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

/***/ }),

/***/ "./cartridges/app_custom_sfra/cartridge/client/default/js/giftCertificate/giftCert.js":
/*!********************************************************************************************!*\
  !*** ./cartridges/app_custom_sfra/cartridge/client/default/js/giftCertificate/giftCert.js ***!
  \********************************************************************************************/
/***/ (function(module) {



//var base = require('./base');

/**
 * Updates the Mini-Cart quantity value after the customer has pressed the "Add to Cart" button
 * @param {string} response - ajax response from clicking the add to cart button
 */
function handlePostCartAdd(response) {
  $('.minicart').trigger('count:update', response);
  var messageType = response.error ? 'alert-danger' : 'alert-success';
  // show add to cart toast
  if (response.newBonusDiscountLineItem && Object.keys(response.newBonusDiscountLineItem).length !== 0) {
    chooseBonusProducts(response.newBonusDiscountLineItem);
  } else {
    if ($('.add-to-cart-messages').length === 0) {
      $('body').append('<div class="add-to-cart-messages"></div>');
    }
    $('.add-to-cart-messages').append('<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">' + response.message + '</div>');
    setTimeout(function () {
      $('.add-to-basket-alert').remove();
    }, 5000);
  }
}
module.exports = {
  addGiftCertToCart: function addGiftCertToCart() {
    $(document).on('click', 'button.add-giftcert-to-cart', function () {
      var addToCartUrl;
      var pid;
      var pidsObj;
      var setPids;
      $('body').trigger('product:beforeAddToCart', this);

      /*
      if ($('.set-items').length && $(this).hasClass('add-to-cart-global')) {
          setPids = [];
           $('.product-detail').each(function () {
              if (!$(this).hasClass('product-set-detail')) {
                  setPids.push({
                      pid: $(this).find('.product-id').text(),
                      qty: $(this).find('.quantity-select').val(),
                      options: getOptions($(this))
                  });
              }
          });
          pidsObj = JSON.stringify(setPids);
      }
       pid = getPidValue($(this));
       var $productContainer = $(this).closest('.product-detail');
      if (!$productContainer.length) {
          $productContainer = $(this).closest('.quick-view-dialog').find('.product-detail');
      }
      */

      addToCartUrl = $('.add-giftcert-to-cart-url').val();
      /*
      console.log('addToCartUrl: ' + addToCartUrl);
      console.log('giftCertTo: ' + $('#giftcertificate-recipient').val());
      console.log('giftCertEmail: ' + $('#giftcertificate-email').val());
      console.log('giftCertAmount: ' + $('#giftcertificate-amount').val());
      console.log('giftCertMessage: ' + $('#giftcertificate-message').val());
      */

      var form = {
        pid: pid,
        pidsObj: pidsObj,
        childProducts: [],
        quantity: 1,
        giftCertTo: $('#giftcertificate-recipient').val(),
        giftCertEmail: $('#giftcertificate-email').val(),
        giftCertAmount: $('#giftcertificate-amount').val(),
        giftCertMessage: $('#giftcertificate-message').val()
      };

      /*
      if (!$('.bundle-item').length) {
          form.options = getOptions($productContainer);
      }
      */

      $(this).trigger('updateAddToCartFormData', form);
      if (addToCartUrl) {
        $.ajax({
          url: addToCartUrl,
          method: 'POST',
          data: form,
          success: function success(data) {
            handlePostCartAdd(data);
            $('body').trigger('product:afterAddToCart', data);
            $.spinner().stop();
          },
          error: function error() {
            $.spinner().stop();
          }
        });
      }
    });
  }
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/util.js":
/*!*************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/util.js ***!
  \*************************************************************************************************************************/
/***/ (function(module) {



function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
module.exports = function (include) {
  if (typeof include === 'function') {
    include();
  } else if (_typeof(include) === 'object') {
    Object.keys(include).forEach(function (key) {
      if (typeof include[key] === 'function') {
        include[key]();
      }
    });
  }
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!****************************************************************************!*\
  !*** ./cartridges/app_custom_sfra/cartridge/client/default/js/giftCert.js ***!
  \****************************************************************************/


var processInclude = __webpack_require__(/*! base/util */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/util.js");
$(document).ready(function () {
  processInclude(__webpack_require__(/*! ./giftCertificate/giftCert */ "./cartridges/app_custom_sfra/cartridge/client/default/js/giftCertificate/giftCert.js"));
  processInclude(__webpack_require__(/*! ./checkout/giftCertificate */ "./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/giftCertificate.js"));
});
}();
/******/ })()
;
//# sourceMappingURL=giftCert.js.map