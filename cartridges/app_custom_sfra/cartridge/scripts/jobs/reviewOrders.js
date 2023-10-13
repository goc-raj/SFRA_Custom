'use strict';

/**
 * @module feeds/upload
 */

/**
 * @type {dw.io.File}
 */
const File = require('dw/io/File');
/**
 * @type {dw.svc.LocalServiceRegistry}
 */
const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
/**
 * @type {dw.system.Status}
 */
const Status = require('dw/system/Status');

function sendReviewMail() {

    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var customerOrder;
    var ONE_WEEK_AGO = Date.now() - 657436500;
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');
    var customerNo = '00004003';
    var customerOrders = OrderMgr.searchOrders(
        'customerNo={0} AND status!={0}',
        'creationDate desc',
        customerNo,
        Order.ORDER_STATUS_REPLACED
    );
    var filtOrdersCount = 0;
    var filtOrdersAmount = 0.00;
    while (customerOrders.hasNext()) {
        customerOrder = customerOrders.next();
        var orderTime = customerOrder.getCreationDate().getTime();
        if (ONE_WEEK_AGO < orderTime) {
            filtOrdersCount++;
            filtOrdersAmount += customerOrder.getTotalGrossPrice();
        }
    }

    // Send Mail
    var objectForEmail = {
        filtOrdersCount: filtOrdersCount,
        filtOrdersAmount: filtOrdersAmount
    };

    var emailObj = {
        to: "raj.joshi@getoncrm.com",
        subject: Resource.msg('subject.review.order.email', 'account', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
        type: emailHelpers.emailTypes.weeklyReview
    };

    var status = emailHelpers.send(emailObj, 'coupons/reviewOrders', objectForEmail);
    var returnStatus = new Status(Status.OK);

    // var returnStatus;
    // try {
    //     var uploadStatus = sftpService.call(
    //         {
    //             exportFile: exportFile,
    //             filename: fileName,
    //             targetPath: params.TargetPath
    //         }
    //         );
    //     if (uploadStatus.ok) {
    //         returnStatus = new Status(Status.OK);
    //     } else {
    //         returnStatus = new Status(Status.ERROR, uploadStatus.status, uploadStatus.errorMessage);
    //     }
    // } catch (e) {
    //     returnStatus = new Status(Status.ERROR, 'EXCEPTION', e.toString());
    // }
    return returnStatus;
}

exports.sendReviewMail = sendReviewMail;
