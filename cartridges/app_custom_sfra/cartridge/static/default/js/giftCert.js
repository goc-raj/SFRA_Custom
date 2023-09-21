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
          $('.coupon-error-message').show().append(data.errorMessage);
          $('#pmt').show();
        } else {
          $('.giftcert-message').empty().show().append(data.message);
          if (data.flag === "more") {
            $('#pmt').hide();
            // var paymentMethod = "<input type='hidden' class='form-control' name='${pdict.forms.billingForm.paymentMethod.htmlName}' value='GIFT_CERTIFICATE'>";
            // $("#giftForm").prepend(paymentMethod);
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
  if ($('.add-to-cart-messages').length === 0) {
    $('body').append('<div class="add-to-cart-messages"></div>');
  }
  $('.add-to-cart-messages').append('<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">' + response.message + '</div>');
  setTimeout(function () {
    $('.add-to-basket-alert').remove();
  }, 5000);
}

/**
 * Makes a call to the server to report the event of adding an item to the cart
 *
 * @param {string | boolean} url - a string representing the end point to hit so that the event can be recorded, or false
 */
function miniCartReportingUrl(url) {
  if (url) {
    $.ajax({
      url: url,
      method: 'GET',
      success: function success() {
        // reporting urls hit on the server
      },
      error: function error() {
        // no reporting urls hit on the server
      }
    });
  }
}
module.exports = {
  addGiftCertToCart: function addGiftCertToCart() {
    $(document).on('submit', '.giftCardForm', function (e) {
      var addToCartUrl;
      var pid;
      e.preventDefault();
      $('body').trigger('product:beforeAddToCart', this);
      var formData = $('.giftCardForm').serialize();
      addToCartUrl = $('.add-to-cart-url').val();
      pid = $('#prodId').val();
      // var form = {
      //     pid: pid,
      //     pidsObj: {},
      //     childProducts: [],
      //     quantity: 1,
      //     formData: formData
      // };
      var form = $('.giftCardForm');
      $(this).trigger('updateAddToCartFormData', form);
      if (addToCartUrl) {
        $.ajax({
          url: addToCartUrl,
          method: 'POST',
          data: form.serialize(),
          success: function success(data) {
            handlePostCartAdd(data);
            $('body').trigger('product:afterAddToCart', data);
            $.spinner().stop();
            miniCartReportingUrl(data.reportingURL);
          },
          error: function error() {
            $.spinner().stop();
          }
        });
      }
    });
  },
  miniCartReportingUrl: miniCartReportingUrl
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