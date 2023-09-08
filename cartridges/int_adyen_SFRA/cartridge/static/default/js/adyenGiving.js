/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!******************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenGiving.js ***!
  \******************************************************************************/


var adyenGivingNode = document.getElementById('donate-container');
function handleOnDonate(state, component) {
  if (!state.isValid) {
    return;
  }
  var selectedAmount = state.data.amount;
  var donationData = {
    amountValue: selectedAmount.value,
    amountCurrency: selectedAmount.currency,
    orderNo: window.orderNo,
    orderToken: window.orderToken
  };
  $.ajax({
    url: window.donateURL,
    type: 'post',
    data: donationData,
    success: function success() {
      component.setStatus('success');
    }
  });
}
function handleOnCancel(state, component) {
  var adyenGiving = document.getElementById('adyenGiving');
  adyenGiving.style.transition = 'all 3s ease-in-out';
  adyenGiving.style.display = 'none';
  component.unmount();
}
function getAmounts() {
  try {
    return JSON.parse(donationAmounts);
  } catch (e) {
    return [];
  }
}
var donationConfig = {
  amounts: getAmounts(),
  backgroundUrl: adyenGivingBackgroundUrl,
  description: charityDescription,
  logoUrl: adyenGivingLogoUrl,
  name: charityName,
  url: charityWebsite,
  showCancelButton: true,
  onDonate: handleOnDonate,
  onCancel: handleOnCancel
};
AdyenCheckout(window.Configuration).then(function (checkout) {
  checkout.create('donation', donationConfig).mount(adyenGivingNode);
});
/******/ })()
;
//# sourceMappingURL=adyenGiving.js.map