'use strict';

/**
 * @namespace Order
 */

var server = require('server');

var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
var GiftCertificate = require('dw/order/GiftCertificate');

/**
 * GiftCertificate-CheckBalance : This endpoint is invoked when the shopper's click on Submit button on gift-check-balance Page.
 * @name GiftCertificate-CheckBalance
 * @function
 * @memberof Order
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {querystringparameter} - ID - Order ID
 * @param {querystringparameter} - token - token associated with the order
 * @param {category} - sensitive
 * @param {serverfunction} - get
 */
server.get(
    'CheckBalance',
    consentTracking.consent,
    function (req, res, next) {

        var breadcrumbs = [
            {
                htmlValue: Resource.msg('global.home', 'common', null),
                url: URLUtils.home().toString()
            }
        ];
        var actionUrl = URLUtils.url('GiftCertificate-BalanceResult');

        res.render('/giftcertificate/checkBalance', {
            breadcrumbs: breadcrumbs,
            actionUrl: actionUrl
        });
        return next();
    }
);

server.post('BalanceResult', consentTracking.consent, function (req, res, next) {
    var WishlistSearchModel = require('*/cartridge/models/wishlist/search');
    var breadcrumbs = [
        {
            htmlValue: Resource.msg('global.home', 'common', null),
            url: URLUtils.home().toString()
        }
    ];

    var code = req.form.searchCode;
    var giftCertificate = GiftCertificateMgr.getGiftCertificateByCode(code);
    var balance = giftCertificate.getBalance();

    res.render('/giftcertificate/balanceResult', {
        breadcrumbs: breadcrumbs,
        balance: balance
    });
    next();
});

server.get('Add', server.middleware.https, function(req, res, next) {
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');

    var giftCert = GiftCertificateMgr.getGiftCertificateByCode(req.querystring.giftCertCode);

    if (!giftCert) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.not.found', 'giftcertificate', null)
        });
        return next();
    }

    var recEmail = giftCert.getRecipientEmail();
    if(recEmail != req.currentCustomer.profile.email) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.authorization', 'giftcertificate', null)
        });
        return next();
    }

    var giftCertStatus = giftCert.getStatus();
    var statusCodes = {
        0: 'STATUS_PENDING',
        1: 'STATUS_ISSUED',
        2: 'STATUS_PARTIALLY_REDEEMED',
        3: 'STATUS_REDEEMED'
    };

    var giftCertBalanceAndCurrency = '';
    var giftCertBalanceValue;
    var giftCertCurrency = '';
    var giftCertMessage = '';
    var flag = "";
    if (giftCertStatus === 1 || giftCertStatus === 2) {
        giftCertBalanceAndCurrency = giftCert.getBalance().toString();
        giftCertCurrency = giftCert.getBalance().getCurrencyCode();
        giftCertBalanceValue = giftCert.getBalance().getValue();
        giftCertMessage = Resource.msg('msg.status.issued.or.partially.redeemed', 'giftcertificate', null);

        var currentBasket = BasketMgr.getCurrentBasket();
        var orderTotal = currentBasket.totalGrossPrice.getValue();
        if (orderTotal > giftCertBalanceValue) {
            flag = "less";
            Transaction.begin();
            currentBasket.custom.useGiftCard = "yes";
            currentBasket.custom.gcCode = req.querystring.giftCertCode;
            Transaction.commit();
        } else if (orderTotal < giftCertBalanceValue || orderTotal == giftCertBalanceValue) {
            flag = "more";
            Transaction.begin();
            currentBasket.custom.useGiftCard = "no";
            currentBasket.custom.gcCode = req.querystring.giftCertCode;
            Transaction.commit();
        }

    } else if (giftCertStatus === 0) {
        giftCertMessage = Resource.msg('msg.status.pending', 'giftcertificate', null);
    } else if (giftCertStatus === 3) {
        giftCertMessage = Resource.msg('msg.status.redeemed', 'giftcertificate', null);
    }

    res.json({
        error: false,
        status: statusCodes[giftCertStatus],
        balanceValue: giftCertBalanceValue,
        balanceCurrency: giftCertCurrency,
        message: giftCertMessage,
        flag: flag
    });

    next();
});

server.get(
    'ShowEgiftCardsForm',
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var URLUtils = require('dw/web/URLUtils');
        var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
        var eGiftCardsForm = server.forms.getForm('giftCards');
        var params = req.querystring;
        var eGiftCardEdit = params.eGiftCardEdit;
        // if (eGiftCardEdit !== 'EGIFT_CARD') { // eslint-disable-next-line
        // 	eGiftCardsForm.clear();
        // }
        res.render('giftcertificate/eGiftCardForm', {
            productId: 'Gift_Certi_Form_Red',
            addToCartUrl: URLUtils.url('Cart-AddProduct'),
            eGiftCardsForm: eGiftCardsForm
        });
        next();
    }
);

server.post(
    'SaveGiftCard',
    consentTracking.consent,
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var Transaction = require('dw/system/Transaction');
        var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
        var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');

        var productId = req.form.pid;
        var currentBasket = BasketMgr.getCurrentBasket();
        var productLineItems = currentBasket.getProductLineItems(productId);
        var price = req.form.gcAmount;
        var productLineItem = productLineItems[0];
        Transaction.wrap(function () {
            productLineItem.custom.gcRecipientName = req.form.gcRecipientName || '';
            productLineItem.custom.gcRecipientEmail = req.form.gcRecipientEmail || '';
            productLineItem.custom.gcMessage = req.form.gcMessage || '';
            productLineItem.setPriceValue(25);
            basketCalculationHelpers.calculateTotals(currentBasket);
        });
        var reportingURL = cartHelper.getReportingUrlAddToCart(currentBasket, false);

        res.json({
            reportingURL: reportingURL
        });
        next();

    }
);

module.exports = server.exports();
