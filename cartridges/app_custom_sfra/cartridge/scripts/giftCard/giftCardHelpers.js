'use strict';
/*
 * API Includes
 */
const Logger = require('dw/system/Logger').getLogger('GiftCard');
const StringUtils = require('dw/util/StringUtils');
const Money = require('dw/value/Money');
const Site = require('dw/system/Site');
const Transaction = require('dw/system/Transaction');
const Resource = require('dw/web/Resource');
const gcPaymentMethodId = 'GIFT_CARD';
const ccPaymentMethodId = 'Paymetric';
const aurusCCPaymentMethodId = 'AURUS_CREDIT_CARD';
var collections = require('*/cartridge/scripts/util/collections');
const eGiftCard = 'EGIFT_CARD';
const physicalGiftCard = 'GIFT_CARD';
const giftCardShipmentID = 'EGiftCardShipment';

/**
 * This method updates eGiftCard Data to ProductLineItem attributes
 * @param {string} productId - Product ID value
 */
function updateEGiftCardData(productId, req) {
    var error = false;
    try {
        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentBasket();
        var productLineItems = currentBasket.getProductLineItems();
        var productLineItem = productLineItems[0];
        Transaction.wrap(function () {
            productLineItem.custom.gcRecipientName = req.form.gcRecipientName || '';
            productLineItem.custom.gcRecipientEmail = req.form.gcRecipientEmail || '';
            productLineItem.custom.gcMessage = req.form.gcMessage || '';
            productLineItem.setPriceValue(25);
        });
        return error;
    } catch (e) {
        Logger.error('Error updating EGiftCard ProductLineItem: ' + e.message);
        error = true;
        return error;
    }
    return;
}

module.exports = {
    updateEGiftCardData: updateEGiftCardData
}
