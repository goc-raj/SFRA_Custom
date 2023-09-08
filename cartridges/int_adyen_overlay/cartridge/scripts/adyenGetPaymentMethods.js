"use strict";

/**
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 * Adyen Salesforce Commerce Cloud
 * Copyright (c) 2021 Adyen B.V.
 * This file is open source and available under the MIT license.
 * See the LICENSE file for more info.
 *
 * Send request to adyen to get payment methods based on country code and currency
 */

// script include
var AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');
var AdyenConfigs = require('*/cartridge/scripts/util/adyenConfigs');
var constants = require('*/cartridge/adyenConstants/constants');
var AdyenLogs = require('*/cartridge/scripts/adyenCustomLogs');
function getMethods(basket, customer, countryCode) {
  try {
    var paymentAmount;
    var currencyCode;

    // paymentMethods call from checkout
    if (basket) {
      currencyCode = basket.currencyCode;
      paymentAmount = basket.getTotalGrossPrice().isAvailable() ? AdyenHelper.getCurrencyValueForApi(basket.getTotalGrossPrice()) : new dw.value.Money(1000, currencyCode);
    } else {
      // paymentMethods call from My Account
      currencyCode = session.currency.currencyCode;
      paymentAmount = new dw.value.Money(0, currencyCode);
    }
    var paymentMethodsRequest = {
      merchantAccount: AdyenConfigs.getAdyenMerchantAccount(),
      amount: {
        currency: currencyCode,
        value: paymentAmount.value
      }
    };
    if (countryCode) {
      paymentMethodsRequest.countryCode = countryCode;
    }
    if (request.getLocale()) {
      paymentMethodsRequest.shopperLocale = request.getLocale();
    }

    // check logged in shopper for oneClick
    var profile = customer && customer.registered && customer.getProfile() ? customer.getProfile() : null;
    var customerID = null;
    if (profile && profile.getCustomerNo()) {
      customerID = profile.getCustomerNo();
    }
    if (customerID) {
      paymentMethodsRequest.shopperReference = customerID;
    }
    paymentMethodsRequest.blockedPaymentMethods = AdyenHelper.BLOCKED_PAYMENT_METHODS;
    var platformVersion = AdyenHelper.getApplicationInfo().externalPlatform.version;
    var service = platformVersion === constants.PLATFORMS.SG ? "".concat(constants.SERVICE.CHECKOUTPAYMENTMETHODS).concat(constants.PLATFORMS.SG) : constants.SERVICE.CHECKOUTPAYMENTMETHODS;
    return AdyenHelper.executeCall(service, paymentMethodsRequest);
  } catch (e) {
    AdyenLogs.fatal_log("Adyen: ".concat(e.toString(), " in ").concat(e.fileName, ":").concat(e.lineNumber));
  }
}
module.exports = {
  getMethods: getMethods
};