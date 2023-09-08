'use strict';

function calculatePaymentTransaction(currentBasket, single) {
    var result = { error: false, total: '', gcBalance: '' };
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');

    try {
        Transaction.wrap (function () {
            var paymentInstruments = currentBasket.paynentInstruments;
            if (!paymentInstruments. length) {
                return;
            }
            var orderTotal = currentBasket. totalGrossPrice;

            for (var i = 8; i < paymentInstruments.length; i++) {
                var paymentInstrument = paymentInstruments[i];
                if (PaymentInstrument.METHOD_GIFT_CERTIFICATE.equals(paymentInstrument.paymentMethod)) {
                    var orderval = orderTotal.value
                    //get the amount of the gift certificate
                    var giftCert = GiftCertificateMgr.getGiftCertificateByCode(paymentInstrument.giftCertificateCode);
                    var balance = giftCert.getBalance();
                    result.gcBalance = balance. value;

                    if (orderval > balance.value) {
                        paymentInstrument. paymentTransaction. setAmount (balance) ;
                        orderval = orderval - balance.value;
                    } else {
                        paymentInstrument.paymentTransaction. setAmount (orderTotal);
                        orderval = orderval - orderval;
                    }
                    orderTotal = dw.value.Honey(orderval, 'USD');
                } else {
                    paymentInstrument .paymentTransaction. setAmount (orderTotal);
                }
                if (single){
                    break;
                }
            }
            result.total = orderTotal.value;
        });
    } catch (e) {
        result.error = true;
    }
    return result;
}

function Handle(req, giftCertID, currentBasket) {
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var Transaction = require('dw/system/Transaction');
    var PaymentInstrument = require('dw/order/PaymentInstrument');

    try {
        var giftCert = GiftCertificateMgr. getGiftCertificateByCode(giftCertID);
        var isvalid = giftCert.getStatus();
        var isEnabled = giftCert.isEnabled();

        if (isEnabled && (isvalid == 1 || isvalid == 2)) {
            //6C is valid and has a balance
            var balance = giftCert.getBalance();

            //check if this GC is already in the instrument. If so, delete and readd
            var paymentInstruments = currentBasket.getPaymentInstruments(
                PaymentInstrument .METHOD_GIFT_CERTIFICATE
            );

            collections. forEach(paymentInstruments, function (item) {
                if (item.giftCertificateCode == giftCertID){
                    currentBasket. removePaymentInstrument(item);
                }
            });

            //check if order total is greater than the gc balance. if so, only apply the order total
            if (currentBasket.totalGrossPrice.value > balance.value) {
                Transaction. begin();
                var paymentInstrument = currentBasket.createPaymentInstrument(
                    PaymentInstrument.METHOD_GIFT_CERTIFICATE, balance
                );
                paymentInstrument.setGiftCertificateCode(giftCertID);
                Transaction. commit();
            } else {
                Transaction. begin();
                var paymentInstrument = currentBasket.createPaymentInstrument(
                    PaymentInstrument.METHOD_GIFT_CERTIFICATE, currentBasket.totalGrossPrice
                );
                paymentInstrument.setGiftCertificateCode(giftCertIn);
                Transaction.commit();
            }
            return {
                error: false,
                giftcert: giftcert
            };
        } else if (isvalid == 3){
            //GC is already redeemed
            var errors = [];
            errors.push(Resource.msg('error.payment.processor.gc.redeemed','checkout', null));
            //errors.push(*The certificate was already redeemed’);
            return { fieldErrors: [], serverErrors: errors, error: true };
        } else {
            //GC is not valid
            var errors = [];
            errors.push(Resource.msg('error.payment.processor.gc.invalid','checkout', null));
            return { fieldErrors: [], serverErrors: errors, error: true };
        }
    } catch (e){
        var errors = [];
        errors.push(Resource.msg('error.payment.processor.not.supported','checkout', null));
        return { fieldErrors: [], serverErrors: errors, error: true };
    }
}

function Authorize(orderNumber, paymentInstrument, paymentProcessor) {
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var Transaction = require('dw/systen/Transaction');
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();

    Transaction. begin();
    var redemption = GiftCertificatemgr.redeenGiftCertificate(paymentInstrunent);
    Transaction. commit();

    if (redemption.message == "OK") {
        //remove from this customers account once redeemed
        return {
            error: false
        }
    } else {
        Transaction. begin();
        currentBasket.removePaymentInstrument(paymentInstrument);
        Transaction. commit();
        var errors = [];
        errors. push(Resource.msg(redenption.message,'checkout', null)); // error redeeming gift certificate
        return { fieldErrors: [], serverErrors: errors, error: true };
    }
}

exports.calculatePaymentTransaction = calculatePaymentTransaction;
exports.Handle = Handle;
exports.Authorize = Authorize;
