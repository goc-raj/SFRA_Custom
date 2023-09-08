'use strict';

/**
 * @namespace Account
 */

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
server.extend(module.superModule);

/**
 * Account-Show : The Account-Show endpoint will render the shopper's account page. Once a shopper logs in they will see is a dashboard that displays profile, address, payment and order information.
 * @name Base/Account-Show
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {querystringparameter} - registration - A flag determining whether or not this is a newly registered account
 * @param {category} - senstive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.prepend(
    'Show',
    server.middleware.https,
    userLoggedIn.validateLoggedIn,
    consentTracking.consent,
    function (req, res, next) {
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var Resource = require('dw/web/Resource');
        var URLUtils = require('dw/web/URLUtils');
        var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');
        var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
        var reportingURLs;

        // Get reporting event Account Open url
        if (req.querystring.registration && req.querystring.registration === 'submitted') {
            reportingURLs = reportingUrlsHelper.getAccountOpenReportingURLs(
                CustomerMgr.registeredCustomerCount
            );
        }

        var accountModel = accountHelpers.getAccountModel(req);

        res.render('account/accountDashboard', {
            account: accountModel,
            accountlanding: true,
            breadcrumbs: [
                {
                    htmlValue: Resource.msg('global.home', 'common', null),
                    url: URLUtils.home().toString()
                }
            ],
            reportingURLs: reportingURLs,
            payment: accountModel.payment,
            viewSavedPaymentsUrl: URLUtils.url('PaymentInstruments-List').toString(),
            addPaymentUrl: URLUtils.url('PaymentInstruments-AddPayment').toString()
        });
        next();
    }
);

/**
 * Account-SubmitRegistration : The Account-SubmitRegistration endpoint is the endpoint that gets hit when a shopper submits their registration for a new account
 * @name Base/Account-SubmitRegistration
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {querystringparameter} - rurl - redirect url. The value of this is a number. This number then gets mapped to an endpoint set up in oAuthRenentryRedirectEndpoints.js
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password - Input field for the shopper's password
 * @param {httpparameter} - dwfrm_profile_login_passwordconfirm: - Input field for the shopper's password to confirm
 * @param {httpparameter} - dwfrm_profile_customer_addtoemaillist - Checkbox for whether or not a shopper wants to be added to the mailing list
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.prepend(
    'SubmitRegistration',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var Resource = require('dw/web/Resource');

        var formErrors = require('*/cartridge/scripts/formErrors');

        var registrationForm = server.forms.getForm('profile');

        // form validation
        if (registrationForm.customer.email.value.toLowerCase()
            !== registrationForm.customer.emailconfirm.value.toLowerCase()
        ) {
            registrationForm.customer.email.valid = false;
            registrationForm.customer.emailconfirm.valid = false;
            registrationForm.customer.emailconfirm.error =
                Resource.msg('error.message.mismatch.email', 'forms', null);
            registrationForm.valid = false;
        }

        if (registrationForm.login.password.value
            !== registrationForm.login.passwordconfirm.value
        ) {
            registrationForm.login.password.valid = false;
            registrationForm.login.passwordconfirm.valid = false;
            registrationForm.login.passwordconfirm.error =
                Resource.msg('error.message.mismatch.password', 'forms', null);
            registrationForm.valid = false;
        }

        if (!CustomerMgr.isAcceptablePassword(registrationForm.login.password.value)) {
            registrationForm.login.password.valid = false;
            registrationForm.login.passwordconfirm.valid = false;
            registrationForm.login.passwordconfirm.error =
                Resource.msg('error.message.password.constraints.not.matched', 'forms', null);
            registrationForm.valid = false;
        }

        // setting variables for the BeforeComplete function
        var registrationFormObj = {
            firstName: registrationForm.customer.firstname.value,
            lastName: registrationForm.customer.lastname.value,
            phone: registrationForm.customer.phone.value,
            email: registrationForm.customer.email.value,
            emailConfirm: registrationForm.customer.emailconfirm.value,
            // Custom Code Start
            countryCode: registrationForm.customer.country.value,
            stateCode: registrationForm.customer.states.stateCode.value,
            city: registrationForm.customer.city.value,
            // Custom Code End
            password: registrationForm.login.password.value,
            passwordConfirm: registrationForm.login.passwordconfirm.value,
            validForm: registrationForm.valid,
            form: registrationForm
        };

        if (registrationForm.valid) {
            res.setViewData(registrationFormObj);

            this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
                var Transaction = require('dw/system/Transaction');
                var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
                var authenticatedCustomer;
                var serverError;

                // getting variables for the BeforeComplete function
                var registrationForm = res.getViewData(); // eslint-disable-line

                if (registrationForm.validForm) {
                    var login = registrationForm.email;
                    var password = registrationForm.password;

                    // attempt to create a new user and log that user in.
                    try {
                        Transaction.wrap(function () {
                            var error = {};
                            var newCustomer = CustomerMgr.createCustomer(login, password);

                            var authenticateCustomerResult = CustomerMgr.authenticateCustomer(login, password);
                            if (authenticateCustomerResult.status !== 'AUTH_OK') {
                                error = { authError: true, status: authenticateCustomerResult.status };
                                throw error;
                            }

                            authenticatedCustomer = CustomerMgr.loginCustomer(authenticateCustomerResult, false);

                            if (!authenticatedCustomer) {
                                error = { authError: true, status: authenticateCustomerResult.status };
                                throw error;
                            } else {
                                // assign values to the profile
                                var newCustomerProfile = newCustomer.getProfile();

                                newCustomerProfile.firstName = registrationForm.firstName;
                                newCustomerProfile.lastName = registrationForm.lastName;
                                newCustomerProfile.phoneHome = registrationForm.phone;
                                newCustomerProfile.email = registrationForm.email;
                                // Custom Code Start
                                newCustomerProfile.custom.countryCode = registrationForm.countryCode;
                                newCustomerProfile.custom.stateCode = registrationForm.stateCode;
                                newCustomerProfile.custom.city = registrationForm.city;
                                // Custom Code End
                            }
                        });
                    } catch (e) {
                        if (e.authError) {
                            serverError = true;
                        } else {
                            registrationForm.validForm = false;
                            registrationForm.form.customer.email.valid = false;
                            registrationForm.form.customer.emailconfirm.valid = false;
                            registrationForm.form.customer.email.error =
                                Resource.msg('error.message.username.invalid', 'forms', null);
                        }
                    }
                }

                delete registrationForm.password;
                delete registrationForm.passwordConfirm;
                formErrors.removeFormValues(registrationForm.form);

                if (serverError) {
                    res.setStatusCode(500);
                    res.json({
                        success: false,
                        errorMessage: Resource.msg('error.message.unable.to.create.account', 'login', null)
                    });

                    return;
                }

                if (registrationForm.validForm) {
                    // send a registration email
                    accountHelpers.sendCreateAccountEmail(authenticatedCustomer.profile);

                    res.setViewData({ authenticatedCustomer: authenticatedCustomer });
                    res.json({
                        success: true,
                        redirectUrl: accountHelpers.getLoginRedirectURL(req.querystring.rurl, req.session.privacyCache, true)
                    });

                    req.session.privacyCache.set('args', null);
                } else {
                    res.json({
                        fields: formErrors.getFormErrors(registrationForm)
                    });
                }
            });
        } else {
            res.json({
                fields: formErrors.getFormErrors(registrationForm)
            });
        }

        return next();
    }
);

/**
 * Account-EditProfile : The Account-EditProfile endpoint renders the page that allows a shopper to edit their profile. The edit profile form is prefilled with the shopper's first name, last name, phone number and email
 * @name Base/Account-EditProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.replace(
    'EditProfile',
    server.middleware.https,
    csrfProtection.generateToken,
    userLoggedIn.validateLoggedIn,
    consentTracking.consent,
    function (req, res, next) {
        var Resource = require('dw/web/Resource');
        var URLUtils = require('dw/web/URLUtils');
        var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');

        var accountModel = accountHelpers.getAccountModel(req);
        var profileForm = server.forms.getForm('profile');
        profileForm.clear();
        profileForm.customer.firstname.value = accountModel.profile.firstName;
        profileForm.customer.lastname.value = accountModel.profile.lastName;
        profileForm.customer.phone.value = accountModel.profile.phone;
        profileForm.customer.email.value = accountModel.profile.email;
        // profileForm.customer.country.value = accountModel.profile.countryCode;
        // profileForm.customer.states.stateCode.value = accountModel.profile.stateCode;
        profileForm.customer.city.value = accountModel.profile.city;
        res.render('account/profile', {
            profileForm: profileForm,
            breadcrumbs: [
                {
                    htmlValue: Resource.msg('global.home', 'common', null),
                    url: URLUtils.home().toString()
                },
                {
                    htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                    url: URLUtils.url('Account-Show').toString()
                }
            ]
        });
        next();
    }
);

/**
 * Account-SaveProfile : The Account-SaveProfile endpoint is the endpoint that gets hit when a shopper has edited their profile
 * @name Base/Account-SaveProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password  - Input field for the shopper's password
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensititve
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.replace(
    'SaveProfile',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var Transaction = require('dw/system/Transaction');
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var Resource = require('dw/web/Resource');
        var URLUtils = require('dw/web/URLUtils');
        var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');

        var formErrors = require('*/cartridge/scripts/formErrors');

        var profileForm = server.forms.getForm('profile');

        // form validation
        if (profileForm.customer.email.value.toLowerCase()
            !== profileForm.customer.emailconfirm.value.toLowerCase()) {
            profileForm.valid = false;
            profileForm.customer.email.valid = false;
            profileForm.customer.emailconfirm.valid = false;
            profileForm.customer.emailconfirm.error =
                Resource.msg('error.message.mismatch.email', 'forms', null);
        }

        var result = {
            firstName: profileForm.customer.firstname.value,
            lastName: profileForm.customer.lastname.value,
            phone: profileForm.customer.phone.value,
            email: profileForm.customer.email.value,
            confirmEmail: profileForm.customer.emailconfirm.value,
            password: profileForm.login.password.value,
            countryCode: profileForm.customer.country.value,
            stateCode: profileForm.customer.states.stateCode.value,
            city: profileForm.customer.city.value,
            profileForm: profileForm
        };
        if (profileForm.valid) {
            res.setViewData(result);
            this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
                var formInfo = res.getViewData();
                var customer = CustomerMgr.getCustomerByCustomerNumber(
                    req.currentCustomer.profile.customerNo
                );
                var profile = customer.getProfile();
                var customerLogin;
                var status;

                Transaction.wrap(function () {
                    status = profile.credentials.setPassword(
                        formInfo.password,
                        formInfo.password,
                        true
                    );

                    if (status.error) {
                        formInfo.profileForm.login.password.valid = false;
                        formInfo.profileForm.login.password.error =
                            Resource.msg('error.message.currentpasswordnomatch', 'forms', null);
                    } else {
                        customerLogin = profile.credentials.setLogin(
                            formInfo.email,
                            formInfo.password
                        );
                    }
                });

                delete formInfo.password;
                delete formInfo.confirmEmail;

                if (customerLogin) {
                    Transaction.wrap(function () {
                        profile.setFirstName(formInfo.firstName);
                        profile.setLastName(formInfo.lastName);
                        profile.setEmail(formInfo.email);
                        profile.setPhoneHome(formInfo.phone);
                        profile.custom.countryCode = formInfo.countryCode;
                        profile.custom.stateCode = formInfo.stateCode;
                        profile.custom.city = formInfo.city;
                    });

                    // Send account edited email
                    accountHelpers.sendAccountEditedEmail(customer.profile);

                    delete formInfo.profileForm;
                    delete formInfo.email;

                    res.json({
                        success: true,
                        redirectUrl: URLUtils.url('Account-Show').toString()
                    });
                } else {
                    if (!status.error) {
                        formInfo.profileForm.customer.email.valid = false;
                        formInfo.profileForm.customer.email.error =
                            Resource.msg('error.message.username.invalid', 'forms', null);
                    }

                    delete formInfo.profileForm;
                    delete formInfo.email;

                    res.json({
                        success: false,
                        fields: formErrors.getFormErrors(profileForm)
                    });
                }
            });
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(profileForm)
            });
        }
        return next();
    }
);

module.exports = server.exports();
