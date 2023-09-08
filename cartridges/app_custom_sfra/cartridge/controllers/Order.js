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
var lineItems = require('dw/order/LineItemCtnr');
var lineItem = require('dw/order/LineItem');
var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
server.extend(module.superModule);

/**
 * Order-Confirm : This endpoint is invoked when the shopper's Order is Placed and Confirmed
 * @name Base/Order-Confirm
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
server.prepend(
    'Confirm',
    consentTracking.consent,
    server.middleware.https,
    csrfProtection.generateToken,
    function (req, res, next) {
        var OrderMgr = require('dw/order/OrderMgr');
        var order;
        order = OrderMgr.getOrder(req.form.orderID, req.form.orderToken);
        var dataForm = server.forms.getForm('shipping');
        var smsUpdates = dataForm.shippingAddress.isSMS
            ? dataForm.shippingAddress.isSMS.value
            : '';
        var Transaction = require('dw/system/Transaction');
        Transaction.wrap(function () {
            order.custom.Send_SMS = smsUpdates;
        });

        return next();
    }
);

module.exports = server.exports();
