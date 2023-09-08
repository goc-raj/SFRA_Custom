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

server.get(
    'Create',
    consentTracking.consent,
    function (req, res, next) {

        var breadcrumbs = [
            {
                htmlValue: Resource.msg('global.home', 'common', null),
                url: URLUtils.home().toString()
            }
        ];
        var actionUrl = URLUtils.url('GiftCertificate-AddToCart');

        res.render('/giftcertificate/createGift', {
            breadcrumbs: breadcrumbs,
            actionUrl: actionUrl
        });
        return next();
    }
);

server.post('AddToCart', consentTracking.consent, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var Transaction = require('dw/system/Transaction');
    var GiftCertificateLineItem = require('dw/order/GiftCertificateLineItem');
    var CartModel = require('*/cartridge/models/cart');
    var ProductLineItemsModel = require('*/cartridge/models/productLineItems');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var giftCertRecipient = req.form.giftCertTo;
    var giftCertEmail = req.form.giftCertEmail;
    var giftCertAmount = parseInt(req.form.giftCertAmount, 10);
    var giftCertMessage;
    req.form.giftCertMessage ? giftCertMessage = req.form.giftCertMessage : giftCertMessage = "";
    var quantity;
    var result;

    if (currentBasket) {
        Transaction.wrap(function () {
            if (giftCertEmail && giftCertAmount) {
                quantity = 1;
                result = cartHelper.addGiftCertToCart(
                    currentBasket,
                    giftCertRecipient,
                    giftCertEmail,
                    giftCertAmount,
                    giftCertMessage,
                    quantity
                );
            } else {
                res.render('/giftCertificate/giftCertificate');
                next();
            }
            if (!result.error) {
                cartHelper.ensureAllShipmentsHaveMethods(currentBasket);
                basketCalculationHelpers.calculateTotals(currentBasket);
            }
        });
    }

    var quantityTotal = 1;

    var cartModel = new CartModel(currentBasket);

    var reportingURL = cartHelper.getReportingUrlAddToCart(currentBasket, result.error);

    res.json({
        reportingURL: reportingURL,
        quantityTotal: 1,
        message: result.message,
        cart: cartModel,
        newBonusDiscountLineItem: {},
        error: result.error,
        pliUUID: result.uuid,
        minicartCountOfItems: Resource.msgf('minicart.count', 'common', null, quantityTotal)
    });

    next();
});

server.get('RemoveGiftCertLineItem', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');
    var CartModel = require('*/cartridge/models/cart');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.setStatusCode(500);
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });

        return next();
    }

    var isGiftCertLineItemFound = false;

    Transaction.wrap(function () {
        if (req.querystring.uuid) {
            var giftCertLineItems = currentBasket.getGiftCertificateLineItems();

            for (var i = 0; i < giftCertLineItems.length; i++) {
                var item = giftCertLineItems[i];

                if ((item.UUID === req.querystring.uuid)) {
                    var shipmentToRemove = item.shipment;
                    currentBasket.removeGiftCertificateLineItem(item);
                    if (shipmentToRemove.productLineItems.empty && !shipmentToRemove.default) {
                        currentBasket.removeShipment(shipmentToRemove);
                    }
                    isGiftCertLineItemFound = true;
                    break;
                }
            }
        }
        basketCalculationHelpers.calculateTotals(currentBasket);
    });

    if (isGiftCertLineItemFound) {
        var basketModel = new CartModel(currentBasket);
        var basketModelPlus = {
            basket: basketModel
        };
        res.json(basketModelPlus);
    } else {
        res.setStatusCode(500);
        res.json({ errorMessage: Resource.msg('error.cannot.remove.product', 'cart', null) });
    }

    return next();
});

server.get('Add', server.middleware.https, function(req, res, next) {
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var shippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var Locale = require('dw/util/Locale');
    var OrderModel = require('*/cartridge/models/order');
    var TotalsModel = require('*/cartridge/models/totals');

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
        } else if (orderTotal < giftCertBalanceValue || orderTotal == giftCertBalanceValue) {
            flag = "more";
            // var methodID = "007";
            // var shipment = currentBasket.defaultShipment;
            // var currentLocale = Locale.getLocale(req.locale.id);

            Transaction.begin();
            currentBasket.custom.useGiftCard = "no";
            // shippingHelper.selectShippingMethod(shipment, methodID);
            // basketCalculationHelpers.calculateTotals(currentBasket);
            Transaction.commit();

            // var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
            // var allValid = COHelpers.ensureValidShipments(currentBasket);
            // var orderModel = new OrderModel(
            //     currentBasket,
            //     {
            //         customer: req.currentCustomer.raw,
            //         usingMultiShipping: usingMultiShipping,
            //         shippable: allValid,
            //         countryCode: currentLocale.country,
            //         containerView: 'basket'
            //     }
            // );
            var totalsModel = new TotalsModel(currentBasket);
        }

    } else if (giftCertStatus === 0) {
        giftCertMessage = Resource.msg('msg.status.pending', 'giftcertificate', null);
    } else if (giftCertStatus === 3) {
        giftCertMessage = Resource.msg('msg.status.redeemed', 'giftcertificate', null);
    }

    res.json({
        error: false,
        totals: totalsModel,
        status: statusCodes[giftCertStatus],
        balanceValue: giftCertBalanceValue,
        balanceCurrency: giftCertCurrency,
        message: giftCertMessage,
        flag: flag
    });

    next();
});

module.exports = server.exports();
