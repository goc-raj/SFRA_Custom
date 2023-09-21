/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/******/ 	var __webpack_exports__ = __webpack_require__("./cartridges/app_custom_sfra/cartridge/client/default/js/giftCertificate/giftCert.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=giftCert.js.map