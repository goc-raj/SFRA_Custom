'use strict';

/**
 * @namespace Login
 */

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
server.extend(module.superModule);


/**
 * Login-OAuthLogin : This endpoint invokes the External OAuth Providers Login
 * @name Base/Login-OAuthLogin
 * @function
 * @memberof Login
 * @param {middleware} - server.middleware.https
 * @param {middleware} - consentTracking.consent
 * @param {querystringparameter} - oauthProvider - ID of the OAuth Provider. e.g. Facebook, Google
 * @param {querystringparameter} - oauthLoginTargetEndPoint - Valid values for this parameter are 1 or 2. These values are mapped in oAuthRenentryRedirectEndpoints.js
 * @param {category} - sensitive
 * @param {renders} - isml if there is an error
 * @param {serverfunction} - get
 */
server.replace('OAuthLogin', server.middleware.https, consentTracking.consent, function (req, res, next) {
    var oauthLoginFlowMgr = require('dw/customer/oauth/OAuthLoginFlowMgr');
    var Resource = require('dw/web/Resource');
    var endpoints = require('*/cartridge/config/oAuthRenentryRedirectEndpoints');

    var targetEndPoint = req.querystring.oauthLoginTargetEndPoint
        ? parseInt(req.querystring.oauthLoginTargetEndPoint, 10)
        : null;

    if (targetEndPoint && endpoints[targetEndPoint]) {
        req.session.privacyCache.set(
            'oauthLoginTargetEndPoint',
            endpoints[targetEndPoint]
        );
    } else {
        res.render('/error', {
            message: Resource.msg('error.oauth.login.failure', 'login', null)
        });

        return next();
    }

    if (req.querystring.oauthProvider) {
        var oauthProvider = req.querystring.oauthProvider;
        // Custom Code
        if(oauthProvider === 'Google') {
            oauthProvider = 'GOCRefDemo';
        }
        //oauthProvider = (oauthProvider === 'Google') ? 'GOCRefDemo' : 'Facebook';
        var result = oauthLoginFlowMgr.initiateOAuthLogin(oauthProvider);

        if (result) {
            res.redirect(result.location);
        } else {
            res.render('/error', {
                message: Resource.msg('error.oauth.login.failure', 'login', null)
            });

            return next();
        }
    } else {
        res.render('/error', {
            message: Resource.msg('error.oauth.login.failure', 'login', null)
        });

        return next();
    }

    return next();
});

module.exports = server.exports();
