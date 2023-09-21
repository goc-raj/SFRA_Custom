'use strict';

/**
 * @namespace Order
 */

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var collections = require('*/cartridge/scripts/util/collections');
var URLUtils = require('dw/web/URLUtils');
var giftcardHelper = require('*/cartridge/scripts/giftCard/giftCardHelpers');
const eGiftCard = 'EGIFT_CARD';
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
server.extend(module.superModule);

server.append('MiniCart', server.middleware.include, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');

    var currentBasket = BasketMgr.getCurrentBasket();
    var quantityTotal;

    if (currentBasket) {
        quantityTotal = currentBasket.productQuantityTotal;
    } else {
        quantityTotal = 0;
    }

    res.render('/components/header/miniCart', { quantityTotal: quantityTotal });
    next();
});

server.append('MiniCartShow', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var CartModel = require('*/cartridge/models/cart');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();
    var reportingURLs;

    if (currentBasket) {
        Transaction.wrap(function () {
            if (currentBasket.currencyCode !== req.session.currency.currencyCode) {
                currentBasket.updateCurrency();
            }
            cartHelper.ensureAllShipmentsHaveMethods(currentBasket);
            basketCalculationHelpers.calculateTotals(currentBasket);
        });
    }

    if (currentBasket && currentBasket.allLineItems.length) {
        reportingURLs = reportingUrlsHelper.getBasketOpenReportingURLs(currentBasket);
    }

    res.setViewData({ reportingURLs: reportingURLs });


    var basketModel = new CartModel(currentBasket);

    res.render('checkout/cart/miniCart', basketModel);
    next();
});

server.append('AddProduct', function (req, res, next) {

    var productId = req.form.pid;

    if(productId != 'Gift_Certi_Form_Red') {
        return next();
    }

    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var Resource = require('dw/web/Resource');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
    var currentBasket = BasketMgr.getCurrentBasket();

    var productLineItems = currentBasket.getProductLineItems();
    var productLineItem = productLineItems[0];
    var form = req.form;
    Transaction.wrap(function () {
        productLineItem.custom.gcRecipientName = req.form.gcRecipientName || '';
        productLineItem.custom.gcRecipientEmail = req.form.gcRecipientEmail || '';
        productLineItem.custom.gcMessage = req.form.gcMessage || '';
        var price = req.form.gcAmount || '';
        productLineItem.setPriceValue(parseFloat(price || 0, 10));
        basketCalculationHelpers.calculateTotals(currentBasket);
    });

    var reportingURL = cartHelper.getReportingUrlAddToCart(currentBasket, false);
    res.json({
        reportingURL: reportingURL,
        // quantityTotal: quantityTotal,
        // message: result.message,
        // cart: cartModel,
        // newBonusDiscountLineItem: newBonusDiscountLineItem || {},
        // error: result.error,
        // pliUUID: result.uuid,
        minicartCountOfItems: Resource.msgf('minicart.count', 'common', null, currentBasket.productQuantityTotal)
    });

    /* Second Way
    var reportingURLs = reportingUrlsHelper.getBasketOpenReportingURLs(currentBasket);
    res.render('/reporting/reportingUrls', {
        reportingURLs: reportingURLs
    });
    */

    next();
});

// server.append('AddProduct', function (req, res, next) {
//     var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
//     var Transaction = require('dw/system/Transaction');
//     var BasketMgr = require('dw/order/BasketMgr');
//     var CartModel = require('*/cartridge/models/cart');
//     var Resource = require('dw/web/Resource');
//     var currentBasket = BasketMgr.getCurrentBasket();
//     var eGiftCardFormData = req.form.eGiftCardData;
//     var viewData = res.getViewData();

//     if (typeof eGiftCardFormData !== 'undefined' && !empty(eGiftCardFormData)) {
//         var productId = req.form.pid;
//         // Below method called to update eGiftCard specific ProductLineItem level custom attributes
//         giftcardHelper.updateEGiftCardData(productId, viewData.pliUUID, eGiftCardFormData);
//     }

//     // Below line of code will split the single shipment into multiple shipment if the basket has the e-gift card item.
//     Transaction.wrap(function () {
//         // giftcardHelper.updateGiftCardShipments(currentBasket);
//         // giftcardHelper.removeEmptyShipments(currentBasket);
//         basketCalculationHelpers.calculateTotals(currentBasket);
//     });

//     // if (currentBasket) {
//     //     var basketModel = new CartModel(currentBasket);
//         // update additional availability attributes
//         // var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');
//         // var availabilityHelper = require('*/cartridge/scripts/helpers/availabilityHelpers');
//         // var validatedProducts = validationHelpers.validateProductsInventory(currentBasket, 'CartView');
//         // if (validatedProducts && validatedProducts.availabilityError) {
//         //     availabilityHelper.updateLineItemQuantityOption(validatedProducts.lineItemQtyList, basketModel);
//         //     availabilityHelper.getInvalidItems(basketModel, validatedProducts);
//         // } else if (validatedProducts) {
//         //     availabilityHelper.updateLineItemQuantityOption(validatedProducts.lineItemQtyList, basketModel);
//         // }
//     //     var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
//     //     var context = {
//     //         cartQuantity: currentBasket.productQuantityTotal,
//     //         actionUrls: basketModel.actionUrls,
//     //         lineItems: basketModel.items,
//     //         numItems: basketModel.numItems,
//     //         CurrentCustomer: req.currentCustomer.raw,
//     //         template: 'cart/cartItems.isml',
//     //         minicartCountOfItems: Resource.msgf('minicart.count', 'common', null, currentBasket.productQuantityTotal)
//     //     };
//     //     res.setViewData(context);
//     //     viewData = res.getViewData();
//     //     res.json({
//     //         renderedTemplate: renderTemplateHelper.getRenderedHtml(viewData, viewData.template)
//     //     });
//     // }

//     // // Update Default size selection
//     // var sViewData = res.viewData;
//     // if (!sViewData.error) {
//     //     var sizePreferencesHelper = require('*/cartridge/scripts/helpers/sizePreferencesHelper');
//     //     var sizePreferences = req.session.privacyCache.get('sizePreferences');
//     //     var sizePreferencesobj = sizePreferencesHelper.createSizePrefJson(req.form.pid, sizePreferences, req.currentCustomer.raw.authenticated ? req.currentCustomer.raw.profile.email : null);
//     //     if (sizePreferencesobj) {
//     //         req.session.privacyCache.set('sizePreferences', sizePreferencesobj);
//     //     }
//     // }

//     next();
// });


module.exports = server.exports();
