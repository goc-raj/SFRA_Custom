/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/giftCertificate.js":
/*!********************************************************************************************!*\
  !*** ./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/giftCertificate.js ***!
  \********************************************************************************************/
/***/ (function(module) {



function submitGiftCertCode() {
  $('.giftcertcode-button').click(function (e) {
    e.preventDefault();
    $.spinner().start();
    $('.giftcert-message').hide();
    $('.coupon-missing-error').hide();
    $('.coupon-error-message').hide();
    if (!$('.giftcert-input-field').val()) {
      $('.coupon-missing-error').show();
      $.spinner().stop();
      return false;
    }
    var $giftcertcode = $('.giftcert-input-field').val();
    //console.log('$form: ' + $form);
    console.log('$giftcertcode: ' + $giftcertcode);
    var $data = $('.giftcert-input-field').attr('data-gift-cert-add');
    console.log('url: ' + $data);
    $.ajax({
      url: $('.giftcert-input-field').attr('data-gift-cert-add'),
      type: 'GET',
      dataType: 'json',
      data: 'giftCertCode=' + $giftcertcode,
      success: function success(data) {
        if (data.error) {
          $('.coupon-error-message').show();
          $('#pmt').show();
        } else {
          $('.giftcert-message').empty().show().append(data.message);
          if (data.flag === "more") {
            $('#pmt').hide();
            // var paymentMethod = "<input type='hidden' class='form-control' name='${pdict.forms.billingForm.paymentMethod.htmlName}' value='GIFT_CERTIFICATE'>";
            // $("#giftForm").prepend(paymentMethod);
            $('.shipping-total-cost').text(0.00);
            $('.tax-total').text(0.00);
            $('.sub-total').text(0.00);
            $('.grand-total-sum').text(0.00);
          }
        }
        $.spinner().stop();
      },
      error: function error(err) {
        if (err.responseJSON.redirectUrl) {
          window.location.href = err.responseJSON.redirectUrl;
        } else {
          createErrorNotification(err.errorMessage);
          $.spinner().stop();
        }
      }
    });
  });
}
module.exports = {
  submitGiftCertCode: submitGiftCertCode
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/giftCertificate.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=giftCertificate.js.map