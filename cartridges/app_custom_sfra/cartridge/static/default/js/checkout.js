/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/billing.js":
/*!************************************************************************************!*\
  !*** ./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/billing.js ***!
  \************************************************************************************/
/***/ (function(module) {



/**
 * Updates the payment information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updatePaymentInformation(order) {
  var $paymentSummary = $('.payment-details');
  var htmlToAppend = '';
  if (order.billing.payment && order.billing.payment.selectedPaymentInstruments && order.billing.payment.selectedPaymentInstruments.length > 0) {
    htmlToAppend += '<span>' + order.resources.cardType + ' ' + order.billing.payment.selectedPaymentInstruments[0].type + '</span><div>' + order.billing.payment.selectedPaymentInstruments[0].maskedGiftCertificateCode + '</div>';
  }
  $paymentSummary.empty().append(htmlToAppend);
}
module.exports.methods = {
  updatePaymentInformation: updatePaymentInformation
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js":
/*!********************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js ***!
  \********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var store = __webpack_require__(/*! ../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
var _require = __webpack_require__(/*! ./adyen_checkout/renderGenericComponent */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGenericComponent.js"),
  renderGenericComponent = _require.renderGenericComponent;
var _require2 = __webpack_require__(/*! ./adyen_checkout/checkoutConfiguration */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/checkoutConfiguration.js"),
  setCheckoutConfiguration = _require2.setCheckoutConfiguration,
  actionHandler = _require2.actionHandler;
var _require3 = __webpack_require__(/*! ./adyen_checkout/helpers */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js"),
  assignPaymentMethodValue = _require3.assignPaymentMethodValue,
  showValidation = _require3.showValidation,
  paymentFromComponent = _require3.paymentFromComponent;
var _require4 = __webpack_require__(/*! ./adyen_checkout/validateComponents */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/validateComponents.js"),
  validateComponents = _require4.validateComponents;
$('#dwfrm_billing').submit(function apiRequest(e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr('action');
  $.ajax({
    type: 'POST',
    url: url,
    data: form.serialize(),
    async: false,
    success: function success(data) {
      store.formErrorsExist = 'fieldErrors' in data;
    }
  });
});
setCheckoutConfiguration();
if (window.cardholderNameBool !== 'null') {
  store.checkoutConfiguration.paymentMethodsConfiguration.card.hasHolderName = true;
  store.checkoutConfiguration.paymentMethodsConfiguration.card.holderNameRequired = true;
}
if (window.googleMerchantID !== 'null' && window.Configuration.environment === 'live') {
  var id = 'merchantId';
  store.checkoutConfiguration.paymentMethodsConfiguration.paywithgoogle.configuration[id] = window.googleMerchantID;
  store.checkoutConfiguration.paymentMethodsConfiguration.googlepay.configuration[id] = window.googleMerchantID;
}

// Submit the payment
$('button[value="submit-payment"]').on('click', function () {
  if (store.paypalTerminatedEarly) {
    paymentFromComponent({
      cancelTransaction: true,
      merchantReference: document.querySelector('#merchantReference').value
    });
    store.paypalTerminatedEarly = false;
  }
  if (document.querySelector('#selectedPaymentOption').value === 'AdyenPOS') {
    document.querySelector('#terminalId').value = document.querySelector('#terminalList').value;
  }
  if (document.querySelector('#selectedPaymentOption').value === 'AdyenComponent' || document.querySelector('#selectedPaymentOption').value === 'CREDIT_CARD') {
    assignPaymentMethodValue();
    validateComponents();
    return showValidation();
  }
  return true;
});
module.exports = {
  renderGenericComponent: renderGenericComponent,
  actionHandler: actionHandler
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/checkoutConfiguration.js":
/*!*******************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/checkoutConfiguration.js ***!
  \*******************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var helpers = __webpack_require__(/*! ./helpers */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js");
var _require = __webpack_require__(/*! ./makePartialPayment */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/makePartialPayment.js"),
  makePartialPayment = _require.makePartialPayment;
var _require2 = __webpack_require__(/*! ../commons */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/commons/index.js"),
  onBrand = _require2.onBrand,
  onFieldValid = _require2.onFieldValid;
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
var constants = __webpack_require__(/*! ../constants */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/constants.js");
var _require3 = __webpack_require__(/*! ./renderGiftcardComponent */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGiftcardComponent.js"),
  createElementsToShowRemainingGiftCardAmount = _require3.createElementsToShowRemainingGiftCardAmount,
  renderAddedGiftCard = _require3.renderAddedGiftCard,
  getGiftCardElements = _require3.getGiftCardElements,
  showGiftCardInfoMessage = _require3.showGiftCardInfoMessage;
function getCardConfig() {
  return {
    enableStoreDetails: window.showStoreDetails,
    showBrandsUnderCardNumber: false,
    clickToPayConfiguration: {
      shopperEmail: window.customerEmail,
      merchantDisplayName: window.merchantAccount
    },
    onChange: function onChange(state) {
      store.isValid = state.isValid;
      var method = state.data.paymentMethod.storedPaymentMethodId ? "storedCard".concat(state.data.paymentMethod.storedPaymentMethodId) : store.selectedMethod;
      store.updateSelectedPayment(method, 'isValid', store.isValid);
      store.updateSelectedPayment(method, 'stateData', state.data);
    },
    onSubmit: function onSubmit() {
      helpers.assignPaymentMethodValue();
      document.querySelector('button[value="submit-payment"]').disabled = false;
      document.querySelector('button[value="submit-payment"]').click();
    },
    onFieldValid: onFieldValid,
    onBrand: onBrand
  };
}
function getPaypalConfig() {
  store.paypalTerminatedEarly = false;
  return {
    showPayButton: true,
    environment: window.Configuration.environment,
    onSubmit: function onSubmit(state, component) {
      helpers.assignPaymentMethodValue();
      document.querySelector('#adyenStateData').value = JSON.stringify(store.selectedPayment.stateData);
      helpers.paymentFromComponent(state.data, component);
    },
    onCancel: function onCancel(data, component) {
      store.paypalTerminatedEarly = false;
      helpers.paymentFromComponent({
        cancelTransaction: true,
        merchantReference: document.querySelector('#merchantReference').value,
        orderToken: document.querySelector('#orderToken').value
      }, component);
    },
    onError: function onError(error, component) {
      store.paypalTerminatedEarly = false;
      if (component) {
        component.setStatus('ready');
      }
      document.querySelector('#showConfirmationForm').submit();
    },
    onAdditionalDetails: function onAdditionalDetails(state) {
      store.paypalTerminatedEarly = false;
      document.querySelector('#additionalDetailsHidden').value = JSON.stringify(state.data);
      document.querySelector('#showConfirmationForm').submit();
    },
    onClick: function onClick(data, actions) {
      $('#dwfrm_billing').trigger('submit');
      if (store.formErrorsExist) {
        return actions.reject();
      }
      if (store.paypalTerminatedEarly) {
        helpers.paymentFromComponent({
          cancelTransaction: true,
          merchantReference: document.querySelector('#merchantReference').value
        });
        store.paypalTerminatedEarly = false;
        return actions.resolve();
      }
      store.paypalTerminatedEarly = true;
      return null;
    }
  };
}
function getGooglePayConfig() {
  return {
    environment: window.Configuration.environment,
    onSubmit: function onSubmit() {
      helpers.assignPaymentMethodValue();
      document.querySelector('button[value="submit-payment"]').disabled = false;
      document.querySelector('button[value="submit-payment"]').click();
    },
    configuration: {
      gatewayMerchantId: window.merchantAccount
    },
    showPayButton: true,
    buttonColor: 'white'
  };
}
function handlePartialPaymentSuccess() {
  var _store$addedGiftCards;
  var _getGiftCardElements = getGiftCardElements(),
    giftCardSelectContainer = _getGiftCardElements.giftCardSelectContainer,
    giftCardSelect = _getGiftCardElements.giftCardSelect,
    giftCardsList = _getGiftCardElements.giftCardsList;
  giftCardSelectContainer.classList.add('invisible');
  giftCardSelect.value = null;
  giftCardsList.innerHTML = '';
  store.componentsObj.giftcard.node.unmount('component_giftcard');
  store.addedGiftCards.forEach(function (card) {
    renderAddedGiftCard(card);
  });
  if ((_store$addedGiftCards = store.addedGiftCards) !== null && _store$addedGiftCards !== void 0 && _store$addedGiftCards.length) {
    showGiftCardInfoMessage();
  }
  createElementsToShowRemainingGiftCardAmount();
}
function getGiftCardConfig() {
  var giftcardBalance;
  return {
    showPayButton: true,
    onChange: function onChange(state) {
      store.updateSelectedPayment(constants.GIFTCARD, 'isValid', state.isValid);
      store.updateSelectedPayment(constants.GIFTCARD, 'stateData', state.data);
    },
    onBalanceCheck: function onBalanceCheck(resolve, reject, requestData) {
      $.ajax({
        type: 'POST',
        url: 'Adyen-CheckBalance',
        data: JSON.stringify(requestData),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function success(data) {
          giftcardBalance = data.balance;
          document.querySelector('button[value="submit-payment"]').disabled = false;
          if (data.resultCode === constants.SUCCESS) {
            var _getGiftCardElements2 = getGiftCardElements(),
              giftCardsInfoMessageContainer = _getGiftCardElements2.giftCardsInfoMessageContainer,
              giftCardSelect = _getGiftCardElements2.giftCardSelect,
              giftCardCancelButton = _getGiftCardElements2.giftCardCancelButton,
              giftCardAddButton = _getGiftCardElements2.giftCardAddButton,
              giftCardSelectWrapper = _getGiftCardElements2.giftCardSelectWrapper;
            if (giftCardSelectWrapper) {
              giftCardSelectWrapper.classList.add('invisible');
            }
            var initialPartialObject = _objectSpread({}, store.partialPaymentsOrderObj);
            giftCardCancelButton.classList.remove('invisible');
            giftCardCancelButton.addEventListener('click', function () {
              store.componentsObj.giftcard.node.unmount('component_giftcard');
              giftCardCancelButton.classList.add('invisible');
              giftCardAddButton.style.display = 'block';
              giftCardSelect.value = 'null';
              store.partialPaymentsOrderObj.remainingAmountFormatted = initialPartialObject.remainingAmountFormatted;
              store.partialPaymentsOrderObj.totalDiscountedAmount = initialPartialObject.totalDiscountedAmount;
              createElementsToShowRemainingGiftCardAmount();
            });
            document.querySelector('button[value="submit-payment"]').disabled = true;
            giftCardsInfoMessageContainer.innerHTML = '';
            giftCardsInfoMessageContainer.classList.remove('gift-cards-info-message-container');
            store.partialPaymentsOrderObj.remainingAmountFormatted = data.remainingAmountFormatted;
            store.partialPaymentsOrderObj.totalDiscountedAmount = data.totalAmountFormatted;
            createElementsToShowRemainingGiftCardAmount();
            resolve(data);
          } else if (data.resultCode === constants.NOTENOUGHBALANCE) {
            resolve(data);
          } else {
            reject();
          }
        },
        fail: function fail() {
          reject();
        }
      });
    },
    onOrderRequest: function onOrderRequest(resolve, reject, requestData) {
      // Make a POST /orders request
      // Create an order for the total transaction amount
      var giftCardData = requestData.paymentMethod;
      $.ajax({
        type: 'POST',
        url: 'Adyen-PartialPaymentsOrder',
        data: JSON.stringify(requestData),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function success(data) {
          if (data.resultCode === 'Success') {
            // make payments call including giftcard data and order data
            var brandSelect = document.getElementById('giftCardSelect');
            var selectedBrandIndex = brandSelect.selectedIndex;
            var giftcardBrand = brandSelect.options[selectedBrandIndex].text;
            var partialPaymentRequest = {
              paymentMethod: giftCardData,
              amount: giftcardBalance,
              partialPaymentsOrder: {
                pspReference: data.pspReference,
                orderData: data.orderData
              },
              giftcardBrand: giftcardBrand
            };
            var partialPaymentResponse = makePartialPayment(partialPaymentRequest);
            if (partialPaymentResponse !== null && partialPaymentResponse !== void 0 && partialPaymentResponse.error) {
              reject();
            } else {
              handlePartialPaymentSuccess();
            }
          }
        }
      });
    },
    onSubmit: function onSubmit(state, component) {
      store.selectedMethod = state.data.paymentMethod.type;
      store.brand = component === null || component === void 0 ? void 0 : component.displayName;
      document.querySelector('input[name="brandCode"]').checked = false;
      document.querySelector('button[value="submit-payment"]').disabled = false;
      document.querySelector('button[value="submit-payment"]').click();
    }
  };
}
function handleOnChange(state) {
  store.isValid = state.isValid;
  if (!store.componentsObj[store.selectedMethod]) {
    store.componentsObj[store.selectedMethod] = {};
  }
  store.componentsObj[store.selectedMethod].isValid = store.isValid;
  store.componentsObj[store.selectedMethod].stateData = state.data;
}
var actionHandler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(action) {
    var checkout;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return AdyenCheckout(store.checkoutConfiguration);
        case 2:
          checkout = _context.sent;
          checkout.createFromAction(action).mount('#action-container');
          $('#action-modal').modal({
            backdrop: 'static',
            keyboard: false
          });
          if (action.type === constants.ACTIONTYPE.QRCODE) {
            document.getElementById('cancelQrMethodsButton').classList.remove('invisible');
          }
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function actionHandler(_x) {
    return _ref.apply(this, arguments);
  };
}();
function handleOnAdditionalDetails(state) {
  $.ajax({
    type: 'POST',
    url: 'Adyen-PaymentsDetails',
    data: JSON.stringify({
      data: state.data,
      orderToken: window.orderToken
    }),
    contentType: 'application/json; charset=utf-8',
    async: false,
    success: function success(data) {
      if (!data.isFinal && _typeof(data.action) === 'object') {
        actionHandler(data.action);
      } else {
        window.location.href = data.redirectUrl;
      }
    }
  });
}
function getAmazonpayConfig() {
  return {
    showPayButton: true,
    productType: 'PayAndShip',
    checkoutMode: 'ProcessOrder',
    locale: window.Configuration.locale,
    returnUrl: window.returnURL,
    onClick: function onClick(resolve, reject) {
      $('#dwfrm_billing').trigger('submit');
      if (store.formErrorsExist) {
        reject();
      } else {
        helpers.assignPaymentMethodValue();
        resolve();
      }
    },
    onError: function onError() {}
  };
}
function getApplePayConfig() {
  return {
    showPayButton: true,
    onSubmit: function onSubmit(state, component) {
      helpers.assignPaymentMethodValue();
      helpers.paymentFromComponent(state.data, component);
    }
  };
}
function getKlarnaConfig() {
  var _window = window,
    klarnaWidgetEnabled = _window.klarnaWidgetEnabled;
  if (klarnaWidgetEnabled) {
    return {
      showPayButton: true,
      useKlarnaWidget: true,
      onSubmit: function onSubmit(state, component) {
        helpers.assignPaymentMethodValue();
        helpers.paymentFromComponent(state.data, component);
      },
      onAdditionalDetails: function onAdditionalDetails(state) {
        document.querySelector('#additionalDetailsHidden').value = JSON.stringify(state.data);
        document.querySelector('#showConfirmationForm').submit();
      }
    };
  }
  return null;
}
function setCheckoutConfiguration() {
  store.checkoutConfiguration.onChange = handleOnChange;
  store.checkoutConfiguration.onAdditionalDetails = handleOnAdditionalDetails;
  store.checkoutConfiguration.showPayButton = false;
  store.checkoutConfiguration.clientKey = window.adyenClientKey;
  store.checkoutConfiguration.paymentMethodsConfiguration = {
    card: getCardConfig(),
    bcmc: getCardConfig(),
    storedCard: getCardConfig(),
    boletobancario: {
      personalDetailsRequired: true,
      // turn personalDetails section on/off
      billingAddressRequired: false,
      // turn billingAddress section on/off
      showEmailAddress: false // allow shopper to specify their email address
    },

    paywithgoogle: getGooglePayConfig(),
    googlepay: getGooglePayConfig(),
    paypal: getPaypalConfig(),
    amazonpay: getAmazonpayConfig(),
    giftcard: getGiftCardConfig(),
    applepay: getApplePayConfig(),
    klarna: getKlarnaConfig(),
    klarna_account: getKlarnaConfig(),
    klarna_paynow: getKlarnaConfig()
  };
}
module.exports = {
  getCardConfig: getCardConfig,
  getPaypalConfig: getPaypalConfig,
  getGooglePayConfig: getGooglePayConfig,
  getAmazonpayConfig: getAmazonpayConfig,
  setCheckoutConfiguration: setCheckoutConfiguration,
  actionHandler: actionHandler
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js ***!
  \*****************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
function assignPaymentMethodValue() {
  var adyenPaymentMethod = document.querySelector('#adyenPaymentMethodName');
  // if currently selected paymentMethod contains a brand it will be part of the label ID
  var paymentMethodlabelId = "#lb_".concat(store.selectedMethod);
  if (adyenPaymentMethod) {
    var _document$querySelect;
    adyenPaymentMethod.value = store.brand ? store.brand : (_document$querySelect = document.querySelector(paymentMethodlabelId)) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerHTML;
  }
}
function setOrderFormData(response) {
  if (response.orderNo) {
    document.querySelector('#merchantReference').value = response.orderNo;
  }
  if (response.orderToken) {
    document.querySelector('#orderToken').value = response.orderToken;
  }
}

/**
 * Makes an ajax call to the controller function PaymentFromComponent.
 * Used by certain payment methods like paypal
 */
function paymentFromComponent(data) {
  var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var requestData = store.partialPaymentsOrderObj ? _objectSpread(_objectSpread({}, data), {}, {
    partialPaymentsOrder: store.partialPaymentsOrderObj
  }) : data;
  $.ajax({
    url: window.paymentFromComponentURL,
    type: 'post',
    data: {
      data: JSON.stringify(requestData),
      paymentMethod: document.querySelector('#adyenPaymentMethodName').value
    },
    success: function success(response) {
      var _response$fullRespons;
      setOrderFormData(response);
      if ((_response$fullRespons = response.fullResponse) !== null && _response$fullRespons !== void 0 && _response$fullRespons.action) {
        component.handleAction(response.fullResponse.action);
      } else if (response.isApplePay) {
        document.querySelector('#result').value = JSON.stringify(response);
        document.querySelector('#showConfirmationForm').submit();
      } else if (response.paymentError || response.error) {
        component.handleError();
      }
    }
  });
}
function resetPaymentMethod() {
  $('#requiredBrandCode').hide();
  $('#selectedIssuer').val('');
  $('#adyenIssuerName').val('');
  $('#dateOfBirth').val('');
  $('#telephoneNumber').val('');
  $('#gender').val('');
  $('#bankAccountOwnerName').val('');
  $('#bankAccountNumber').val('');
  $('#bankLocationId').val('');
  $('.additionalFields').hide();
}

/**
 * Changes the "display" attribute of the selected method from hidden to visible
 */
function displaySelectedMethod(type) {
  var _document$querySelect2;
  // If 'type' input field is present use this as type, otherwise default to function input param
  store.selectedMethod = document.querySelector("#component_".concat(type, " .type")) ? document.querySelector("#component_".concat(type, " .type")).value : type;
  resetPaymentMethod();
  var disabledSubmitButtonMethods = ['paypal', 'paywithgoogle', 'googlepay', 'amazonpay', 'applepay'];
  if (window.klarnaWidgetEnabled) {
    disabledSubmitButtonMethods.push('klarna');
  }
  document.querySelector('button[value="submit-payment"]').disabled = disabledSubmitButtonMethods.findIndex(function (pm) {
    return type.includes(pm);
  }) > -1;
  document.querySelector("#component_".concat(type)).setAttribute('style', 'display:block');
  // set brand for giftcards if hidden inputfield is present
  store.brand = (_document$querySelect2 = document.querySelector("#component_".concat(type, " .brand"))) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.value;
}
function displayValidationErrors() {
  store.selectedPayment.node.showValidation();
  return false;
}
var selectedMethods = {};
function doCustomValidation() {
  return store.selectedMethod in selectedMethods ? selectedMethods[store.selectedMethod]() : true;
}
function showValidation() {
  return store.selectedPaymentIsValid ? doCustomValidation() : displayValidationErrors();
}
function getInstallmentValues(maxValue) {
  var values = [];
  for (var i = 1; i <= maxValue; i += 1) {
    values.push(i);
  }
  return values;
}
function createShowConfirmationForm(action) {
  if (document.querySelector('#showConfirmationForm')) {
    return;
  }
  var template = document.createElement('template');
  var form = "<form method=\"post\" id=\"showConfirmationForm\" name=\"showConfirmationForm\" action=\"".concat(action, "\">\n    <input type=\"hidden\" id=\"additionalDetailsHidden\" name=\"additionalDetailsHidden\" value=\"null\"/>\n    <input type=\"hidden\" id=\"merchantReference\" name=\"merchantReference\"/>\n    <input type=\"hidden\" id=\"orderToken\" name=\"orderToken\"/>\n    <input type=\"hidden\" id=\"result\" name=\"result\" value=\"null\"/>\n  </form>");
  template.innerHTML = form;
  document.querySelector('body').appendChild(template.content);
}
module.exports = {
  setOrderFormData: setOrderFormData,
  assignPaymentMethodValue: assignPaymentMethodValue,
  paymentFromComponent: paymentFromComponent,
  resetPaymentMethod: resetPaymentMethod,
  displaySelectedMethod: displaySelectedMethod,
  showValidation: showValidation,
  createShowConfirmationForm: createShowConfirmationForm,
  getInstallmentValues: getInstallmentValues
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/localesUsingInstallments.js":
/*!**********************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/localesUsingInstallments.js ***!
  \**********************************************************************************************************/
/***/ (function(module) {



module.exports.installmentLocales = ['pt_BR', 'ja_JP', 'tr_TR', 'es_MX'];

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/makePartialPayment.js":
/*!****************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/makePartialPayment.js ***!
  \****************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var _excluded = ["giftCards"];
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
var _require = __webpack_require__(/*! ./renderGenericComponent */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGenericComponent.js"),
  renderGenericComponent = _require.renderGenericComponent;
var helpers = __webpack_require__(/*! ./helpers */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js");
function makePartialPayment(requestData) {
  var error;
  $.ajax({
    url: 'Adyen-partialPayment',
    type: 'POST',
    data: JSON.stringify(requestData),
    contentType: 'application/json; charset=utf-8',
    async: false,
    success: function success(response) {
      if (response.error) {
        error = {
          error: true
        };
      } else {
        var giftCards = response.giftCards,
          rest = _objectWithoutProperties(response, _excluded);
        store.checkout.options.amount = rest.remainingAmount;
        store.partialPaymentsOrderObj = rest;
        sessionStorage.setItem('partialPaymentsObj', JSON.stringify(rest));
        store.addedGiftCards = giftCards;
        helpers.setOrderFormData(response);
        renderGenericComponent(true);
      }
    }
  }).fail(function () {});
  return error;
}
module.exports = {
  makePartialPayment: makePartialPayment
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGenericComponent.js":
/*!********************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGenericComponent.js ***!
  \********************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var _document$getElementB;
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
/* eslint-disable no-unsafe-optional-chaining */
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
var _require = __webpack_require__(/*! ./renderPaymentMethod */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderPaymentMethod.js"),
  renderPaymentMethod = _require.renderPaymentMethod;
var helpers = __webpack_require__(/*! ./helpers */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js");
var _require2 = __webpack_require__(/*! ./localesUsingInstallments */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/localesUsingInstallments.js"),
  installmentLocales = _require2.installmentLocales;
var _require3 = __webpack_require__(/*! ../commons */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/commons/index.js"),
  createSession = _require3.createSession,
  fetchGiftCards = _require3.fetchGiftCards;
var constants = __webpack_require__(/*! ../constants */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/constants.js");
var _require4 = __webpack_require__(/*! ./renderGiftcardComponent */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGiftcardComponent.js"),
  createElementsToShowRemainingGiftCardAmount = _require4.createElementsToShowRemainingGiftCardAmount,
  removeGiftCards = _require4.removeGiftCards,
  renderAddedGiftCard = _require4.renderAddedGiftCard,
  showGiftCardWarningMessage = _require4.showGiftCardWarningMessage,
  attachGiftCardAddButtonListener = _require4.attachGiftCardAddButtonListener,
  showGiftCardInfoMessage = _require4.showGiftCardInfoMessage,
  giftCardBrands = _require4.giftCardBrands;
function addPosTerminals(terminals) {
  var ddTerminals = document.createElement('select');
  ddTerminals.id = 'terminalList';
  Object.keys(terminals).forEach(function (t) {
    var option = document.createElement('option');
    option.value = terminals[t];
    option.text = terminals[t];
    ddTerminals.appendChild(option);
  });
  document.querySelector('#adyenPosTerminals').append(ddTerminals);
}
function setCheckoutConfiguration(checkoutOptions) {
  var setField = function setField(key, val) {
    return val && _defineProperty({}, key, val);
  };
  store.checkoutConfiguration = _objectSpread(_objectSpread(_objectSpread({}, store.checkoutConfiguration), setField('amount', checkoutOptions.amount)), setField('countryCode', checkoutOptions.countryCode));
}
function resolveUnmount(key, val) {
  try {
    return Promise.resolve(val.node.unmount("component_".concat(key)));
  } catch (e) {
    // try/catch block for val.unmount
    return Promise.resolve(false);
  }
}

/**
 * To avoid re-rendering components twice, unmounts existing components from payment methods list
 */
function unmountComponents() {
  var promises = Object.entries(store.componentsObj).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      key = _ref3[0],
      val = _ref3[1];
    delete store.componentsObj[key];
    return resolveUnmount(key, val);
  });
  return Promise.all(promises);
}
function isCartModified(refresh, amount, orderAmount) {
  return refresh === false && (amount.currency !== orderAmount.currency || amount.value !== orderAmount.value);
}
function renderGiftCardLogo(imagePath) {
  var headingImg = document.querySelector('#headingImg');
  if (headingImg) {
    headingImg.src = "".concat(imagePath, "genericgiftcard.png");
  }
}
function applyGiftCards(refresh) {
  var now = new Date().toISOString();
  var amount = store.checkoutConfiguration.amount;
  var orderAmount = store.partialPaymentsOrderObj.orderAmount;
  var isPartialPaymentExpired = store.addedGiftCards.some(function (cart) {
    return now > cart.expiresAt;
  });
  var cartModified = isCartModified(refresh, amount, orderAmount);
  if (isPartialPaymentExpired) {
    removeGiftCards();
  } else if (cartModified) {
    removeGiftCards();
    showGiftCardWarningMessage();
  } else {
    var _store$addedGiftCards;
    store.addedGiftCards.forEach(function (card) {
      renderAddedGiftCard(card);
    });
    if ((_store$addedGiftCards = store.addedGiftCards) !== null && _store$addedGiftCards !== void 0 && _store$addedGiftCards.length) {
      showGiftCardInfoMessage();
    }
    store.checkout.options.amount = store.addedGiftCards[store.addedGiftCards.length - 1].remainingAmount;
    createElementsToShowRemainingGiftCardAmount();
  }
}
function renderStoredPaymentMethod(imagePath) {
  return function (pm) {
    if (pm.supportedShopperInteractions.includes('Ecommerce')) {
      renderPaymentMethod(pm, true, imagePath);
    }
  };
}
function renderStoredPaymentMethods(data, imagePath) {
  if (data.storedPaymentMethods) {
    var storedPaymentMethods = data.storedPaymentMethods;
    storedPaymentMethods.forEach(renderStoredPaymentMethod(imagePath));
  }
}
function renderPaymentMethods(data, imagePath, adyenDescriptions) {
  data.paymentMethods.forEach(function (pm) {
    if (pm.type !== constants.GIFTCARD) {
      renderPaymentMethod(pm, false, imagePath, adyenDescriptions[pm.type]);
    }
  });
}
function renderPosTerminals(adyenConnectedTerminals) {
  var _adyenConnectedTermin;
  var removeChilds = function removeChilds() {
    var posTerminals = document.querySelector('#adyenPosTerminals');
    while (posTerminals.firstChild) {
      posTerminals.removeChild(posTerminals.firstChild);
    }
  };
  if (adyenConnectedTerminals !== null && adyenConnectedTerminals !== void 0 && (_adyenConnectedTermin = adyenConnectedTerminals.uniqueTerminalIds) !== null && _adyenConnectedTermin !== void 0 && _adyenConnectedTermin.length) {
    removeChilds();
    addPosTerminals(adyenConnectedTerminals.uniqueTerminalIds);
  }
}
function setAmazonPayConfig(adyenPaymentMethods) {
  var amazonpay = adyenPaymentMethods.paymentMethods.find(function (paymentMethod) {
    return paymentMethod.type === 'amazonpay';
  });
  if (amazonpay) {
    var _document$querySelect, _document$querySelect2, _document$querySelect3, _document$querySelect4, _document$querySelect5, _document$querySelect6, _document$querySelect7, _document$querySelect8;
    store.checkoutConfiguration.paymentMethodsConfiguration.amazonpay.configuration = amazonpay.configuration;
    store.checkoutConfiguration.paymentMethodsConfiguration.amazonpay.addressDetails = {
      name: "".concat((_document$querySelect = document.querySelector('#shippingFirstNamedefault')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.value, " ").concat((_document$querySelect2 = document.querySelector('#shippingLastNamedefault')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.value),
      addressLine1: (_document$querySelect3 = document.querySelector('#shippingAddressOnedefault')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.value,
      city: (_document$querySelect4 = document.querySelector('#shippingAddressCitydefault')) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.value,
      stateOrRegion: (_document$querySelect5 = document.querySelector('#shippingAddressCitydefault')) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.value,
      postalCode: (_document$querySelect6 = document.querySelector('#shippingZipCodedefault')) === null || _document$querySelect6 === void 0 ? void 0 : _document$querySelect6.value,
      countryCode: (_document$querySelect7 = document.querySelector('#shippingCountrydefault')) === null || _document$querySelect7 === void 0 ? void 0 : _document$querySelect7.value,
      phoneNumber: (_document$querySelect8 = document.querySelector('#shippingPhoneNumberdefault')) === null || _document$querySelect8 === void 0 ? void 0 : _document$querySelect8.value
    };
  }
}
function setInstallments(amount) {
  try {
    var _window$installments;
    if (installmentLocales.indexOf(window.Configuration.locale) < 0) {
      return;
    }
    var _window$installments$ = (_window$installments = window.installments) === null || _window$installments === void 0 ? void 0 : _window$installments.replace(/\[|]/g, '').split(','),
      _window$installments$2 = _slicedToArray(_window$installments$, 2),
      minAmount = _window$installments$2[0],
      numOfInstallments = _window$installments$2[1];
    if (minAmount <= amount.value) {
      store.checkoutConfiguration.paymentMethodsConfiguration.card.installmentOptions = {
        card: {}
      }; // eslint-disable-next-line max-len
      store.checkoutConfiguration.paymentMethodsConfiguration.card.installmentOptions.card.values = helpers.getInstallmentValues(numOfInstallments);
      store.checkoutConfiguration.paymentMethodsConfiguration.card.showInstallmentAmounts = true;
    }
  } catch (e) {} // eslint-disable-line no-empty
}

function setGiftCardContainerVisibility() {
  var availableGiftCards = giftCardBrands();
  if (availableGiftCards.length === 0) {
    var giftCardContainer = document.querySelector('.gift-card-selection');
    giftCardContainer.style.display = 'none';
  }
}
(_document$getElementB = document.getElementById('email')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.addEventListener('change', function (e) {
  var emailPattern = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
  if (emailPattern.test(e.target.value)) {
    var paymentMethodsConfiguration = store.checkoutConfiguration.paymentMethodsConfiguration;
    paymentMethodsConfiguration.card.clickToPayConfiguration.shopperEmail = e.target.value;
    var event = new Event('renderGenericComponentCalled');
    document.dispatchEvent(event);
  }
});

// used by renderGiftCardComponent.js
document.addEventListener('renderGenericComponentCalled', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return module.exports.renderGenericComponent();
      case 2:
      case "end":
        return _context.stop();
    }
  }, _callee);
})));

/**
 * Calls createSession and then renders the retrieved payment methods (including card component)
 */
module.exports.renderGenericComponent = /*#__PURE__*/function () {
  var _renderGenericComponent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _store$addedGiftCards2;
    var refresh,
      session,
      giftCardsData,
      totalDiscountedAmount,
      giftCards,
      _giftCardsData$giftCa,
      lastGiftCard,
      firstPaymentMethod,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          refresh = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : false;
          if (!(Object.keys(store.componentsObj).length !== 0)) {
            _context2.next = 4;
            break;
          }
          _context2.next = 4;
          return unmountComponents();
        case 4:
          _context2.next = 6;
          return createSession();
        case 6:
          session = _context2.sent;
          _context2.next = 9;
          return fetchGiftCards();
        case 9:
          giftCardsData = _context2.sent;
          store.checkoutConfiguration.session = {
            id: session.id,
            sessionData: session.sessionData,
            imagePath: session.imagePath,
            adyenDescriptions: session.adyenDescriptions
          };
          _context2.next = 13;
          return AdyenCheckout(store.checkoutConfiguration);
        case 13:
          store.checkout = _context2.sent;
          setGiftCardContainerVisibility();
          totalDiscountedAmount = giftCardsData.totalDiscountedAmount, giftCards = giftCardsData.giftCards;
          store.addedGiftCards = giftCards;
          if (giftCards !== null && giftCards !== void 0 && giftCards.length) {
            lastGiftCard = giftCards[store.addedGiftCards.length - 1];
            store.partialPaymentsOrderObj = (_giftCardsData$giftCa = giftCardsData.giftCards) !== null && _giftCardsData$giftCa !== void 0 && _giftCardsData$giftCa.length ? _objectSpread(_objectSpread({}, lastGiftCard), {}, {
              totalDiscountedAmount: totalDiscountedAmount
            }) : null;
          }
          setCheckoutConfiguration(store.checkout.options);
          setInstallments(store.checkout.options.amount);
          setAmazonPayConfig(store.checkout.paymentMethodsResponse);
          document.querySelector('#paymentMethodsList').innerHTML = '';
          renderStoredPaymentMethods(store.checkout.paymentMethodsResponse, session.imagePath);
          renderPaymentMethods(store.checkout.paymentMethodsResponse, session.imagePath, session.adyenDescriptions);
          renderPosTerminals(session.adyenConnectedTerminals);
          renderGiftCardLogo(session.imagePath);
          if ((_store$addedGiftCards2 = store.addedGiftCards) !== null && _store$addedGiftCards2 !== void 0 && _store$addedGiftCards2.length) {
            applyGiftCards(refresh);
          }
          attachGiftCardAddButtonListener();
          firstPaymentMethod = document.querySelector('input[type=radio][name=brandCode]');
          firstPaymentMethod.checked = true;
          helpers.displaySelectedMethod(firstPaymentMethod.value);
          helpers.createShowConfirmationForm(window.ShowConfirmationPaymentFromComponent);
        case 32:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  function renderGenericComponent() {
    return _renderGenericComponent.apply(this, arguments);
  }
  return renderGenericComponent;
}();

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGiftcardComponent.js":
/*!*********************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderGiftcardComponent.js ***!
  \*********************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
var constants = __webpack_require__(/*! ../constants */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/constants.js");
function getGiftCardElements() {
  var giftCardSelect = document.querySelector('#giftCardSelect');
  var giftCardUl = document.querySelector('#giftCardUl');
  var giftCardContainer = document.querySelector('#giftCardContainer');
  var giftCardAddButton = document.querySelector('#giftCardAddButton');
  var giftCardSelectContainer = document.querySelector('#giftCardSelectContainer');
  var giftCardSelectWrapper = document.querySelector('#giftCardSelectWrapper');
  var giftCardsList = document.querySelector('#giftCardsList');
  var giftCardsInfoMessageContainer = document.querySelector('#giftCardsInfoMessage');
  var giftCardCancelButton = document.querySelector('#cancelGiftCardButton');
  return {
    giftCardSelect: giftCardSelect,
    giftCardUl: giftCardUl,
    giftCardContainer: giftCardContainer,
    giftCardAddButton: giftCardAddButton,
    giftCardSelectContainer: giftCardSelectContainer,
    giftCardsList: giftCardsList,
    giftCardsInfoMessageContainer: giftCardsInfoMessageContainer,
    giftCardCancelButton: giftCardCancelButton,
    giftCardSelectWrapper: giftCardSelectWrapper
  };
}
function giftCardBrands() {
  var paymentMethodsResponse = store.checkout.paymentMethodsResponse;
  return paymentMethodsResponse.paymentMethods.filter(function (pm) {
    return pm.type === constants.GIFTCARD;
  });
}
function renderGiftCardSelectForm() {
  var _getGiftCardElements = getGiftCardElements(),
    giftCardUl = _getGiftCardElements.giftCardUl,
    giftCardSelect = _getGiftCardElements.giftCardSelect;
  if (giftCardUl !== null && giftCardUl !== void 0 && giftCardUl.innerHTML) {
    giftCardSelect.classList.remove('invisible');
    return;
  }
  var imagePath = store.checkoutConfiguration.session.imagePath;
  giftCardBrands().forEach(function (giftCard) {
    var newListItem = document.createElement('li');
    newListItem.setAttribute('data-brand', giftCard.brand);
    newListItem.setAttribute('data-name', giftCard.name);
    newListItem.setAttribute('data-type', giftCard.type);
    var span = document.createElement('span');
    span.textContent = giftCard.name;
    var img = document.createElement('img');
    img.src = "".concat(imagePath).concat(giftCard.brand, ".png");
    img.width = 40;
    img.height = 26;
    newListItem.appendChild(span);
    newListItem.appendChild(img);
    giftCardUl.appendChild(newListItem);
  });
}
function attachGiftCardFormListeners() {
  if (store.giftCardComponentListenersAdded) {
    return;
  }
  var _getGiftCardElements2 = getGiftCardElements(),
    giftCardUl = _getGiftCardElements2.giftCardUl,
    giftCardSelect = _getGiftCardElements2.giftCardSelect,
    giftCardContainer = _getGiftCardElements2.giftCardContainer,
    giftCardSelectWrapper = _getGiftCardElements2.giftCardSelectWrapper;
  if (giftCardUl) {
    giftCardUl.addEventListener('click', function (event) {
      var _store$componentsObj;
      giftCardUl.classList.toggle('invisible');
      var selectedGiftCard = {
        name: event.target.dataset.name,
        brand: event.target.dataset.brand,
        type: event.target.dataset.type
      };
      if ((_store$componentsObj = store.componentsObj) !== null && _store$componentsObj !== void 0 && _store$componentsObj.giftcard) {
        store.componentsObj.giftcard.node.unmount('component_giftcard');
      }
      if (!store.partialPaymentsOrderObj) {
        store.partialPaymentsOrderObj = {};
      }
      var newOption = document.createElement('option');
      newOption.textContent = selectedGiftCard.name;
      newOption.value = selectedGiftCard.brand;
      newOption.style.visibility = 'hidden';
      giftCardSelect.appendChild(newOption);
      giftCardSelect.value = selectedGiftCard.brand;
      giftCardContainer.innerHTML = '';
      var giftCardNode = store.checkout.create(constants.GIFTCARD, _objectSpread(_objectSpread({}, store.checkoutConfiguration.giftcard), {}, {
        brand: selectedGiftCard.brand,
        name: selectedGiftCard.name
      })).mount(giftCardContainer);
      store.componentsObj.giftcard = {
        node: giftCardNode
      };
    });
  }
  if (giftCardSelect) {
    giftCardSelectWrapper.addEventListener('mousedown', function () {
      giftCardUl.classList.toggle('invisible');
    });
  }
  store.giftCardComponentListenersAdded = true;
}
function showGiftCardWarningMessage() {
  var alertContainer = document.createElement('div');
  alertContainer.setAttribute('id', 'giftCardWarningMessage');
  alertContainer.classList.add('alert', 'alert-warning', 'error-message', 'gift-card-warning-msg');
  alertContainer.setAttribute('role', 'alert');
  var alertContainerP = document.createElement('p');
  alertContainerP.classList.add('error-message-text');
  alertContainerP.textContent = window.giftCardWarningMessage;
  alertContainer.appendChild(alertContainerP);
  var orderTotalSummaryEl = document.querySelector('.card-body.order-total-summary');
  orderTotalSummaryEl === null || orderTotalSummaryEl === void 0 ? void 0 : orderTotalSummaryEl.appendChild(alertContainer);
}
function attachGiftCardAddButtonListener() {
  var _getGiftCardElements3 = getGiftCardElements(),
    giftCardAddButton = _getGiftCardElements3.giftCardAddButton,
    giftCardSelectContainer = _getGiftCardElements3.giftCardSelectContainer,
    giftCardSelectWrapper = _getGiftCardElements3.giftCardSelectWrapper,
    giftCardSelect = _getGiftCardElements3.giftCardSelect;
  if (giftCardAddButton) {
    giftCardAddButton.addEventListener('click', function () {
      renderGiftCardSelectForm();
      attachGiftCardFormListeners();
      var giftCardWarningMessageEl = document.querySelector('#giftCardWarningMessage');
      if (giftCardWarningMessageEl) {
        giftCardWarningMessageEl.style.display = 'none';
      }
      giftCardSelect.value = 'null';
      giftCardAddButton.style.display = 'none';
      giftCardSelectContainer.classList.remove('invisible');
      giftCardSelectWrapper.classList.remove('invisible');
    });
  }
}
function removeGiftCardFormListeners() {
  var _getGiftCardElements4 = getGiftCardElements(),
    giftCardUl = _getGiftCardElements4.giftCardUl,
    giftCardSelect = _getGiftCardElements4.giftCardSelect;
  giftCardUl.replaceWith(giftCardUl.cloneNode(true));
  giftCardSelect.replaceWith(giftCardSelect.cloneNode(true));
  store.giftCardComponentListenersAdded = false;
}
function removeGiftCards() {
  var _store$addedGiftCards;
  (_store$addedGiftCards = store.addedGiftCards) === null || _store$addedGiftCards === void 0 ? void 0 : _store$addedGiftCards.forEach(function (card) {
    $.ajax({
      type: 'POST',
      url: 'Adyen-CancelPartialPaymentOrder',
      data: JSON.stringify(card),
      contentType: 'application/json; charset=utf-8',
      async: false,
      success: function success(res) {
        var adyenPartialPaymentsOrder = document.querySelector('#adyenPartialPaymentsOrder');
        var _getGiftCardElements5 = getGiftCardElements(),
          giftCardsList = _getGiftCardElements5.giftCardsList,
          giftCardAddButton = _getGiftCardElements5.giftCardAddButton,
          giftCardSelect = _getGiftCardElements5.giftCardSelect,
          giftCardUl = _getGiftCardElements5.giftCardUl,
          giftCardsInfoMessageContainer = _getGiftCardElements5.giftCardsInfoMessageContainer,
          giftCardSelectContainer = _getGiftCardElements5.giftCardSelectContainer;
        adyenPartialPaymentsOrder.value = null;
        giftCardsList.innerHTML = '';
        giftCardAddButton.style.display = 'block';
        giftCardSelect.value = null;
        giftCardSelectContainer.classList.add('invisible');
        giftCardSelect.classList.remove('invisible');
        giftCardUl.innerHTML = '';
        store.checkout.options.amount = res.amount;
        store.partialPaymentsOrderObj = null;
        store.addedGiftCards = null;
        giftCardsInfoMessageContainer.innerHTML = '';
        giftCardsInfoMessageContainer.classList.remove('gift-cards-info-message-container');
        document.querySelector('button[value="submit-payment"]').disabled = false;
        if (res.resultCode === constants.RECEIVED) {
          var _document$querySelect, _store$componentsObj2, _store$componentsObj3;
          (_document$querySelect = document.querySelector('#cancelGiftCardContainer')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.parentNode.remove();
          (_store$componentsObj2 = store.componentsObj) === null || _store$componentsObj2 === void 0 ? void 0 : (_store$componentsObj3 = _store$componentsObj2.giftcard) === null || _store$componentsObj3 === void 0 ? void 0 : _store$componentsObj3.node.unmount('component_giftcard');
        }
      }
    });
  });
}
function renderAddedGiftCard(card) {
  var giftCardData = card.giftCard;
  var imagePath = store.checkoutConfiguration.session.imagePath;
  var _getGiftCardElements6 = getGiftCardElements(),
    giftCardsList = _getGiftCardElements6.giftCardsList,
    giftCardAddButton = _getGiftCardElements6.giftCardAddButton;
  var giftCardDiv = document.createElement('div');
  giftCardDiv.classList.add('gift-card');
  var brandContainer = document.createElement('div');
  brandContainer.classList.add('brand-container');
  var giftCardImg = document.createElement('img');
  var giftCardImgSrc = "".concat(imagePath).concat(giftCardData.brand, ".png");
  giftCardImg.setAttribute('src', giftCardImgSrc);
  giftCardImg.classList.add('gift-card-logo');
  var giftCardNameP = document.createElement('p');
  giftCardNameP.textContent = giftCardData.name;
  brandContainer.appendChild(giftCardImg);
  brandContainer.appendChild(giftCardNameP);
  var giftCardAction = document.createElement('div');
  giftCardAction.classList.add('gift-card-action');
  var brandAndRemoveActionWrapper = document.createElement('div');
  brandAndRemoveActionWrapper.classList.add('wrapper');
  brandAndRemoveActionWrapper.appendChild(brandContainer);
  brandAndRemoveActionWrapper.appendChild(giftCardAction);
  var giftCardAmountDiv = document.createElement('div');
  giftCardAmountDiv.classList.add('wrapper');
  var amountLabel = document.createElement('p');
  amountLabel.textContent = window.deductedBalanceGiftCardResource;
  var amountValue = document.createElement('strong');
  amountValue.textContent = card.discountedAmount ? "-".concat(card.discountedAmount) : '';
  giftCardAmountDiv.appendChild(amountLabel);
  giftCardAmountDiv.appendChild(amountValue);
  giftCardDiv.appendChild(brandAndRemoveActionWrapper);
  giftCardDiv.appendChild(giftCardAmountDiv);
  giftCardsList.appendChild(giftCardDiv);
  giftCardAddButton.style.display = 'block';
  removeGiftCardFormListeners();
}
function createElementsToShowRemainingGiftCardAmount() {
  var _getGiftCardElements7 = getGiftCardElements(),
    giftCardCancelButton = _getGiftCardElements7.giftCardCancelButton,
    giftCardAddButton = _getGiftCardElements7.giftCardAddButton;
  var renderedRemainingAmountEndSpan = document.getElementById('remainingAmountEndSpan');
  var renderedDiscountedAmountEndSpan = document.getElementById('discountedAmountEndSpan');
  if (renderedRemainingAmountEndSpan && renderedDiscountedAmountEndSpan) {
    renderedRemainingAmountEndSpan.innerText = store.partialPaymentsOrderObj.remainingAmountFormatted;
    renderedDiscountedAmountEndSpan.innerText = store.partialPaymentsOrderObj.totalDiscountedAmount;
    return;
  }
  var mainContainer = document.createElement('div');
  var remainingAmountContainer = document.createElement('div');
  var remainingAmountStart = document.createElement('div');
  var remainingAmountEnd = document.createElement('div');
  var discountedAmountContainer = document.createElement('div');
  var discountedAmountStart = document.createElement('div');
  var discountedAmountEnd = document.createElement('div');
  var cancelGiftCard = document.createElement('a');
  var remainingAmountStartP = document.createElement('p');
  var remainingAmountEndP = document.createElement('p');
  var discountedAmountStartP = document.createElement('p');
  var discountedAmountEndP = document.createElement('p');
  var cancelGiftCardP = document.createElement('p');
  var remainingAmountStartSpan = document.createElement('span');
  var discountedAmountStartSpan = document.createElement('span');
  var cancelGiftCardSpan = document.createElement('span');
  var remainingAmountEndSpan = document.createElement('span');
  remainingAmountEndSpan.id = 'remainingAmountEndSpan';
  var discountedAmountEndSpan = document.createElement('span');
  discountedAmountEndSpan.id = 'discountedAmountEndSpan';
  remainingAmountContainer.classList.add('row', 'grand-total', 'leading-lines');
  remainingAmountStart.classList.add('col-6', 'start-lines');
  remainingAmountEnd.classList.add('col-6', 'end-lines');
  remainingAmountStartP.classList.add('order-receipt-label');
  discountedAmountContainer.classList.add('row', 'grand-total', 'leading-lines');
  discountedAmountStart.classList.add('col-6', 'start-lines');
  discountedAmountEnd.classList.add('col-6', 'end-lines');
  discountedAmountStartP.classList.add('order-receipt-label');
  cancelGiftCardP.classList.add('order-receipt-label');
  remainingAmountEndP.classList.add('text-right');
  discountedAmountEndP.classList.add('text-right');
  cancelGiftCard.id = 'cancelGiftCardContainer';
  cancelGiftCard.role = 'button';
  discountedAmountContainer.id = 'discountedAmountContainer';
  remainingAmountContainer.id = 'remainingAmountContainer';
  remainingAmountStartSpan.innerText = window.remainingAmountGiftCardResource;
  discountedAmountStartSpan.innerText = window.discountedAmountGiftCardResource;
  cancelGiftCardSpan.innerText = window.cancelGiftCardResource;
  remainingAmountEndSpan.innerText = store.partialPaymentsOrderObj.remainingAmountFormatted;
  discountedAmountEndSpan.innerText = store.partialPaymentsOrderObj.totalDiscountedAmount;
  cancelGiftCard.addEventListener('click', function () {
    removeGiftCards();
    giftCardCancelButton.classList.add('invisible');
    giftCardAddButton.style.display = 'block';
    // Emit a custom event instead of calling renderGenericComponent() directly,
    // to avoid circular dependency
    var event = new Event('renderGenericComponentCalled');
    document.dispatchEvent(event);
  });
  remainingAmountContainer.appendChild(remainingAmountStart);
  remainingAmountContainer.appendChild(remainingAmountEnd);
  remainingAmountContainer.appendChild(cancelGiftCard);
  remainingAmountStart.appendChild(remainingAmountStartP);
  discountedAmountContainer.appendChild(discountedAmountStart);
  discountedAmountContainer.appendChild(discountedAmountEnd);
  discountedAmountStart.appendChild(discountedAmountStartP);
  cancelGiftCard.appendChild(cancelGiftCardP);
  remainingAmountEnd.appendChild(remainingAmountEndP);
  remainingAmountStartP.appendChild(remainingAmountStartSpan);
  discountedAmountEnd.appendChild(discountedAmountEndP);
  discountedAmountStartP.appendChild(discountedAmountStartSpan);
  cancelGiftCardP.appendChild(cancelGiftCardSpan);
  remainingAmountEndP.appendChild(remainingAmountEndSpan);
  discountedAmountEndP.appendChild(discountedAmountEndSpan);
  var pricingContainer = document.querySelector('.card-body.order-total-summary');
  mainContainer.appendChild(discountedAmountContainer);
  mainContainer.appendChild(remainingAmountContainer);
  mainContainer.appendChild(cancelGiftCard);
  pricingContainer.appendChild(mainContainer);
}
function showGiftCardInfoMessage() {
  var messageText = store.partialPaymentsOrderObj.message;
  var _getGiftCardElements8 = getGiftCardElements(),
    giftCardsInfoMessageContainer = _getGiftCardElements8.giftCardsInfoMessageContainer;
  giftCardsInfoMessageContainer.innerHTML = '';
  giftCardsInfoMessageContainer.classList.remove('gift-cards-info-message-container');
  if (!messageText) return;
  var giftCardsInfoMessage = document.createElement('div');
  giftCardsInfoMessage.classList.add('adyen-checkout__alert-message', 'adyen-checkout__alert-message--warning');
  giftCardsInfoMessage.setAttribute('role', 'alert');
  var infoMessage = document.createElement('span');
  infoMessage.textContent = store.partialPaymentsOrderObj.message;
  giftCardsInfoMessage.appendChild(infoMessage);
  giftCardsInfoMessageContainer.appendChild(giftCardsInfoMessage);
  giftCardsInfoMessageContainer.classList.add('gift-cards-info-message-container');
}
module.exports = {
  removeGiftCards: removeGiftCards,
  renderAddedGiftCard: renderAddedGiftCard,
  attachGiftCardAddButtonListener: attachGiftCardAddButtonListener,
  getGiftCardElements: getGiftCardElements,
  showGiftCardWarningMessage: showGiftCardWarningMessage,
  createElementsToShowRemainingGiftCardAmount: createElementsToShowRemainingGiftCardAmount,
  renderGiftCardSelectForm: renderGiftCardSelectForm,
  showGiftCardInfoMessage: showGiftCardInfoMessage,
  giftCardBrands: giftCardBrands
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderPaymentMethod.js":
/*!*****************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/renderPaymentMethod.js ***!
  \*****************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
var helpers = __webpack_require__(/*! ./helpers */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/helpers.js");
var constants = __webpack_require__(/*! ../constants */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/constants.js");
function getFallback(paymentMethod) {
  var fallback = {};
  if (fallback[paymentMethod.type]) {
    store.componentsObj[paymentMethod.type] = {};
  }
  return fallback[paymentMethod.type];
}
function getPersonalDetails() {
  var _document$querySelect, _document$querySelect2, _document$querySelect3, _document$querySelect4;
  return {
    firstName: (_document$querySelect = document.querySelector('#shippingFirstNamedefault')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.value,
    lastName: (_document$querySelect2 = document.querySelector('#shippingLastNamedefault')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.value,
    telephoneNumber: (_document$querySelect3 = document.querySelector('#shippingPhoneNumberdefault')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.value,
    shopperEmail: (_document$querySelect4 = document.querySelector('.customer-summary-email')) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.textContent
  };
}
function setNode(paymentMethodID) {
  var createNode = function createNode() {
    if (!store.componentsObj[paymentMethodID]) {
      store.componentsObj[paymentMethodID] = {};
    }
    try {
      var _store$checkout;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // ALl nodes created for the checkout component are enriched with shopper personal details
      var node = (_store$checkout = store.checkout).create.apply(_store$checkout, args.concat([{
        data: _objectSpread(_objectSpread({}, getPersonalDetails()), {}, {
          personalDetails: getPersonalDetails()
        }),
        visibility: {
          personalDetails: 'editable',
          billingAddress: 'hidden',
          deliveryAddress: 'hidden'
        }
      }]));
      store.componentsObj[paymentMethodID].node = node;
      store.componentsObj[paymentMethodID].isValid = node.isValid;
    } catch (e) {
      /* No component for payment method */
    }
  };
  return createNode;
}
function getPaymentMethodID(isStored, paymentMethod) {
  if (isStored) {
    return "storedCard".concat(paymentMethod.id);
  }
  if (paymentMethod.type === constants.GIFTCARD) {
    return constants.GIFTCARD;
  }
  if (paymentMethod.brand) {
    return "".concat(paymentMethod.type, "_").concat(paymentMethod.brand);
  }
  return paymentMethod.type;
}
function getImage(isStored, paymentMethod) {
  return isStored ? paymentMethod.brand : paymentMethod.type;
}
function getLabel(isStored, paymentMethod) {
  var label = isStored ? " ".concat(store.MASKED_CC_PREFIX).concat(paymentMethod.lastFour) : '';
  return "".concat(paymentMethod.name).concat(label);
}
function handleFallbackPayment(_ref) {
  var paymentMethod = _ref.paymentMethod,
    container = _ref.container,
    paymentMethodID = _ref.paymentMethodID;
  var fallback = getFallback(paymentMethod);
  var createTemplate = function createTemplate() {
    var template = document.createElement('template');
    template.innerHTML = fallback;
    container.append(template.content);
  };
  return fallback ? createTemplate() : setNode(paymentMethod.type)(paymentMethodID);
}
function handlePayment(options) {
  return options.isStored ? setNode(options.paymentMethodID)('card', options.paymentMethod) : handleFallbackPayment(options);
}
function getListContents(_ref2) {
  var imagePath = _ref2.imagePath,
    isStored = _ref2.isStored,
    paymentMethod = _ref2.paymentMethod,
    description = _ref2.description;
  var paymentMethodID = getPaymentMethodID(isStored, paymentMethod);
  var label = getLabel(isStored, paymentMethod);
  var liContents = "\n    <input name=\"brandCode\" type=\"radio\" value=\"".concat(paymentMethodID, "\" id=\"rb_").concat(paymentMethodID, "\">\n    <img class=\"paymentMethod_img\" src=\"").concat(imagePath, "\" ></img>\n    <label id=\"lb_").concat(paymentMethodID, "\" for=\"rb_").concat(paymentMethodID, "\">").concat(label, "</label>\n  ");
  return description ? "".concat(liContents, "<p>").concat(description, "</p>") : liContents;
}
function getImagePath(_ref3) {
  var isStored = _ref3.isStored,
    paymentMethod = _ref3.paymentMethod,
    path = _ref3.path,
    isSchemeNotStored = _ref3.isSchemeNotStored;
  var paymentMethodImage = "".concat(path).concat(getImage(isStored, paymentMethod), ".png");
  var cardImage = "".concat(path, "card.png");
  return isSchemeNotStored ? cardImage : paymentMethodImage;
}
function setValid(_ref4) {
  var isStored = _ref4.isStored,
    paymentMethodID = _ref4.paymentMethodID;
  if (isStored && ['bcmc', 'scheme'].indexOf(paymentMethodID) > -1) {
    store.componentsObj[paymentMethodID].isValid = true;
  }
}
function configureContainer(_ref5) {
  var paymentMethodID = _ref5.paymentMethodID,
    container = _ref5.container;
  container.classList.add('additionalFields');
  container.setAttribute('id', "component_".concat(paymentMethodID));
  container.setAttribute('style', 'display:none');
}
function handleInput(_ref6) {
  var paymentMethodID = _ref6.paymentMethodID;
  var input = document.querySelector("#rb_".concat(paymentMethodID));
  input.onchange = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            helpers.displaySelectedMethod(event.target.value);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref7.apply(this, arguments);
    };
  }();
}
// eslint-disable-next-line complexity
module.exports.renderPaymentMethod = function renderPaymentMethod(paymentMethod, isStored, path) {
  var _store$componentsObj$;
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var rerender = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var paymentMethodsUI = document.querySelector('#paymentMethodsList');
  var paymentMethodID = getPaymentMethodID(isStored, paymentMethod);
  if (paymentMethodID === constants.GIFTCARD) {
    return;
  }
  var isSchemeNotStored = paymentMethod.type === 'scheme' && !isStored;
  var container = document.createElement('div');
  var options = {
    container: container,
    paymentMethod: paymentMethod,
    isStored: isStored,
    path: path,
    description: description,
    paymentMethodID: paymentMethodID,
    isSchemeNotStored: isSchemeNotStored
  };
  var imagePath = getImagePath(options);
  var liContents = getListContents(_objectSpread(_objectSpread({}, options), {}, {
    imagePath: imagePath,
    description: description
  }));
  var li;
  if (rerender) {
    li = document.querySelector("#rb_".concat(paymentMethodID)).closest('li');
  } else {
    li = document.createElement('li');
    li.innerHTML = liContents;
    li.classList.add('paymentMethod');
    paymentMethodsUI.append(li);
  }
  handlePayment(options);
  configureContainer(options);
  li.append(container);
  var node = (_store$componentsObj$ = store.componentsObj[paymentMethodID]) === null || _store$componentsObj$ === void 0 ? void 0 : _store$componentsObj$.node;
  if (node) {
    node.mount(container);
  }
  if (paymentMethodID === 'giropay') {
    container.innerHTML = '';
  }
  handleInput(options);
  setValid(options);
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/validateComponents.js":
/*!****************************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyen_checkout/validateComponents.js ***!
  \****************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
module.exports.validateComponents = function validateComponents() {
  var customMethods = {};
  if (store.selectedMethod in customMethods) {
    customMethods[store.selectedMethod]();
  }
  document.querySelector('#adyenStateData').value = JSON.stringify(store.stateData);
  if (store.partialPaymentsOrderObj) {
    document.querySelector('#adyenPartialPaymentsOrder').value = JSON.stringify(store.partialPaymentsOrderObj);
  }
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout.js":
/*!***************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {



/* eslint-disable prefer-regex-literals */
var processInclude = __webpack_require__(/*! base/util */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/util.js");
var baseCheckout = __webpack_require__(/*! base/checkout/checkout */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/checkout.js");
var adyenCheckout = __webpack_require__(/*! ./adyenCheckout */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js");
var billing = __webpack_require__(/*! ./checkout/billing */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/billing.js");

// Compatibility Adyen SFRA 5.x.x & 6.x.x
var checkout = window.AdyenSFRA6Enabled !== 'null' ? __webpack_require__(/*! ./checkout/checkoutSFRA6 */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/checkoutSFRA6.js") : __webpack_require__(/*! ./checkout/checkoutSFRA5 */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/checkoutSFRA5.js");
$(document).ready(function () {
  // eslint-disable-line
  var name = 'paymentError';
  var error = new RegExp("[?&]".concat(encodeURIComponent(name), "=([^&]*)")).exec(window.location.search);
  var paymentStage = new RegExp('[?&]stage=payment([^&]*)').exec(window.location.search);
  if (error || paymentStage) {
    if (error) {
      $('.error-message').show();
      $('.error-message-text').text(decodeURIComponent(error[1]));
    }
    adyenCheckout.renderGenericComponent();
  }
  processInclude(baseCheckout);
  processInclude(billing);
  processInclude(checkout);
  $('#selectedPaymentOption').val($('.payment-options .nav-item .active').parent().attr('data-method-id'));
});
$('.payment-options .nav-link').click(function setAttr() {
  $('#selectedPaymentOption').val($(this).parent().attr('data-method-id'));
});

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/billing.js":
/*!***********************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/billing.js ***!
  \***********************************************************************************/
/***/ (function(module) {



function hasData() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args.every(function (arg) {
    return !!arg;
  });
}
function appendToPaymentSummary(html) {
  // update payment details
  var paymentSummary = document.querySelector('.payment-details');
  paymentSummary.innerHTML += html;
}
function appendMaskedCC(_ref) {
  var maskedCreditCardNumber = _ref.maskedCreditCardNumber;
  var innerHTML = "<div>".concat(maskedCreditCardNumber, "</div>");
  return maskedCreditCardNumber && appendToPaymentSummary(innerHTML);
}
function appendIssuerName(_ref2) {
  var selectedIssuerName = _ref2.selectedIssuerName;
  var innerHTML = "<div><span>".concat(selectedIssuerName, "</span></div>");
  return selectedIssuerName && appendToPaymentSummary(innerHTML);
}
function appendExpiration(_ref3, order) {
  var expirationMonth = _ref3.expirationMonth,
    expirationYear = _ref3.expirationYear;
  var innerHTML = "<div><span>".concat(order.resources.cardEnding, " ").concat(expirationMonth, "/").concat(expirationYear, "</span></div>");
  return hasData(expirationMonth, expirationYear) && appendToPaymentSummary(innerHTML);
}
function appendPaymentMethod(_ref4) {
  var selectedAdyenPM = _ref4.selectedAdyenPM;
  var innerHTML = "<div><span>".concat(selectedAdyenPM, "</span></div>");
  return selectedAdyenPM && appendToPaymentSummary(innerHTML);
}

/**
 * Updates the payment information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updatePaymentInformation(order) {
  var _order$billing$paymen;
  if ((_order$billing$paymen = order.billing.payment.selectedPaymentInstruments) !== null && _order$billing$paymen !== void 0 && _order$billing$paymen.length) {
    var selectedPaymentInstrument = order.billing.payment.selectedPaymentInstruments[0];
    document.querySelector('.payment-details').innerHTML = '';
    appendPaymentMethod(selectedPaymentInstrument);
    appendIssuerName(selectedPaymentInstrument);
    appendMaskedCC(selectedPaymentInstrument);
    appendExpiration(selectedPaymentInstrument, order);
  }
}
module.exports.methods = {
  updatePaymentInformation: updatePaymentInformation
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/checkoutSFRA5.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/checkoutSFRA5.js ***!
  \*****************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var shippingHelpers = __webpack_require__(/*! base/checkout/shipping */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/shipping.js");
var billingHelpers = __webpack_require__(/*! base/checkout/billing */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js");
var summaryHelpers = __webpack_require__(/*! base/checkout/summary */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js");
var formHelpers = __webpack_require__(/*! base/checkout/formErrors */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js");
var scrollAnimate = __webpack_require__(/*! base/components/scrollAnimate */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");
var billing = __webpack_require__(/*! ./billing */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/billing.js");
// ### Custom Adyen cartridge start ###
var adyenCheckout = __webpack_require__(/*! ../adyenCheckout */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js");
// ### Custom Adyen cartridge end ###

/**
 * Create the jQuery Checkout Plugin.
 *
 * This jQuery plugin will be registered on the dom element in checkout.isml with the
 * id of "checkout-main".
 *
 * The checkout plugin will handle the different state the user interface is in as the user
 * progresses through the varying forms such as shipping and payment.
 *
 * Billing info and payment info are used a bit synonymously in this code.
 *
 */
(function ($) {
  $.fn.checkout = function () {
    // eslint-disable-line
    var plugin = this;

    //
    // Collect form data from user input
    //
    var formData = {
      // Shipping Address
      shipping: {},
      // Billing Address
      billing: {},
      // Payment
      payment: {},
      // Gift Codes
      giftCode: {}
    };

    //
    // The different states/stages of checkout
    //
    var checkoutStages = ['shipping', 'payment', 'placeOrder', 'submitted'];

    /**
     * Updates the URL to determine stage
     * @param {number} currentStage - The current stage the user is currently on in the checkout
     */
    function updateUrl(currentStage) {
      history.pushState(checkoutStages[currentStage], document.title, location.pathname + '?stage=' + checkoutStages[currentStage] + '#' + checkoutStages[currentStage]);
    }

    //
    // Local member methods of the Checkout plugin
    //
    var members = {
      // initialize the currentStage variable for the first time
      currentStage: 0,
      /**
       * Set or update the checkout stage (AKA the shipping, billing, payment, etc... steps)
       * @returns {Object} a promise
       */
      updateStage: function updateStage() {
        var stage = checkoutStages[members.currentStage];
        var defer = $.Deferred(); // eslint-disable-line

        if (stage === 'shipping') {
          //
          // Clear Previous Errors
          //
          formHelpers.clearPreviousErrors('.shipping-form');

          //
          // Submit the Shipping Address Form
          //
          var isMultiShip = $('#checkout-main').hasClass('multi-ship');
          var formSelector = isMultiShip ? '.multi-shipping .active form' : '.single-shipping .shipping-form';
          var form = $(formSelector);
          if (isMultiShip && form.length === 0) {
            // disable the next:Payment button here
            $('body').trigger('checkout:disableButton', '.next-step-button button');
            // in case the multi ship form is already submitted
            var url = $('#checkout-main').attr('data-checkout-get-url');
            $.ajax({
              url: url,
              method: 'GET',
              success: function success(data) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (!data.error) {
                  $('body').trigger('checkout:updateCheckoutView', {
                    order: data.order,
                    customer: data.customer
                  });
                  defer.resolve();
                } else if (data.message && $('.shipping-error .alert-danger').length < 1) {
                  var errorMsg = data.message;
                  var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' + 'fade show" role="alert">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + errorMsg + '</div>';
                  $('.shipping-error').append(errorHtml);
                  scrollAnimate($('.shipping-error'));
                  defer.reject();
                } else if (data.redirectUrl) {
                  window.location.href = data.redirectUrl;
                }
              },
              error: function error() {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                // Server error submitting form
                defer.reject();
              }
            });
          } else {
            var shippingFormData = form.serialize();
            $('body').trigger('checkout:serializeShipping', {
              form: form,
              data: shippingFormData,
              callback: function callback(data) {
                shippingFormData = data;
              }
            });
            // disable the next:Payment button here
            $('body').trigger('checkout:disableButton', '.next-step-button button');
            $.ajax({
              url: form.attr('action'),
              type: 'post',
              data: shippingFormData,
              success: function success(data) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                shippingHelpers.methods.shippingFormResponse(defer, data);
              },
              error: function error(err) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (err.responseJSON && err.responseJSON.redirectUrl) {
                  window.location.href = err.responseJSON.redirectUrl;
                }
                // Server error submitting form
                defer.reject(err.responseJSON);
              }
            });
          }
          return defer;
        } else if (stage === 'payment') {
          //
          // Submit the Billing Address Form
          //

          formHelpers.clearPreviousErrors('.payment-form');
          var billingAddressForm = $('#dwfrm_billing .billing-address-block :input').serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $('#dwfrm_billing .billing-address-block'),
            data: billingAddressForm,
            callback: function callback(data) {
              if (data) {
                billingAddressForm = data;
              }
            }
          });
          var contactInfoForm = $('#dwfrm_billing .contact-info-block :input').serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $('#dwfrm_billing .contact-info-block'),
            data: contactInfoForm,
            callback: function callback(data) {
              if (data) {
                contactInfoForm = data;
              }
            }
          });
          var activeTabId = $('.tab-pane.active').attr('id');
          var paymentInfoSelector = '#dwfrm_billing .' + activeTabId + ' .payment-form-fields :input';
          var paymentInfoForm = $(paymentInfoSelector).serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $(paymentInfoSelector),
            data: paymentInfoForm,
            callback: function callback(data) {
              if (data) {
                paymentInfoForm = data;
              }
            }
          });
          var paymentForm = billingAddressForm + '&' + contactInfoForm + '&' + paymentInfoForm;
          if ($('.data-checkout-stage').data('customer-type') === 'registered') {
            // if payment method is credit card
            if ($('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
              if (!$('.payment-information').data('is-new-payment')) {
                var cvvCode = $('.saved-payment-instrument.' + 'selected-payment .saved-payment-security-code').val();
                if (cvvCode === '') {
                  var cvvElement = $('.saved-payment-instrument.' + 'selected-payment ' + '.form-control');
                  cvvElement.addClass('is-invalid');
                  scrollAnimate(cvvElement);
                  defer.reject();
                  return defer;
                }
                var $savedPaymentInstrument = $('.saved-payment-instrument' + '.selected-payment');
                paymentForm += '&storedPaymentUUID=' + $savedPaymentInstrument.data('uuid');
                paymentForm += '&securityCode=' + cvvCode;
              }
            }
          }
          // disable the next:Place Order button here
          $('body').trigger('checkout:disableButton', '.next-step-button button');
          $.ajax({
            url: $('#dwfrm_billing').attr('action'),
            method: 'POST',
            data: paymentForm,
            success: function success(data) {
              // enable the next:Place Order button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              // look for field validation errors
              if (data.error) {
                if (data.fieldErrors.length) {
                  data.fieldErrors.forEach(function (error) {
                    if (Object.keys(error).length) {
                      formHelpers.loadFormErrors('.payment-form', error);
                    }
                  });
                }
                if (data.serverErrors.length) {
                  data.serverErrors.forEach(function (error) {
                    $('.error-message').show();
                    $('.error-message-text').text(error);
                    scrollAnimate($('.error-message'));
                  });
                }
                if (data.cartError) {
                  window.location.href = data.redirectUrl;
                }
                defer.reject();
              } else {
                //
                // Populate the Address Summary
                //
                $('body').trigger('checkout:updateCheckoutView', {
                  order: data.order,
                  customer: data.customer
                });
                if (data.renderedPaymentInstruments) {
                  $('.stored-payments').empty().html(data.renderedPaymentInstruments);
                }
                if (data.customer.registeredUser && data.customer.customerPaymentInstruments.length) {
                  $('.cancel-new-payment').removeClass('checkout-hidden');
                }
                scrollAnimate();
                defer.resolve(data);
              }
            },
            error: function error(err) {
              // enable the next:Place Order button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              if (err.responseJSON && err.responseJSON.redirectUrl) {
                window.location.href = err.responseJSON.redirectUrl;
              }
            }
          });
          return defer;
        } else if (stage === 'placeOrder') {
          // disable the placeOrder button here
          $('body').trigger('checkout:disableButton', '.next-step-button button');
          $.ajax({
            url: $('.place-order').data('action'),
            method: 'POST',
            success: function success(data) {
              // enable the placeOrder button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              if (data.error) {
                if (data.cartError) {
                  window.location.href = data.redirectUrl;
                  defer.reject();
                } else {
                  // go to appropriate stage and display error message
                  defer.reject(data);
                }
                // ### Custom Adyen cartridge start ###
              } else if (data.adyenAction) {
                window.orderToken = data.orderToken;
                adyenCheckout.actionHandler(data.adyenAction);
                // ### Custom Adyen cartridge end ###
              } else {
                var continueUrl = data.continueUrl;
                var urlParams = {
                  ID: data.orderID,
                  token: data.orderToken
                };
                continueUrl += (continueUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(urlParams).map(function (key) {
                  return key + '=' + encodeURIComponent(urlParams[key]);
                }).join('&');
                window.location.href = continueUrl;
                defer.resolve(data);
              }
            },
            error: function error() {
              // enable the placeOrder button here
              $('body').trigger('checkout:enableButton', $('.next-step-button button'));
            }
          });
          return defer;
        }
        var p = $('<div>').promise(); // eslint-disable-line
        setTimeout(function () {
          p.done(); // eslint-disable-line
        }, 500);
        return p; // eslint-disable-line
      },

      /**
       * Initialize the checkout stage.
       *
       * TODO: update this to allow stage to be set from server?
       */
      initialize: function initialize() {
        // set the initial state of checkout
        members.currentStage = checkoutStages.indexOf($('.data-checkout-stage').data('checkout-stage'));
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);

        //
        // Handle Payment option selection
        //
        $('input[name$="paymentMethod"]', plugin).on('change', function () {
          $('.credit-card-form').toggle($(this).val() === 'CREDIT_CARD');
        });

        //
        // Handle Next State button click
        //
        $(plugin).on('click', '.next-step-button button', function () {
          members.nextStage();
        });

        //
        // Handle Edit buttons on shipping and payment summary cards
        //
        $('.shipping-summary .edit-button', plugin).on('click', function () {
          if (!$('#checkout-main').hasClass('multi-ship')) {
            $('body').trigger('shipping:selectSingleShipping');
          }
          members.gotoStage('shipping');
        });
        $('.payment-summary .edit-button', plugin).on('click', function () {
          members.gotoStage('payment');
        });

        //
        // remember stage (e.g. shipping)
        //
        updateUrl(members.currentStage);

        //
        // Listen for foward/back button press and move to correct checkout-stage
        //
        $(window).on('popstate', function (e) {
          //
          // Back button when event state less than current state in ordered
          // checkoutStages array.
          //
          if (e.state === null || checkoutStages.indexOf(e.state) < members.currentStage) {
            members.handlePrevStage(false);
          } else if (checkoutStages.indexOf(e.state) > members.currentStage) {
            // Forward button  pressed
            members.handleNextStage(false);
          }
        });

        //
        // Set the form data
        //
        plugin.data('formData', formData);
      },
      /**
       * The next checkout state step updates the css for showing correct buttons etc...
       */
      nextStage: function nextStage() {
        var promise = members.updateStage();
        promise.done(function () {
          // Update UI with new stage
          members.handleNextStage(true);
        });
        promise.fail(function (data) {
          // show errors
          if (data) {
            if (data.errorStage) {
              members.gotoStage(data.errorStage.stage);
              if (data.errorStage.step === 'billingAddress') {
                var $billingAddressSameAsShipping = $('input[name$="_shippingAddressUseAsBillingAddress"]');
                if ($billingAddressSameAsShipping.is(':checked')) {
                  $billingAddressSameAsShipping.prop('checked', false);
                }
              }
            }
            if (data.errorMessage) {
              $('.error-message').show();
              $('.error-message-text').text(data.errorMessage);
            }
          }
        });
      },
      /**
       * The next checkout state step updates the css for showing correct buttons etc...
       *
       * @param {boolean} bPushState - boolean when true pushes state using the history api.
       */
      handleNextStage: function handleNextStage(bPushState) {
        if (members.currentStage < checkoutStages.length - 1) {
          // move stage forward
          members.currentStage++;

          //
          // show new stage in url (e.g.payment)
          //
          if (bPushState) {
            updateUrl(members.currentStage);
          }
        }

        // Set the next stage on the DOM
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      },
      /**
       * Previous State
       */
      handlePrevStage: function handlePrevStage() {
        if (members.currentStage > 0) {
          // move state back
          members.currentStage--;
          updateUrl(members.currentStage);
        }
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      },
      /**
       * Use window history to go to a checkout stage
       * @param {string} stageName - the checkout state to goto
       */
      gotoStage: function gotoStage(stageName) {
        members.currentStage = checkoutStages.indexOf(stageName);
        updateUrl(members.currentStage);
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      }
    };

    //
    // Initialize the checkout
    //
    members.initialize();
    return this;
  };
})(jQuery);
module.exports = {
  updateCheckoutView: function updateCheckoutView() {
    $('body').on('checkout:updateCheckoutView', function (e, data) {
      shippingHelpers.methods.updateMultiShipInformation(data.order);
      summaryHelpers.updateTotals(data.order.totals);
      data.order.shipping.forEach(function (shipping) {
        shippingHelpers.methods.updateShippingInformation(shipping, data.order, data.customer, data.options);
      });
      var currentStage = window.location.search.substring(window.location.search.indexOf('=') + 1);
      if (currentStage === ('shipping' || 0)) {
        adyenCheckout.renderGenericComponent();
      }
      billingHelpers.methods.updateBillingInformation(data.order, data.customer, data.options);
      billing.methods.updatePaymentInformation(data.order, data.options);
      summaryHelpers.updateOrderProductSummaryInformation(data.order, data.options);
    });
  }
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/checkoutSFRA6.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/checkoutSFRA6.js ***!
  \*****************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var customerHelpers = __webpack_require__(/*! base/checkout/customer */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/customer.js");
var shippingHelpers = __webpack_require__(/*! base/checkout/shipping */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/shipping.js");
var billingHelpers = __webpack_require__(/*! base/checkout/billing */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js");
var summaryHelpers = __webpack_require__(/*! base/checkout/summary */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js");
var formHelpers = __webpack_require__(/*! base/checkout/formErrors */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js");
var scrollAnimate = __webpack_require__(/*! base/components/scrollAnimate */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");
var billing = __webpack_require__(/*! ./billing */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout/billing.js");
// ### Custom Adyen cartridge start ###
var adyenCheckout = __webpack_require__(/*! ../adyenCheckout */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js");
// ### Custom Adyen cartridge end ###

/**
 * Create the jQuery Checkout Plugin.
 *
 * This jQuery plugin will be registered on the dom element in checkout.isml with the
 * id of "checkout-main".
 *
 * The checkout plugin will handle the different state the user interface is in as the user
 * progresses through the varying forms such as shipping and payment.
 *
 * Billing info and payment info are used a bit synonymously in this code.
 *
 */
(function ($) {
  $.fn.checkout = function () {
    var plugin = this;

    //
    // Collect form data from user input
    //
    var formData = {
      // Customer Data
      customer: {},
      // Shipping Address
      shipping: {},
      // Billing Address
      billing: {},
      // Payment
      payment: {},
      // Gift Codes
      giftCode: {}
    };

    //
    // The different states/stages of checkout
    //
    var checkoutStages = ['customer', 'shipping', 'payment', 'placeOrder', 'submitted'];

    /**
     * Updates the URL to determine stage
     * @param {number} currentStage - The current stage the user is currently on in the checkout
     */
    function updateUrl(currentStage) {
      history.pushState(checkoutStages[currentStage], document.title, location.pathname + '?stage=' + checkoutStages[currentStage] + '#' + checkoutStages[currentStage]);
    }

    //
    // Local member methods of the Checkout plugin
    //
    var members = {
      // initialize the currentStage variable for the first time
      currentStage: 0,
      /**
       * Set or update the checkout stage (AKA the shipping, billing, payment, etc... steps)
       * @returns {Object} a promise
       */
      updateStage: function updateStage() {
        var stage = checkoutStages[members.currentStage];
        var defer = $.Deferred(); // eslint-disable-line

        if (stage === 'customer') {
          //
          // Clear Previous Errors
          //
          customerHelpers.methods.clearErrors();
          //
          // Submit the Customer Form
          //
          var customerFormSelector = customerHelpers.methods.isGuestFormActive() ? customerHelpers.vars.GUEST_FORM : customerHelpers.vars.REGISTERED_FORM;
          var customerForm = $(customerFormSelector);
          $.ajax({
            url: customerForm.attr('action'),
            type: 'post',
            data: customerForm.serialize(),
            success: function success(data) {
              if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
              } else {
                customerHelpers.methods.customerFormResponse(defer, data);
              }
            },
            error: function error(err) {
              if (err.responseJSON && err.responseJSON.redirectUrl) {
                window.location.href = err.responseJSON.redirectUrl;
              }
              // Server error submitting form
              defer.reject(err.responseJSON);
            }
          });
          return defer;
        } else if (stage === 'shipping') {
          //
          // Clear Previous Errors
          //
          formHelpers.clearPreviousErrors('.shipping-form');

          //
          // Submit the Shipping Address Form
          //
          var isMultiShip = $('#checkout-main').hasClass('multi-ship');
          var formSelector = isMultiShip ? '.multi-shipping .active form' : '.single-shipping .shipping-form';
          var form = $(formSelector);
          if (isMultiShip && form.length === 0) {
            // disable the next:Payment button here
            $('body').trigger('checkout:disableButton', '.next-step-button button');
            // in case the multi ship form is already submitted
            var url = $('#checkout-main').attr('data-checkout-get-url');
            $.ajax({
              url: url,
              method: 'GET',
              success: function success(data) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (!data.error) {
                  $('body').trigger('checkout:updateCheckoutView', {
                    order: data.order,
                    customer: data.customer
                  });
                  defer.resolve();
                } else if (data.message && $('.shipping-error .alert-danger').length < 1) {
                  var errorMsg = data.message;
                  var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' + 'fade show" role="alert">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + errorMsg + '</div>';
                  $('.shipping-error').append(errorHtml);
                  scrollAnimate($('.shipping-error'));
                  defer.reject();
                } else if (data.redirectUrl) {
                  window.location.href = data.redirectUrl;
                }
              },
              error: function error() {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                // Server error submitting form
                defer.reject();
              }
            });
          } else {
            var shippingFormData = form.serialize();
            $('body').trigger('checkout:serializeShipping', {
              form: form,
              data: shippingFormData,
              callback: function callback(data) {
                shippingFormData = data;
              }
            });
            // disable the next:Payment button here
            $('body').trigger('checkout:disableButton', '.next-step-button button');
            $.ajax({
              url: form.attr('action'),
              type: 'post',
              data: shippingFormData,
              success: function success(data) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                shippingHelpers.methods.shippingFormResponse(defer, data);
              },
              error: function error(err) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (err.responseJSON && err.responseJSON.redirectUrl) {
                  window.location.href = err.responseJSON.redirectUrl;
                }
                // Server error submitting form
                defer.reject(err.responseJSON);
              }
            });
          }
          return defer;
        } else if (stage === 'payment') {
          //
          // Submit the Billing Address Form
          //

          formHelpers.clearPreviousErrors('.payment-form');
          var billingAddressForm = $('#dwfrm_billing .billing-address-block :input').serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $('#dwfrm_billing .billing-address-block'),
            data: billingAddressForm,
            callback: function callback(data) {
              if (data) {
                billingAddressForm = data;
              }
            }
          });
          var contactInfoForm = $('#dwfrm_billing .contact-info-block :input').serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $('#dwfrm_billing .contact-info-block'),
            data: contactInfoForm,
            callback: function callback(data) {
              if (data) {
                contactInfoForm = data;
              }
            }
          });
          var activeTabId = $('.tab-pane.active').attr('id');
          var paymentInfoSelector = '#dwfrm_billing .' + activeTabId + ' .payment-form-fields :input';
          var paymentInfoForm = $(paymentInfoSelector).serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $(paymentInfoSelector),
            data: paymentInfoForm,
            callback: function callback(data) {
              if (data) {
                paymentInfoForm = data;
              }
            }
          });
          var paymentForm = billingAddressForm + '&' + contactInfoForm + '&' + paymentInfoForm;
          if ($('.data-checkout-stage').data('customer-type') === 'registered') {
            // if payment method is credit card
            if ($('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
              if (!$('.payment-information').data('is-new-payment')) {
                var cvvCode = $('.saved-payment-instrument.' + 'selected-payment .saved-payment-security-code').val();
                if (cvvCode === '') {
                  var cvvElement = $('.saved-payment-instrument.' + 'selected-payment ' + '.form-control');
                  cvvElement.addClass('is-invalid');
                  scrollAnimate(cvvElement);
                  defer.reject();
                  return defer;
                }
                var $savedPaymentInstrument = $('.saved-payment-instrument' + '.selected-payment');
                paymentForm += '&storedPaymentUUID=' + $savedPaymentInstrument.data('uuid');
                paymentForm += '&securityCode=' + cvvCode;
              }
            }
          }
          // disable the next:Place Order button here
          $('body').trigger('checkout:disableButton', '.next-step-button button');
          $.ajax({
            url: $('#dwfrm_billing').attr('action'),
            method: 'POST',
            data: paymentForm,
            success: function success(data) {
              // enable the next:Place Order button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              // look for field validation errors
              if (data.error) {
                if (data.fieldErrors.length) {
                  data.fieldErrors.forEach(function (error) {
                    if (Object.keys(error).length) {
                      formHelpers.loadFormErrors('.payment-form', error);
                    }
                  });
                }
                if (data.serverErrors.length) {
                  data.serverErrors.forEach(function (error) {
                    $('.error-message').show();
                    $('.error-message-text').text(error);
                    scrollAnimate($('.error-message'));
                  });
                }
                if (data.cartError) {
                  window.location.href = data.redirectUrl;
                }
                defer.reject();
              } else {
                //
                // Populate the Address Summary
                //
                $('body').trigger('checkout:updateCheckoutView', {
                  order: data.order,
                  customer: data.customer
                });
                if (data.renderedPaymentInstruments) {
                  $('.stored-payments').empty().html(data.renderedPaymentInstruments);
                }
                if (data.customer.registeredUser && data.customer.customerPaymentInstruments.length) {
                  $('.cancel-new-payment').removeClass('checkout-hidden');
                }
                scrollAnimate();
                defer.resolve(data);
              }
            },
            error: function error(err) {
              // enable the next:Place Order button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              if (err.responseJSON && err.responseJSON.redirectUrl) {
                window.location.href = err.responseJSON.redirectUrl;
              }
            }
          });
          return defer;
        } else if (stage === 'placeOrder') {
          // disable the placeOrder button here
          $('body').trigger('checkout:disableButton', '.next-step-button button');
          $.ajax({
            url: $('.place-order').data('action'),
            method: 'POST',
            success: function success(data) {
              // enable the placeOrder button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              if (data.error) {
                if (data.cartError) {
                  window.location.href = data.redirectUrl;
                  defer.reject();
                } else {
                  // go to appropriate stage and display error message
                  defer.reject(data);
                }
                // ### Custom Adyen cartridge start ###
              } else if (data.adyenAction) {
                window.orderToken = data.orderToken;
                adyenCheckout.actionHandler(data.adyenAction);
                // ### Custom Adyen cartridge end ###
              } else {
                var redirect = $('<form>').appendTo(document.body).attr({
                  method: 'POST',
                  action: data.continueUrl
                });
                $('<input>').appendTo(redirect).attr({
                  name: 'orderID',
                  value: data.orderID
                });
                $('<input>').appendTo(redirect).attr({
                  name: 'orderToken',
                  value: data.orderToken
                });
                redirect.submit();
                defer.resolve(data);
              }
            },
            error: function error() {
              // enable the placeOrder button here
              $('body').trigger('checkout:enableButton', $('.next-step-button button'));
            }
          });
          return defer;
        }
        var p = $('<div>').promise(); // eslint-disable-line
        setTimeout(function () {
          p.done(); // eslint-disable-line
        }, 500);
        return p; // eslint-disable-line
      },

      /**
       * Initialize the checkout stage.
       *
       * TODO: update this to allow stage to be set from server?
       */
      initialize: function initialize() {
        // set the initial state of checkout
        members.currentStage = checkoutStages.indexOf($('.data-checkout-stage').data('checkout-stage'));
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
        $('body').on('click', '.submit-customer-login', function (e) {
          e.preventDefault();
          members.nextStage();
        });
        $('body').on('click', '.submit-customer', function (e) {
          e.preventDefault();
          members.nextStage();
        });

        //
        // Handle Payment option selection
        //
        $('input[name$="paymentMethod"]', plugin).on('change', function () {
          $('.credit-card-form').toggle($(this).val() === 'CREDIT_CARD');
        });

        //
        // Handle Next State button click
        //
        $(plugin).on('click', '.next-step-button button', function () {
          members.nextStage();
        });

        //
        // Handle Edit buttons on shipping and payment summary cards
        //
        $('.customer-summary .edit-button', plugin).on('click', function () {
          members.gotoStage('customer');
        });
        $('.shipping-summary .edit-button', plugin).on('click', function () {
          if (!$('#checkout-main').hasClass('multi-ship')) {
            $('body').trigger('shipping:selectSingleShipping');
          }
          members.gotoStage('shipping');
        });
        $('.payment-summary .edit-button', plugin).on('click', function () {
          members.gotoStage('payment');
        });

        //
        // remember stage (e.g. shipping)
        //
        updateUrl(members.currentStage);

        //
        // Listen for foward/back button press and move to correct checkout-stage
        //
        $(window).on('popstate', function (e) {
          //
          // Back button when event state less than current state in ordered
          // checkoutStages array.
          //
          if (e.state === null || checkoutStages.indexOf(e.state) < members.currentStage) {
            members.handlePrevStage(false);
          } else if (checkoutStages.indexOf(e.state) > members.currentStage) {
            // Forward button  pressed
            members.handleNextStage(false);
          }
        });

        //
        // Set the form data
        //
        plugin.data('formData', formData);
      },
      /**
       * The next checkout state step updates the css for showing correct buttons etc...
       */
      nextStage: function nextStage() {
        var promise = members.updateStage();
        promise.done(function () {
          // Update UI with new stage
          $('.error-message').hide();
          members.handleNextStage(true);
        });
        promise.fail(function (data) {
          // show errors
          if (data) {
            if (data.errorStage) {
              members.gotoStage(data.errorStage.stage);
              if (data.errorStage.step === 'billingAddress') {
                var $billingAddressSameAsShipping = $('input[name$="_shippingAddressUseAsBillingAddress"]');
                if ($billingAddressSameAsShipping.is(':checked')) {
                  $billingAddressSameAsShipping.prop('checked', false);
                }
              }
            }
            if (data.errorMessage) {
              $('.error-message').show();
              $('.error-message-text').text(data.errorMessage);
            }
          }
        });
      },
      /**
       * The next checkout state step updates the css for showing correct buttons etc...
       *
       * @param {boolean} bPushState - boolean when true pushes state using the history api.
       */
      handleNextStage: function handleNextStage(bPushState) {
        if (members.currentStage < checkoutStages.length - 1) {
          // move stage forward
          members.currentStage++;

          //
          // show new stage in url (e.g.payment)
          //
          if (bPushState) {
            updateUrl(members.currentStage);
          }
        }

        // Set the next stage on the DOM
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      },
      /**
       * Previous State
       */
      handlePrevStage: function handlePrevStage() {
        if (members.currentStage > 0) {
          // move state back
          members.currentStage--;
          updateUrl(members.currentStage);
        }
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      },
      /**
       * Use window history to go to a checkout stage
       * @param {string} stageName - the checkout state to goto
       */
      gotoStage: function gotoStage(stageName) {
        members.currentStage = checkoutStages.indexOf(stageName);
        updateUrl(members.currentStage);
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      }
    };

    //
    // Initialize the checkout
    //
    members.initialize();
    return this;
  };
})(jQuery);
module.exports = {
  updateCheckoutView: function updateCheckoutView() {
    $('body').on('checkout:updateCheckoutView', function (e, data) {
      if (data.csrfToken) {
        $("input[name*='csrf_token']").val(data.csrfToken);
      }
      customerHelpers.methods.updateCustomerInformation(data.customer, data.order);
      shippingHelpers.methods.updateMultiShipInformation(data.order);
      summaryHelpers.updateTotals(data.order.totals);
      data.order.shipping.forEach(function (shipping) {
        shippingHelpers.methods.updateShippingInformation(shipping, data.order, data.customer, data.options);
      });
      var currentStage = window.location.search.substring(window.location.search.indexOf('=') + 1);
      if (currentStage === ('shipping' || 0)) {
        adyenCheckout.renderGenericComponent();
      }
      billingHelpers.methods.updateBillingInformation(data.order, data.customer, data.options);
      billing.methods.updatePaymentInformation(data.order, data.options);
      summaryHelpers.updateOrderProductSummaryInformation(data.order, data.options);
    });
  }
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/commons/index.js":
/*!********************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/commons/index.js ***!
  \********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
var store = __webpack_require__(/*! ../../../../store */ "./cartridges/int_adyen_SFRA/cartridge/store/index.js");
module.exports.onFieldValid = function onFieldValid(data) {
  if (data.endDigits) {
    store.endDigits = data.endDigits;
    document.querySelector('#cardNumber').value = store.maskedCardNumber;
  }
};
module.exports.onBrand = function onBrand(brandObject) {
  document.querySelector('#cardType').value = brandObject.brand;
};

/**
 * Makes an ajax call to the controller function CreateSession
 */
module.exports.createSession = /*#__PURE__*/function () {
  var _createSession = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", $.ajax({
            url: 'Adyen-Sessions',
            type: 'get'
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  function createSession() {
    return _createSession.apply(this, arguments);
  }
  return createSession;
}();

/**
 * Makes an ajax call to the controller function FetchGiftCards
 */
module.exports.fetchGiftCards = /*#__PURE__*/function () {
  var _fetchGiftCards = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", $.ajax({
            url: 'Adyen-fetchGiftCards',
            type: 'get'
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  function fetchGiftCards() {
    return _fetchGiftCards.apply(this, arguments);
  }
  return fetchGiftCards;
}();
module.exports.checkIfExpressMethodsAreReady = function checkIfExpressMethodsAreReady() {
  var expressMethodsConfig = {
    applepay: window.isApplePayExpressEnabled === 'true',
    amazonpay: window.isAmazonPayExpressEnabled === 'true'
  };
  var enabledExpressMethods = [];
  Object.keys(expressMethodsConfig).forEach(function (key) {
    if (expressMethodsConfig[key]) {
      enabledExpressMethods.push(key);
    }
  });
  enabledExpressMethods = enabledExpressMethods.sort();
  var loadedExpressMethods = window.loadedExpressMethods && window.loadedExpressMethods.length ? window.loadedExpressMethods.sort() : [];
  var areAllMethodsReady = JSON.stringify(enabledExpressMethods) === JSON.stringify(loadedExpressMethods);
  if (!enabledExpressMethods.length || areAllMethodsReady) {
    var _document$getElementB, _document$getElementB2;
    (_document$getElementB = document.getElementById('express-loader-container')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.classList.add('hidden');
    (_document$getElementB2 = document.getElementById('express-container')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.classList.remove('hidden');
  }
};
module.exports.updateLoadedExpressMethods = function updateLoadedExpressMethods(method) {
  if (!window.loadedExpressMethods) {
    window.loadedExpressMethods = [];
  }
  if (!window.loadedExpressMethods.includes(method)) {
    window.loadedExpressMethods.push(method);
  }
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/constants.js":
/*!****************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/constants.js ***!
  \****************************************************************************/
/***/ (function(module) {



// Adyen constants
module.exports = {
  METHOD_ADYEN: 'Adyen',
  METHOD_ADYEN_POS: 'AdyenPOS',
  METHOD_ADYEN_COMPONENT: 'AdyenComponent',
  RECEIVED: 'Received',
  NOTENOUGHBALANCE: 'NotEnoughBalance',
  SUCCESS: 'Success',
  GIFTCARD: 'giftcard',
  ACTIONTYPE: {
    QRCODE: 'qrCode'
  }
};

/***/ }),

/***/ "./cartridges/int_adyen_SFRA/cartridge/store/index.js":
/*!************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/store/index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.');
}
var _require = __webpack_require__(/*! mobx */ "./node_modules/mobx/dist/mobx.esm.js"),
  observable = _require.observable,
  computed = _require.computed;
var Store = (_class = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);
    _defineProperty(this, "MASKED_CC_PREFIX", '************');
    _initializerDefineProperty(this, "checkout", _descriptor, this);
    _initializerDefineProperty(this, "endDigits", _descriptor2, this);
    _initializerDefineProperty(this, "selectedMethod", _descriptor3, this);
    _initializerDefineProperty(this, "componentsObj", _descriptor4, this);
    _initializerDefineProperty(this, "checkoutConfiguration", _descriptor5, this);
    _initializerDefineProperty(this, "formErrorsExist", _descriptor6, this);
    _initializerDefineProperty(this, "isValid", _descriptor7, this);
    _initializerDefineProperty(this, "paypalTerminatedEarly", _descriptor8, this);
    _initializerDefineProperty(this, "componentState", _descriptor9, this);
    _initializerDefineProperty(this, "brand", _descriptor10, this);
    _initializerDefineProperty(this, "partialPaymentsOrderObj", _descriptor11, this);
    _initializerDefineProperty(this, "giftCardComponentListenersAdded", _descriptor12, this);
    _initializerDefineProperty(this, "addedGiftCards", _descriptor13, this);
  }
  _createClass(Store, [{
    key: "maskedCardNumber",
    get: function get() {
      return "".concat(this.MASKED_CC_PREFIX).concat(this.endDigits);
    }
  }, {
    key: "selectedPayment",
    get: function get() {
      return this.componentsObj[this.selectedMethod];
    }
  }, {
    key: "selectedPaymentIsValid",
    get: function get() {
      var _this$selectedPayment;
      return !!((_this$selectedPayment = this.selectedPayment) !== null && _this$selectedPayment !== void 0 && _this$selectedPayment.isValid);
    }
  }, {
    key: "stateData",
    get: function get() {
      var _this$selectedPayment2;
      return ((_this$selectedPayment2 = this.selectedPayment) === null || _this$selectedPayment2 === void 0 ? void 0 : _this$selectedPayment2.stateData) || {
        paymentMethod: _objectSpread({
          type: this.selectedMethod
        }, this.brand ? {
          brand: this.brand
        } : undefined)
      };
    }
  }, {
    key: "updateSelectedPayment",
    value: function updateSelectedPayment(method, key, val) {
      this.componentsObj[method][key] = val;
    }
  }]);
  return Store;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "checkout", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "endDigits", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "selectedMethod", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "componentsObj", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "checkoutConfiguration", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return window.Configuration || {};
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "formErrorsExist", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "isValid", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "paypalTerminatedEarly", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "componentState", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "brand", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "partialPaymentsOrderObj", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "giftCardComponentListenersAdded", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "addedGiftCards", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "maskedCardNumber", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "maskedCardNumber"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedPayment", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "selectedPayment"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedPaymentIsValid", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "selectedPaymentIsValid"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "stateData", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "stateData"), _class.prototype)), _class);
module.exports = new Store();

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout.js":
/*!*****************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout.js ***!
  \*****************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {



var processInclude = __webpack_require__(/*! ./util */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/util.js");
$(document).ready(function () {
  processInclude(__webpack_require__(/*! ./checkout/checkout */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/checkout.js"));
});

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js":
/*!*************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js ***!
  \*************************************************************************************************************************************/
/***/ (function(module) {



/**
 * Populate the Billing Address Summary View
 * @param {string} parentSelector - the top level DOM selector for a unique address summary
 * @param {Object} address - the address data
 */
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function populateAddressSummary(parentSelector, address) {
  $.each(address, function (attr) {
    var val = address[attr];
    $('.' + attr, parentSelector).text(val || '');
  });
}

/**
 * returns a formed <option /> element
 * @param {Object} shipping - the shipping object (shipment model)
 * @param {boolean} selected - current shipping is selected (for PLI)
 * @param {order} order - the Order model
 * @param {Object} [options] - options
 * @returns {Object} - the jQuery / DOMElement
 */
function optionValueForAddress(shipping, selected, order, options) {
  var safeOptions = options || {};
  var isBilling = safeOptions.type && safeOptions.type === 'billing';
  var className = safeOptions.className || '';
  var isSelected = selected;
  var isNew = !shipping;
  if (typeof shipping === 'string') {
    return $('<option class="' + className + '" disabled>' + shipping + '</option>');
  }
  var safeShipping = shipping || {};
  var shippingAddress = safeShipping.shippingAddress || {};
  if (isBilling && isNew && !order.billing.matchingAddressId) {
    shippingAddress = order.billing.billingAddress.address || {};
    isNew = false;
    isSelected = true;
    safeShipping.UUID = 'manual-entry';
  }
  var uuid = safeShipping.UUID ? safeShipping.UUID : 'new';
  var optionEl = $('<option class="' + className + '" />');
  optionEl.val(uuid);
  var title;
  if (isNew) {
    title = order.resources.addNewAddress;
  } else {
    title = [];
    if (shippingAddress.firstName) {
      title.push(shippingAddress.firstName);
    }
    if (shippingAddress.lastName) {
      title.push(shippingAddress.lastName);
    }
    if (shippingAddress.address1) {
      title.push(shippingAddress.address1);
    }
    if (shippingAddress.address2) {
      title.push(shippingAddress.address2);
    }
    if (shippingAddress.city) {
      if (shippingAddress.state) {
        title.push(shippingAddress.city + ',');
      } else {
        title.push(shippingAddress.city);
      }
    }
    if (shippingAddress.stateCode) {
      title.push(shippingAddress.stateCode);
    }
    if (shippingAddress.postalCode) {
      title.push(shippingAddress.postalCode);
    }
    if (!isBilling && safeShipping.selectedShippingMethod) {
      title.push('-');
      title.push(safeShipping.selectedShippingMethod.displayName);
    }
    if (title.length > 2) {
      title = title.join(' ');
    } else {
      title = order.resources.newAddress;
    }
  }
  optionEl.text(title);
  var keyMap = {
    'data-first-name': 'firstName',
    'data-last-name': 'lastName',
    'data-address1': 'address1',
    'data-address2': 'address2',
    'data-city': 'city',
    'data-state-code': 'stateCode',
    'data-postal-code': 'postalCode',
    'data-country-code': 'countryCode',
    'data-phone': 'phone'
  };
  $.each(keyMap, function (key) {
    var mappedKey = keyMap[key];
    var mappedValue = shippingAddress[mappedKey];
    // In case of country code
    if (mappedValue && _typeof(mappedValue) === 'object') {
      mappedValue = mappedValue.value;
    }
    optionEl.attr(key, mappedValue || '');
  });
  var giftObj = {
    'data-is-gift': 'isGift',
    'data-gift-message': 'giftMessage'
  };
  $.each(giftObj, function (key) {
    var mappedKey = giftObj[key];
    var mappedValue = safeShipping[mappedKey];
    optionEl.attr(key, mappedValue || '');
  });
  if (isSelected) {
    optionEl.attr('selected', true);
  }
  return optionEl;
}

/**
 * returns address properties from a UI form
 * @param {Form} form - the Form element
 * @returns {Object} - a JSON object with all values
 */
function getAddressFieldsFromUI(form) {
  var address = {
    firstName: $('input[name$=_firstName]', form).val(),
    lastName: $('input[name$=_lastName]', form).val(),
    address1: $('input[name$=_address1]', form).val(),
    address2: $('input[name$=_address2]', form).val(),
    city: $('input[name$=_city]', form).val(),
    postalCode: $('input[name$=_postalCode]', form).val(),
    stateCode: $('select[name$=_stateCode],input[name$=_stateCode]', form).val(),
    countryCode: $('select[name$=_country]', form).val(),
    phone: $('input[name$=_phone]', form).val()
  };
  return address;
}
module.exports = {
  methods: {
    populateAddressSummary: populateAddressSummary,
    optionValueForAddress: optionValueForAddress,
    getAddressFieldsFromUI: getAddressFieldsFromUI
  },
  showDetails: function showDetails() {
    $('.btn-show-details').on('click', function () {
      var form = $(this).closest('form');
      form.attr('data-address-mode', 'details');
      form.find('.multi-ship-address-actions').removeClass('d-none');
      form.find('.multi-ship-action-buttons .col-12.btn-save-multi-ship').addClass('d-none');
    });
  },
  addNewAddress: function addNewAddress() {
    $('.btn-add-new').on('click', function () {
      var $el = $(this);
      if ($el.parents('#dwfrm_billing').length > 0) {
        // Handle billing address case
        $('body').trigger('checkout:clearBillingForm');
        var $option = $($el.parents('form').find('.addressSelector option')[0]);
        $option.attr('value', 'new');
        var $newTitle = $('#dwfrm_billing input[name=localizedNewAddressTitle]').val();
        $option.text($newTitle);
        $option.prop('selected', 'selected');
        $el.parents('[data-address-mode]').attr('data-address-mode', 'new');
      } else {
        // Handle shipping address case
        var $newEl = $el.parents('form').find('.addressSelector option[value=new]');
        $newEl.prop('selected', 'selected');
        $newEl.parent().trigger('change');
      }
    });
  }
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js":
/*!*************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js ***!
  \*************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var addressHelpers = __webpack_require__(/*! ./address */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js");
var cleave = __webpack_require__(/*! ../components/cleave */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js");

/**
 * updates the billing address selector within billing forms
 * @param {Object} order - the order model
 * @param {Object} customer - the customer model
 */
function updateBillingAddressSelector(order, customer) {
  var shippings = order.shipping;
  var form = $('form[name$=billing]')[0];
  var $billingAddressSelector = $('.addressSelector', form);
  var hasSelectedAddress = false;
  if ($billingAddressSelector && $billingAddressSelector.length === 1) {
    $billingAddressSelector.empty();
    // Add New Address option
    $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(null, false, order, {
      type: 'billing'
    }));

    // Separator -
    $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(order.resources.shippingAddresses, false, order, {
      // className: 'multi-shipping',
      type: 'billing'
    }));
    shippings.forEach(function (aShipping) {
      var isSelected = order.billing.matchingAddressId === aShipping.UUID;
      hasSelectedAddress = hasSelectedAddress || isSelected;
      // Shipping Address option
      $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(aShipping, isSelected, order, {
        // className: 'multi-shipping',
        type: 'billing'
      }));
    });
    if (customer.addresses && customer.addresses.length > 0) {
      $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(order.resources.accountAddresses, false, order));
      customer.addresses.forEach(function (address) {
        var isSelected = order.billing.matchingAddressId === address.ID;
        hasSelectedAddress = hasSelectedAddress || isSelected;
        // Customer Address option
        $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress({
          UUID: 'ab_' + address.ID,
          shippingAddress: address
        }, isSelected, order, {
          type: 'billing'
        }));
      });
    }
  }
  if (hasSelectedAddress || !order.billing.matchingAddressId && order.billing.billingAddress.address) {
    // show
    $(form).attr('data-address-mode', 'edit');
  } else {
    $(form).attr('data-address-mode', 'new');
  }
  $billingAddressSelector.show();
}

/**
 * Updates the billing address form values within payment forms without any payment instrument validation
 * @param {Object} order - the order model
 */
function updateBillingAddress(order) {
  var billing = order.billing;
  if (!billing.billingAddress || !billing.billingAddress.address) return;
  var form = $('form[name=dwfrm_billing]');
  if (!form) return;
  $('input[name$=_firstName]', form).val(billing.billingAddress.address.firstName);
  $('input[name$=_lastName]', form).val(billing.billingAddress.address.lastName);
  $('input[name$=_address1]', form).val(billing.billingAddress.address.address1);
  $('input[name$=_address2]', form).val(billing.billingAddress.address.address2);
  $('input[name$=_city]', form).val(billing.billingAddress.address.city);
  $('input[name$=_postalCode]', form).val(billing.billingAddress.address.postalCode);
  $('select[name$=_stateCode],input[name$=_stateCode]', form).val(billing.billingAddress.address.stateCode);
  $('select[name$=_country]', form).val(billing.billingAddress.address.countryCode.value);
  $('input[name$=_phone]', form).val(billing.billingAddress.address.phone);
  $('input[name$=_email]', form).val(order.orderEmail);
}

/**
 * Validate and update payment instrument form fields
 * @param {Object} order - the order model
 */
function validateAndUpdateBillingPaymentInstrument(order) {
  var billing = order.billing;
  if (!billing.payment || !billing.payment.selectedPaymentInstruments || billing.payment.selectedPaymentInstruments.length <= 0) return;
  var form = $('form[name=dwfrm_billing]');
  if (!form) return;
  var instrument = billing.payment.selectedPaymentInstruments[0];
  $('select[name$=expirationMonth]', form).val(instrument.expirationMonth);
  $('select[name$=expirationYear]', form).val(instrument.expirationYear);
  // Force security code and card number clear
  $('input[name$=securityCode]', form).val('');
  $('input[name$=cardNumber]').data('cleave').setRawValue('');
}

/**
 * Updates the billing address form values within payment forms
 * @param {Object} order - the order model
 */
function updateBillingAddressFormValues(order) {
  module.exports.methods.updateBillingAddress(order);
  module.exports.methods.validateAndUpdateBillingPaymentInstrument(order);
}

/**
 * clears the billing address form values
 */
function clearBillingAddressFormValues() {
  updateBillingAddressFormValues({
    billing: {
      billingAddress: {
        address: {
          countryCode: {}
        }
      }
    }
  });
}

/**
 * update billing address summary and contact information
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updateBillingAddressSummary(order) {
  // update billing address summary
  addressHelpers.methods.populateAddressSummary('.billing .address-summary', order.billing.billingAddress.address);

  // update billing parts of order summary
  $('.order-summary-email').text(order.orderEmail);
  if (order.billing.billingAddress.address) {
    $('.order-summary-phone').text(order.billing.billingAddress.address.phone);
  }
}

/**
 * Updates the billing information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 * @param {Object} customer - customer model to use as basis of new truth
 * @param {Object} [options] - options
 */
function updateBillingInformation(order, customer) {
  updateBillingAddressSelector(order, customer);

  // update billing address form
  updateBillingAddressFormValues(order);

  // update billing address summary and billing parts of order summary
  updateBillingAddressSummary(order);
}

/**
 * Updates the payment information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updatePaymentInformation(order) {
  // update payment details
  var $paymentSummary = $('.payment-details');
  var htmlToAppend = '';
  if (order.billing.payment && order.billing.payment.selectedPaymentInstruments && order.billing.payment.selectedPaymentInstruments.length > 0) {
    htmlToAppend += '<span>' + order.resources.cardType + ' ' + order.billing.payment.selectedPaymentInstruments[0].type + '</span><div>' + order.billing.payment.selectedPaymentInstruments[0].maskedCreditCardNumber + '</div><div><span>' + order.resources.cardEnding + ' ' + order.billing.payment.selectedPaymentInstruments[0].expirationMonth + '/' + order.billing.payment.selectedPaymentInstruments[0].expirationYear + '</span></div>';
  }
  $paymentSummary.empty().append(htmlToAppend);
}

/**
 * clears the credit card form
 */
function clearCreditCardForm() {
  $('input[name$="_cardNumber"]').data('cleave').setRawValue('');
  $('select[name$="_expirationMonth"]').val('');
  $('select[name$="_expirationYear"]').val('');
  $('input[name$="_securityCode"]').val('');
}
module.exports = {
  methods: {
    updateBillingAddressSelector: updateBillingAddressSelector,
    updateBillingAddressFormValues: updateBillingAddressFormValues,
    clearBillingAddressFormValues: clearBillingAddressFormValues,
    updateBillingInformation: updateBillingInformation,
    updatePaymentInformation: updatePaymentInformation,
    clearCreditCardForm: clearCreditCardForm,
    updateBillingAddress: updateBillingAddress,
    validateAndUpdateBillingPaymentInstrument: validateAndUpdateBillingPaymentInstrument,
    updateBillingAddressSummary: updateBillingAddressSummary
  },
  showBillingDetails: function showBillingDetails() {
    $('.btn-show-billing-details').on('click', function () {
      $(this).parents('[data-address-mode]').attr('data-address-mode', 'new');
    });
  },
  hideBillingDetails: function hideBillingDetails() {
    $('.btn-hide-billing-details').on('click', function () {
      $(this).parents('[data-address-mode]').attr('data-address-mode', 'shipment');
    });
  },
  selectBillingAddress: function selectBillingAddress() {
    $('.payment-form .addressSelector').on('change', function () {
      var form = $(this).parents('form')[0];
      var selectedOption = $('option:selected', this);
      var optionID = selectedOption[0].value;
      if (optionID === 'new') {
        // Show Address
        $(form).attr('data-address-mode', 'new');
      } else {
        // Hide Address
        $(form).attr('data-address-mode', 'shipment');
      }

      // Copy fields
      var attrs = selectedOption.data();
      var element;
      Object.keys(attrs).forEach(function (attr) {
        element = attr === 'countryCode' ? 'country' : attr;
        if (element === 'cardNumber') {
          $('.cardNumber').data('cleave').setRawValue(attrs[attr]);
        } else {
          $('[name$=' + element + ']', form).val(attrs[attr]);
        }
      });
    });
  },
  handleCreditCardNumber: function handleCreditCardNumber() {
    cleave.handleCreditCardNumber('.cardNumber', '#cardType');
  },
  santitizeForm: function santitizeForm() {
    $('body').on('checkout:serializeBilling', function (e, data) {
      var serializedForm = cleave.serializeData(data.form);
      data.callback(serializedForm);
    });
  },
  selectSavedPaymentInstrument: function selectSavedPaymentInstrument() {
    $(document).on('click', '.saved-payment-instrument', function (e) {
      e.preventDefault();
      $('.saved-payment-security-code').val('');
      $('.saved-payment-instrument').removeClass('selected-payment');
      $(this).addClass('selected-payment');
      $('.saved-payment-instrument .card-image').removeClass('checkout-hidden');
      $('.saved-payment-instrument .security-code-input').addClass('checkout-hidden');
      $('.saved-payment-instrument.selected-payment' + ' .card-image').addClass('checkout-hidden');
      $('.saved-payment-instrument.selected-payment ' + '.security-code-input').removeClass('checkout-hidden');
    });
  },
  addNewPaymentInstrument: function addNewPaymentInstrument() {
    $('.btn.add-payment').on('click', function (e) {
      e.preventDefault();
      $('.payment-information').data('is-new-payment', true);
      clearCreditCardForm();
      $('.credit-card-form').removeClass('checkout-hidden');
      $('.user-payment-instruments').addClass('checkout-hidden');
    });
  },
  cancelNewPayment: function cancelNewPayment() {
    $('.cancel-new-payment').on('click', function (e) {
      e.preventDefault();
      $('.payment-information').data('is-new-payment', false);
      clearCreditCardForm();
      $('.user-payment-instruments').removeClass('checkout-hidden');
      $('.credit-card-form').addClass('checkout-hidden');
    });
  },
  clearBillingForm: function clearBillingForm() {
    $('body').on('checkout:clearBillingForm', function () {
      clearBillingAddressFormValues();
    });
  },
  paymentTabs: function paymentTabs() {
    $('.payment-options .nav-item').on('click', function (e) {
      e.preventDefault();
      var methodID = $(this).data('method-id');
      $('.payment-information').data('payment-method-id', methodID);
    });
  }
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/checkout.js":
/*!**************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/checkout.js ***!
  \**************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var customerHelpers = __webpack_require__(/*! ./customer */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/customer.js");
var addressHelpers = __webpack_require__(/*! ./address */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js");
var shippingHelpers = __webpack_require__(/*! ./shipping */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/shipping.js");
var billingHelpers = __webpack_require__(/*! ./billing */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js");
var summaryHelpers = __webpack_require__(/*! ./summary */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js");
var formHelpers = __webpack_require__(/*! ./formErrors */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js");
var scrollAnimate = __webpack_require__(/*! ../components/scrollAnimate */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");

/**
 * Create the jQuery Checkout Plugin.
 *
 * This jQuery plugin will be registered on the dom element in checkout.isml with the
 * id of "checkout-main".
 *
 * The checkout plugin will handle the different state the user interface is in as the user
 * progresses through the varying forms such as shipping and payment.
 *
 * Billing info and payment info are used a bit synonymously in this code.
 *
 */
(function ($) {
  $.fn.checkout = function () {
    // eslint-disable-line
    var plugin = this;

    //
    // Collect form data from user input
    //
    var formData = {
      // Customer Data
      customer: {},
      // Shipping Address
      shipping: {},
      // Billing Address
      billing: {},
      // Payment
      payment: {},
      // Gift Codes
      giftCode: {}
    };

    //
    // The different states/stages of checkout
    //
    var checkoutStages = ['customer', 'shipping', 'payment', 'placeOrder', 'submitted'];

    /**
     * Updates the URL to determine stage
     * @param {number} currentStage - The current stage the user is currently on in the checkout
     */
    function updateUrl(currentStage) {
      history.pushState(checkoutStages[currentStage], document.title, location.pathname + '?stage=' + checkoutStages[currentStage] + '#' + checkoutStages[currentStage]);
    }

    //
    // Local member methods of the Checkout plugin
    //
    var members = {
      // initialize the currentStage variable for the first time
      currentStage: 0,
      /**
       * Set or update the checkout stage (AKA the shipping, billing, payment, etc... steps)
       * @returns {Object} a promise
       */
      updateStage: function updateStage() {
        var stage = checkoutStages[members.currentStage];
        var defer = $.Deferred(); // eslint-disable-line

        if (stage === 'customer') {
          //
          // Clear Previous Errors
          //
          customerHelpers.methods.clearErrors();
          //
          // Submit the Customer Form
          //
          var customerFormSelector = customerHelpers.methods.isGuestFormActive() ? customerHelpers.vars.GUEST_FORM : customerHelpers.vars.REGISTERED_FORM;
          var customerForm = $(customerFormSelector);
          $.ajax({
            url: customerForm.attr('action'),
            type: 'post',
            data: customerForm.serialize(),
            success: function success(data) {
              if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
              } else {
                customerHelpers.methods.customerFormResponse(defer, data);
              }
            },
            error: function error(err) {
              if (err.responseJSON && err.responseJSON.redirectUrl) {
                window.location.href = err.responseJSON.redirectUrl;
              }
              // Server error submitting form
              defer.reject(err.responseJSON);
            }
          });
          return defer;
        } else if (stage === 'shipping') {
          //
          // Clear Previous Errors
          //
          formHelpers.clearPreviousErrors('.shipping-form');

          //
          // Submit the Shipping Address Form
          //
          var isMultiShip = $('#checkout-main').hasClass('multi-ship');
          var formSelector = isMultiShip ? '.multi-shipping .active form' : '.single-shipping .shipping-form';
          var form = $(formSelector);
          if (isMultiShip && form.length === 0) {
            // disable the next:Payment button here
            $('body').trigger('checkout:disableButton', '.next-step-button button');
            // in case the multi ship form is already submitted
            var url = $('#checkout-main').attr('data-checkout-get-url');
            $.ajax({
              url: url,
              method: 'GET',
              success: function success(data) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (!data.error) {
                  $('body').trigger('checkout:updateCheckoutView', {
                    order: data.order,
                    customer: data.customer
                  });
                  defer.resolve();
                } else if (data.message && $('.shipping-error .alert-danger').length < 1) {
                  var errorMsg = data.message;
                  var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' + 'fade show" role="alert">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + errorMsg + '</div>';
                  $('.shipping-error').append(errorHtml);
                  scrollAnimate($('.shipping-error'));
                  defer.reject();
                } else if (data.redirectUrl) {
                  window.location.href = data.redirectUrl;
                }
              },
              error: function error() {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                // Server error submitting form
                defer.reject();
              }
            });
          } else {
            var shippingFormData = form.serialize();
            $('body').trigger('checkout:serializeShipping', {
              form: form,
              data: shippingFormData,
              callback: function callback(data) {
                shippingFormData = data;
              }
            });
            // disable the next:Payment button here
            $('body').trigger('checkout:disableButton', '.next-step-button button');
            $.ajax({
              url: form.attr('action'),
              type: 'post',
              data: shippingFormData,
              success: function success(data) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                shippingHelpers.methods.shippingFormResponse(defer, data);
              },
              error: function error(err) {
                // enable the next:Payment button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (err.responseJSON && err.responseJSON.redirectUrl) {
                  window.location.href = err.responseJSON.redirectUrl;
                }
                // Server error submitting form
                defer.reject(err.responseJSON);
              }
            });
          }
          return defer;
        } else if (stage === 'payment') {
          //
          // Submit the Billing Address Form
          //

          formHelpers.clearPreviousErrors('.payment-form');
          var billingAddressForm = $('#dwfrm_billing .billing-address-block :input').serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $('#dwfrm_billing .billing-address-block'),
            data: billingAddressForm,
            callback: function callback(data) {
              if (data) {
                billingAddressForm = data;
              }
            }
          });
          var contactInfoForm = $('#dwfrm_billing .contact-info-block :input').serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $('#dwfrm_billing .contact-info-block'),
            data: contactInfoForm,
            callback: function callback(data) {
              if (data) {
                contactInfoForm = data;
              }
            }
          });
          var activeTabId = $('.tab-pane.active').attr('id');
          var paymentInfoSelector = '#dwfrm_billing .' + activeTabId + ' .payment-form-fields :input';
          var paymentInfoForm = $(paymentInfoSelector).serialize();
          $('body').trigger('checkout:serializeBilling', {
            form: $(paymentInfoSelector),
            data: paymentInfoForm,
            callback: function callback(data) {
              if (data) {
                paymentInfoForm = data;
              }
            }
          });
          var paymentForm = billingAddressForm + '&' + contactInfoForm + '&' + paymentInfoForm;
          if ($('.data-checkout-stage').data('customer-type') === 'registered') {
            // if payment method is credit card
            if ($('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
              if (!$('.payment-information').data('is-new-payment')) {
                var cvvCode = $('.saved-payment-instrument.' + 'selected-payment .saved-payment-security-code').val();
                if (cvvCode === '') {
                  var cvvElement = $('.saved-payment-instrument.' + 'selected-payment ' + '.form-control');
                  cvvElement.addClass('is-invalid');
                  scrollAnimate(cvvElement);
                  defer.reject();
                  return defer;
                }
                var $savedPaymentInstrument = $('.saved-payment-instrument' + '.selected-payment');
                paymentForm += '&storedPaymentUUID=' + $savedPaymentInstrument.data('uuid');
                paymentForm += '&securityCode=' + cvvCode;
              }
            }
          }
          // disable the next:Place Order button here
          $('body').trigger('checkout:disableButton', '.next-step-button button');
          $.ajax({
            url: $('#dwfrm_billing').attr('action'),
            method: 'POST',
            data: paymentForm,
            success: function success(data) {
              // enable the next:Place Order button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              // look for field validation errors
              if (data.error) {
                if (data.fieldErrors.length) {
                  data.fieldErrors.forEach(function (error) {
                    if (Object.keys(error).length) {
                      formHelpers.loadFormErrors('.payment-form', error);
                    }
                  });
                }
                if (data.serverErrors.length) {
                  data.serverErrors.forEach(function (error) {
                    $('.error-message').show();
                    $('.error-message-text').text(error);
                    scrollAnimate($('.error-message'));
                  });
                }
                if (data.cartError) {
                  window.location.href = data.redirectUrl;
                }
                defer.reject();
              } else {
                //
                // Populate the Address Summary
                //
                $('body').trigger('checkout:updateCheckoutView', {
                  order: data.order,
                  customer: data.customer
                });
                if (data.renderedPaymentInstruments) {
                  $('.stored-payments').empty().html(data.renderedPaymentInstruments);
                }
                if (data.customer.registeredUser && data.customer.customerPaymentInstruments.length) {
                  $('.cancel-new-payment').removeClass('checkout-hidden');
                }
                scrollAnimate();
                defer.resolve(data);
              }
            },
            error: function error(err) {
              // enable the next:Place Order button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              if (err.responseJSON && err.responseJSON.redirectUrl) {
                window.location.href = err.responseJSON.redirectUrl;
              }
            }
          });
          return defer;
        } else if (stage === 'placeOrder') {
          // disable the placeOrder button here
          $('body').trigger('checkout:disableButton', '.next-step-button button');
          $.ajax({
            url: $('.place-order').data('action'),
            method: 'POST',
            success: function success(data) {
              // enable the placeOrder button here
              $('body').trigger('checkout:enableButton', '.next-step-button button');
              if (data.error) {
                if (data.cartError) {
                  window.location.href = data.redirectUrl;
                  defer.reject();
                } else {
                  // go to appropriate stage and display error message
                  defer.reject(data);
                }
              } else {
                var redirect = $('<form>').appendTo(document.body).attr({
                  method: 'POST',
                  action: data.continueUrl
                });
                $('<input>').appendTo(redirect).attr({
                  name: 'orderID',
                  value: data.orderID
                });
                $('<input>').appendTo(redirect).attr({
                  name: 'orderToken',
                  value: data.orderToken
                });
                redirect.submit();
                defer.resolve(data);
              }
            },
            error: function error() {
              // enable the placeOrder button here
              $('body').trigger('checkout:enableButton', $('.next-step-button button'));
            }
          });
          return defer;
        }
        var p = $('<div>').promise(); // eslint-disable-line
        setTimeout(function () {
          p.done(); // eslint-disable-line
        }, 500);
        return p; // eslint-disable-line
      },

      /**
       * Initialize the checkout stage.
       *
       * TODO: update this to allow stage to be set from server?
       */
      initialize: function initialize() {
        // set the initial state of checkout
        members.currentStage = checkoutStages.indexOf($('.data-checkout-stage').data('checkout-stage'));
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
        $('body').on('click', '.submit-customer-login', function (e) {
          e.preventDefault();
          members.nextStage();
        });
        $('body').on('click', '.submit-customer', function (e) {
          e.preventDefault();
          members.nextStage();
        });

        //
        // Handle Payment option selection
        //
        $('input[name$="paymentMethod"]', plugin).on('change', function () {
          $('.credit-card-form').toggle($(this).val() === 'CREDIT_CARD');
        });

        //
        // Handle Next State button click
        //
        $(plugin).on('click', '.next-step-button button', function () {
          members.nextStage();
        });

        //
        // Handle Edit buttons on shipping and payment summary cards
        //
        $('.customer-summary .edit-button', plugin).on('click', function () {
          members.gotoStage('customer');
        });
        $('.shipping-summary .edit-button', plugin).on('click', function () {
          if (!$('#checkout-main').hasClass('multi-ship')) {
            $('body').trigger('shipping:selectSingleShipping');
          }
          members.gotoStage('shipping');
        });
        $('.payment-summary .edit-button', plugin).on('click', function () {
          members.gotoStage('payment');
        });

        //
        // remember stage (e.g. shipping)
        //
        updateUrl(members.currentStage);

        //
        // Listen for foward/back button press and move to correct checkout-stage
        //
        $(window).on('popstate', function (e) {
          //
          // Back button when event state less than current state in ordered
          // checkoutStages array.
          //
          if (e.state === null || checkoutStages.indexOf(e.state) < members.currentStage) {
            members.handlePrevStage(false);
          } else if (checkoutStages.indexOf(e.state) > members.currentStage) {
            // Forward button  pressed
            members.handleNextStage(false);
          }
        });

        //
        // Set the form data
        //
        plugin.data('formData', formData);
      },
      /**
       * The next checkout state step updates the css for showing correct buttons etc...
       */
      nextStage: function nextStage() {
        var promise = members.updateStage();
        promise.done(function () {
          // Update UI with new stage
          $('.error-message').hide();
          members.handleNextStage(true);
        });
        promise.fail(function (data) {
          // show errors
          if (data) {
            if (data.errorStage) {
              members.gotoStage(data.errorStage.stage);
              if (data.errorStage.step === 'billingAddress') {
                var $billingAddressSameAsShipping = $('input[name$="_shippingAddressUseAsBillingAddress"]');
                if ($billingAddressSameAsShipping.is(':checked')) {
                  $billingAddressSameAsShipping.prop('checked', false);
                }
              }
            }
            if (data.errorMessage) {
              $('.error-message').show();
              $('.error-message-text').text(data.errorMessage);
            }
          }
        });
      },
      /**
       * The next checkout state step updates the css for showing correct buttons etc...
       *
       * @param {boolean} bPushState - boolean when true pushes state using the history api.
       */
      handleNextStage: function handleNextStage(bPushState) {
        if (members.currentStage < checkoutStages.length - 1) {
          // move stage forward
          members.currentStage++;

          //
          // show new stage in url (e.g.payment)
          //
          if (bPushState) {
            updateUrl(members.currentStage);
          }
        }

        // Set the next stage on the DOM
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      },
      /**
       * Previous State
       */
      handlePrevStage: function handlePrevStage() {
        if (members.currentStage > 0) {
          // move state back
          members.currentStage--;
          updateUrl(members.currentStage);
        }
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      },
      /**
       * Use window history to go to a checkout stage
       * @param {string} stageName - the checkout state to goto
       */
      gotoStage: function gotoStage(stageName) {
        members.currentStage = checkoutStages.indexOf(stageName);
        updateUrl(members.currentStage);
        $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
      }
    };

    //
    // Initialize the checkout
    //
    members.initialize();
    return this;
  };
})(jQuery);
var exports = {
  initialize: function initialize() {
    $('#checkout-main').checkout();
  },
  updateCheckoutView: function updateCheckoutView() {
    $('body').on('checkout:updateCheckoutView', function (e, data) {
      if (data.csrfToken) {
        $("input[name*='csrf_token']").val(data.csrfToken);
      }
      customerHelpers.methods.updateCustomerInformation(data.customer, data.order);
      shippingHelpers.methods.updateMultiShipInformation(data.order);
      summaryHelpers.updateTotals(data.order.totals);
      data.order.shipping.forEach(function (shipping) {
        shippingHelpers.methods.updateShippingInformation(shipping, data.order, data.customer, data.options);
      });
      billingHelpers.methods.updateBillingInformation(data.order, data.customer, data.options);
      billingHelpers.methods.updatePaymentInformation(data.order, data.options);
      summaryHelpers.updateOrderProductSummaryInformation(data.order, data.options);
    });
  },
  disableButton: function disableButton() {
    $('body').on('checkout:disableButton', function (e, button) {
      $(button).prop('disabled', true);
    });
  },
  enableButton: function enableButton() {
    $('body').on('checkout:enableButton', function (e, button) {
      $(button).prop('disabled', false);
    });
  }
};
[customerHelpers, billingHelpers, shippingHelpers, addressHelpers].forEach(function (library) {
  Object.keys(library).forEach(function (item) {
    if (_typeof(library[item]) === 'object') {
      exports[item] = $.extend({}, exports[item], library[item]);
    } else {
      exports[item] = library[item];
    }
  });
});
module.exports = exports;

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/customer.js":
/*!**************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/customer.js ***!
  \**************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var formHelpers = __webpack_require__(/*! ./formErrors */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js");
var scrollAnimate = __webpack_require__(/*! ../components/scrollAnimate */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");
var createErrorNotification = __webpack_require__(/*! ../components/errorNotification */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/errorNotification.js");
var GUEST_FORM = '#guest-customer';
var REGISTERED_FORM = '#registered-customer';
var ERROR_SECTION = '.customer-error';

/**
 * @returns {boolean} If guest is active, registered is not visible
 */
function isGuestFormActive() {
  return $(REGISTERED_FORM).hasClass('d-none');
}

/**
 * Clear any previous errors in the customer form.
 */
function clearErrors() {
  $(ERROR_SECTION).children().remove();
  formHelpers.clearPreviousErrors('.customer-information-block');
}

/**
 * @param {Object} customerData - data includes checkout related customer information
 * @param {Object} orderData - data includes checkout related order information
 */
function updateCustomerInformation(customerData, orderData) {
  var $container = $('.customer-summary');
  var $summaryDetails = $container.find('.summary-details');
  var email = customerData.profile && customerData.profile.email ? customerData.profile.email : orderData.orderEmail;
  $summaryDetails.find('.customer-summary-email').text(email);
  if (customerData.registeredUser) {
    $container.find('.edit-button').hide();
  } else {
    $container.find('.edit-button').show();
  }
}

/**
 * Handle response from the server for valid or invalid form fields.
 * @param {Object} defer - the deferred object which will resolve on success or reject.
 * @param {Object} data - the response data with the invalid form fields or
 *  valid model data.
 */
function customerFormResponse(defer, data) {
  var parentForm = isGuestFormActive() ? GUEST_FORM : REGISTERED_FORM;
  var formSelector = '.customer-section ' + parentForm;

  // highlight fields with errors
  if (data.error) {
    if (data.fieldErrors.length) {
      data.fieldErrors.forEach(function (error) {
        if (Object.keys(error).length) {
          formHelpers.loadFormErrors(formSelector, error);
        }
      });
    }
    if (data.customerErrorMessage) {
      createErrorNotification(ERROR_SECTION, data.customerErrorMessage);
    }
    if (data.fieldErrors.length || data.customerErrorMessage || data.serverErrors && data.serverErrors.length) {
      defer.reject(data);
    }
    if (data.cartError) {
      window.location.href = data.redirectUrl;
      defer.reject();
    }
  } else {
    // Populate the Address Summary

    $('body').trigger('checkout:updateCheckoutView', {
      order: data.order,
      customer: data.customer,
      csrfToken: data.csrfToken
    });
    scrollAnimate($('.shipping-form'));
    defer.resolve(data);
  }
}

/**
 *
 * @param {boolean} registered - wether a registered login block will be used
 */
function chooseLoginBlock(registered) {
  $(ERROR_SECTION).find('.alert').remove();
  $('#password').val('');
  if (registered) {
    $(REGISTERED_FORM).removeClass('d-none');
    $(GUEST_FORM).addClass('d-none');
    $('#email').val($('#email-guest').val());
  } else {
    $(REGISTERED_FORM).addClass('d-none');
    $(GUEST_FORM).removeClass('d-none');
    $('#email').val('');
  }
}
module.exports = {
  /**
   * Listeners for customer form
   */
  initListeners: function initListeners() {
    // 1. password
    var customerLogin = '.js-login-customer';
    var cancelLogin = '.js-cancel-login';
    var registered;
    if (customerLogin.length !== 0) {
      $('body').on('click', customerLogin, function (e) {
        registered = true;
        e.preventDefault();
        chooseLoginBlock(registered);
      });
    }
    if (cancelLogin.length !== 0) {
      $('body').on('click', cancelLogin, function (e) {
        registered = false;
        e.preventDefault();
        chooseLoginBlock(registered);
      });
    }
  },
  methods: {
    clearErrors: clearErrors,
    updateCustomerInformation: updateCustomerInformation,
    customerFormResponse: customerFormResponse,
    isGuestFormActive: isGuestFormActive
  },
  vars: {
    GUEST_FORM: GUEST_FORM,
    REGISTERED_FORM: REGISTERED_FORM
  }
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js":
/*!****************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js ***!
  \****************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var scrollAnimate = __webpack_require__(/*! ../components/scrollAnimate */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");

/**
 * Display error messages and highlight form fields with errors.
 * @param {string} parentSelector - the form which contains the fields
 * @param {Object} fieldErrors - the fields with errors
 */
function loadFormErrors(parentSelector, fieldErrors) {
  // eslint-disable-line
  // Display error messages and highlight form fields with errors.
  $.each(fieldErrors, function (attr) {
    $('*[name=' + attr + ']', parentSelector).addClass('is-invalid').siblings('.invalid-feedback').html(fieldErrors[attr]);
  });
  // Animate to top of form that has errors
  scrollAnimate($(parentSelector));
}

/**
 * Clear the form errors.
 * @param {string} parentSelector - the parent form selector.
 */
function clearPreviousErrors(parentSelector) {
  $(parentSelector).find('.form-control.is-invalid').removeClass('is-invalid');
  $('.error-message').hide();
}
module.exports = {
  loadFormErrors: loadFormErrors,
  clearPreviousErrors: clearPreviousErrors
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/shipping.js":
/*!**************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/shipping.js ***!
  \**************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var addressHelpers = __webpack_require__(/*! ./address */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js");
var formHelpers = __webpack_require__(/*! ./formErrors */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/formErrors.js");
var scrollAnimate = __webpack_require__(/*! ../components/scrollAnimate */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");

/**
 * updates the shipping address selector within shipping forms
 * @param {Object} productLineItem - the productLineItem model
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order model
 * @param {Object} customer - the customer model
 */
function updateShippingAddressSelector(productLineItem, shipping, order, customer) {
  var uuidEl = $('input[value=' + productLineItem.UUID + ']');
  var shippings = order.shipping;
  var form;
  var $shippingAddressSelector;
  var hasSelectedAddress = false;
  if (uuidEl && uuidEl.length > 0) {
    form = uuidEl[0].form;
    $shippingAddressSelector = $('.addressSelector', form);
  }
  if ($shippingAddressSelector && $shippingAddressSelector.length === 1) {
    $shippingAddressSelector.empty();
    // Add New Address option
    $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress(null, false, order));
    if (customer.addresses && customer.addresses.length > 0) {
      $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress(order.resources.accountAddresses, false, order));
      customer.addresses.forEach(function (address) {
        var isSelected = shipping.matchingAddressId === address.ID;
        $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress({
          UUID: 'ab_' + address.ID,
          shippingAddress: address
        }, isSelected, order));
      });
    }
    // Separator -
    $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress(order.resources.shippingAddresses, false, order, {
      className: 'multi-shipping'
    }));
    shippings.forEach(function (aShipping) {
      var isSelected = shipping.UUID === aShipping.UUID;
      hasSelectedAddress = hasSelectedAddress || isSelected;
      var addressOption = addressHelpers.methods.optionValueForAddress(aShipping, isSelected, order, {
        className: 'multi-shipping'
      });
      var newAddress = addressOption.html() === order.resources.addNewAddress;
      var matchingUUID = aShipping.UUID === shipping.UUID;
      if (newAddress && matchingUUID || !newAddress && matchingUUID || !newAddress && !matchingUUID) {
        $shippingAddressSelector.append(addressOption);
      }
      if (newAddress && !matchingUUID) {
        $(addressOption[0]).remove();
      }
    });
  }
  if (!hasSelectedAddress) {
    // show
    $(form).addClass('hide-details');
  } else {
    $(form).removeClass('hide-details');
  }
  $('body').trigger('shipping:updateShippingAddressSelector', {
    productLineItem: productLineItem,
    shipping: shipping,
    order: order,
    customer: customer
  });
}

/**
 * updates the shipping address form values within shipping forms
 * @param {Object} shipping - the shipping (shipment model) model
 */
function updateShippingAddressFormValues(shipping) {
  var addressObject = $.extend({}, shipping.shippingAddress);
  if (!addressObject) {
    addressObject = {
      firstName: null,
      lastName: null,
      address1: null,
      address2: null,
      city: null,
      postalCode: null,
      stateCode: null,
      countryCode: null,
      phone: null
    };
  }
  addressObject.isGift = shipping.isGift;
  addressObject.giftMessage = shipping.giftMessage;
  $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
    var form = el.form;
    if (!form) return;
    var countryCode = addressObject.countryCode;
    $('input[name$=_firstName]', form).val(addressObject.firstName);
    $('input[name$=_lastName]', form).val(addressObject.lastName);
    $('input[name$=_address1]', form).val(addressObject.address1);
    $('input[name$=_address2]', form).val(addressObject.address2);
    $('input[name$=_city]', form).val(addressObject.city);
    $('input[name$=_postalCode]', form).val(addressObject.postalCode);
    $('select[name$=_stateCode],input[name$=_stateCode]', form).val(addressObject.stateCode);
    if (countryCode && _typeof(countryCode) === 'object') {
      $('select[name$=_country]', form).val(addressObject.countryCode.value);
    } else {
      $('select[name$=_country]', form).val(addressObject.countryCode);
    }
    $('input[name$=_phone]', form).val(addressObject.phone);
    $('input[name$=_isGift]', form).prop('checked', addressObject.isGift);
    $('textarea[name$=_giftMessage]', form).val(addressObject.isGift && addressObject.giftMessage ? addressObject.giftMessage : '');
  });
  $('body').trigger('shipping:updateShippingAddressFormValues', {
    shipping: shipping
  });
}

/**
 * updates the shipping method radio buttons within shipping forms
 * @param {Object} shipping - the shipping (shipment model) model
 */
function updateShippingMethods(shipping) {
  var uuidEl = $('input[value=' + shipping.UUID + ']');
  if (uuidEl && uuidEl.length > 0) {
    $.each(uuidEl, function (shipmentIndex, el) {
      var form = el.form;
      if (!form) return;
      var $shippingMethodList = $('.shipping-method-list', form);
      if ($shippingMethodList && $shippingMethodList.length > 0) {
        $shippingMethodList.empty();
        var shippingMethods = shipping.applicableShippingMethods;
        var selected = shipping.selectedShippingMethod || {};
        var shippingMethodFormID = form.name + '_shippingAddress_shippingMethodID';
        //
        // Create the new rows for each shipping method
        //
        $.each(shippingMethods, function (methodIndex, shippingMethod) {
          var tmpl = $('#shipping-method-template').clone();
          // set input
          $('input', tmpl).prop('id', 'shippingMethod-' + shippingMethod.ID + '-' + shipping.UUID).prop('name', shippingMethodFormID).prop('value', shippingMethod.ID).attr('checked', shippingMethod.ID === selected.ID);
          $('label', tmpl).prop('for', 'shippingMethod-' + shippingMethod.ID + '-' + shipping.UUID);
          // set shipping method name
          $('.display-name', tmpl).text(shippingMethod.displayName);
          // set or hide arrival time
          if (shippingMethod.estimatedArrivalTime) {
            $('.arrival-time', tmpl).text('(' + shippingMethod.estimatedArrivalTime + ')').show();
          }
          // set shipping cost
          $('.shipping-cost', tmpl).text(shippingMethod.shippingCost);
          $shippingMethodList.append(tmpl.html());
        });
      }
    });
  }
  $('body').trigger('shipping:updateShippingMethods', {
    shipping: shipping
  });
}

/**
 * Update list of available shipping methods whenever user modifies shipping address details.
 * @param {jQuery} $shippingForm - current shipping form
 */
function updateShippingMethodList($shippingForm) {
  // delay for autocomplete!
  setTimeout(function () {
    var $shippingMethodList = $shippingForm.find('.shipping-method-list');
    var urlParams = addressHelpers.methods.getAddressFieldsFromUI($shippingForm);
    var shipmentUUID = $shippingForm.find('[name=shipmentUUID]').val();
    var url = $shippingMethodList.data('actionUrl');
    urlParams.shipmentUUID = shipmentUUID;
    $shippingMethodList.spinner().start();
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      data: urlParams,
      success: function success(data) {
        if (data.error) {
          window.location.href = data.redirectUrl;
        } else {
          $('body').trigger('checkout:updateCheckoutView', {
            order: data.order,
            customer: data.customer,
            options: {
              keepOpen: true
            }
          });
          $shippingMethodList.spinner().stop();
        }
      }
    });
  }, 300);
}

/**
 * updates the order shipping summary for an order shipment model
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order model
 */
function updateShippingSummaryInformation(shipping, order) {
  $('[data-shipment-summary=' + shipping.UUID + ']').each(function (i, el) {
    var $container = $(el);
    var $shippingAddressLabel = $container.find('.shipping-addr-label');
    var $addressContainer = $container.find('.address-summary');
    var $shippingPhone = $container.find('.shipping-phone');
    var $methodTitle = $container.find('.shipping-method-title');
    var $methodArrivalTime = $container.find('.shipping-method-arrival-time');
    var $methodPrice = $container.find('.shipping-method-price');
    var $shippingSummaryLabel = $container.find('.shipping-method-label');
    var $summaryDetails = $container.find('.row.summary-details');
    var giftMessageSummary = $container.find('.gift-summary');
    var address = shipping.shippingAddress;
    var selectedShippingMethod = shipping.selectedShippingMethod;
    var isGift = shipping.isGift;
    addressHelpers.methods.populateAddressSummary($addressContainer, address);
    if (address && address.phone) {
      $shippingPhone.text(address.phone);
    } else {
      $shippingPhone.empty();
    }
    if (selectedShippingMethod) {
      $('body').trigger('shipping:updateAddressLabelText', {
        selectedShippingMethod: selectedShippingMethod,
        resources: order.resources,
        shippingAddressLabel: $shippingAddressLabel
      });
      $shippingSummaryLabel.show();
      $summaryDetails.show();
      $methodTitle.text(selectedShippingMethod.displayName);
      if (selectedShippingMethod.estimatedArrivalTime) {
        $methodArrivalTime.text('( ' + selectedShippingMethod.estimatedArrivalTime + ' )');
      } else {
        $methodArrivalTime.empty();
      }
      $methodPrice.text(selectedShippingMethod.shippingCost);
    }
    if (isGift) {
      giftMessageSummary.find('.gift-message-summary').text(shipping.giftMessage);
      giftMessageSummary.removeClass('d-none');
    } else {
      giftMessageSummary.addClass('d-none');
    }
  });
  $('body').trigger('shipping:updateShippingSummaryInformation', {
    shipping: shipping,
    order: order
  });
}

/**
 * Update the read-only portion of the shipment display (per PLI)
 * @param {Object} productLineItem - the productLineItem model
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order model
 * @param {Object} [options] - options for updating PLI summary info
 * @param {Object} [options.keepOpen] - if true, prevent changing PLI view mode to 'view'
 */
function updatePLIShippingSummaryInformation(productLineItem, shipping, order, options) {
  var $pli = $('input[value=' + productLineItem.UUID + ']');
  var form = $pli && $pli.length > 0 ? $pli[0].form : null;
  if (!form) return;
  var $viewBlock = $('.view-address-block', form);
  var address = shipping.shippingAddress || {};
  var selectedMethod = shipping.selectedShippingMethod;
  var nameLine = address.firstName ? address.firstName + ' ' : '';
  if (address.lastName) nameLine += address.lastName;
  var address1Line = address.address1;
  var address2Line = address.address2;
  var phoneLine = address.phone;
  var shippingCost = selectedMethod ? selectedMethod.shippingCost : '';
  var methodNameLine = selectedMethod ? selectedMethod.displayName : '';
  var methodArrivalTime = selectedMethod && selectedMethod.estimatedArrivalTime ? '(' + selectedMethod.estimatedArrivalTime + ')' : '';
  var tmpl = $('#pli-shipping-summary-template').clone();
  $('.ship-to-name', tmpl).text(nameLine);
  $('.ship-to-address1', tmpl).text(address1Line);
  $('.ship-to-address2', tmpl).text(address2Line);
  $('.ship-to-city', tmpl).text(address.city);
  if (address.stateCode) {
    $('.ship-to-st', tmpl).text(address.stateCode);
  }
  $('.ship-to-zip', tmpl).text(address.postalCode);
  $('.ship-to-phone', tmpl).text(phoneLine);
  if (!address2Line) {
    $('.ship-to-address2', tmpl).hide();
  }
  if (!phoneLine) {
    $('.ship-to-phone', tmpl).hide();
  }
  if (shipping.selectedShippingMethod) {
    $('.display-name', tmpl).text(methodNameLine);
    $('.arrival-time', tmpl).text(methodArrivalTime);
    $('.price', tmpl).text(shippingCost);
  }
  if (shipping.isGift) {
    $('.gift-message-summary', tmpl).text(shipping.giftMessage);
    var shipment = $('.gift-message-' + shipping.UUID);
    $(shipment).val(shipping.giftMessage);
  } else {
    $('.gift-summary', tmpl).addClass('d-none');
  }
  // checking h5 title shipping to or pickup
  var $shippingAddressLabel = $('.shipping-header-text', tmpl);
  $('body').trigger('shipping:updateAddressLabelText', {
    selectedShippingMethod: selectedMethod,
    resources: order.resources,
    shippingAddressLabel: $shippingAddressLabel
  });
  $viewBlock.html(tmpl.html());
  $('body').trigger('shipping:updatePLIShippingSummaryInformation', {
    productLineItem: productLineItem,
    shipping: shipping,
    order: order,
    options: options
  });
}

/**
 * Update the hidden form values that associate shipping info with product line items
 * @param {Object} productLineItem - the productLineItem model
 * @param {Object} shipping - the shipping (shipment model) model
 */
function updateProductLineItemShipmentUUIDs(productLineItem, shipping) {
  $('input[value=' + productLineItem.UUID + ']').each(function (key, pli) {
    var form = pli.form;
    $('[name=shipmentUUID]', form).val(shipping.UUID);
    $('[name=originalShipmentUUID]', form).val(shipping.UUID);
    $(form).closest('.card').attr('data-shipment-uuid', shipping.UUID);
  });
  $('body').trigger('shipping:updateProductLineItemShipmentUUIDs', {
    productLineItem: productLineItem,
    shipping: shipping
  });
}

/**
 * Update the shipping UI for a single shipping info (shipment model)
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order/basket model
 * @param {Object} customer - the customer model
 * @param {Object} [options] - options for updating PLI summary info
 * @param {Object} [options.keepOpen] - if true, prevent changing PLI view mode to 'view'
 */
function updateShippingInformation(shipping, order, customer, options) {
  // First copy over shipmentUUIDs from response, to each PLI form
  order.shipping.forEach(function (aShipping) {
    aShipping.productLineItems.items.forEach(function (productLineItem) {
      updateProductLineItemShipmentUUIDs(productLineItem, aShipping);
    });
  });

  // Now update shipping information, based on those associations
  updateShippingMethods(shipping);
  updateShippingAddressFormValues(shipping);
  updateShippingSummaryInformation(shipping, order);

  // And update the PLI-based summary information as well
  shipping.productLineItems.items.forEach(function (productLineItem) {
    updateShippingAddressSelector(productLineItem, shipping, order, customer);
    updatePLIShippingSummaryInformation(productLineItem, shipping, order, options);
  });
  $('body').trigger('shipping:updateShippingInformation', {
    order: order,
    shipping: shipping,
    customer: customer,
    options: options
  });
}

/**
 * Update the checkout state (single vs. multi-ship)
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updateMultiShipInformation(order) {
  var $checkoutMain = $('#checkout-main');
  var $checkbox = $('[name=usingMultiShipping]');
  var $submitShippingBtn = $('button.submit-shipping');
  $('.shipping-error .alert-danger').remove();
  if (order.usingMultiShipping) {
    $checkoutMain.addClass('multi-ship');
    $checkbox.prop('checked', true);
  } else {
    $checkoutMain.removeClass('multi-ship');
    $checkbox.prop('checked', null);
    $submitShippingBtn.prop('disabled', null);
  }
  $('body').trigger('shipping:updateMultiShipInformation', {
    order: order
  });
}

/**
  * Create an alert to display the error message
  * @param {Object} message - Error message to display
  */
function createErrorNotification(message) {
  var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' + 'fade show" role="alert">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + message + '</div>';
  $('.shipping-error').append(errorHtml);
  scrollAnimate($('.shipping-error'));
}

/**
 * Handle response from the server for valid or invalid form fields.
 * @param {Object} defer - the deferred object which will resolve on success or reject.
 * @param {Object} data - the response data with the invalid form fields or
 *  valid model data.
 */
function shippingFormResponse(defer, data) {
  var isMultiShip = $('#checkout-main').hasClass('multi-ship');
  var formSelector = isMultiShip ? '.multi-shipping .active form' : '.single-shipping form';

  // highlight fields with errors
  if (data.error) {
    if (data.fieldErrors.length) {
      data.fieldErrors.forEach(function (error) {
        if (Object.keys(error).length) {
          formHelpers.loadFormErrors(formSelector, error);
        }
      });
      defer.reject(data);
    }
    if (data.serverErrors && data.serverErrors.length) {
      $.each(data.serverErrors, function (index, element) {
        createErrorNotification(element);
      });
      defer.reject(data);
    }
    if (data.cartError) {
      window.location.href = data.redirectUrl;
      defer.reject();
    }
  } else {
    // Populate the Address Summary

    $('body').trigger('checkout:updateCheckoutView', {
      order: data.order,
      customer: data.customer
    });
    scrollAnimate($('.payment-form'));
    defer.resolve(data);
  }
}
/**
 * Clear out all the shipping form values and select the new address in the drop down
 * @param {Object} order - the order object
 */
function clearShippingForms(order) {
  order.shipping.forEach(function (shipping) {
    $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
      var form = el.form;
      if (!form) return;
      $('input[name$=_firstName]', form).val('');
      $('input[name$=_lastName]', form).val('');
      $('input[name$=_address1]', form).val('');
      $('input[name$=_address2]', form).val('');
      $('input[name$=_city]', form).val('');
      $('input[name$=_postalCode]', form).val('');
      $('select[name$=_stateCode],input[name$=_stateCode]', form).val('');
      $('select[name$=_country]', form).val('');
      $('input[name$=_phone]', form).val('');
      $('input[name$=_isGift]', form).prop('checked', false);
      $('textarea[name$=_giftMessage]', form).val('');
      $(form).find('.gift-message').addClass('d-none');
      $(form).attr('data-address-mode', 'new');
      var addressSelectorDropDown = $('.addressSelector option[value=new]', form);
      $(addressSelectorDropDown).prop('selected', true);
    });
  });
  $('body').trigger('shipping:clearShippingForms', {
    order: order
  });
}

/**
 * Does Ajax call to create a server-side shipment w/ pliUUID & URL
 * @param {string} url - string representation of endpoint URL
 * @param {Object} shipmentData - product line item UUID
 * @returns {Object} - promise value for async call
 */
function createNewShipment(url, shipmentData) {
  $.spinner().start();
  return $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    data: shipmentData
  });
}

/**
 * Does Ajax call to select shipping method
 * @param {string} url - string representation of endpoint URL
 * @param {Object} urlParams - url params
 * @param {Object} el - element that triggered this call
 */
function selectShippingMethodAjax(url, urlParams, el) {
  $.spinner().start();
  $('body').trigger('checkout:beforeShippingMethodSelected');
  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    data: urlParams
  }).done(function (data) {
    if (data.error) {
      window.location.href = data.redirectUrl;
    } else {
      $('body').trigger('checkout:updateCheckoutView', {
        order: data.order,
        customer: data.customer,
        options: {
          keepOpen: true
        },
        urlParams: urlParams
      });
      $('body').trigger('checkout:postUpdateCheckoutView', {
        el: el
      });
    }
    $('body').trigger('checkout:shippingMethodSelected', data);
    $.spinner().stop();
  }).fail(function () {
    $.spinner().stop();
  });
}

/**
 * Hide and show to appropriate elements to show the multi ship shipment cards in the enter view
 * @param {jQuery} element - The shipping content
 */
function enterMultishipView(element) {
  element.find('.btn-enter-multi-ship').removeClass('d-none');
  element.find('.view-address-block').addClass('d-none');
  element.find('.shipping-address').addClass('d-none');
  element.find('.btn-save-multi-ship.save-shipment').addClass('d-none');
  element.find('.btn-edit-multi-ship').addClass('d-none');
  element.find('.multi-ship-address-actions').addClass('d-none');
}

/**
 * Hide and show to appropriate elements to show the multi ship shipment cards in the view mode
 * @param {jQuery} element - The shipping content
 */
function viewMultishipAddress(element) {
  element.find('.view-address-block').removeClass('d-none');
  element.find('.btn-edit-multi-ship').removeClass('d-none');
  element.find('.shipping-address').addClass('d-none');
  element.find('.btn-save-multi-ship.save-shipment').addClass('d-none');
  element.find('.btn-enter-multi-ship').addClass('d-none');
  element.find('.multi-ship-address-actions').addClass('d-none');
}

/**
 * Hide and show to appropriate elements that allows the user to edit multi ship address information
 * @param {jQuery} element - The shipping content
 */
function editMultiShipAddress(element) {
  // Show
  element.find('.shipping-address').removeClass('d-none');
  element.find('.btn-save-multi-ship.save-shipment').removeClass('d-none');

  // Hide
  element.find('.view-address-block').addClass('d-none');
  element.find('.btn-enter-multi-ship').addClass('d-none');
  element.find('.btn-edit-multi-ship').addClass('d-none');
  element.find('.multi-ship-address-actions').addClass('d-none');
  $('body').trigger('shipping:editMultiShipAddress', {
    element: element,
    form: element.find('.shipping-form')
  });
}

/**
 * perform the proper actions once a user has clicked enter address or edit address for a shipment
 * @param {jQuery} element - The shipping content
 * @param {string} mode - the address mode
 */
function editOrEnterMultiShipInfo(element, mode) {
  var form = $(element).closest('form');
  var root = $(element).closest('.shipping-content');
  $('body').trigger('shipping:updateDataAddressMode', {
    form: form,
    mode: mode
  });
  editMultiShipAddress(root);
  var addressInfo = addressHelpers.methods.getAddressFieldsFromUI(form);
  var savedState = {
    UUID: $('input[name=shipmentUUID]', form).val(),
    shippingAddress: addressInfo
  };
  root.data('saved-state', JSON.stringify(savedState));
}
module.exports = {
  methods: {
    updateShippingAddressSelector: updateShippingAddressSelector,
    updateShippingAddressFormValues: updateShippingAddressFormValues,
    updateShippingMethods: updateShippingMethods,
    updateShippingSummaryInformation: updateShippingSummaryInformation,
    updatePLIShippingSummaryInformation: updatePLIShippingSummaryInformation,
    updateProductLineItemShipmentUUIDs: updateProductLineItemShipmentUUIDs,
    updateShippingInformation: updateShippingInformation,
    updateMultiShipInformation: updateMultiShipInformation,
    shippingFormResponse: shippingFormResponse,
    createNewShipment: createNewShipment,
    selectShippingMethodAjax: selectShippingMethodAjax,
    updateShippingMethodList: updateShippingMethodList,
    clearShippingForms: clearShippingForms,
    editMultiShipAddress: editMultiShipAddress,
    editOrEnterMultiShipInfo: editOrEnterMultiShipInfo,
    createErrorNotification: createErrorNotification,
    viewMultishipAddress: viewMultishipAddress
  },
  selectShippingMethod: function selectShippingMethod() {
    var baseObj = this;
    $('.shipping-method-list').change(function () {
      var $shippingForm = $(this).parents('form');
      var methodID = $(':checked', this).val();
      var shipmentUUID = $shippingForm.find('[name=shipmentUUID]').val();
      var urlParams = addressHelpers.methods.getAddressFieldsFromUI($shippingForm);
      urlParams.shipmentUUID = shipmentUUID;
      urlParams.methodID = methodID;
      urlParams.isGift = $shippingForm.find('.gift').prop('checked');
      urlParams.giftMessage = $shippingForm.find('textarea[name$=_giftMessage]').val();
      var url = $(this).data('select-shipping-method-url');
      if (baseObj.methods && baseObj.methods.selectShippingMethodAjax) {
        baseObj.methods.selectShippingMethodAjax(url, urlParams, $(this));
      } else {
        selectShippingMethodAjax(url, urlParams, $(this));
      }
    });
  },
  toggleMultiship: function toggleMultiship() {
    var baseObj = this;
    $('input[name="usingMultiShipping"]').on('change', function () {
      var url = $('.multi-shipping-checkbox-block form').attr('action');
      var usingMultiShip = this.checked;
      $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
          usingMultiShip: usingMultiShip
        },
        success: function success(response) {
          if (response.error) {
            window.location.href = response.redirectUrl;
          } else {
            $('body').trigger('checkout:updateCheckoutView', {
              order: response.order,
              customer: response.customer
            });
            if ($('#checkout-main').data('customer-type') === 'guest') {
              if (baseObj.methods && baseObj.methods.clearShippingForms) {
                baseObj.methods.clearShippingForms(response.order);
              } else {
                clearShippingForms(response.order);
              }
            } else {
              response.order.shipping.forEach(function (shipping) {
                $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
                  var form = el.form;
                  if (!form) return;
                  $(form).attr('data-address-mode', 'edit');
                  var addressSelectorDropDown = $(form).find('.addressSelector option[value="ab_' + shipping.matchingAddressId + '"]');
                  $(addressSelectorDropDown).prop('selected', true);
                  $('input[name$=_isGift]', form).prop('checked', false);
                  $('textarea[name$=_giftMessage]', form).val('');
                  $(form).find('.gift-message').addClass('d-none');
                });
              });
            }
            if (usingMultiShip) {
              $('body').trigger('shipping:selectMultiShipping', {
                data: response
              });
            } else {
              $('body').trigger('shipping:selectSingleShipping', {
                data: response
              });
            }
          }
          $.spinner().stop();
        },
        error: function error() {
          $.spinner().stop();
        }
      });
    });
  },
  selectSingleShipping: function selectSingleShipping() {
    $('body').on('shipping:selectSingleShipping', function () {
      $('.single-shipping .shipping-address').removeClass('d-none');
    });
  },
  selectMultiShipping: function selectMultiShipping() {
    var baseObj = this;
    $('body').on('shipping:selectMultiShipping', function (e, data) {
      $('.multi-shipping .shipping-address').addClass('d-none');
      data.data.order.shipping.forEach(function (shipping) {
        var element = $('.multi-shipping .card[data-shipment-uuid="' + shipping.UUID + '"]');
        if (shipping.shippingAddress) {
          if (baseObj.methods && baseObj.methods.viewMultishipAddress) {
            baseObj.methods.viewMultishipAddress($(element));
          } else {
            viewMultishipAddress($(element));
          }
        } else {
          /* eslint-disable no-lonely-if */
          if (baseObj.methods && baseObj.methods.enterMultishipView) {
            baseObj.methods.enterMultishipView($(element));
          } else {
            enterMultishipView($(element));
          }
          /* eslint-enable no-lonely-if */
        }
      });
    });
  },

  selectSingleShipAddress: function selectSingleShipAddress() {
    $('.single-shipping .addressSelector').on('change', function () {
      var form = $(this).parents('form')[0];
      var selectedOption = $('option:selected', this);
      var attrs = selectedOption.data();
      var shipmentUUID = selectedOption[0].value;
      var originalUUID = $('input[name=shipmentUUID]', form).val();
      var element;
      Object.keys(attrs).forEach(function (attr) {
        element = attr === 'countryCode' ? 'country' : attr;
        $('[name$=' + element + ']', form).val(attrs[attr]);
      });
      $('[name$=stateCode]', form).trigger('change');
      if (shipmentUUID === 'new') {
        $(form).attr('data-address-mode', 'new');
        $(form).find('.shipping-address-block').removeClass('d-none');
      } else if (shipmentUUID === originalUUID) {
        $(form).attr('data-address-mode', 'shipment');
      } else if (shipmentUUID.indexOf('ab_') === 0) {
        $(form).attr('data-address-mode', 'customer');
      } else {
        $(form).attr('data-address-mode', 'edit');
      }
    });
  },
  selectMultiShipAddress: function selectMultiShipAddress() {
    var baseObj = this;
    $('.multi-shipping .addressSelector').on('change', function () {
      var form = $(this).closest('form');
      var selectedOption = $('option:selected', this);
      var attrs = selectedOption.data();
      var shipmentUUID = selectedOption[0].value;
      var originalUUID = $('input[name=shipmentUUID]', form).val();
      var pliUUID = $('input[name=productLineItemUUID]', form).val();
      var createNewShipmentScoped = baseObj.methods && baseObj.methods.createNewShipment ? baseObj.methods.createNewShipment : createNewShipment;
      var element;
      Object.keys(attrs).forEach(function (attr) {
        if (attr === 'isGift') {
          $('[name$=' + attr + ']', form).prop('checked', attrs[attr]);
          $('[name$=' + attr + ']', form).trigger('change');
        } else {
          element = attr === 'countryCode' ? 'country' : attr;
          $('[name$=' + element + ']', form).val(attrs[attr]);
        }
      });
      if (shipmentUUID === 'new' && pliUUID) {
        var createShipmentUrl = $(this).attr('data-create-shipment-url');
        createNewShipmentScoped(createShipmentUrl, {
          productLineItemUUID: pliUUID
        }).done(function (response) {
          $.spinner().stop();
          if (response.error) {
            if (response.redirectUrl) {
              window.location.href = response.redirectUrl;
            }
            return;
          }
          $('body').trigger('checkout:updateCheckoutView', {
            order: response.order,
            customer: response.customer,
            options: {
              keepOpen: true
            }
          });
          $(form).attr('data-address-mode', 'new');
        }).fail(function () {
          $.spinner().stop();
        });
      } else if (shipmentUUID === originalUUID) {
        $('select[name$=stateCode]', form).trigger('change');
        $(form).attr('data-address-mode', 'shipment');
      } else if (shipmentUUID.indexOf('ab_') === 0) {
        var url = $(form).attr('action');
        var serializedData = $(form).serialize();
        createNewShipmentScoped(url, serializedData).done(function (response) {
          $.spinner().stop();
          if (response.error) {
            if (response.redirectUrl) {
              window.location.href = response.redirectUrl;
            }
            return;
          }
          $('body').trigger('checkout:updateCheckoutView', {
            order: response.order,
            customer: response.customer,
            options: {
              keepOpen: true
            }
          });
          $(form).attr('data-address-mode', 'customer');
          var $rootEl = $(form).closest('.shipping-content');
          editMultiShipAddress($rootEl);
        }).fail(function () {
          $.spinner().stop();
        });
      } else {
        var updatePLIShipmentUrl = $(form).attr('action');
        var serializedAddress = $(form).serialize();
        createNewShipmentScoped(updatePLIShipmentUrl, serializedAddress).done(function (response) {
          $.spinner().stop();
          if (response.error) {
            if (response.redirectUrl) {
              window.location.href = response.redirectUrl;
            }
            return;
          }
          $('body').trigger('checkout:updateCheckoutView', {
            order: response.order,
            customer: response.customer,
            options: {
              keepOpen: true
            }
          });
          $(form).attr('data-address-mode', 'edit');
        }).fail(function () {
          $.spinner().stop();
        });
      }
    });
  },
  updateShippingList: function updateShippingList() {
    var baseObj = this;
    $('select[name$="shippingAddress_addressFields_states_stateCode"]').on('change', function (e) {
      if (baseObj.methods && baseObj.methods.updateShippingMethodList) {
        baseObj.methods.updateShippingMethodList($(e.currentTarget.form));
      } else {
        updateShippingMethodList($(e.currentTarget.form));
      }
    });
  },
  updateDataAddressMode: function updateDataAddressMode() {
    $('body').on('shipping:updateDataAddressMode', function (e, data) {
      $(data.form).attr('data-address-mode', data.mode);
    });
  },
  enterMultiShipInfo: function enterMultiShipInfo() {
    var baseObj = this;
    $('.btn-enter-multi-ship').on('click', function (e) {
      e.preventDefault();
      if (baseObj.methods && baseObj.methods.editOrEnterMultiShipInfo) {
        baseObj.methods.editOrEnterMultiShipInfo($(this), 'new');
      } else {
        editOrEnterMultiShipInfo($(this), 'new');
      }
    });
  },
  editMultiShipInfo: function editMultiShipInfo() {
    var baseObj = this;
    $('.btn-edit-multi-ship').on('click', function (e) {
      e.preventDefault();
      if (baseObj.methods && baseObj.methods.editOrEnterMultiShipInfo) {
        baseObj.methods.editOrEnterMultiShipInfo($(this), 'edit');
      } else {
        editOrEnterMultiShipInfo($(this), 'edit');
      }
    });
  },
  saveMultiShipInfo: function saveMultiShipInfo() {
    var baseObj = this;
    $('.btn-save-multi-ship').on('click', function (e) {
      e.preventDefault();

      // Save address to checkoutAddressBook
      var form = $(this).closest('form');
      var $rootEl = $(this).closest('.shipping-content');
      var data = $(form).serialize();
      var url = $(form).attr('action');
      $rootEl.spinner().start();
      $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data
      }).done(function (response) {
        formHelpers.clearPreviousErrors(form);
        if (response.error) {
          if (response.fieldErrors && response.fieldErrors.length) {
            response.fieldErrors.forEach(function (error) {
              if (Object.keys(error).length) {
                formHelpers.loadFormErrors(form, error);
              }
            });
          } else if (response.serverErrors && response.serverErrors.length) {
            $.each(response.serverErrors, function (index, element) {
              createErrorNotification(element);
            });
          } else if (response.redirectUrl) {
            window.location.href = response.redirectUrl;
          }
        } else {
          // Update UI from response
          $('body').trigger('checkout:updateCheckoutView', {
            order: response.order,
            customer: response.customer
          });
          if (baseObj.methods && baseObj.methods.viewMultishipAddress) {
            baseObj.methods.viewMultishipAddress($rootEl);
          } else {
            viewMultishipAddress($rootEl);
          }
        }
        if (response.order && response.order.shippable) {
          $('button.submit-shipping').attr('disabled', null);
        }
        $rootEl.spinner().stop();
      }).fail(function (err) {
        if (err.responseJSON.redirectUrl) {
          window.location.href = err.responseJSON.redirectUrl;
        }
        $rootEl.spinner().stop();
      });
      return false;
    });
  },
  cancelMultiShipAddress: function cancelMultiShipAddress() {
    var baseObj = this;
    $('.btn-cancel-multi-ship-address').on('click', function (e) {
      e.preventDefault();
      var form = $(this).closest('form');
      var $rootEl = $(this).closest('.shipping-content');
      var restoreState = $rootEl.data('saved-state');

      // Should clear out changes / restore previous state
      if (restoreState) {
        var restoreStateObj = JSON.parse(restoreState);
        var originalStateCode = restoreStateObj.shippingAddress.stateCode;
        var stateCode = $('[name$=_stateCode]', form).val();
        if (baseObj.methods && baseObj.methods.updateShippingAddressFormValues) {
          baseObj.methods.updateShippingAddressFormValues(restoreStateObj);
        } else {
          updateShippingAddressFormValues(restoreStateObj);
        }
        if (stateCode !== originalStateCode) {
          $('[data-action=save]', form).trigger('click');
        } else {
          $(form).attr('data-address-mode', 'edit');
          if (baseObj.methods && baseObj.methods.editMultiShipAddress) {
            baseObj.methods.editMultiShipAddress($rootEl);
          } else {
            editMultiShipAddress($rootEl);
          }
        }
      }
      return false;
    });
  },
  isGift: function isGift() {
    $('.gift').on('change', function (e) {
      e.preventDefault();
      var form = $(this).closest('form');
      if (this.checked) {
        $(form).find('.gift-message').removeClass('d-none');
      } else {
        $(form).find('.gift-message').addClass('d-none');
        $(form).find('.gift-message').val('');
      }
    });
  }
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js":
/*!*************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js ***!
  \*************************************************************************************************************************************/
/***/ (function(module) {



/**
 * updates the totals summary
 * @param {Array} totals - the totals data
 */
function updateTotals(totals) {
  $('.shipping-total-cost').text(totals.totalShippingCost);
  $('.tax-total').text(totals.totalTax);
  $('.sub-total').text(totals.subTotal);
  $('.grand-total-sum').text(totals.grandTotal);
  if (totals.orderLevelDiscountTotal.value > 0) {
    $('.order-discount').removeClass('hide-order-discount');
    $('.order-discount-total').text('- ' + totals.orderLevelDiscountTotal.formatted);
  } else {
    $('.order-discount').addClass('hide-order-discount');
  }
  if (totals.shippingLevelDiscountTotal.value > 0) {
    $('.shipping-discount').removeClass('hide-shipping-discount');
    $('.shipping-discount-total').text('- ' + totals.shippingLevelDiscountTotal.formatted);
  } else {
    $('.shipping-discount').addClass('hide-shipping-discount');
  }
}

/**
 * updates the order product shipping summary for an order model
 * @param {Object} order - the order model
 */
function updateOrderProductSummaryInformation(order) {
  var $productSummary = $('<div />');
  order.shipping.forEach(function (shipping) {
    shipping.productLineItems.items.forEach(function (lineItem) {
      var pli = $('[data-product-line-item=' + lineItem.UUID + ']');
      $productSummary.append(pli);
    });
    var address = shipping.shippingAddress || {};
    var selectedMethod = shipping.selectedShippingMethod;
    var nameLine = address.firstName ? address.firstName + ' ' : '';
    if (address.lastName) nameLine += address.lastName;
    var address1Line = address.address1;
    var address2Line = address.address2;
    var phoneLine = address.phone;
    var shippingCost = selectedMethod ? selectedMethod.shippingCost : '';
    var methodNameLine = selectedMethod ? selectedMethod.displayName : '';
    var methodArrivalTime = selectedMethod && selectedMethod.estimatedArrivalTime ? '( ' + selectedMethod.estimatedArrivalTime + ' )' : '';
    var tmpl = $('#pli-shipping-summary-template').clone();
    if (shipping.productLineItems.items && shipping.productLineItems.items.length > 1) {
      $('h5 > span').text(' - ' + shipping.productLineItems.items.length + ' ' + order.resources.items);
    } else {
      $('h5 > span').text('');
    }
    var stateRequiredAttr = $('#shippingState').attr('required');
    var isRequired = stateRequiredAttr !== undefined && stateRequiredAttr !== false;
    var stateExists = shipping.shippingAddress && shipping.shippingAddress.stateCode ? shipping.shippingAddress.stateCode : false;
    var stateBoolean = false;
    if (isRequired && stateExists || !isRequired) {
      stateBoolean = true;
    }
    var shippingForm = $('.multi-shipping input[name="shipmentUUID"][value="' + shipping.UUID + '"]').parent();
    if (shipping.shippingAddress && shipping.shippingAddress.firstName && shipping.shippingAddress.address1 && shipping.shippingAddress.city && stateBoolean && shipping.shippingAddress.countryCode && (shipping.shippingAddress.phone || shipping.productLineItems.items[0].fromStoreId)) {
      $('.ship-to-name', tmpl).text(nameLine);
      $('.ship-to-address1', tmpl).text(address1Line);
      $('.ship-to-address2', tmpl).text(address2Line);
      $('.ship-to-city', tmpl).text(address.city);
      if (address.stateCode) {
        $('.ship-to-st', tmpl).text(address.stateCode);
      }
      $('.ship-to-zip', tmpl).text(address.postalCode);
      $('.ship-to-phone', tmpl).text(phoneLine);
      if (!address2Line) {
        $('.ship-to-address2', tmpl).hide();
      }
      if (!phoneLine) {
        $('.ship-to-phone', tmpl).hide();
      }
      shippingForm.find('.ship-to-message').text('');
    } else {
      shippingForm.find('.ship-to-message').text(order.resources.addressIncomplete);
    }
    if (shipping.isGift) {
      $('.gift-message-summary', tmpl).text(shipping.giftMessage);
    } else {
      $('.gift-summary', tmpl).addClass('d-none');
    }

    // checking h5 title shipping to or pickup
    var $shippingAddressLabel = $('.shipping-header-text', tmpl);
    $('body').trigger('shipping:updateAddressLabelText', {
      selectedShippingMethod: selectedMethod,
      resources: order.resources,
      shippingAddressLabel: $shippingAddressLabel
    });
    if (shipping.selectedShippingMethod) {
      $('.display-name', tmpl).text(methodNameLine);
      $('.arrival-time', tmpl).text(methodArrivalTime);
      $('.price', tmpl).text(shippingCost);
    }
    var $shippingSummary = $('<div class="multi-shipping" data-shipment-summary="' + shipping.UUID + '" />');
    $shippingSummary.html(tmpl.html());
    $productSummary.append($shippingSummary);
  });
  $('.product-summary-block').html($productSummary.html());

  // Also update the line item prices, as they might have been altered
  $('.grand-total-price').text(order.totals.subTotal);
  order.items.items.forEach(function (item) {
    if (item.priceTotal && item.priceTotal.renderedPrice) {
      $('.item-total-' + item.UUID).empty().append(item.priceTotal.renderedPrice);
    }
  });
}
module.exports = {
  updateTotals: updateTotals,
  updateOrderProductSummaryInformation: updateOrderProductSummaryInformation
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js":
/*!**************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js ***!
  \**************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var Cleave = (__webpack_require__(/*! cleave.js */ "./node_modules/cleave.js/dist/cleave-esm.js")["default"]);
module.exports = {
  handleCreditCardNumber: function handleCreditCardNumber(cardFieldSelector, cardTypeSelector) {
    var cleave = new Cleave(cardFieldSelector, {
      creditCard: true,
      onCreditCardTypeChanged: function onCreditCardTypeChanged(type) {
        var creditCardTypes = {
          visa: 'Visa',
          mastercard: 'Master Card',
          amex: 'Amex',
          discover: 'Discover',
          unknown: 'Unknown'
        };
        var cardType = creditCardTypes[Object.keys(creditCardTypes).indexOf(type) > -1 ? type : 'unknown'];
        $(cardTypeSelector).val(cardType);
        $('.card-number-wrapper').attr('data-type', type);
        if (type === 'visa' || type === 'mastercard' || type === 'discover') {
          $('#securityCode').attr('maxlength', 3);
        } else {
          $('#securityCode').attr('maxlength', 4);
        }
      }
    });
    $(cardFieldSelector).data('cleave', cleave);
  },
  serializeData: function serializeData(form) {
    var serializedArray = form.serializeArray();
    serializedArray.forEach(function (item) {
      if (item.name.indexOf('cardNumber') > -1) {
        item.value = $('#cardNumber').data('cleave').getRawValue(); // eslint-disable-line
      }
    });

    return $.param(serializedArray);
  }
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/errorNotification.js":
/*!*************************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/errorNotification.js ***!
  \*************************************************************************************************************************************************/
/***/ (function(module) {



module.exports = function (element, message) {
  var errorHtml = '<div class="alert alert-danger alert-dismissible ' + 'fade show" role="alert">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + message + '</div>';
  $(element).append(errorHtml);
};

/***/ }),

/***/ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js":
/*!*********************************************************************************************************************************************!*\
  !*** ./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js ***!
  \*********************************************************************************************************************************************/
/***/ (function(module) {



module.exports = function (element) {
  var position = element && element.length ? element.offset().top : 0;
  $('html, body').animate({
    scrollTop: position
  }, 500);
  if (!element) {
    $('.logo-home').focus();
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

/***/ }),

/***/ "./node_modules/cleave.js/dist/cleave-esm.js":
/*!***************************************************!*\
  !*** ./node_modules/cleave.js/dist/cleave-esm.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};
var NumeralFormatter = function NumeralFormatter(numeralDecimalMark, numeralIntegerScale, numeralDecimalScale, numeralThousandsGroupStyle, numeralPositiveOnly, stripLeadingZeroes, prefix, signBeforePrefix, tailPrefix, delimiter) {
  var owner = this;
  owner.numeralDecimalMark = numeralDecimalMark || '.';
  owner.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
  owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
  owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
  owner.numeralPositiveOnly = !!numeralPositiveOnly;
  owner.stripLeadingZeroes = stripLeadingZeroes !== false;
  owner.prefix = prefix || prefix === '' ? prefix : '';
  owner.signBeforePrefix = !!signBeforePrefix;
  owner.tailPrefix = !!tailPrefix;
  owner.delimiter = delimiter || delimiter === '' ? delimiter : ',';
  owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
};
NumeralFormatter.groupStyle = {
  thousand: 'thousand',
  lakh: 'lakh',
  wan: 'wan',
  none: 'none'
};
NumeralFormatter.prototype = {
  getRawValue: function getRawValue(value) {
    return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
  },
  format: function format(value) {
    var owner = this,
      parts,
      partSign,
      partSignAndPrefix,
      partInteger,
      partDecimal = '';

    // strip alphabet letters
    value = value.replace(/[A-Za-z]/g, '')
    // replace the first decimal mark with reserved placeholder
    .replace(owner.numeralDecimalMark, 'M')

    // strip non numeric letters except minus and "M"
    // this is to ensure prefix has been stripped
    .replace(/[^\dM-]/g, '')

    // replace the leading minus with reserved placeholder
    .replace(/^\-/, 'N')

    // strip the other minus sign (if present)
    .replace(/\-/g, '')

    // replace the minus sign (if present)
    .replace('N', owner.numeralPositiveOnly ? '' : '-')

    // replace decimal mark
    .replace('M', owner.numeralDecimalMark);

    // strip any leading zeros
    if (owner.stripLeadingZeroes) {
      value = value.replace(/^(-)?0+(?=\d)/, '$1');
    }
    partSign = value.slice(0, 1) === '-' ? '-' : '';
    if (typeof owner.prefix != 'undefined') {
      if (owner.signBeforePrefix) {
        partSignAndPrefix = partSign + owner.prefix;
      } else {
        partSignAndPrefix = owner.prefix + partSign;
      }
    } else {
      partSignAndPrefix = partSign;
    }
    partInteger = value;
    if (value.indexOf(owner.numeralDecimalMark) >= 0) {
      parts = value.split(owner.numeralDecimalMark);
      partInteger = parts[0];
      partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
    }
    if (partSign === '-') {
      partInteger = partInteger.slice(1);
    }
    if (owner.numeralIntegerScale > 0) {
      partInteger = partInteger.slice(0, owner.numeralIntegerScale);
    }
    switch (owner.numeralThousandsGroupStyle) {
      case NumeralFormatter.groupStyle.lakh:
        partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);
        break;
      case NumeralFormatter.groupStyle.wan:
        partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);
        break;
      case NumeralFormatter.groupStyle.thousand:
        partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);
        break;
    }
    if (owner.tailPrefix) {
      return partSign + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '') + owner.prefix;
    }
    return partSignAndPrefix + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
  }
};
var NumeralFormatter_1 = NumeralFormatter;
var DateFormatter = function DateFormatter(datePattern, dateMin, dateMax) {
  var owner = this;
  owner.date = [];
  owner.blocks = [];
  owner.datePattern = datePattern;
  owner.dateMin = dateMin.split('-').reverse().map(function (x) {
    return parseInt(x, 10);
  });
  if (owner.dateMin.length === 2) owner.dateMin.unshift(0);
  owner.dateMax = dateMax.split('-').reverse().map(function (x) {
    return parseInt(x, 10);
  });
  if (owner.dateMax.length === 2) owner.dateMax.unshift(0);
  owner.initBlocks();
};
DateFormatter.prototype = {
  initBlocks: function initBlocks() {
    var owner = this;
    owner.datePattern.forEach(function (value) {
      if (value === 'Y') {
        owner.blocks.push(4);
      } else {
        owner.blocks.push(2);
      }
    });
  },
  getISOFormatDate: function getISOFormatDate() {
    var owner = this,
      date = owner.date;
    return date[2] ? date[2] + '-' + owner.addLeadingZero(date[1]) + '-' + owner.addLeadingZero(date[0]) : '';
  },
  getBlocks: function getBlocks() {
    return this.blocks;
  },
  getValidatedDate: function getValidatedDate(value) {
    var owner = this,
      result = '';
    value = value.replace(/[^\d]/g, '');
    owner.blocks.forEach(function (length, index) {
      if (value.length > 0) {
        var sub = value.slice(0, length),
          sub0 = sub.slice(0, 1),
          rest = value.slice(length);
        switch (owner.datePattern[index]) {
          case 'd':
            if (sub === '00') {
              sub = '01';
            } else if (parseInt(sub0, 10) > 3) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > 31) {
              sub = '31';
            }
            break;
          case 'm':
            if (sub === '00') {
              sub = '01';
            } else if (parseInt(sub0, 10) > 1) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > 12) {
              sub = '12';
            }
            break;
        }
        result += sub;

        // update remaining string
        value = rest;
      }
    });
    return this.getFixedDateString(result);
  },
  getFixedDateString: function getFixedDateString(value) {
    var owner = this,
      datePattern = owner.datePattern,
      date = [],
      dayIndex = 0,
      monthIndex = 0,
      yearIndex = 0,
      dayStartIndex = 0,
      monthStartIndex = 0,
      yearStartIndex = 0,
      day,
      month,
      year,
      fullYearDone = false;

    // mm-dd || dd-mm
    if (value.length === 4 && datePattern[0].toLowerCase() !== 'y' && datePattern[1].toLowerCase() !== 'y') {
      dayStartIndex = datePattern[0] === 'd' ? 0 : 2;
      monthStartIndex = 2 - dayStartIndex;
      day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      date = this.getFixedDate(day, month, 0);
    }

    // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd
    if (value.length === 8) {
      datePattern.forEach(function (type, index) {
        switch (type) {
          case 'd':
            dayIndex = index;
            break;
          case 'm':
            monthIndex = index;
            break;
          default:
            yearIndex = index;
            break;
        }
      });
      yearStartIndex = yearIndex * 2;
      dayStartIndex = dayIndex <= yearIndex ? dayIndex * 2 : dayIndex * 2 + 2;
      monthStartIndex = monthIndex <= yearIndex ? monthIndex * 2 : monthIndex * 2 + 2;
      day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);
      fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;
      date = this.getFixedDate(day, month, year);
    }

    // mm-yy || yy-mm
    if (value.length === 4 && (datePattern[0] === 'y' || datePattern[1] === 'y')) {
      monthStartIndex = datePattern[0] === 'm' ? 0 : 2;
      yearStartIndex = 2 - monthStartIndex;
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 2), 10);
      fullYearDone = value.slice(yearStartIndex, yearStartIndex + 2).length === 2;
      date = [0, month, year];
    }

    // mm-yyyy || yyyy-mm
    if (value.length === 6 && (datePattern[0] === 'Y' || datePattern[1] === 'Y')) {
      monthStartIndex = datePattern[0] === 'm' ? 0 : 4;
      yearStartIndex = 2 - 0.5 * monthStartIndex;
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);
      fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;
      date = [0, month, year];
    }
    date = owner.getRangeFixedDate(date);
    owner.date = date;
    var result = date.length === 0 ? value : datePattern.reduce(function (previous, current) {
      switch (current) {
        case 'd':
          return previous + (date[0] === 0 ? '' : owner.addLeadingZero(date[0]));
        case 'm':
          return previous + (date[1] === 0 ? '' : owner.addLeadingZero(date[1]));
        case 'y':
          return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], false) : '');
        case 'Y':
          return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], true) : '');
      }
    }, '');
    return result;
  },
  getRangeFixedDate: function getRangeFixedDate(date) {
    var owner = this,
      datePattern = owner.datePattern,
      dateMin = owner.dateMin || [],
      dateMax = owner.dateMax || [];
    if (!date.length || dateMin.length < 3 && dateMax.length < 3) return date;
    if (datePattern.find(function (x) {
      return x.toLowerCase() === 'y';
    }) && date[2] === 0) return date;
    if (dateMax.length && (dateMax[2] < date[2] || dateMax[2] === date[2] && (dateMax[1] < date[1] || dateMax[1] === date[1] && dateMax[0] < date[0]))) return dateMax;
    if (dateMin.length && (dateMin[2] > date[2] || dateMin[2] === date[2] && (dateMin[1] > date[1] || dateMin[1] === date[1] && dateMin[0] > date[0]))) return dateMin;
    return date;
  },
  getFixedDate: function getFixedDate(day, month, year) {
    day = Math.min(day, 31);
    month = Math.min(month, 12);
    year = parseInt(year || 0, 10);
    if (month < 7 && month % 2 === 0 || month > 8 && month % 2 === 1) {
      day = Math.min(day, month === 2 ? this.isLeapYear(year) ? 29 : 28 : 30);
    }
    return [day, month, year];
  },
  isLeapYear: function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  },
  addLeadingZero: function addLeadingZero(number) {
    return (number < 10 ? '0' : '') + number;
  },
  addLeadingZeroForYear: function addLeadingZeroForYear(number, fullYearMode) {
    if (fullYearMode) {
      return (number < 10 ? '000' : number < 100 ? '00' : number < 1000 ? '0' : '') + number;
    }
    return (number < 10 ? '0' : '') + number;
  }
};
var DateFormatter_1 = DateFormatter;
var TimeFormatter = function TimeFormatter(timePattern, timeFormat) {
  var owner = this;
  owner.time = [];
  owner.blocks = [];
  owner.timePattern = timePattern;
  owner.timeFormat = timeFormat;
  owner.initBlocks();
};
TimeFormatter.prototype = {
  initBlocks: function initBlocks() {
    var owner = this;
    owner.timePattern.forEach(function () {
      owner.blocks.push(2);
    });
  },
  getISOFormatTime: function getISOFormatTime() {
    var owner = this,
      time = owner.time;
    return time[2] ? owner.addLeadingZero(time[0]) + ':' + owner.addLeadingZero(time[1]) + ':' + owner.addLeadingZero(time[2]) : '';
  },
  getBlocks: function getBlocks() {
    return this.blocks;
  },
  getTimeFormatOptions: function getTimeFormatOptions() {
    var owner = this;
    if (String(owner.timeFormat) === '12') {
      return {
        maxHourFirstDigit: 1,
        maxHours: 12,
        maxMinutesFirstDigit: 5,
        maxMinutes: 60
      };
    }
    return {
      maxHourFirstDigit: 2,
      maxHours: 23,
      maxMinutesFirstDigit: 5,
      maxMinutes: 60
    };
  },
  getValidatedTime: function getValidatedTime(value) {
    var owner = this,
      result = '';
    value = value.replace(/[^\d]/g, '');
    var timeFormatOptions = owner.getTimeFormatOptions();
    owner.blocks.forEach(function (length, index) {
      if (value.length > 0) {
        var sub = value.slice(0, length),
          sub0 = sub.slice(0, 1),
          rest = value.slice(length);
        switch (owner.timePattern[index]) {
          case 'h':
            if (parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > timeFormatOptions.maxHours) {
              sub = timeFormatOptions.maxHours + '';
            }
            break;
          case 'm':
          case 's':
            if (parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
              sub = '0' + sub0;
            } else if (parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
              sub = timeFormatOptions.maxMinutes + '';
            }
            break;
        }
        result += sub;

        // update remaining string
        value = rest;
      }
    });
    return this.getFixedTimeString(result);
  },
  getFixedTimeString: function getFixedTimeString(value) {
    var owner = this,
      timePattern = owner.timePattern,
      time = [],
      secondIndex = 0,
      minuteIndex = 0,
      hourIndex = 0,
      secondStartIndex = 0,
      minuteStartIndex = 0,
      hourStartIndex = 0,
      second,
      minute,
      hour;
    if (value.length === 6) {
      timePattern.forEach(function (type, index) {
        switch (type) {
          case 's':
            secondIndex = index * 2;
            break;
          case 'm':
            minuteIndex = index * 2;
            break;
          case 'h':
            hourIndex = index * 2;
            break;
        }
      });
      hourStartIndex = hourIndex;
      minuteStartIndex = minuteIndex;
      secondStartIndex = secondIndex;
      second = parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10);
      minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
      hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);
      time = this.getFixedTime(hour, minute, second);
    }
    if (value.length === 4 && owner.timePattern.indexOf('s') < 0) {
      timePattern.forEach(function (type, index) {
        switch (type) {
          case 'm':
            minuteIndex = index * 2;
            break;
          case 'h':
            hourIndex = index * 2;
            break;
        }
      });
      hourStartIndex = hourIndex;
      minuteStartIndex = minuteIndex;
      second = 0;
      minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
      hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);
      time = this.getFixedTime(hour, minute, second);
    }
    owner.time = time;
    return time.length === 0 ? value : timePattern.reduce(function (previous, current) {
      switch (current) {
        case 's':
          return previous + owner.addLeadingZero(time[2]);
        case 'm':
          return previous + owner.addLeadingZero(time[1]);
        case 'h':
          return previous + owner.addLeadingZero(time[0]);
      }
    }, '');
  },
  getFixedTime: function getFixedTime(hour, minute, second) {
    second = Math.min(parseInt(second || 0, 10), 60);
    minute = Math.min(minute, 60);
    hour = Math.min(hour, 60);
    return [hour, minute, second];
  },
  addLeadingZero: function addLeadingZero(number) {
    return (number < 10 ? '0' : '') + number;
  }
};
var TimeFormatter_1 = TimeFormatter;
var PhoneFormatter = function PhoneFormatter(formatter, delimiter) {
  var owner = this;
  owner.delimiter = delimiter || delimiter === '' ? delimiter : ' ';
  owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
  owner.formatter = formatter;
};
PhoneFormatter.prototype = {
  setFormatter: function setFormatter(formatter) {
    this.formatter = formatter;
  },
  format: function format(phoneNumber) {
    var owner = this;
    owner.formatter.clear();

    // only keep number and +
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

    // strip non-leading +
    phoneNumber = phoneNumber.replace(/^\+/, 'B').replace(/\+/g, '').replace('B', '+');

    // strip delimiter
    phoneNumber = phoneNumber.replace(owner.delimiterRE, '');
    var result = '',
      current,
      validated = false;
    for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
      current = owner.formatter.inputDigit(phoneNumber.charAt(i));

      // has ()- or space inside
      if (/[\s()-]/g.test(current)) {
        result = current;
        validated = true;
      } else {
        if (!validated) {
          result = current;
        }
        // else: over length input
        // it turns to invalid number again
      }
    }

    // strip ()
    // e.g. US: 7161234567 returns (716) 123-4567
    result = result.replace(/[()]/g, '');
    // replace library delimiter with user customized delimiter
    result = result.replace(/[\s-]/g, owner.delimiter);
    return result;
  }
};
var PhoneFormatter_1 = PhoneFormatter;
var CreditCardDetector = {
  blocks: {
    uatp: [4, 5, 6],
    amex: [4, 6, 5],
    diners: [4, 6, 4],
    discover: [4, 4, 4, 4],
    mastercard: [4, 4, 4, 4],
    dankort: [4, 4, 4, 4],
    instapayment: [4, 4, 4, 4],
    jcb15: [4, 6, 5],
    jcb: [4, 4, 4, 4],
    maestro: [4, 4, 4, 4],
    visa: [4, 4, 4, 4],
    mir: [4, 4, 4, 4],
    unionPay: [4, 4, 4, 4],
    general: [4, 4, 4, 4]
  },
  re: {
    // starts with 1; 15 digits, not starts with 1800 (jcb card)
    uatp: /^(?!1800)1\d{0,14}/,
    // starts with 34/37; 15 digits
    amex: /^3[47]\d{0,13}/,
    // starts with 6011/65/644-649; 16 digits
    discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
    // starts with 300-305/309 or 36/38/39; 14 digits
    diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
    // starts with 51-55/2221–2720; 16 digits
    mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
    // starts with 5019/4175/4571; 16 digits
    dankort: /^(5019|4175|4571)\d{0,12}/,
    // starts with 637-639; 16 digits
    instapayment: /^63[7-9]\d{0,13}/,
    // starts with 2131/1800; 15 digits
    jcb15: /^(?:2131|1800)\d{0,11}/,
    // starts with 2131/1800/35; 16 digits
    jcb: /^(?:35\d{0,2})\d{0,12}/,
    // starts with 50/56-58/6304/67; 16 digits
    maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
    // starts with 22; 16 digits
    mir: /^220[0-4]\d{0,12}/,
    // starts with 4; 16 digits
    visa: /^4\d{0,15}/,
    // starts with 62/81; 16 digits
    unionPay: /^(62|81)\d{0,14}/
  },
  getStrictBlocks: function getStrictBlocks(block) {
    var total = block.reduce(function (prev, current) {
      return prev + current;
    }, 0);
    return block.concat(19 - total);
  },
  getInfo: function getInfo(value, strictMode) {
    var blocks = CreditCardDetector.blocks,
      re = CreditCardDetector.re;

    // Some credit card can have up to 19 digits number.
    // Set strictMode to true will remove the 16 max-length restrain,
    // however, I never found any website validate card number like
    // this, hence probably you don't want to enable this option.
    strictMode = !!strictMode;
    for (var key in re) {
      if (re[key].test(value)) {
        var matchedBlocks = blocks[key];
        return {
          type: key,
          blocks: strictMode ? this.getStrictBlocks(matchedBlocks) : matchedBlocks
        };
      }
    }
    return {
      type: 'unknown',
      blocks: strictMode ? this.getStrictBlocks(blocks.general) : blocks.general
    };
  }
};
var CreditCardDetector_1 = CreditCardDetector;
var Util = {
  noop: function noop() {},
  strip: function strip(value, re) {
    return value.replace(re, '');
  },
  getPostDelimiter: function getPostDelimiter(value, delimiter, delimiters) {
    // single delimiter
    if (delimiters.length === 0) {
      return value.slice(-delimiter.length) === delimiter ? delimiter : '';
    }

    // multiple delimiters
    var matchedDelimiter = '';
    delimiters.forEach(function (current) {
      if (value.slice(-current.length) === current) {
        matchedDelimiter = current;
      }
    });
    return matchedDelimiter;
  },
  getDelimiterREByDelimiter: function getDelimiterREByDelimiter(delimiter) {
    return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
  },
  getNextCursorPosition: function getNextCursorPosition(prevPos, oldValue, newValue, delimiter, delimiters) {
    // If cursor was at the end of value, just place it back.
    // Because new value could contain additional chars.
    if (oldValue.length === prevPos) {
      return newValue.length;
    }
    return prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters);
  },
  getPositionOffset: function getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters) {
    var oldRawValue, newRawValue, lengthOffset;
    oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
    newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
    lengthOffset = oldRawValue.length - newRawValue.length;
    return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
  },
  stripDelimiters: function stripDelimiters(value, delimiter, delimiters) {
    var owner = this;

    // single delimiter
    if (delimiters.length === 0) {
      var delimiterRE = delimiter ? owner.getDelimiterREByDelimiter(delimiter) : '';
      return value.replace(delimiterRE, '');
    }

    // multiple delimiters
    delimiters.forEach(function (current) {
      current.split('').forEach(function (letter) {
        value = value.replace(owner.getDelimiterREByDelimiter(letter), '');
      });
    });
    return value;
  },
  headStr: function headStr(str, length) {
    return str.slice(0, length);
  },
  getMaxLength: function getMaxLength(blocks) {
    return blocks.reduce(function (previous, current) {
      return previous + current;
    }, 0);
  },
  // strip prefix
  // Before type  |   After type    |     Return value
  // PEFIX-...    |   PEFIX-...     |     ''
  // PREFIX-123   |   PEFIX-123     |     123
  // PREFIX-123   |   PREFIX-23     |     23
  // PREFIX-123   |   PREFIX-1234   |     1234
  getPrefixStrippedValue: function getPrefixStrippedValue(value, prefix, prefixLength, prevResult, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix) {
    // No prefix
    if (prefixLength === 0) {
      return value;
    }

    // Value is prefix
    if (value === prefix && value !== '') {
      return '';
    }
    if (signBeforePrefix && value.slice(0, 1) == '-') {
      var prev = prevResult.slice(0, 1) == '-' ? prevResult.slice(1) : prevResult;
      return '-' + this.getPrefixStrippedValue(value.slice(1), prefix, prefixLength, prev, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix);
    }

    // Pre result prefix string does not match pre-defined prefix
    if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix) {
      // Check if the first time user entered something
      if (noImmediatePrefix && !prevResult && value) return value;
      return '';
    } else if (prevResult.slice(-prefixLength) !== prefix && tailPrefix) {
      // Check if the first time user entered something
      if (noImmediatePrefix && !prevResult && value) return value;
      return '';
    }
    var prevValue = this.stripDelimiters(prevResult, delimiter, delimiters);

    // New value has issue, someone typed in between prefix letters
    // Revert to pre value
    if (value.slice(0, prefixLength) !== prefix && !tailPrefix) {
      return prevValue.slice(prefixLength);
    } else if (value.slice(-prefixLength) !== prefix && tailPrefix) {
      return prevValue.slice(0, -prefixLength - 1);
    }

    // No issue, strip prefix for new value
    return tailPrefix ? value.slice(0, -prefixLength) : value.slice(prefixLength);
  },
  getFirstDiffIndex: function getFirstDiffIndex(prev, current) {
    var index = 0;
    while (prev.charAt(index) === current.charAt(index)) {
      if (prev.charAt(index++) === '') {
        return -1;
      }
    }
    return index;
  },
  getFormattedValue: function getFormattedValue(value, blocks, blocksLength, delimiter, delimiters, delimiterLazyShow) {
    var result = '',
      multipleDelimiters = delimiters.length > 0,
      currentDelimiter = '';

    // no options, normal input
    if (blocksLength === 0) {
      return value;
    }
    blocks.forEach(function (length, index) {
      if (value.length > 0) {
        var sub = value.slice(0, length),
          rest = value.slice(length);
        if (multipleDelimiters) {
          currentDelimiter = delimiters[delimiterLazyShow ? index - 1 : index] || currentDelimiter;
        } else {
          currentDelimiter = delimiter;
        }
        if (delimiterLazyShow) {
          if (index > 0) {
            result += currentDelimiter;
          }
          result += sub;
        } else {
          result += sub;
          if (sub.length === length && index < blocksLength - 1) {
            result += currentDelimiter;
          }
        }

        // update remaining string
        value = rest;
      }
    });
    return result;
  },
  // move cursor to the end
  // the first time user focuses on an input with prefix
  fixPrefixCursor: function fixPrefixCursor(el, prefix, delimiter, delimiters) {
    if (!el) {
      return;
    }
    var val = el.value,
      appendix = delimiter || delimiters[0] || ' ';
    if (!el.setSelectionRange || !prefix || prefix.length + appendix.length <= val.length) {
      return;
    }
    var len = val.length * 2;

    // set timeout to avoid blink
    setTimeout(function () {
      el.setSelectionRange(len, len);
    }, 1);
  },
  // Check if input field is fully selected
  checkFullSelection: function checkFullSelection(value) {
    try {
      var selection = window.getSelection() || document.getSelection() || {};
      return selection.toString().length === value.length;
    } catch (ex) {
      // Ignore
    }
    return false;
  },
  setSelection: function setSelection(element, position, doc) {
    if (element !== this.getActiveElement(doc)) {
      return;
    }

    // cursor is already in the end
    if (element && element.value.length <= position) {
      return;
    }
    if (element.createTextRange) {
      var range = element.createTextRange();
      range.move('character', position);
      range.select();
    } else {
      try {
        element.setSelectionRange(position, position);
      } catch (e) {
        // eslint-disable-next-line
        console.warn('The input element type does not support selection');
      }
    }
  },
  getActiveElement: function getActiveElement(parent) {
    var activeElement = parent.activeElement;
    if (activeElement && activeElement.shadowRoot) {
      return this.getActiveElement(activeElement.shadowRoot);
    }
    return activeElement;
  },
  isAndroid: function isAndroid() {
    return navigator && /android/i.test(navigator.userAgent);
  },
  // On Android chrome, the keyup and keydown events
  // always return key code 229 as a composition that
  // buffers the user’s keystrokes
  // see https://github.com/nosir/cleave.js/issues/147
  isAndroidBackspaceKeydown: function isAndroidBackspaceKeydown(lastInputValue, currentInputValue) {
    if (!this.isAndroid() || !lastInputValue || !currentInputValue) {
      return false;
    }
    return currentInputValue === lastInputValue.slice(0, -1);
  }
};
var Util_1 = Util;

/**
 * Props Assignment
 *
 * Separate this, so react module can share the usage
 */
var DefaultProperties = {
  // Maybe change to object-assign
  // for now just keep it as simple
  assign: function assign(target, opts) {
    target = target || {};
    opts = opts || {};

    // credit card
    target.creditCard = !!opts.creditCard;
    target.creditCardStrictMode = !!opts.creditCardStrictMode;
    target.creditCardType = '';
    target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || function () {};

    // phone
    target.phone = !!opts.phone;
    target.phoneRegionCode = opts.phoneRegionCode || 'AU';
    target.phoneFormatter = {};

    // time
    target.time = !!opts.time;
    target.timePattern = opts.timePattern || ['h', 'm', 's'];
    target.timeFormat = opts.timeFormat || '24';
    target.timeFormatter = {};

    // date
    target.date = !!opts.date;
    target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
    target.dateMin = opts.dateMin || '';
    target.dateMax = opts.dateMax || '';
    target.dateFormatter = {};

    // numeral
    target.numeral = !!opts.numeral;
    target.numeralIntegerScale = opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
    target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
    target.numeralDecimalMark = opts.numeralDecimalMark || '.';
    target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
    target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
    target.stripLeadingZeroes = opts.stripLeadingZeroes !== false;
    target.signBeforePrefix = !!opts.signBeforePrefix;
    target.tailPrefix = !!opts.tailPrefix;

    // others
    target.swapHiddenInput = !!opts.swapHiddenInput;
    target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;
    target.uppercase = !!opts.uppercase;
    target.lowercase = !!opts.lowercase;
    target.prefix = target.creditCard || target.date ? '' : opts.prefix || '';
    target.noImmediatePrefix = !!opts.noImmediatePrefix;
    target.prefixLength = target.prefix.length;
    target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
    target.copyDelimiter = !!opts.copyDelimiter;
    target.initValue = opts.initValue !== undefined && opts.initValue !== null ? opts.initValue.toString() : '';
    target.delimiter = opts.delimiter || opts.delimiter === '' ? opts.delimiter : opts.date ? '/' : opts.time ? ':' : opts.numeral ? ',' : opts.phone ? ' ' : ' ';
    target.delimiterLength = target.delimiter.length;
    target.delimiterLazyShow = !!opts.delimiterLazyShow;
    target.delimiters = opts.delimiters || [];
    target.blocks = opts.blocks || [];
    target.blocksLength = target.blocks.length;
    target.root = _typeof(commonjsGlobal) === 'object' && commonjsGlobal ? commonjsGlobal : window;
    target.document = opts.document || target.root.document;
    target.maxLength = 0;
    target.backspace = false;
    target.result = '';
    target.onValueChanged = opts.onValueChanged || function () {};
    return target;
  }
};
var DefaultProperties_1 = DefaultProperties;

/**
 * Construct a new Cleave instance by passing the configuration object
 *
 * @param {String | HTMLElement} element
 * @param {Object} opts
 */
var Cleave = function Cleave(element, opts) {
  var owner = this;
  var hasMultipleElements = false;
  if (typeof element === 'string') {
    owner.element = document.querySelector(element);
    hasMultipleElements = document.querySelectorAll(element).length > 1;
  } else {
    if (typeof element.length !== 'undefined' && element.length > 0) {
      owner.element = element[0];
      hasMultipleElements = element.length > 1;
    } else {
      owner.element = element;
    }
  }
  if (!owner.element) {
    throw new Error('[cleave.js] Please check the element');
  }
  if (hasMultipleElements) {
    try {
      // eslint-disable-next-line
      console.warn('[cleave.js] Multiple input fields matched, cleave.js will only take the first one.');
    } catch (e) {
      // Old IE
    }
  }
  opts.initValue = owner.element.value;
  owner.properties = Cleave.DefaultProperties.assign({}, opts);
  owner.init();
};
Cleave.prototype = {
  init: function init() {
    var owner = this,
      pps = owner.properties;

    // no need to use this lib
    if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.time && !pps.date && pps.blocksLength === 0 && !pps.prefix) {
      owner.onInput(pps.initValue);
      return;
    }
    pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
    owner.isAndroid = Cleave.Util.isAndroid();
    owner.lastInputValue = '';
    owner.isBackward = '';
    owner.onChangeListener = owner.onChange.bind(owner);
    owner.onKeyDownListener = owner.onKeyDown.bind(owner);
    owner.onFocusListener = owner.onFocus.bind(owner);
    owner.onCutListener = owner.onCut.bind(owner);
    owner.onCopyListener = owner.onCopy.bind(owner);
    owner.initSwapHiddenInput();
    owner.element.addEventListener('input', owner.onChangeListener);
    owner.element.addEventListener('keydown', owner.onKeyDownListener);
    owner.element.addEventListener('focus', owner.onFocusListener);
    owner.element.addEventListener('cut', owner.onCutListener);
    owner.element.addEventListener('copy', owner.onCopyListener);
    owner.initPhoneFormatter();
    owner.initDateFormatter();
    owner.initTimeFormatter();
    owner.initNumeralFormatter();

    // avoid touch input field if value is null
    // otherwise Firefox will add red box-shadow for <input required />
    if (pps.initValue || pps.prefix && !pps.noImmediatePrefix) {
      owner.onInput(pps.initValue);
    }
  },
  initSwapHiddenInput: function initSwapHiddenInput() {
    var owner = this,
      pps = owner.properties;
    if (!pps.swapHiddenInput) return;
    var inputFormatter = owner.element.cloneNode(true);
    owner.element.parentNode.insertBefore(inputFormatter, owner.element);
    owner.elementSwapHidden = owner.element;
    owner.elementSwapHidden.type = 'hidden';
    owner.element = inputFormatter;
    owner.element.id = '';
  },
  initNumeralFormatter: function initNumeralFormatter() {
    var owner = this,
      pps = owner.properties;
    if (!pps.numeral) {
      return;
    }
    pps.numeralFormatter = new Cleave.NumeralFormatter(pps.numeralDecimalMark, pps.numeralIntegerScale, pps.numeralDecimalScale, pps.numeralThousandsGroupStyle, pps.numeralPositiveOnly, pps.stripLeadingZeroes, pps.prefix, pps.signBeforePrefix, pps.tailPrefix, pps.delimiter);
  },
  initTimeFormatter: function initTimeFormatter() {
    var owner = this,
      pps = owner.properties;
    if (!pps.time) {
      return;
    }
    pps.timeFormatter = new Cleave.TimeFormatter(pps.timePattern, pps.timeFormat);
    pps.blocks = pps.timeFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
  },
  initDateFormatter: function initDateFormatter() {
    var owner = this,
      pps = owner.properties;
    if (!pps.date) {
      return;
    }
    pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern, pps.dateMin, pps.dateMax);
    pps.blocks = pps.dateFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
  },
  initPhoneFormatter: function initPhoneFormatter() {
    var owner = this,
      pps = owner.properties;
    if (!pps.phone) {
      return;
    }

    // Cleave.AsYouTypeFormatter should be provided by
    // external google closure lib
    try {
      pps.phoneFormatter = new Cleave.PhoneFormatter(new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode), pps.delimiter);
    } catch (ex) {
      throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
    }
  },
  onKeyDown: function onKeyDown(event) {
    var owner = this,
      charCode = event.which || event.keyCode;
    owner.lastInputValue = owner.element.value;
    owner.isBackward = charCode === 8;
  },
  onChange: function onChange(event) {
    var owner = this,
      pps = owner.properties,
      Util = Cleave.Util;
    owner.isBackward = owner.isBackward || event.inputType === 'deleteContentBackward';
    var postDelimiter = Util.getPostDelimiter(owner.lastInputValue, pps.delimiter, pps.delimiters);
    if (owner.isBackward && postDelimiter) {
      pps.postDelimiterBackspace = postDelimiter;
    } else {
      pps.postDelimiterBackspace = false;
    }
    this.onInput(this.element.value);
  },
  onFocus: function onFocus() {
    var owner = this,
      pps = owner.properties;
    owner.lastInputValue = owner.element.value;
    if (pps.prefix && pps.noImmediatePrefix && !owner.element.value) {
      this.onInput(pps.prefix);
    }
    Cleave.Util.fixPrefixCursor(owner.element, pps.prefix, pps.delimiter, pps.delimiters);
  },
  onCut: function onCut(e) {
    if (!Cleave.Util.checkFullSelection(this.element.value)) return;
    this.copyClipboardData(e);
    this.onInput('');
  },
  onCopy: function onCopy(e) {
    if (!Cleave.Util.checkFullSelection(this.element.value)) return;
    this.copyClipboardData(e);
  },
  copyClipboardData: function copyClipboardData(e) {
    var owner = this,
      pps = owner.properties,
      Util = Cleave.Util,
      inputValue = owner.element.value,
      textToCopy = '';
    if (!pps.copyDelimiter) {
      textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
    } else {
      textToCopy = inputValue;
    }
    try {
      if (e.clipboardData) {
        e.clipboardData.setData('Text', textToCopy);
      } else {
        window.clipboardData.setData('Text', textToCopy);
      }
      e.preventDefault();
    } catch (ex) {
      //  empty
    }
  },
  onInput: function onInput(value) {
    var owner = this,
      pps = owner.properties,
      Util = Cleave.Util;

    // case 1: delete one more character "4"
    // 1234*| -> hit backspace -> 123|
    // case 2: last character is not delimiter which is:
    // 12|34* -> hit backspace -> 1|34*
    // note: no need to apply this for numeral mode
    var postDelimiterAfter = Util.getPostDelimiter(value, pps.delimiter, pps.delimiters);
    if (!pps.numeral && pps.postDelimiterBackspace && !postDelimiterAfter) {
      value = Util.headStr(value, value.length - pps.postDelimiterBackspace.length);
    }

    // phone formatter
    if (pps.phone) {
      if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
        pps.result = pps.prefix + pps.phoneFormatter.format(value).slice(pps.prefix.length);
      } else {
        pps.result = pps.phoneFormatter.format(value);
      }
      owner.updateValueState();
      return;
    }

    // numeral formatter
    if (pps.numeral) {
      // Do not show prefix when noImmediatePrefix is specified
      // This mostly because we need to show user the native input placeholder
      if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
        pps.result = '';
      } else {
        pps.result = pps.numeralFormatter.format(value);
      }
      owner.updateValueState();
      return;
    }

    // date
    if (pps.date) {
      value = pps.dateFormatter.getValidatedDate(value);
    }

    // time
    if (pps.time) {
      value = pps.timeFormatter.getValidatedTime(value);
    }

    // strip delimiters
    value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

    // strip prefix
    value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);

    // strip non-numeric characters
    value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

    // convert case
    value = pps.uppercase ? value.toUpperCase() : value;
    value = pps.lowercase ? value.toLowerCase() : value;

    // prevent from showing prefix when no immediate option enabled with empty input value
    if (pps.prefix) {
      if (pps.tailPrefix) {
        value = value + pps.prefix;
      } else {
        value = pps.prefix + value;
      }

      // no blocks specified, no need to do formatting
      if (pps.blocksLength === 0) {
        pps.result = value;
        owner.updateValueState();
        return;
      }
    }

    // update credit card props
    if (pps.creditCard) {
      owner.updateCreditCardPropsByValue(value);
    }

    // strip over length characters
    value = Util.headStr(value, pps.maxLength);

    // apply blocks
    pps.result = Util.getFormattedValue(value, pps.blocks, pps.blocksLength, pps.delimiter, pps.delimiters, pps.delimiterLazyShow);
    owner.updateValueState();
  },
  updateCreditCardPropsByValue: function updateCreditCardPropsByValue(value) {
    var owner = this,
      pps = owner.properties,
      Util = Cleave.Util,
      creditCardInfo;

    // At least one of the first 4 characters has changed
    if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
      return;
    }
    creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);
    pps.blocks = creditCardInfo.blocks;
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);

    // credit card type changed
    if (pps.creditCardType !== creditCardInfo.type) {
      pps.creditCardType = creditCardInfo.type;
      pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
    }
  },
  updateValueState: function updateValueState() {
    var owner = this,
      Util = Cleave.Util,
      pps = owner.properties;
    if (!owner.element) {
      return;
    }
    var endPos = owner.element.selectionEnd;
    var oldValue = owner.element.value;
    var newValue = pps.result;
    endPos = Util.getNextCursorPosition(endPos, oldValue, newValue, pps.delimiter, pps.delimiters);

    // fix Android browser type="text" input field
    // cursor not jumping issue
    if (owner.isAndroid) {
      window.setTimeout(function () {
        owner.element.value = newValue;
        Util.setSelection(owner.element, endPos, pps.document, false);
        owner.callOnValueChanged();
      }, 1);
      return;
    }
    owner.element.value = newValue;
    if (pps.swapHiddenInput) owner.elementSwapHidden.value = owner.getRawValue();
    Util.setSelection(owner.element, endPos, pps.document, false);
    owner.callOnValueChanged();
  },
  callOnValueChanged: function callOnValueChanged() {
    var owner = this,
      pps = owner.properties;
    pps.onValueChanged.call(owner, {
      target: {
        name: owner.element.name,
        value: pps.result,
        rawValue: owner.getRawValue()
      }
    });
  },
  setPhoneRegionCode: function setPhoneRegionCode(phoneRegionCode) {
    var owner = this,
      pps = owner.properties;
    pps.phoneRegionCode = phoneRegionCode;
    owner.initPhoneFormatter();
    owner.onChange();
  },
  setRawValue: function setRawValue(value) {
    var owner = this,
      pps = owner.properties;
    value = value !== undefined && value !== null ? value.toString() : '';
    if (pps.numeral) {
      value = value.replace('.', pps.numeralDecimalMark);
    }
    pps.postDelimiterBackspace = false;
    owner.element.value = value;
    owner.onInput(value);
  },
  getRawValue: function getRawValue() {
    var owner = this,
      pps = owner.properties,
      Util = Cleave.Util,
      rawValue = owner.element.value;
    if (pps.rawValueTrimPrefix) {
      rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);
    }
    if (pps.numeral) {
      rawValue = pps.numeralFormatter.getRawValue(rawValue);
    } else {
      rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
    }
    return rawValue;
  },
  getISOFormatDate: function getISOFormatDate() {
    var owner = this,
      pps = owner.properties;
    return pps.date ? pps.dateFormatter.getISOFormatDate() : '';
  },
  getISOFormatTime: function getISOFormatTime() {
    var owner = this,
      pps = owner.properties;
    return pps.time ? pps.timeFormatter.getISOFormatTime() : '';
  },
  getFormattedValue: function getFormattedValue() {
    return this.element.value;
  },
  destroy: function destroy() {
    var owner = this;
    owner.element.removeEventListener('input', owner.onChangeListener);
    owner.element.removeEventListener('keydown', owner.onKeyDownListener);
    owner.element.removeEventListener('focus', owner.onFocusListener);
    owner.element.removeEventListener('cut', owner.onCutListener);
    owner.element.removeEventListener('copy', owner.onCopyListener);
  },
  toString: function toString() {
    return '[Cleave Object]';
  }
};
Cleave.NumeralFormatter = NumeralFormatter_1;
Cleave.DateFormatter = DateFormatter_1;
Cleave.TimeFormatter = TimeFormatter_1;
Cleave.PhoneFormatter = PhoneFormatter_1;
Cleave.CreditCardDetector = CreditCardDetector_1;
Cleave.Util = Util_1;
Cleave.DefaultProperties = DefaultProperties_1;

// for angular directive
(_typeof(commonjsGlobal) === 'object' && commonjsGlobal ? commonjsGlobal : window)['Cleave'] = Cleave;

// CommonJS
var Cleave_1 = Cleave;
/* harmony default export */ __webpack_exports__["default"] = (Cleave_1);

/***/ }),

/***/ "./node_modules/mobx/dist/mobx.esm.js":
/*!********************************************!*\
  !*** ./node_modules/mobx/dist/mobx.esm.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$mobx": function() { return /* binding */ $mobx; },
/* harmony export */   "FlowCancellationError": function() { return /* binding */ FlowCancellationError; },
/* harmony export */   "ObservableMap": function() { return /* binding */ ObservableMap; },
/* harmony export */   "ObservableSet": function() { return /* binding */ ObservableSet; },
/* harmony export */   "Reaction": function() { return /* binding */ Reaction; },
/* harmony export */   "_allowStateChanges": function() { return /* binding */ allowStateChanges; },
/* harmony export */   "_allowStateChangesInsideComputed": function() { return /* binding */ runInAction; },
/* harmony export */   "_allowStateReadsEnd": function() { return /* binding */ allowStateReadsEnd; },
/* harmony export */   "_allowStateReadsStart": function() { return /* binding */ allowStateReadsStart; },
/* harmony export */   "_autoAction": function() { return /* binding */ autoAction; },
/* harmony export */   "_endAction": function() { return /* binding */ _endAction; },
/* harmony export */   "_getAdministration": function() { return /* binding */ getAdministration; },
/* harmony export */   "_getGlobalState": function() { return /* binding */ getGlobalState; },
/* harmony export */   "_interceptReads": function() { return /* binding */ interceptReads; },
/* harmony export */   "_isComputingDerivation": function() { return /* binding */ isComputingDerivation; },
/* harmony export */   "_resetGlobalState": function() { return /* binding */ resetGlobalState; },
/* harmony export */   "_startAction": function() { return /* binding */ _startAction; },
/* harmony export */   "action": function() { return /* binding */ action; },
/* harmony export */   "autorun": function() { return /* binding */ autorun; },
/* harmony export */   "comparer": function() { return /* binding */ comparer; },
/* harmony export */   "computed": function() { return /* binding */ computed; },
/* harmony export */   "configure": function() { return /* binding */ configure; },
/* harmony export */   "createAtom": function() { return /* binding */ createAtom; },
/* harmony export */   "defineProperty": function() { return /* binding */ apiDefineProperty; },
/* harmony export */   "entries": function() { return /* binding */ entries; },
/* harmony export */   "extendObservable": function() { return /* binding */ extendObservable; },
/* harmony export */   "flow": function() { return /* binding */ flow; },
/* harmony export */   "flowResult": function() { return /* binding */ flowResult; },
/* harmony export */   "get": function() { return /* binding */ get; },
/* harmony export */   "getAtom": function() { return /* binding */ getAtom; },
/* harmony export */   "getDebugName": function() { return /* binding */ getDebugName; },
/* harmony export */   "getDependencyTree": function() { return /* binding */ getDependencyTree; },
/* harmony export */   "getObserverTree": function() { return /* binding */ getObserverTree; },
/* harmony export */   "has": function() { return /* binding */ has; },
/* harmony export */   "intercept": function() { return /* binding */ intercept; },
/* harmony export */   "isAction": function() { return /* binding */ isAction; },
/* harmony export */   "isBoxedObservable": function() { return /* binding */ isObservableValue; },
/* harmony export */   "isComputed": function() { return /* binding */ isComputed; },
/* harmony export */   "isComputedProp": function() { return /* binding */ isComputedProp; },
/* harmony export */   "isFlow": function() { return /* binding */ isFlow; },
/* harmony export */   "isFlowCancellationError": function() { return /* binding */ isFlowCancellationError; },
/* harmony export */   "isObservable": function() { return /* binding */ isObservable; },
/* harmony export */   "isObservableArray": function() { return /* binding */ isObservableArray; },
/* harmony export */   "isObservableMap": function() { return /* binding */ isObservableMap; },
/* harmony export */   "isObservableObject": function() { return /* binding */ isObservableObject; },
/* harmony export */   "isObservableProp": function() { return /* binding */ isObservableProp; },
/* harmony export */   "isObservableSet": function() { return /* binding */ isObservableSet; },
/* harmony export */   "keys": function() { return /* binding */ keys; },
/* harmony export */   "makeAutoObservable": function() { return /* binding */ makeAutoObservable; },
/* harmony export */   "makeObservable": function() { return /* binding */ makeObservable; },
/* harmony export */   "observable": function() { return /* binding */ observable; },
/* harmony export */   "observe": function() { return /* binding */ observe; },
/* harmony export */   "onBecomeObserved": function() { return /* binding */ onBecomeObserved; },
/* harmony export */   "onBecomeUnobserved": function() { return /* binding */ onBecomeUnobserved; },
/* harmony export */   "onReactionError": function() { return /* binding */ onReactionError; },
/* harmony export */   "override": function() { return /* binding */ override; },
/* harmony export */   "ownKeys": function() { return /* binding */ apiOwnKeys; },
/* harmony export */   "reaction": function() { return /* binding */ reaction; },
/* harmony export */   "remove": function() { return /* binding */ remove; },
/* harmony export */   "runInAction": function() { return /* binding */ runInAction; },
/* harmony export */   "set": function() { return /* binding */ set; },
/* harmony export */   "spy": function() { return /* binding */ spy; },
/* harmony export */   "toJS": function() { return /* binding */ toJS; },
/* harmony export */   "trace": function() { return /* binding */ trace; },
/* harmony export */   "transaction": function() { return /* binding */ transaction; },
/* harmony export */   "untracked": function() { return /* binding */ untracked; },
/* harmony export */   "values": function() { return /* binding */ values; },
/* harmony export */   "when": function() { return /* binding */ when; }
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var niceErrors = {
  0: "Invalid value for configuration 'enforceActions', expected 'never', 'always' or 'observed'",
  1: function _(annotationType, key) {
    return "Cannot apply '" + annotationType + "' to '" + key.toString() + "': Field not found.";
  },
  /*
  2(prop) {
      return `invalid decorator for '${prop.toString()}'`
  },
  3(prop) {
      return `Cannot decorate '${prop.toString()}': action can only be used on properties with a function value.`
  },
  4(prop) {
      return `Cannot decorate '${prop.toString()}': computed can only be used on getter properties.`
  },
  */
  5: "'keys()' can only be used on observable objects, arrays, sets and maps",
  6: "'values()' can only be used on observable objects, arrays, sets and maps",
  7: "'entries()' can only be used on observable objects, arrays and maps",
  8: "'set()' can only be used on observable objects, arrays and maps",
  9: "'remove()' can only be used on observable objects, arrays and maps",
  10: "'has()' can only be used on observable objects, arrays and maps",
  11: "'get()' can only be used on observable objects, arrays and maps",
  12: "Invalid annotation",
  13: "Dynamic observable objects cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  14: "Intercept handlers should return nothing or a change object",
  15: "Observable arrays cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  16: "Modification exception: the internal structure of an observable array was changed.",
  17: function _(index, length) {
    return "[mobx.array] Index out of bounds, " + index + " is larger than " + length;
  },
  18: "mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js",
  19: function _(other) {
    return "Cannot initialize from classes that inherit from Map: " + other.constructor.name;
  },
  20: function _(other) {
    return "Cannot initialize map from " + other;
  },
  21: function _(dataStructure) {
    return "Cannot convert to map from '" + dataStructure + "'";
  },
  22: "mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js",
  23: "It is not possible to get index atoms from arrays",
  24: function _(thing) {
    return "Cannot obtain administration from " + thing;
  },
  25: function _(property, name) {
    return "the entry '" + property + "' does not exist in the observable map '" + name + "'";
  },
  26: "please specify a property",
  27: function _(property, name) {
    return "no observable property '" + property.toString() + "' found on the observable object '" + name + "'";
  },
  28: function _(thing) {
    return "Cannot obtain atom from " + thing;
  },
  29: "Expecting some object",
  30: "invalid action stack. did you forget to finish an action?",
  31: "missing option for computed: get",
  32: function _(name, derivation) {
    return "Cycle detected in computation " + name + ": " + derivation;
  },
  33: function _(name) {
    return "The setter of computed value '" + name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?";
  },
  34: function _(name) {
    return "[ComputedValue '" + name + "'] It is not possible to assign a new value to a computed value.";
  },
  35: "There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`",
  36: "isolateGlobalState should be called before MobX is running any reactions",
  37: function _(method) {
    return "[mobx] `observableArray." + method + "()` mutates the array in-place, which is not allowed inside a derivation. Use `array.slice()." + method + "()` instead";
  },
  38: "'ownKeys()' can only be used on observable objects",
  39: "'defineProperty()' can only be used on observable objects"
};
var errors =  true ? niceErrors : 0;
function die(error) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  if (true) {
    var e = typeof error === "string" ? error : errors[error];
    if (typeof e === "function") e = e.apply(null, args);
    throw new Error("[MobX] " + e);
  }
  throw new Error(typeof error === "number" ? "[MobX] minified error nr: " + error + (args.length ? " " + args.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + error);
}
var mockGlobal = {};
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof __webpack_require__.g !== "undefined") {
    return __webpack_require__.g;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  return mockGlobal;
}

// We shorten anything used > 5 times
var assign = Object.assign;
var getDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var objectPrototype = Object.prototype;
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
var hasProxy = typeof Proxy !== "undefined";
var plainObjectString = /*#__PURE__*/Object.toString();
function assertProxies() {
  if (!hasProxy) {
    die( true ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : 0);
  }
}
function warnAboutProxyRequirement(msg) {
  if ( true && globalState.verifyProxies) {
    die("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + msg);
  }
}
function getNextId() {
  return ++globalState.mobxGuid;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */
function once(func) {
  var invoked = false;
  return function () {
    if (invoked) {
      return;
    }
    invoked = true;
    return func.apply(this, arguments);
  };
}
var noop = function noop() {};
function isFunction(fn) {
  return typeof fn === "function";
}
function isStringish(value) {
  var t = _typeof(value);
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return true;
  }
  return false;
}
function isObject(value) {
  return value !== null && _typeof(value) === "object";
}
function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto == null) {
    return true;
  }
  var protoConstructor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof protoConstructor === "function" && protoConstructor.toString() === plainObjectString;
}
// https://stackoverflow.com/a/37865170
function isGenerator(obj) {
  var constructor = obj == null ? void 0 : obj.constructor;
  if (!constructor) {
    return false;
  }
  if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) {
    return true;
  }
  return false;
}
function addHiddenProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value
  });
}
function addHiddenFinalProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: value
  });
}
function createInstanceofPredicate(name, theClass) {
  var propName = "isMobX" + name;
  theClass.prototype[propName] = true;
  return function (x) {
    return isObject(x) && x[propName] === true;
  };
}
function isES6Map(thing) {
  return thing instanceof Map;
}
function isES6Set(thing) {
  return thing instanceof Set;
}
var hasGetOwnPropertySymbols = typeof Object.getOwnPropertySymbols !== "undefined";
/**
 * Returns the following: own enumerable keys and symbols.
 */
function getPlainObjectKeys(object) {
  var keys = Object.keys(object);
  // Not supported in IE, so there are not going to be symbol props anyway...
  if (!hasGetOwnPropertySymbols) {
    return keys;
  }
  var symbols = Object.getOwnPropertySymbols(object);
  if (!symbols.length) {
    return keys;
  }
  return [].concat(keys, symbols.filter(function (s) {
    return objectPrototype.propertyIsEnumerable.call(object, s);
  }));
}
// From Immer utils
// Returns all own keys, including non-enumerable and symbolic
var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : hasGetOwnPropertySymbols ? function (obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} : /* istanbul ignore next */Object.getOwnPropertyNames;
function stringifyKey(key) {
  if (typeof key === "string") {
    return key;
  }
  if (_typeof(key) === "symbol") {
    return key.toString();
  }
  return new String(key).toString();
}
function toPrimitive(value) {
  return value === null ? null : _typeof(value) === "object" ? "" + value : value;
}
function hasProp(target, prop) {
  return objectPrototype.hasOwnProperty.call(target, prop);
}
// From Immer utils
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(target) {
  // Polyfill needed for Hermes and IE, see https://github.com/facebook/hermes/issues/274
  var res = {};
  // Note: without polyfill for ownKeys, symbols won't be picked up
  ownKeys(target).forEach(function (key) {
    res[key] = getDescriptor(target, key);
  });
  return res;
};
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
var storedAnnotationsSymbol = /*#__PURE__*/Symbol("mobx-stored-annotations");
/**
 * Creates a function that acts as
 * - decorator
 * - annotation object
 */
function createDecoratorAnnotation(annotation) {
  function decorator(target, property) {
    storeAnnotation(target, property, annotation);
  }
  return Object.assign(decorator, annotation);
}
/**
 * Stores annotation to prototype,
 * so it can be inspected later by `makeObservable` called from constructor
 */
function storeAnnotation(prototype, key, annotation) {
  if (!hasProp(prototype, storedAnnotationsSymbol)) {
    addHiddenProp(prototype, storedAnnotationsSymbol, _extends({}, prototype[storedAnnotationsSymbol]));
  }
  // @override must override something
  if ( true && isOverride(annotation) && !hasProp(prototype[storedAnnotationsSymbol], key)) {
    var fieldName = prototype.constructor.name + ".prototype." + key.toString();
    die("'" + fieldName + "' is decorated with 'override', " + "but no such decorated member was found on prototype.");
  }
  // Cannot re-decorate
  assertNotDecorated(prototype, annotation, key);
  // Ignore override
  if (!isOverride(annotation)) {
    prototype[storedAnnotationsSymbol][key] = annotation;
  }
}
function assertNotDecorated(prototype, annotation, key) {
  if ( true && !isOverride(annotation) && hasProp(prototype[storedAnnotationsSymbol], key)) {
    var fieldName = prototype.constructor.name + ".prototype." + key.toString();
    var currentAnnotationType = prototype[storedAnnotationsSymbol][key].annotationType_;
    var requestedAnnotationType = annotation.annotationType_;
    die("Cannot apply '@" + requestedAnnotationType + "' to '" + fieldName + "':" + ("\nThe field is already decorated with '@" + currentAnnotationType + "'.") + "\nRe-decorating fields is not allowed." + "\nUse '@override' decorator for methods overridden by subclass.");
  }
}
/**
 * Collects annotations from prototypes and stores them on target (instance)
 */
function collectStoredAnnotations(target) {
  if (!hasProp(target, storedAnnotationsSymbol)) {
    if ( true && !target[storedAnnotationsSymbol]) {
      die("No annotations were passed to makeObservable, but no decorated members have been found either");
    }
    // We need a copy as we will remove annotation from the list once it's applied.
    addHiddenProp(target, storedAnnotationsSymbol, _extends({}, target[storedAnnotationsSymbol]));
  }
  return target[storedAnnotationsSymbol];
}
var $mobx = /*#__PURE__*/Symbol("mobx administration");
var Atom = /*#__PURE__*/function () {
  // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed

  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */
  function Atom(name_) {
    if (name_ === void 0) {
      name_ =  true ? "Atom@" + getNextId() : 0;
    }
    this.name_ = void 0;
    this.isPendingUnobservation_ = false;
    this.isBeingObserved_ = false;
    this.observers_ = new Set();
    this.diffValue_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.NOT_TRACKING_;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    this.name_ = name_;
  }
  // onBecomeObservedListeners
  var _proto = Atom.prototype;
  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function (listener) {
        return listener();
      });
    }
  };
  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function (listener) {
        return listener();
      });
    }
  }
  /**
   * Invoke this method to notify mobx that your atom has been used somehow.
   * Returns true if there is currently a reactive context.
   */;
  _proto.reportObserved = function reportObserved$1() {
    return reportObserved(this);
  }
  /**
   * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
   */;
  _proto.reportChanged = function reportChanged() {
    startBatch();
    propagateChanged(this);
    // We could update state version only at the end of batch,
    // but we would still have to switch some global flag here to signal a change.
    globalState.stateVersion = globalState.stateVersion < Number.MAX_SAFE_INTEGER ? globalState.stateVersion + 1 : Number.MIN_SAFE_INTEGER;
    endBatch();
  };
  _proto.toString = function toString() {
    return this.name_;
  };
  return Atom;
}();
var isAtom = /*#__PURE__*/createInstanceofPredicate("Atom", Atom);
function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
  if (onBecomeObservedHandler === void 0) {
    onBecomeObservedHandler = noop;
  }
  if (onBecomeUnobservedHandler === void 0) {
    onBecomeUnobservedHandler = noop;
  }
  var atom = new Atom(name);
  // default `noop` listener will not initialize the hook Set
  if (onBecomeObservedHandler !== noop) {
    onBecomeObserved(atom, onBecomeObservedHandler);
  }
  if (onBecomeUnobservedHandler !== noop) {
    onBecomeUnobserved(atom, onBecomeUnobservedHandler);
  }
  return atom;
}
function identityComparer(a, b) {
  return a === b;
}
function structuralComparer(a, b) {
  return deepEqual(a, b);
}
function shallowComparer(a, b) {
  return deepEqual(a, b, 1);
}
function defaultComparer(a, b) {
  if (Object.is) {
    return Object.is(a, b);
  }
  return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
}
var comparer = {
  identity: identityComparer,
  structural: structuralComparer,
  "default": defaultComparer,
  shallow: shallowComparer
};
function deepEnhancer(v, _, name) {
  // it is an observable already, done
  if (isObservable(v)) {
    return v;
  }
  // something that can be converted and mutated?
  if (Array.isArray(v)) {
    return observable.array(v, {
      name: name
    });
  }
  if (isPlainObject(v)) {
    return observable.object(v, undefined, {
      name: name
    });
  }
  if (isES6Map(v)) {
    return observable.map(v, {
      name: name
    });
  }
  if (isES6Set(v)) {
    return observable.set(v, {
      name: name
    });
  }
  if (typeof v === "function" && !isAction(v) && !isFlow(v)) {
    if (isGenerator(v)) {
      return flow(v);
    } else {
      return autoAction(name, v);
    }
  }
  return v;
}
function shallowEnhancer(v, _, name) {
  if (v === undefined || v === null) {
    return v;
  }
  if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v)) {
    return v;
  }
  if (Array.isArray(v)) {
    return observable.array(v, {
      name: name,
      deep: false
    });
  }
  if (isPlainObject(v)) {
    return observable.object(v, undefined, {
      name: name,
      deep: false
    });
  }
  if (isES6Map(v)) {
    return observable.map(v, {
      name: name,
      deep: false
    });
  }
  if (isES6Set(v)) {
    return observable.set(v, {
      name: name,
      deep: false
    });
  }
  if (true) {
    die("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
  }
}
function referenceEnhancer(newValue) {
  // never turn into an observable
  return newValue;
}
function refStructEnhancer(v, oldValue) {
  if ( true && isObservable(v)) {
    die("observable.struct should not be used with observable values");
  }
  if (deepEqual(v, oldValue)) {
    return oldValue;
  }
  return v;
}
var OVERRIDE = "override";
var override = /*#__PURE__*/createDecoratorAnnotation({
  annotationType_: OVERRIDE,
  make_: make_,
  extend_: extend_
});
function isOverride(annotation) {
  return annotation.annotationType_ === OVERRIDE;
}
function make_(adm, key) {
  // Must not be plain object
  if ( true && adm.isPlainObject_) {
    die("Cannot apply '" + this.annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + this.annotationType_ + "' cannot be used on plain objects."));
  }
  // Must override something
  if ( true && !hasProp(adm.appliedAnnotations_, key)) {
    die("'" + adm.name_ + "." + key.toString() + "' is annotated with '" + this.annotationType_ + "', " + "but no such annotated member was found on prototype.");
  }
  return 0 /* Cancel */;
}

function extend_(adm, key, descriptor, proxyTrap) {
  die("'" + this.annotationType_ + "' can only be used with 'makeObservable'");
}
function createActionAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$1,
    extend_: extend_$1
  };
}
function make_$1(adm, key, descriptor, source) {
  var _this$options_;
  // bound
  if ((_this$options_ = this.options_) != null && _this$options_.bound) {
    return this.extend_(adm, key, descriptor, false) === null ? 0 /* Cancel */ : 1 /* Break */;
  }
  // own
  if (source === adm.target_) {
    return this.extend_(adm, key, descriptor, false) === null ? 0 /* Cancel */ : 2 /* Continue */;
  }
  // prototype
  if (isAction(descriptor.value)) {
    // A prototype could have been annotated already by other constructor,
    // rest of the proto chain must be annotated already
    return 1 /* Break */;
  }

  var actionDescriptor = createActionDescriptor(adm, this, key, descriptor, false);
  defineProperty(source, key, actionDescriptor);
  return 2 /* Continue */;
}

function extend_$1(adm, key, descriptor, proxyTrap) {
  var actionDescriptor = createActionDescriptor(adm, this, key, descriptor);
  return adm.defineProperty_(key, actionDescriptor, proxyTrap);
}
function assertActionDescriptor(adm, _ref, key, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var value = _ref2.value;
  if ( true && !isFunction(value)) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on properties with a function value."));
  }
}
function createActionDescriptor(adm, annotation, key, descriptor,
// provides ability to disable safeDescriptors for prototypes
safeDescriptors) {
  var _annotation$options_, _annotation$options_$, _annotation$options_2, _annotation$options_$2, _annotation$options_3, _annotation$options_4, _adm$proxy_2;
  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }
  assertActionDescriptor(adm, annotation, key, descriptor);
  var value = descriptor.value;
  if ((_annotation$options_ = annotation.options_) != null && _annotation$options_.bound) {
    var _adm$proxy_;
    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }
  return {
    value: createAction((_annotation$options_$ = (_annotation$options_2 = annotation.options_) == null ? void 0 : _annotation$options_2.name) != null ? _annotation$options_$ : key.toString(), value, (_annotation$options_$2 = (_annotation$options_3 = annotation.options_) == null ? void 0 : _annotation$options_3.autoAction) != null ? _annotation$options_$2 : false,
    // https://github.com/mobxjs/mobx/discussions/3140
    (_annotation$options_4 = annotation.options_) != null && _annotation$options_4.bound ? (_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_ : undefined),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}
function createFlowAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$2,
    extend_: extend_$2
  };
}
function make_$2(adm, key, descriptor, source) {
  var _this$options_;
  // own
  if (source === adm.target_) {
    return this.extend_(adm, key, descriptor, false) === null ? 0 /* Cancel */ : 2 /* Continue */;
  }
  // prototype
  // bound - must annotate protos to support super.flow()
  if ((_this$options_ = this.options_) != null && _this$options_.bound && (!hasProp(adm.target_, key) || !isFlow(adm.target_[key]))) {
    if (this.extend_(adm, key, descriptor, false) === null) {
      return 0 /* Cancel */;
    }
  }

  if (isFlow(descriptor.value)) {
    // A prototype could have been annotated already by other constructor,
    // rest of the proto chain must be annotated already
    return 1 /* Break */;
  }

  var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, false, false);
  defineProperty(source, key, flowDescriptor);
  return 2 /* Continue */;
}

function extend_$2(adm, key, descriptor, proxyTrap) {
  var _this$options_2;
  var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, (_this$options_2 = this.options_) == null ? void 0 : _this$options_2.bound);
  return adm.defineProperty_(key, flowDescriptor, proxyTrap);
}
function assertFlowDescriptor(adm, _ref, key, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var value = _ref2.value;
  if ( true && !isFunction(value)) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on properties with a generator function value."));
  }
}
function createFlowDescriptor(adm, annotation, key, descriptor, bound,
// provides ability to disable safeDescriptors for prototypes
safeDescriptors) {
  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }
  assertFlowDescriptor(adm, annotation, key, descriptor);
  var value = descriptor.value;
  // In case of flow.bound, the descriptor can be from already annotated prototype
  if (!isFlow(value)) {
    value = flow(value);
  }
  if (bound) {
    var _adm$proxy_;
    // We do not keep original function around, so we bind the existing flow
    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
    // This is normally set by `flow`, but `bind` returns new function...
    value.isMobXFlow = true;
  }
  return {
    value: value,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}
function createComputedAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$3,
    extend_: extend_$3
  };
}
function make_$3(adm, key, descriptor) {
  return this.extend_(adm, key, descriptor, false) === null ? 0 /* Cancel */ : 1 /* Break */;
}

function extend_$3(adm, key, descriptor, proxyTrap) {
  assertComputedDescriptor(adm, this, key, descriptor);
  return adm.defineComputedProperty_(key, _extends({}, this.options_, {
    get: descriptor.get,
    set: descriptor.set
  }), proxyTrap);
}
function assertComputedDescriptor(adm, _ref, key, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var get = _ref2.get;
  if ( true && !get) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on getter(+setter) properties."));
  }
}
function createObservableAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$4,
    extend_: extend_$4
  };
}
function make_$4(adm, key, descriptor) {
  return this.extend_(adm, key, descriptor, false) === null ? 0 /* Cancel */ : 1 /* Break */;
}

function extend_$4(adm, key, descriptor, proxyTrap) {
  var _this$options_$enhanc, _this$options_;
  assertObservableDescriptor(adm, this, key, descriptor);
  return adm.defineObservableProperty_(key, descriptor.value, (_this$options_$enhanc = (_this$options_ = this.options_) == null ? void 0 : _this$options_.enhancer) != null ? _this$options_$enhanc : deepEnhancer, proxyTrap);
}
function assertObservableDescriptor(adm, _ref, key, descriptor) {
  var annotationType_ = _ref.annotationType_;
  if ( true && !("value" in descriptor)) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' cannot be used on getter/setter properties"));
  }
}
var AUTO = "true";
var autoAnnotation = /*#__PURE__*/createAutoAnnotation();
function createAutoAnnotation(options) {
  return {
    annotationType_: AUTO,
    options_: options,
    make_: make_$5,
    extend_: extend_$5
  };
}
function make_$5(adm, key, descriptor, source) {
  var _this$options_3, _this$options_4;
  // getter -> computed
  if (descriptor.get) {
    return computed.make_(adm, key, descriptor, source);
  }
  // lone setter -> action setter
  if (descriptor.set) {
    // TODO make action applicable to setter and delegate to action.make_
    var set = createAction(key.toString(), descriptor.set);
    // own
    if (source === adm.target_) {
      return adm.defineProperty_(key, {
        configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
        set: set
      }) === null ? 0 /* Cancel */ : 2 /* Continue */;
    }
    // proto
    defineProperty(source, key, {
      configurable: true,
      set: set
    });
    return 2 /* Continue */;
  }
  // function on proto -> autoAction/flow
  if (source !== adm.target_ && typeof descriptor.value === "function") {
    var _this$options_2;
    if (isGenerator(descriptor.value)) {
      var _this$options_;
      var flowAnnotation = (_this$options_ = this.options_) != null && _this$options_.autoBind ? flow.bound : flow;
      return flowAnnotation.make_(adm, key, descriptor, source);
    }
    var actionAnnotation = (_this$options_2 = this.options_) != null && _this$options_2.autoBind ? autoAction.bound : autoAction;
    return actionAnnotation.make_(adm, key, descriptor, source);
  }
  // other -> observable
  // Copy props from proto as well, see test:
  // "decorate should work with Object.create"
  var observableAnnotation = ((_this$options_3 = this.options_) == null ? void 0 : _this$options_3.deep) === false ? observable.ref : observable;
  // if function respect autoBind option
  if (typeof descriptor.value === "function" && (_this$options_4 = this.options_) != null && _this$options_4.autoBind) {
    var _adm$proxy_;
    descriptor.value = descriptor.value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }
  return observableAnnotation.make_(adm, key, descriptor, source);
}
function extend_$5(adm, key, descriptor, proxyTrap) {
  var _this$options_5, _this$options_6;
  // getter -> computed
  if (descriptor.get) {
    return computed.extend_(adm, key, descriptor, proxyTrap);
  }
  // lone setter -> action setter
  if (descriptor.set) {
    // TODO make action applicable to setter and delegate to action.extend_
    return adm.defineProperty_(key, {
      configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
      set: createAction(key.toString(), descriptor.set)
    }, proxyTrap);
  }
  // other -> observable
  // if function respect autoBind option
  if (typeof descriptor.value === "function" && (_this$options_5 = this.options_) != null && _this$options_5.autoBind) {
    var _adm$proxy_2;
    descriptor.value = descriptor.value.bind((_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_);
  }
  var observableAnnotation = ((_this$options_6 = this.options_) == null ? void 0 : _this$options_6.deep) === false ? observable.ref : observable;
  return observableAnnotation.extend_(adm, key, descriptor, proxyTrap);
}
var OBSERVABLE = "observable";
var OBSERVABLE_REF = "observable.ref";
var OBSERVABLE_SHALLOW = "observable.shallow";
var OBSERVABLE_STRUCT = "observable.struct";
// Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases
var defaultCreateObservableOptions = {
  deep: true,
  name: undefined,
  defaultDecorator: undefined,
  proxy: true
};
Object.freeze(defaultCreateObservableOptions);
function asCreateObservableOptions(thing) {
  return thing || defaultCreateObservableOptions;
}
var observableAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE);
var observableRefAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_REF, {
  enhancer: referenceEnhancer
});
var observableShallowAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_SHALLOW, {
  enhancer: shallowEnhancer
});
var observableStructAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_STRUCT, {
  enhancer: refStructEnhancer
});
var observableDecoratorAnnotation = /*#__PURE__*/createDecoratorAnnotation(observableAnnotation);
function getEnhancerFromOptions(options) {
  return options.deep === true ? deepEnhancer : options.deep === false ? referenceEnhancer : getEnhancerFromAnnotation(options.defaultDecorator);
}
function getAnnotationFromOptions(options) {
  var _options$defaultDecor;
  return options ? (_options$defaultDecor = options.defaultDecorator) != null ? _options$defaultDecor : createAutoAnnotation(options) : undefined;
}
function getEnhancerFromAnnotation(annotation) {
  var _annotation$options_$, _annotation$options_;
  return !annotation ? deepEnhancer : (_annotation$options_$ = (_annotation$options_ = annotation.options_) == null ? void 0 : _annotation$options_.enhancer) != null ? _annotation$options_$ : deepEnhancer;
}
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */
function createObservable(v, arg2, arg3) {
  // @observable someProp;
  if (isStringish(arg2)) {
    storeAnnotation(v, arg2, observableAnnotation);
    return;
  }
  // already observable - ignore
  if (isObservable(v)) {
    return v;
  }
  // plain object
  if (isPlainObject(v)) {
    return observable.object(v, arg2, arg3);
  }
  // Array
  if (Array.isArray(v)) {
    return observable.array(v, arg2);
  }
  // Map
  if (isES6Map(v)) {
    return observable.map(v, arg2);
  }
  // Set
  if (isES6Set(v)) {
    return observable.set(v, arg2);
  }
  // other object - ignore
  if (_typeof(v) === "object" && v !== null) {
    return v;
  }
  // anything else
  return observable.box(v, arg2);
}
assign(createObservable, observableDecoratorAnnotation);
var observableFactories = {
  box: function box(value, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
  },
  array: function array(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return (globalState.useProxies === false || o.proxy === false ? createLegacyArray : createObservableArray)(initialValues, getEnhancerFromOptions(o), o.name);
  },
  map: function map(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
  },
  set: function set(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
  },
  object: function object(props, decorators, options) {
    return extendObservable(globalState.useProxies === false || (options == null ? void 0 : options.proxy) === false ? asObservableObject({}, options) : asDynamicObservableObject({}, options), props, decorators);
  },
  ref: /*#__PURE__*/createDecoratorAnnotation(observableRefAnnotation),
  shallow: /*#__PURE__*/createDecoratorAnnotation(observableShallowAnnotation),
  deep: observableDecoratorAnnotation,
  struct: /*#__PURE__*/createDecoratorAnnotation(observableStructAnnotation)
};
// eslint-disable-next-line
var observable = /*#__PURE__*/assign(createObservable, observableFactories);
var COMPUTED = "computed";
var COMPUTED_STRUCT = "computed.struct";
var computedAnnotation = /*#__PURE__*/createComputedAnnotation(COMPUTED);
var computedStructAnnotation = /*#__PURE__*/createComputedAnnotation(COMPUTED_STRUCT, {
  equals: comparer.structural
});
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
var computed = function computed(arg1, arg2) {
  if (isStringish(arg2)) {
    // @computed
    return storeAnnotation(arg1, arg2, computedAnnotation);
  }
  if (isPlainObject(arg1)) {
    // @computed({ options })
    return createDecoratorAnnotation(createComputedAnnotation(COMPUTED, arg1));
  }
  // computed(expr, options?)
  if (true) {
    if (!isFunction(arg1)) {
      die("First argument to `computed` should be an expression.");
    }
    if (isFunction(arg2)) {
      die("A setter as second argument is no longer supported, use `{ set: fn }` option instead");
    }
  }
  var opts = isPlainObject(arg2) ? arg2 : {};
  opts.get = arg1;
  opts.name || (opts.name = arg1.name || ""); /* for generated name */
  return new ComputedValue(opts);
};
Object.assign(computed, computedAnnotation);
computed.struct = /*#__PURE__*/createDecoratorAnnotation(computedStructAnnotation);
var _getDescriptor$config, _getDescriptor;
// we don't use globalState for these in order to avoid possible issues with multiple
// mobx versions
var currentActionId = 0;
var nextActionId = 1;
var isFunctionNameConfigurable = (_getDescriptor$config = (_getDescriptor = /*#__PURE__*/getDescriptor(function () {}, "name")) == null ? void 0 : _getDescriptor.configurable) != null ? _getDescriptor$config : false;
// we can safely recycle this object
var tmpNameDescriptor = {
  value: "action",
  configurable: true,
  writable: false,
  enumerable: false
};
function createAction(actionName, fn, autoAction, ref) {
  if (autoAction === void 0) {
    autoAction = false;
  }
  if (true) {
    if (!isFunction(fn)) {
      die("`action` can only be invoked on functions");
    }
    if (typeof actionName !== "string" || !actionName) {
      die("actions should have valid names, got: '" + actionName + "'");
    }
  }
  function res() {
    return executeAction(actionName, autoAction, fn, ref || this, arguments);
  }
  res.isMobxAction = true;
  if (isFunctionNameConfigurable) {
    tmpNameDescriptor.value = actionName;
    defineProperty(res, "name", tmpNameDescriptor);
  }
  return res;
}
function executeAction(actionName, canRunAsDerivation, fn, scope, args) {
  var runInfo = _startAction(actionName, canRunAsDerivation, scope, args);
  try {
    return fn.apply(scope, args);
  } catch (err) {
    runInfo.error_ = err;
    throw err;
  } finally {
    _endAction(runInfo);
  }
}
function _startAction(actionName, canRunAsDerivation,
// true for autoAction
scope, args) {
  var notifySpy_ =  true && isSpyEnabled() && !!actionName;
  var startTime_ = 0;
  if ( true && notifySpy_) {
    startTime_ = Date.now();
    var flattenedArgs = args ? Array.from(args) : EMPTY_ARRAY;
    spyReportStart({
      type: ACTION,
      name: actionName,
      object: scope,
      arguments: flattenedArgs
    });
  }
  var prevDerivation_ = globalState.trackingDerivation;
  var runAsAction = !canRunAsDerivation || !prevDerivation_;
  startBatch();
  var prevAllowStateChanges_ = globalState.allowStateChanges; // by default preserve previous allow
  if (runAsAction) {
    untrackedStart();
    prevAllowStateChanges_ = allowStateChangesStart(true);
  }
  var prevAllowStateReads_ = allowStateReadsStart(true);
  var runInfo = {
    runAsAction_: runAsAction,
    prevDerivation_: prevDerivation_,
    prevAllowStateChanges_: prevAllowStateChanges_,
    prevAllowStateReads_: prevAllowStateReads_,
    notifySpy_: notifySpy_,
    startTime_: startTime_,
    actionId_: nextActionId++,
    parentActionId_: currentActionId
  };
  currentActionId = runInfo.actionId_;
  return runInfo;
}
function _endAction(runInfo) {
  if (currentActionId !== runInfo.actionId_) {
    die(30);
  }
  currentActionId = runInfo.parentActionId_;
  if (runInfo.error_ !== undefined) {
    globalState.suppressReactionErrors = true;
  }
  allowStateChangesEnd(runInfo.prevAllowStateChanges_);
  allowStateReadsEnd(runInfo.prevAllowStateReads_);
  endBatch();
  if (runInfo.runAsAction_) {
    untrackedEnd(runInfo.prevDerivation_);
  }
  if ( true && runInfo.notifySpy_) {
    spyReportEnd({
      time: Date.now() - runInfo.startTime_
    });
  }
  globalState.suppressReactionErrors = false;
}
function allowStateChanges(allowStateChanges, func) {
  var prev = allowStateChangesStart(allowStateChanges);
  try {
    return func();
  } finally {
    allowStateChangesEnd(prev);
  }
}
function allowStateChangesStart(allowStateChanges) {
  var prev = globalState.allowStateChanges;
  globalState.allowStateChanges = allowStateChanges;
  return prev;
}
function allowStateChangesEnd(prev) {
  globalState.allowStateChanges = prev;
}
var _Symbol$toPrimitive;
var CREATE = "create";
_Symbol$toPrimitive = Symbol.toPrimitive;
var ObservableValue = /*#__PURE__*/function (_Atom) {
  _inheritsLoose(ObservableValue, _Atom);
  function ObservableValue(value, enhancer, name_, notifySpy, equals) {
    var _this;
    if (name_ === void 0) {
      name_ =  true ? "ObservableValue@" + getNextId() : 0;
    }
    if (notifySpy === void 0) {
      notifySpy = true;
    }
    if (equals === void 0) {
      equals = comparer["default"];
    }
    _this = _Atom.call(this, name_) || this;
    _this.enhancer = void 0;
    _this.name_ = void 0;
    _this.equals = void 0;
    _this.hasUnreportedChange_ = false;
    _this.interceptors_ = void 0;
    _this.changeListeners_ = void 0;
    _this.value_ = void 0;
    _this.dehancer = void 0;
    _this.enhancer = enhancer;
    _this.name_ = name_;
    _this.equals = equals;
    _this.value_ = enhancer(value, undefined, name_);
    if ( true && notifySpy && isSpyEnabled()) {
      // only notify spy if this is a stand-alone observable
      spyReport({
        type: CREATE,
        object: _assertThisInitialized(_this),
        observableKind: "value",
        debugObjectName: _this.name_,
        newValue: "" + _this.value_
      });
    }
    return _this;
  }
  var _proto = ObservableValue.prototype;
  _proto.dehanceValue = function dehanceValue(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.set = function set(newValue) {
    var oldValue = this.value_;
    newValue = this.prepareNewValue_(newValue);
    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      if ( true && notifySpy) {
        spyReportStart({
          type: UPDATE,
          object: this,
          observableKind: "value",
          debugObjectName: this.name_,
          newValue: newValue,
          oldValue: oldValue
        });
      }
      this.setNewValue_(newValue);
      if ( true && notifySpy) {
        spyReportEnd();
      }
    }
  };
  _proto.prepareNewValue_ = function prepareNewValue_(newValue) {
    checkIfStateModificationsAreAllowed(this);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this,
        type: UPDATE,
        newValue: newValue
      });
      if (!change) {
        return globalState.UNCHANGED;
      }
      newValue = change.newValue;
    }
    // apply modifier
    newValue = this.enhancer(newValue, this.value_, this.name_);
    return this.equals(this.value_, newValue) ? globalState.UNCHANGED : newValue;
  };
  _proto.setNewValue_ = function setNewValue_(newValue) {
    var oldValue = this.value_;
    this.value_ = newValue;
    this.reportChanged();
    if (hasListeners(this)) {
      notifyListeners(this, {
        type: UPDATE,
        object: this,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };
  _proto.get = function get() {
    this.reportObserved();
    return this.dehanceValue(this.value_);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately) {
      listener({
        observableKind: "value",
        debugObjectName: this.name_,
        object: this,
        type: UPDATE,
        newValue: this.value_,
        oldValue: undefined
      });
    }
    return registerListener(this, listener);
  };
  _proto.raw = function raw() {
    // used by MST ot get undehanced value
    return this.value_;
  };
  _proto.toJSON = function toJSON() {
    return this.get();
  };
  _proto.toString = function toString() {
    return this.name_ + "[" + this.value_ + "]";
  };
  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };
  _proto[_Symbol$toPrimitive] = function () {
    return this.valueOf();
  };
  return ObservableValue;
}(Atom);
var isObservableValue = /*#__PURE__*/createInstanceofPredicate("ObservableValue", ObservableValue);
var _Symbol$toPrimitive$1;
/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */
_Symbol$toPrimitive$1 = Symbol.toPrimitive;
var ComputedValue = /*#__PURE__*/function () {
  // nodes we are looking at. Our value depends on these nodes
  // during tracking it's an array with new observed observers

  // to check for cycles

  // N.B: unminified as it is used by MST

  /**
   * Create a new computed value based on a function expression.
   *
   * The `name` property is for debug purposes only.
   *
   * The `equals` property specifies the comparer function to use to determine if a newly produced
   * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
   * compares based on identity comparison (===), and `structuralComparer` deeply compares the structure.
   * Structural comparison can be convenient if you always produce a new aggregated object and
   * don't want to notify observers if it is structurally the same.
   * This is useful for working with vectors, mouse coordinates etc.
   */
  function ComputedValue(options) {
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.observing_ = [];
    this.newObserving_ = null;
    this.isBeingObserved_ = false;
    this.isPendingUnobservation_ = false;
    this.observers_ = new Set();
    this.diffValue_ = 0;
    this.runId_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    this.unboundDepsCount_ = 0;
    this.value_ = new CaughtException(null);
    this.name_ = void 0;
    this.triggeredBy_ = void 0;
    this.isComputing_ = false;
    this.isRunningSetter_ = false;
    this.derivation = void 0;
    this.setter_ = void 0;
    this.isTracing_ = TraceMode.NONE;
    this.scope_ = void 0;
    this.equals_ = void 0;
    this.requiresReaction_ = void 0;
    this.keepAlive_ = void 0;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    if (!options.get) {
      die(31);
    }
    this.derivation = options.get;
    this.name_ = options.name || ( true ? "ComputedValue@" + getNextId() : 0);
    if (options.set) {
      this.setter_ = createAction( true ? this.name_ + "-setter" : 0, options.set);
    }
    this.equals_ = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer["default"]);
    this.scope_ = options.context;
    this.requiresReaction_ = options.requiresReaction;
    this.keepAlive_ = !!options.keepAlive;
  }
  var _proto = ComputedValue.prototype;
  _proto.onBecomeStale_ = function onBecomeStale_() {
    propagateMaybeChanged(this);
  };
  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function (listener) {
        return listener();
      });
    }
  };
  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function (listener) {
        return listener();
      });
    }
  }
  /**
   * Returns the current value of this computed value.
   * Will evaluate its computation first if needed.
   */;
  _proto.get = function get() {
    if (this.isComputing_) {
      die(32, this.name_, this.derivation);
    }
    if (globalState.inBatch === 0 &&
    // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_) {
      if (shouldCompute(this)) {
        this.warnAboutUntrackedRead_();
        startBatch(); // See perf test 'computed memoization'
        this.value_ = this.computeValue_(false);
        endBatch();
      }
    } else {
      reportObserved(this);
      if (shouldCompute(this)) {
        var prevTrackingContext = globalState.trackingContext;
        if (this.keepAlive_ && !prevTrackingContext) {
          globalState.trackingContext = this;
        }
        if (this.trackAndCompute()) {
          propagateChangeConfirmed(this);
        }
        globalState.trackingContext = prevTrackingContext;
      }
    }
    var result = this.value_;
    if (isCaughtException(result)) {
      throw result.cause;
    }
    return result;
  };
  _proto.set = function set(value) {
    if (this.setter_) {
      if (this.isRunningSetter_) {
        die(33, this.name_);
      }
      this.isRunningSetter_ = true;
      try {
        this.setter_.call(this.scope_, value);
      } finally {
        this.isRunningSetter_ = false;
      }
    } else {
      die(34, this.name_);
    }
  };
  _proto.trackAndCompute = function trackAndCompute() {
    // N.B: unminified as it is used by MST
    var oldValue = this.value_;
    var wasSuspended = /* see #1208 */this.dependenciesState_ === IDerivationState_.NOT_TRACKING_;
    var newValue = this.computeValue_(true);
    var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals_(oldValue, newValue);
    if (changed) {
      this.value_ = newValue;
      if ( true && isSpyEnabled()) {
        spyReport({
          observableKind: "computed",
          debugObjectName: this.name_,
          object: this.scope_,
          type: "update",
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
    return changed;
  };
  _proto.computeValue_ = function computeValue_(track) {
    this.isComputing_ = true;
    // don't allow state changes during computation
    var prev = allowStateChangesStart(false);
    var res;
    if (track) {
      res = trackDerivedFunction(this, this.derivation, this.scope_);
    } else {
      if (globalState.disableErrorBoundaries === true) {
        res = this.derivation.call(this.scope_);
      } else {
        try {
          res = this.derivation.call(this.scope_);
        } catch (e) {
          res = new CaughtException(e);
        }
      }
    }
    allowStateChangesEnd(prev);
    this.isComputing_ = false;
    return res;
  };
  _proto.suspend_ = function suspend_() {
    if (!this.keepAlive_) {
      clearObserving(this);
      this.value_ = undefined; // don't hold on to computed value!
      if ( true && this.isTracing_ !== TraceMode.NONE) {
        console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access.");
      }
    }
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    var _this = this;
    var firstTime = true;
    var prevValue = undefined;
    return autorun(function () {
      // TODO: why is this in a different place than the spyReport() function? in all other observables it's called in the same place
      var newValue = _this.get();
      if (!firstTime || fireImmediately) {
        var prevU = untrackedStart();
        listener({
          observableKind: "computed",
          debugObjectName: _this.name_,
          type: UPDATE,
          object: _this,
          newValue: newValue,
          oldValue: prevValue
        });
        untrackedEnd(prevU);
      }
      firstTime = false;
      prevValue = newValue;
    });
  };
  _proto.warnAboutUntrackedRead_ = function warnAboutUntrackedRead_() {
    if (false) {}
    if (this.isTracing_ !== TraceMode.NONE) {
      console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
    if (typeof this.requiresReaction_ === "boolean" ? this.requiresReaction_ : globalState.computedRequiresReaction) {
      console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
  };
  _proto.toString = function toString() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  };
  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };
  _proto[_Symbol$toPrimitive$1] = function () {
    return this.valueOf();
  };
  return ComputedValue;
}();
var isComputedValue = /*#__PURE__*/createInstanceofPredicate("ComputedValue", ComputedValue);
var IDerivationState_;
(function (IDerivationState_) {
  // before being run or (outside batch and not being observed)
  // at this point derivation is not holding any data about dependency tree
  IDerivationState_[IDerivationState_["NOT_TRACKING_"] = -1] = "NOT_TRACKING_";
  // no shallow dependency changed since last computation
  // won't recalculate derivation
  // this is what makes mobx fast
  IDerivationState_[IDerivationState_["UP_TO_DATE_"] = 0] = "UP_TO_DATE_";
  // some deep dependency changed, but don't know if shallow dependency changed
  // will require to check first if UP_TO_DATE or POSSIBLY_STALE
  // currently only ComputedValue will propagate POSSIBLY_STALE
  //
  // having this state is second big optimization:
  // don't have to recompute on every dependency change, but only when it's needed
  IDerivationState_[IDerivationState_["POSSIBLY_STALE_"] = 1] = "POSSIBLY_STALE_";
  // A shallow dependency has changed since last computation and the derivation
  // will need to recompute when it's needed next.
  IDerivationState_[IDerivationState_["STALE_"] = 2] = "STALE_";
})(IDerivationState_ || (IDerivationState_ = {}));
var TraceMode;
(function (TraceMode) {
  TraceMode[TraceMode["NONE"] = 0] = "NONE";
  TraceMode[TraceMode["LOG"] = 1] = "LOG";
  TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));
var CaughtException = function CaughtException(cause) {
  this.cause = void 0;
  this.cause = cause;
  // Empty
};

function isCaughtException(e) {
  return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */
function shouldCompute(derivation) {
  switch (derivation.dependenciesState_) {
    case IDerivationState_.UP_TO_DATE_:
      return false;
    case IDerivationState_.NOT_TRACKING_:
    case IDerivationState_.STALE_:
      return true;
    case IDerivationState_.POSSIBLY_STALE_:
      {
        // state propagation can occur outside of action/reactive context #2195
        var prevAllowStateReads = allowStateReadsStart(true);
        var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.
        var obs = derivation.observing_,
          l = obs.length;
        for (var i = 0; i < l; i++) {
          var obj = obs[i];
          if (isComputedValue(obj)) {
            if (globalState.disableErrorBoundaries) {
              obj.get();
            } else {
              try {
                obj.get();
              } catch (e) {
                // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                untrackedEnd(prevUntracked);
                allowStateReadsEnd(prevAllowStateReads);
                return true;
              }
            }
            // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
            // and `derivation` is an observer of `obj`
            // invariantShouldCompute(derivation)
            if (derivation.dependenciesState_ === IDerivationState_.STALE_) {
              untrackedEnd(prevUntracked);
              allowStateReadsEnd(prevAllowStateReads);
              return true;
            }
          }
        }
        changeDependenciesStateTo0(derivation);
        untrackedEnd(prevUntracked);
        allowStateReadsEnd(prevAllowStateReads);
        return false;
      }
  }
}
function isComputingDerivation() {
  return globalState.trackingDerivation !== null; // filter out actions inside computations
}

function checkIfStateModificationsAreAllowed(atom) {
  if (false) {}
  var hasObservers = atom.observers_.size > 0;
  // Should not be possible to change observed state outside strict mode, except during initialization, see #563
  if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "always")) {
    console.warn("[MobX] " + (globalState.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + atom.name_);
  }
}
function checkIfStateReadsAreAllowed(observable) {
  if ( true && !globalState.allowStateReads && globalState.observableRequiresReaction) {
    console.warn("[mobx] Observable '" + observable.name_ + "' being read outside a reactive context.");
  }
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */
function trackDerivedFunction(derivation, f, context) {
  var prevAllowStateReads = allowStateReadsStart(true);
  // pre allocate array allocation + room for variation in deps
  // array will be trimmed by bindDependencies
  changeDependenciesStateTo0(derivation);
  derivation.newObserving_ = new Array(derivation.observing_.length + 100);
  derivation.unboundDepsCount_ = 0;
  derivation.runId_ = ++globalState.runId;
  var prevTracking = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  globalState.inBatch++;
  var result;
  if (globalState.disableErrorBoundaries === true) {
    result = f.call(context);
  } else {
    try {
      result = f.call(context);
    } catch (e) {
      result = new CaughtException(e);
    }
  }
  globalState.inBatch--;
  globalState.trackingDerivation = prevTracking;
  bindDependencies(derivation);
  warnAboutDerivationWithoutDependencies(derivation);
  allowStateReadsEnd(prevAllowStateReads);
  return result;
}
function warnAboutDerivationWithoutDependencies(derivation) {
  if (false) {}
  if (derivation.observing_.length !== 0) {
    return;
  }
  if (typeof derivation.requiresObservable_ === "boolean" ? derivation.requiresObservable_ : globalState.reactionRequiresObservable) {
    console.warn("[mobx] Derivation '" + derivation.name_ + "' is created/updated without reading any observable value.");
  }
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */
function bindDependencies(derivation) {
  // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
  var prevObserving = derivation.observing_;
  var observing = derivation.observing_ = derivation.newObserving_;
  var lowestNewObservingDerivationState = IDerivationState_.UP_TO_DATE_;
  // Go through all new observables and check diffValue: (this list can contain duplicates):
  //   0: first occurrence, change to 1 and keep it
  //   1: extra occurrence, drop it
  var i0 = 0,
    l = derivation.unboundDepsCount_;
  for (var i = 0; i < l; i++) {
    var dep = observing[i];
    if (dep.diffValue_ === 0) {
      dep.diffValue_ = 1;
      if (i0 !== i) {
        observing[i0] = dep;
      }
      i0++;
    }
    // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
    // not hitting the condition
    if (dep.dependenciesState_ > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = dep.dependenciesState_;
    }
  }
  observing.length = i0;
  derivation.newObserving_ = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
  // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
  //   0: it's not in new observables, unobserve it
  //   1: it keeps being observed, don't want to notify it. change to 0
  l = prevObserving.length;
  while (l--) {
    var _dep = prevObserving[l];
    if (_dep.diffValue_ === 0) {
      removeObserver(_dep, derivation);
    }
    _dep.diffValue_ = 0;
  }
  // Go through all new observables and check diffValue: (now it should be unique)
  //   0: it was set to 0 in last loop. don't need to do anything.
  //   1: it wasn't observed, let's observe it. set back to 0
  while (i0--) {
    var _dep2 = observing[i0];
    if (_dep2.diffValue_ === 1) {
      _dep2.diffValue_ = 0;
      addObserver(_dep2, derivation);
    }
  }
  // Some new observed derivations may become stale during this derivation computation
  // so they have had no chance to propagate staleness (#916)
  if (lowestNewObservingDerivationState !== IDerivationState_.UP_TO_DATE_) {
    derivation.dependenciesState_ = lowestNewObservingDerivationState;
    derivation.onBecomeStale_();
  }
}
function clearObserving(derivation) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
  var obs = derivation.observing_;
  derivation.observing_ = [];
  var i = obs.length;
  while (i--) {
    removeObserver(obs[i], derivation);
  }
  derivation.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
}
function untracked(action) {
  var prev = untrackedStart();
  try {
    return action();
  } finally {
    untrackedEnd(prev);
  }
}
function untrackedStart() {
  var prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}
function untrackedEnd(prev) {
  globalState.trackingDerivation = prev;
}
function allowStateReadsStart(allowStateReads) {
  var prev = globalState.allowStateReads;
  globalState.allowStateReads = allowStateReads;
  return prev;
}
function allowStateReadsEnd(prev) {
  globalState.allowStateReads = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */
function changeDependenciesStateTo0(derivation) {
  if (derivation.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
    return;
  }
  derivation.dependenciesState_ = IDerivationState_.UP_TO_DATE_;
  var obs = derivation.observing_;
  var i = obs.length;
  while (i--) {
    obs[i].lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
  }
}

/**
 * These values will persist if global state is reset
 */
var persistentKeys = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED", "useProxies"];
var MobXGlobals = function MobXGlobals() {
  this.version = 6;
  this.UNCHANGED = {};
  this.trackingDerivation = null;
  this.trackingContext = null;
  this.runId = 0;
  this.mobxGuid = 0;
  this.inBatch = 0;
  this.pendingUnobservations = [];
  this.pendingReactions = [];
  this.isRunningReactions = false;
  this.allowStateChanges = false;
  this.allowStateReads = true;
  this.enforceActions = true;
  this.spyListeners = [];
  this.globalReactionErrorHandlers = [];
  this.computedRequiresReaction = false;
  this.reactionRequiresObservable = false;
  this.observableRequiresReaction = false;
  this.disableErrorBoundaries = false;
  this.suppressReactionErrors = false;
  this.useProxies = true;
  this.verifyProxies = false;
  this.safeDescriptors = true;
  this.stateVersion = Number.MIN_SAFE_INTEGER;
};
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = /*#__PURE__*/function () {
  var global = /*#__PURE__*/getGlobal();
  if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals) {
    canMergeGlobalState = false;
  }
  if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version) {
    canMergeGlobalState = false;
  }
  if (!canMergeGlobalState) {
    // Because this is a IIFE we need to let isolateCalled a chance to change
    // so we run it after the event loop completed at least 1 iteration
    setTimeout(function () {
      if (!isolateCalled) {
        die(35);
      }
    }, 1);
    return new MobXGlobals();
  } else if (global.__mobxGlobals) {
    global.__mobxInstanceCount += 1;
    if (!global.__mobxGlobals.UNCHANGED) {
      global.__mobxGlobals.UNCHANGED = {};
    } // make merge backward compatible
    return global.__mobxGlobals;
  } else {
    global.__mobxInstanceCount = 1;
    return global.__mobxGlobals = /*#__PURE__*/new MobXGlobals();
  }
}();
function isolateGlobalState() {
  if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) {
    die(36);
  }
  isolateCalled = true;
  if (canMergeGlobalState) {
    var global = getGlobal();
    if (--global.__mobxInstanceCount === 0) {
      global.__mobxGlobals = undefined;
    }
    globalState = new MobXGlobals();
  }
}
function getGlobalState() {
  return globalState;
}
/**
 * For testing purposes only; this will break the internal state of existing observables,
 * but can be used to get back at a stable state after throwing errors
 */
function resetGlobalState() {
  var defaultGlobals = new MobXGlobals();
  for (var key in defaultGlobals) {
    if (persistentKeys.indexOf(key) === -1) {
      globalState[key] = defaultGlobals[key];
    }
  }
  globalState.allowStateChanges = !globalState.enforceActions;
}
function hasObservers(observable) {
  return observable.observers_ && observable.observers_.size > 0;
}
function getObservers(observable) {
  return observable.observers_;
}
// function invariantObservers(observable: IObservable) {
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }
function addObserver(observable, node) {
  // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
  // invariantObservers(observable);
  observable.observers_.add(node);
  if (observable.lowestObserverState_ > node.dependenciesState_) {
    observable.lowestObserverState_ = node.dependenciesState_;
  }
  // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
}

function removeObserver(observable, node) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
  // invariantObservers(observable);
  observable.observers_["delete"](node);
  if (observable.observers_.size === 0) {
    // deleting last observer
    queueForUnobservation(observable);
  }
  // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");
}

function queueForUnobservation(observable) {
  if (observable.isPendingUnobservation_ === false) {
    // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
    observable.isPendingUnobservation_ = true;
    globalState.pendingUnobservations.push(observable);
  }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */
function startBatch() {
  globalState.inBatch++;
}
function endBatch() {
  if (--globalState.inBatch === 0) {
    runReactions();
    // the batch is actually about to finish, all unobserving should happen here.
    var list = globalState.pendingUnobservations;
    for (var i = 0; i < list.length; i++) {
      var observable = list[i];
      observable.isPendingUnobservation_ = false;
      if (observable.observers_.size === 0) {
        if (observable.isBeingObserved_) {
          // if this observable had reactive observers, trigger the hooks
          observable.isBeingObserved_ = false;
          observable.onBUO();
        }
        if (observable instanceof ComputedValue) {
          // computed values are automatically teared down when the last observer leaves
          // this process happens recursively, this computed might be the last observabe of another, etc..
          observable.suspend_();
        }
      }
    }
    globalState.pendingUnobservations = [];
  }
}
function reportObserved(observable) {
  checkIfStateReadsAreAllowed(observable);
  var derivation = globalState.trackingDerivation;
  if (derivation !== null) {
    /**
     * Simple optimization, give each derivation run an unique id (runId)
     * Check if last time this observable was accessed the same runId is used
     * if this is the case, the relation is already known
     */
    if (derivation.runId_ !== observable.lastAccessedBy_) {
      observable.lastAccessedBy_ = derivation.runId_;
      // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...
      derivation.newObserving_[derivation.unboundDepsCount_++] = observable;
      if (!observable.isBeingObserved_ && globalState.trackingContext) {
        observable.isBeingObserved_ = true;
        observable.onBO();
      }
    }
    return observable.isBeingObserved_;
  } else if (observable.observers_.size === 0 && globalState.inBatch > 0) {
    queueForUnobservation(observable);
  }
  return false;
}
// function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }
/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes
function propagateChanged(observable) {
  // invariantLOS(observable, "changed start");
  if (observable.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }
  observable.lowestObserverState_ = IDerivationState_.STALE_;
  // Ideally we use for..of here, but the downcompiled version is really slow...
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      if ( true && d.isTracing_ !== TraceMode.NONE) {
        logTraceInfo(d, observable);
      }
      d.onBecomeStale_();
    }
    d.dependenciesState_ = IDerivationState_.STALE_;
  });
  // invariantLOS(observable, "changed end");
}
// Called by ComputedValue when it recalculate and its value changed
function propagateChangeConfirmed(observable) {
  // invariantLOS(observable, "confirmed start");
  if (observable.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }
  observable.lowestObserverState_ = IDerivationState_.STALE_;
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.POSSIBLY_STALE_) {
      d.dependenciesState_ = IDerivationState_.STALE_;
      if ( true && d.isTracing_ !== TraceMode.NONE) {
        logTraceInfo(d, observable);
      }
    } else if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_ // this happens during computing of `d`, just keep lowestObserverState up to date.
    ) {
      observable.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    }
  });
  // invariantLOS(observable, "confirmed end");
}
// Used by computed when its dependency changed, but we don't wan't to immediately recompute.
function propagateMaybeChanged(observable) {
  // invariantLOS(observable, "maybe start");
  if (observable.lowestObserverState_ !== IDerivationState_.UP_TO_DATE_) {
    return;
  }
  observable.lowestObserverState_ = IDerivationState_.POSSIBLY_STALE_;
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      d.dependenciesState_ = IDerivationState_.POSSIBLY_STALE_;
      d.onBecomeStale_();
    }
  });
  // invariantLOS(observable, "maybe end");
}

function logTraceInfo(derivation, observable) {
  console.log("[mobx.trace] '" + derivation.name_ + "' is invalidated due to a change in: '" + observable.name_ + "'");
  if (derivation.isTracing_ === TraceMode.BREAK) {
    var lines = [];
    printDepTree(getDependencyTree(derivation), lines, 1);
    // prettier-ignore
    new Function("debugger;\n/*\nTracing '" + derivation.name_ + "'\n\nYou are entering this break point because derivation '" + derivation.name_ + "' is being traced and '" + observable.name_ + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
  }
}
function printDepTree(tree, lines, depth) {
  if (lines.length >= 1000) {
    lines.push("(and many more)");
    return;
  }
  lines.push("" + "\t".repeat(depth - 1) + tree.name);
  if (tree.dependencies) {
    tree.dependencies.forEach(function (child) {
      return printDepTree(child, lines, depth + 1);
    });
  }
}
var Reaction = /*#__PURE__*/function () {
  // nodes we are looking at. Our value depends on these nodes

  function Reaction(name_, onInvalidate_, errorHandler_, requiresObservable_) {
    if (name_ === void 0) {
      name_ =  true ? "Reaction@" + getNextId() : 0;
    }
    this.name_ = void 0;
    this.onInvalidate_ = void 0;
    this.errorHandler_ = void 0;
    this.requiresObservable_ = void 0;
    this.observing_ = [];
    this.newObserving_ = [];
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.diffValue_ = 0;
    this.runId_ = 0;
    this.unboundDepsCount_ = 0;
    this.isDisposed_ = false;
    this.isScheduled_ = false;
    this.isTrackPending_ = false;
    this.isRunning_ = false;
    this.isTracing_ = TraceMode.NONE;
    this.name_ = name_;
    this.onInvalidate_ = onInvalidate_;
    this.errorHandler_ = errorHandler_;
    this.requiresObservable_ = requiresObservable_;
  }
  var _proto = Reaction.prototype;
  _proto.onBecomeStale_ = function onBecomeStale_() {
    this.schedule_();
  };
  _proto.schedule_ = function schedule_() {
    if (!this.isScheduled_) {
      this.isScheduled_ = true;
      globalState.pendingReactions.push(this);
      runReactions();
    }
  };
  _proto.isScheduled = function isScheduled() {
    return this.isScheduled_;
  }
  /**
   * internal, use schedule() if you intend to kick off a reaction
   */;
  _proto.runReaction_ = function runReaction_() {
    if (!this.isDisposed_) {
      startBatch();
      this.isScheduled_ = false;
      var prev = globalState.trackingContext;
      globalState.trackingContext = this;
      if (shouldCompute(this)) {
        this.isTrackPending_ = true;
        try {
          this.onInvalidate_();
          if ( true && this.isTrackPending_ && isSpyEnabled()) {
            // onInvalidate didn't trigger track right away..
            spyReport({
              name: this.name_,
              type: "scheduled-reaction"
            });
          }
        } catch (e) {
          this.reportExceptionInDerivation_(e);
        }
      }
      globalState.trackingContext = prev;
      endBatch();
    }
  };
  _proto.track = function track(fn) {
    if (this.isDisposed_) {
      return;
      // console.warn("Reaction already disposed") // Note: Not a warning / error in mobx 4 either
    }

    startBatch();
    var notify = isSpyEnabled();
    var startTime;
    if ( true && notify) {
      startTime = Date.now();
      spyReportStart({
        name: this.name_,
        type: "reaction"
      });
    }
    this.isRunning_ = true;
    var prevReaction = globalState.trackingContext; // reactions could create reactions...
    globalState.trackingContext = this;
    var result = trackDerivedFunction(this, fn, undefined);
    globalState.trackingContext = prevReaction;
    this.isRunning_ = false;
    this.isTrackPending_ = false;
    if (this.isDisposed_) {
      // disposed during last run. Clean up everything that was bound after the dispose call.
      clearObserving(this);
    }
    if (isCaughtException(result)) {
      this.reportExceptionInDerivation_(result.cause);
    }
    if ( true && notify) {
      spyReportEnd({
        time: Date.now() - startTime
      });
    }
    endBatch();
  };
  _proto.reportExceptionInDerivation_ = function reportExceptionInDerivation_(error) {
    var _this = this;
    if (this.errorHandler_) {
      this.errorHandler_(error, this);
      return;
    }
    if (globalState.disableErrorBoundaries) {
      throw error;
    }
    var message =  true ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : 0;
    if (!globalState.suppressReactionErrors) {
      console.error(message, error);
      /** If debugging brought you here, please, read the above message :-). Tnx! */
    } else if (true) {
      console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)");
    } // prettier-ignore
    if ( true && isSpyEnabled()) {
      spyReport({
        type: "error",
        name: this.name_,
        message: message,
        error: "" + error
      });
    }
    globalState.globalReactionErrorHandlers.forEach(function (f) {
      return f(error, _this);
    });
  };
  _proto.dispose = function dispose() {
    if (!this.isDisposed_) {
      this.isDisposed_ = true;
      if (!this.isRunning_) {
        // if disposed while running, clean up later. Maybe not optimal, but rare case
        startBatch();
        clearObserving(this);
        endBatch();
      }
    }
  };
  _proto.getDisposer_ = function getDisposer_(abortSignal) {
    var _this2 = this;
    var dispose = function dispose() {
      _this2.dispose();
      abortSignal == null ? void 0 : abortSignal.removeEventListener == null ? void 0 : abortSignal.removeEventListener("abort", dispose);
    };
    abortSignal == null ? void 0 : abortSignal.addEventListener == null ? void 0 : abortSignal.addEventListener("abort", dispose);
    dispose[$mobx] = this;
    return dispose;
  };
  _proto.toString = function toString() {
    return "Reaction[" + this.name_ + "]";
  };
  _proto.trace = function trace$1(enterBreakPoint) {
    if (enterBreakPoint === void 0) {
      enterBreakPoint = false;
    }
    trace(this, enterBreakPoint);
  };
  return Reaction;
}();
function onReactionError(handler) {
  globalState.globalReactionErrorHandlers.push(handler);
  return function () {
    var idx = globalState.globalReactionErrorHandlers.indexOf(handler);
    if (idx >= 0) {
      globalState.globalReactionErrorHandlers.splice(idx, 1);
    }
  };
}
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */
var MAX_REACTION_ITERATIONS = 100;
var reactionScheduler = function reactionScheduler(f) {
  return f();
};
function runReactions() {
  // Trampolining, if runReactions are already running, new reactions will be picked up
  if (globalState.inBatch > 0 || globalState.isRunningReactions) {
    return;
  }
  reactionScheduler(runReactionsHelper);
}
function runReactionsHelper() {
  globalState.isRunningReactions = true;
  var allReactions = globalState.pendingReactions;
  var iterations = 0;
  // While running reactions, new reactions might be triggered.
  // Hence we work with two variables and check whether
  // we converge to no remaining reactions after a while.
  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error( true ? "Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." + (" Probably there is a cycle in the reactive function: " + allReactions[0]) : 0);
      allReactions.splice(0); // clear reactions
    }

    var remainingReactions = allReactions.splice(0);
    for (var i = 0, l = remainingReactions.length; i < l; i++) {
      remainingReactions[i].runReaction_();
    }
  }
  globalState.isRunningReactions = false;
}
var isReaction = /*#__PURE__*/createInstanceofPredicate("Reaction", Reaction);
function setReactionScheduler(fn) {
  var baseScheduler = reactionScheduler;
  reactionScheduler = function reactionScheduler(f) {
    return fn(function () {
      return baseScheduler(f);
    });
  };
}
function isSpyEnabled() {
  return  true && !!globalState.spyListeners.length;
}
function spyReport(event) {
  if (false) {} // dead code elimination can do the rest
  if (!globalState.spyListeners.length) {
    return;
  }
  var listeners = globalState.spyListeners;
  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](event);
  }
}
function spyReportStart(event) {
  if (false) {}
  var change = _extends({}, event, {
    spyReportStart: true
  });
  spyReport(change);
}
var END_EVENT = {
  type: "report-end",
  spyReportEnd: true
};
function spyReportEnd(change) {
  if (false) {}
  if (change) {
    spyReport(_extends({}, change, {
      type: "report-end",
      spyReportEnd: true
    }));
  } else {
    spyReport(END_EVENT);
  }
}
function spy(listener) {
  if (false) {} else {
    globalState.spyListeners.push(listener);
    return once(function () {
      globalState.spyListeners = globalState.spyListeners.filter(function (l) {
        return l !== listener;
      });
    });
  }
}
var ACTION = "action";
var ACTION_BOUND = "action.bound";
var AUTOACTION = "autoAction";
var AUTOACTION_BOUND = "autoAction.bound";
var DEFAULT_ACTION_NAME = "<unnamed action>";
var actionAnnotation = /*#__PURE__*/createActionAnnotation(ACTION);
var actionBoundAnnotation = /*#__PURE__*/createActionAnnotation(ACTION_BOUND, {
  bound: true
});
var autoActionAnnotation = /*#__PURE__*/createActionAnnotation(AUTOACTION, {
  autoAction: true
});
var autoActionBoundAnnotation = /*#__PURE__*/createActionAnnotation(AUTOACTION_BOUND, {
  autoAction: true,
  bound: true
});
function createActionFactory(autoAction) {
  var res = function action(arg1, arg2) {
    // action(fn() {})
    if (isFunction(arg1)) {
      return createAction(arg1.name || DEFAULT_ACTION_NAME, arg1, autoAction);
    }
    // action("name", fn() {})
    if (isFunction(arg2)) {
      return createAction(arg1, arg2, autoAction);
    }
    // @action
    if (isStringish(arg2)) {
      return storeAnnotation(arg1, arg2, autoAction ? autoActionAnnotation : actionAnnotation);
    }
    // action("name") & @action("name")
    if (isStringish(arg1)) {
      return createDecoratorAnnotation(createActionAnnotation(autoAction ? AUTOACTION : ACTION, {
        name: arg1,
        autoAction: autoAction
      }));
    }
    if (true) {
      die("Invalid arguments for `action`");
    }
  };
  return res;
}
var action = /*#__PURE__*/createActionFactory(false);
Object.assign(action, actionAnnotation);
var autoAction = /*#__PURE__*/createActionFactory(true);
Object.assign(autoAction, autoActionAnnotation);
action.bound = /*#__PURE__*/createDecoratorAnnotation(actionBoundAnnotation);
autoAction.bound = /*#__PURE__*/createDecoratorAnnotation(autoActionBoundAnnotation);
function runInAction(fn) {
  return executeAction(fn.name || DEFAULT_ACTION_NAME, false, fn, this, undefined);
}
function isAction(thing) {
  return isFunction(thing) && thing.isMobxAction === true;
}

/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
function autorun(view, opts) {
  var _opts$name, _opts, _opts2, _opts2$signal, _opts3;
  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }
  if (true) {
    if (!isFunction(view)) {
      die("Autorun expects a function as first argument");
    }
    if (isAction(view)) {
      die("Autorun does not accept actions since actions are untrackable");
    }
  }
  var name = (_opts$name = (_opts = opts) == null ? void 0 : _opts.name) != null ? _opts$name :  true ? view.name || "Autorun@" + getNextId() : 0;
  var runSync = !opts.scheduler && !opts.delay;
  var reaction;
  if (runSync) {
    // normal autorun
    reaction = new Reaction(name, function () {
      this.track(reactionRunner);
    }, opts.onError, opts.requiresObservable);
  } else {
    var scheduler = createSchedulerFromOptions(opts);
    // debounced autorun
    var isScheduled = false;
    reaction = new Reaction(name, function () {
      if (!isScheduled) {
        isScheduled = true;
        scheduler(function () {
          isScheduled = false;
          if (!reaction.isDisposed_) {
            reaction.track(reactionRunner);
          }
        });
      }
    }, opts.onError, opts.requiresObservable);
  }
  function reactionRunner() {
    view(reaction);
  }
  if (!((_opts2 = opts) != null && (_opts2$signal = _opts2.signal) != null && _opts2$signal.aborted)) {
    reaction.schedule_();
  }
  return reaction.getDisposer_((_opts3 = opts) == null ? void 0 : _opts3.signal);
}
var run = function run(f) {
  return f();
};
function createSchedulerFromOptions(opts) {
  return opts.scheduler ? opts.scheduler : opts.delay ? function (f) {
    return setTimeout(f, opts.delay);
  } : run;
}
function reaction(expression, effect, opts) {
  var _opts$name2, _opts4, _opts4$signal, _opts5;
  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }
  if (true) {
    if (!isFunction(expression) || !isFunction(effect)) {
      die("First and second argument to reaction should be functions");
    }
    if (!isPlainObject(opts)) {
      die("Third argument of reactions should be an object");
    }
  }
  var name = (_opts$name2 = opts.name) != null ? _opts$name2 :  true ? "Reaction@" + getNextId() : 0;
  var effectAction = action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
  var runSync = !opts.scheduler && !opts.delay;
  var scheduler = createSchedulerFromOptions(opts);
  var firstTime = true;
  var isScheduled = false;
  var value;
  var oldValue;
  var equals = opts.compareStructural ? comparer.structural : opts.equals || comparer["default"];
  var r = new Reaction(name, function () {
    if (firstTime || runSync) {
      reactionRunner();
    } else if (!isScheduled) {
      isScheduled = true;
      scheduler(reactionRunner);
    }
  }, opts.onError, opts.requiresObservable);
  function reactionRunner() {
    isScheduled = false;
    if (r.isDisposed_) {
      return;
    }
    var changed = false;
    r.track(function () {
      var nextValue = allowStateChanges(false, function () {
        return expression(r);
      });
      changed = firstTime || !equals(value, nextValue);
      oldValue = value;
      value = nextValue;
    });
    if (firstTime && opts.fireImmediately) {
      effectAction(value, oldValue, r);
    } else if (!firstTime && changed) {
      effectAction(value, oldValue, r);
    }
    firstTime = false;
  }
  if (!((_opts4 = opts) != null && (_opts4$signal = _opts4.signal) != null && _opts4$signal.aborted)) {
    r.schedule_();
  }
  return r.getDisposer_((_opts5 = opts) == null ? void 0 : _opts5.signal);
}
function wrapErrorHandler(errorHandler, baseFn) {
  return function () {
    try {
      return baseFn.apply(this, arguments);
    } catch (e) {
      errorHandler.call(this, e);
    }
  };
}
var ON_BECOME_OBSERVED = "onBO";
var ON_BECOME_UNOBSERVED = "onBUO";
function onBecomeObserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_OBSERVED, thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_UNOBSERVED, thing, arg2, arg3);
}
function interceptHook(hook, thing, arg2, arg3) {
  var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
  var cb = isFunction(arg3) ? arg3 : arg2;
  var listenersKey = hook + "L";
  if (atom[listenersKey]) {
    atom[listenersKey].add(cb);
  } else {
    atom[listenersKey] = new Set([cb]);
  }
  return function () {
    var hookListeners = atom[listenersKey];
    if (hookListeners) {
      hookListeners["delete"](cb);
      if (hookListeners.size === 0) {
        delete atom[listenersKey];
      }
    }
  };
}
var NEVER = "never";
var ALWAYS = "always";
var OBSERVED = "observed";
// const IF_AVAILABLE = "ifavailable"
function configure(options) {
  if (options.isolateGlobalState === true) {
    isolateGlobalState();
  }
  var useProxies = options.useProxies,
    enforceActions = options.enforceActions;
  if (useProxies !== undefined) {
    globalState.useProxies = useProxies === ALWAYS ? true : useProxies === NEVER ? false : typeof Proxy !== "undefined";
  }
  if (useProxies === "ifavailable") {
    globalState.verifyProxies = true;
  }
  if (enforceActions !== undefined) {
    var ea = enforceActions === ALWAYS ? ALWAYS : enforceActions === OBSERVED;
    globalState.enforceActions = ea;
    globalState.allowStateChanges = ea === true || ea === ALWAYS ? false : true;
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function (key) {
    if (key in options) {
      globalState[key] = !!options[key];
    }
  });
  globalState.allowStateReads = !globalState.observableRequiresReaction;
  if ( true && globalState.disableErrorBoundaries === true) {
    console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
  }
  if (options.reactionScheduler) {
    setReactionScheduler(options.reactionScheduler);
  }
}
function extendObservable(target, properties, annotations, options) {
  if (true) {
    if (arguments.length > 4) {
      die("'extendObservable' expected 2-4 arguments");
    }
    if (_typeof(target) !== "object") {
      die("'extendObservable' expects an object as first argument");
    }
    if (isObservableMap(target)) {
      die("'extendObservable' should not be used on maps, use map.merge instead");
    }
    if (!isPlainObject(properties)) {
      die("'extendObservable' only accepts plain objects as second argument");
    }
    if (isObservable(properties) || isObservable(annotations)) {
      die("Extending an object with another observable (object) is not supported");
    }
  }
  // Pull descriptors first, so we don't have to deal with props added by administration ($mobx)
  var descriptors = getOwnPropertyDescriptors(properties);
  var adm = asObservableObject(target, options)[$mobx];
  startBatch();
  try {
    ownKeys(descriptors).forEach(function (key) {
      adm.extend_(key, descriptors[key],
      // must pass "undefined" for { key: undefined }
      !annotations ? true : key in annotations ? annotations[key] : true);
    });
  } finally {
    endBatch();
  }
  return target;
}
function getDependencyTree(thing, property) {
  return nodeToDependencyTree(getAtom(thing, property));
}
function nodeToDependencyTree(node) {
  var result = {
    name: node.name_
  };
  if (node.observing_ && node.observing_.length > 0) {
    result.dependencies = unique(node.observing_).map(nodeToDependencyTree);
  }
  return result;
}
function getObserverTree(thing, property) {
  return nodeToObserverTree(getAtom(thing, property));
}
function nodeToObserverTree(node) {
  var result = {
    name: node.name_
  };
  if (hasObservers(node)) {
    result.observers = Array.from(getObservers(node)).map(nodeToObserverTree);
  }
  return result;
}
function unique(list) {
  return Array.from(new Set(list));
}
var generatorId = 0;
function FlowCancellationError() {
  this.message = "FLOW_CANCELLED";
}
FlowCancellationError.prototype = /*#__PURE__*/Object.create(Error.prototype);
function isFlowCancellationError(error) {
  return error instanceof FlowCancellationError;
}
var flowAnnotation = /*#__PURE__*/createFlowAnnotation("flow");
var flowBoundAnnotation = /*#__PURE__*/createFlowAnnotation("flow.bound", {
  bound: true
});
var flow = /*#__PURE__*/Object.assign(function flow(arg1, arg2) {
  // @flow
  if (isStringish(arg2)) {
    return storeAnnotation(arg1, arg2, flowAnnotation);
  }
  // flow(fn)
  if ( true && arguments.length !== 1) {
    die("Flow expects single argument with generator function");
  }
  var generator = arg1;
  var name = generator.name || "<unnamed flow>";
  // Implementation based on https://github.com/tj/co/blob/master/index.js
  var res = function res() {
    var ctx = this;
    var args = arguments;
    var runId = ++generatorId;
    var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
    var rejector;
    var pendingPromise = undefined;
    var promise = new Promise(function (resolve, reject) {
      var stepId = 0;
      rejector = reject;
      function onFulfilled(res) {
        pendingPromise = undefined;
        var ret;
        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      function onRejected(err) {
        pendingPromise = undefined;
        var ret;
        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen["throw"]).call(gen, err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      function next(ret) {
        if (isFunction(ret == null ? void 0 : ret.then)) {
          // an async iterator
          ret.then(next, reject);
          return;
        }
        if (ret.done) {
          return resolve(ret.value);
        }
        pendingPromise = Promise.resolve(ret.value);
        return pendingPromise.then(onFulfilled, onRejected);
      }
      onFulfilled(undefined); // kick off the process
    });

    promise.cancel = action(name + " - runid: " + runId + " - cancel", function () {
      try {
        if (pendingPromise) {
          cancelPromise(pendingPromise);
        }
        // Finally block can return (or yield) stuff..
        var _res = gen["return"](undefined);
        // eat anything that promise would do, it's cancelled!
        var yieldedPromise = Promise.resolve(_res.value);
        yieldedPromise.then(noop, noop);
        cancelPromise(yieldedPromise); // maybe it can be cancelled :)
        // reject our original promise
        rejector(new FlowCancellationError());
      } catch (e) {
        rejector(e); // there could be a throwing finally block
      }
    });

    return promise;
  };
  res.isMobXFlow = true;
  return res;
}, flowAnnotation);
flow.bound = /*#__PURE__*/createDecoratorAnnotation(flowBoundAnnotation);
function cancelPromise(promise) {
  if (isFunction(promise.cancel)) {
    promise.cancel();
  }
}
function flowResult(result) {
  return result; // just tricking TypeScript :)
}

function isFlow(fn) {
  return (fn == null ? void 0 : fn.isMobXFlow) === true;
}
function interceptReads(thing, propOrHandler, handler) {
  var target;
  if (isObservableMap(thing) || isObservableArray(thing) || isObservableValue(thing)) {
    target = getAdministration(thing);
  } else if (isObservableObject(thing)) {
    if ( true && !isStringish(propOrHandler)) {
      return die("InterceptReads can only be used with a specific property, not with an object in general");
    }
    target = getAdministration(thing, propOrHandler);
  } else if (true) {
    return die("Expected observable map, object or array as first array");
  }
  if ( true && target.dehancer !== undefined) {
    return die("An intercept reader was already established");
  }
  target.dehancer = typeof propOrHandler === "function" ? propOrHandler : handler;
  return function () {
    target.dehancer = undefined;
  };
}
function intercept(thing, propOrHandler, handler) {
  if (isFunction(handler)) {
    return interceptProperty(thing, propOrHandler, handler);
  } else {
    return interceptInterceptable(thing, propOrHandler);
  }
}
function interceptInterceptable(thing, handler) {
  return getAdministration(thing).intercept_(handler);
}
function interceptProperty(thing, property, handler) {
  return getAdministration(thing, property).intercept_(handler);
}
function _isComputed(value, property) {
  if (property === undefined) {
    return isComputedValue(value);
  }
  if (isObservableObject(value) === false) {
    return false;
  }
  if (!value[$mobx].values_.has(property)) {
    return false;
  }
  var atom = getAtom(value, property);
  return isComputedValue(atom);
}
function isComputed(value) {
  if ( true && arguments.length > 1) {
    return die("isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property");
  }
  return _isComputed(value);
}
function isComputedProp(value, propName) {
  if ( true && !isStringish(propName)) {
    return die("isComputed expected a property name as second argument");
  }
  return _isComputed(value, propName);
}
function _isObservable(value, property) {
  if (!value) {
    return false;
  }
  if (property !== undefined) {
    if ( true && (isObservableMap(value) || isObservableArray(value))) {
      return die("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
    }
    if (isObservableObject(value)) {
      return value[$mobx].values_.has(property);
    }
    return false;
  }
  // For first check, see #701
  return isObservableObject(value) || !!value[$mobx] || isAtom(value) || isReaction(value) || isComputedValue(value);
}
function isObservable(value) {
  if ( true && arguments.length !== 1) {
    die("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
  }
  return _isObservable(value);
}
function isObservableProp(value, propName) {
  if ( true && !isStringish(propName)) {
    return die("expected a property name as second argument");
  }
  return _isObservable(value, propName);
}
function keys(obj) {
  if (isObservableObject(obj)) {
    return obj[$mobx].keys_();
  }
  if (isObservableMap(obj) || isObservableSet(obj)) {
    return Array.from(obj.keys());
  }
  if (isObservableArray(obj)) {
    return obj.map(function (_, index) {
      return index;
    });
  }
  die(5);
}
function values(obj) {
  if (isObservableObject(obj)) {
    return keys(obj).map(function (key) {
      return obj[key];
    });
  }
  if (isObservableMap(obj)) {
    return keys(obj).map(function (key) {
      return obj.get(key);
    });
  }
  if (isObservableSet(obj)) {
    return Array.from(obj.values());
  }
  if (isObservableArray(obj)) {
    return obj.slice();
  }
  die(6);
}
function entries(obj) {
  if (isObservableObject(obj)) {
    return keys(obj).map(function (key) {
      return [key, obj[key]];
    });
  }
  if (isObservableMap(obj)) {
    return keys(obj).map(function (key) {
      return [key, obj.get(key)];
    });
  }
  if (isObservableSet(obj)) {
    return Array.from(obj.entries());
  }
  if (isObservableArray(obj)) {
    return obj.map(function (key, index) {
      return [index, key];
    });
  }
  die(7);
}
function set(obj, key, value) {
  if (arguments.length === 2 && !isObservableSet(obj)) {
    startBatch();
    var _values = key;
    try {
      for (var _key in _values) {
        set(obj, _key, _values[_key]);
      }
    } finally {
      endBatch();
    }
    return;
  }
  if (isObservableObject(obj)) {
    obj[$mobx].set_(key, value);
  } else if (isObservableMap(obj)) {
    obj.set(key, value);
  } else if (isObservableSet(obj)) {
    obj.add(key);
  } else if (isObservableArray(obj)) {
    if (typeof key !== "number") {
      key = parseInt(key, 10);
    }
    if (key < 0) {
      die("Invalid index: '" + key + "'");
    }
    startBatch();
    if (key >= obj.length) {
      obj.length = key + 1;
    }
    obj[key] = value;
    endBatch();
  } else {
    die(8);
  }
}
function remove(obj, key) {
  if (isObservableObject(obj)) {
    obj[$mobx].delete_(key);
  } else if (isObservableMap(obj)) {
    obj["delete"](key);
  } else if (isObservableSet(obj)) {
    obj["delete"](key);
  } else if (isObservableArray(obj)) {
    if (typeof key !== "number") {
      key = parseInt(key, 10);
    }
    obj.splice(key, 1);
  } else {
    die(9);
  }
}
function has(obj, key) {
  if (isObservableObject(obj)) {
    return obj[$mobx].has_(key);
  } else if (isObservableMap(obj)) {
    return obj.has(key);
  } else if (isObservableSet(obj)) {
    return obj.has(key);
  } else if (isObservableArray(obj)) {
    return key >= 0 && key < obj.length;
  }
  die(10);
}
function get(obj, key) {
  if (!has(obj, key)) {
    return undefined;
  }
  if (isObservableObject(obj)) {
    return obj[$mobx].get_(key);
  } else if (isObservableMap(obj)) {
    return obj.get(key);
  } else if (isObservableArray(obj)) {
    return obj[key];
  }
  die(11);
}
function apiDefineProperty(obj, key, descriptor) {
  if (isObservableObject(obj)) {
    return obj[$mobx].defineProperty_(key, descriptor);
  }
  die(39);
}
function apiOwnKeys(obj) {
  if (isObservableObject(obj)) {
    return obj[$mobx].ownKeys_();
  }
  die(38);
}
function observe(thing, propOrCb, cbOrFire, fireImmediately) {
  if (isFunction(cbOrFire)) {
    return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);
  } else {
    return observeObservable(thing, propOrCb, cbOrFire);
  }
}
function observeObservable(thing, listener, fireImmediately) {
  return getAdministration(thing).observe_(listener, fireImmediately);
}
function observeObservableProperty(thing, property, listener, fireImmediately) {
  return getAdministration(thing, property).observe_(listener, fireImmediately);
}
function cache(map, key, value) {
  map.set(key, value);
  return value;
}
function toJSHelper(source, __alreadySeen) {
  if (source == null || _typeof(source) !== "object" || source instanceof Date || !isObservable(source)) {
    return source;
  }
  if (isObservableValue(source) || isComputedValue(source)) {
    return toJSHelper(source.get(), __alreadySeen);
  }
  if (__alreadySeen.has(source)) {
    return __alreadySeen.get(source);
  }
  if (isObservableArray(source)) {
    var res = cache(__alreadySeen, source, new Array(source.length));
    source.forEach(function (value, idx) {
      res[idx] = toJSHelper(value, __alreadySeen);
    });
    return res;
  }
  if (isObservableSet(source)) {
    var _res = cache(__alreadySeen, source, new Set());
    source.forEach(function (value) {
      _res.add(toJSHelper(value, __alreadySeen));
    });
    return _res;
  }
  if (isObservableMap(source)) {
    var _res2 = cache(__alreadySeen, source, new Map());
    source.forEach(function (value, key) {
      _res2.set(key, toJSHelper(value, __alreadySeen));
    });
    return _res2;
  } else {
    // must be observable object
    var _res3 = cache(__alreadySeen, source, {});
    apiOwnKeys(source).forEach(function (key) {
      if (objectPrototype.propertyIsEnumerable.call(source, key)) {
        _res3[key] = toJSHelper(source[key], __alreadySeen);
      }
    });
    return _res3;
  }
}
/**
 * Recursively converts an observable to it's non-observable native counterpart.
 * It does NOT recurse into non-observables, these are left as they are, even if they contain observables.
 * Computed and other non-enumerable properties are completely ignored.
 * Complex scenarios require custom solution, eg implementing `toJSON` or using `serializr` lib.
 */
function toJS(source, options) {
  if ( true && options) {
    die("toJS no longer supports options");
  }
  return toJSHelper(source, new Map());
}
function trace() {
  if (false) {}
  var enterBreakPoint = false;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (typeof args[args.length - 1] === "boolean") {
    enterBreakPoint = args.pop();
  }
  var derivation = getAtomFromArgs(args);
  if (!derivation) {
    return die("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  }
  if (derivation.isTracing_ === TraceMode.NONE) {
    console.log("[mobx.trace] '" + derivation.name_ + "' tracing enabled");
  }
  derivation.isTracing_ = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}
function getAtomFromArgs(args) {
  switch (args.length) {
    case 0:
      return globalState.trackingDerivation;
    case 1:
      return getAtom(args[0]);
    case 2:
      return getAtom(args[0], args[1]);
  }
}

/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */
function transaction(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }
  startBatch();
  try {
    return action.apply(thisArg);
  } finally {
    endBatch();
  }
}
function when(predicate, arg1, arg2) {
  if (arguments.length === 1 || arg1 && _typeof(arg1) === "object") {
    return whenPromise(predicate, arg1);
  }
  return _when(predicate, arg1, arg2 || {});
}
function _when(predicate, effect, opts) {
  var timeoutHandle;
  if (typeof opts.timeout === "number") {
    var error = new Error("WHEN_TIMEOUT");
    timeoutHandle = setTimeout(function () {
      if (!disposer[$mobx].isDisposed_) {
        disposer();
        if (opts.onError) {
          opts.onError(error);
        } else {
          throw error;
        }
      }
    }, opts.timeout);
  }
  opts.name =  true ? opts.name || "When@" + getNextId() : 0;
  var effectAction = createAction( true ? opts.name + "-effect" : 0, effect);
  // eslint-disable-next-line
  var disposer = autorun(function (r) {
    // predicate should not change state
    var cond = allowStateChanges(false, predicate);
    if (cond) {
      r.dispose();
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      effectAction();
    }
  }, opts);
  return disposer;
}
function whenPromise(predicate, opts) {
  var _opts$signal;
  if ( true && opts && opts.onError) {
    return die("the options 'onError' and 'promise' cannot be combined");
  }
  if (opts != null && (_opts$signal = opts.signal) != null && _opts$signal.aborted) {
    return Object.assign(Promise.reject(new Error("WHEN_ABORTED")), {
      cancel: function cancel() {
        return null;
      }
    });
  }
  var cancel;
  var abort;
  var res = new Promise(function (resolve, reject) {
    var _opts$signal2;
    var disposer = _when(predicate, resolve, _extends({}, opts, {
      onError: reject
    }));
    cancel = function cancel() {
      disposer();
      reject(new Error("WHEN_CANCELLED"));
    };
    abort = function abort() {
      disposer();
      reject(new Error("WHEN_ABORTED"));
    };
    opts == null ? void 0 : (_opts$signal2 = opts.signal) == null ? void 0 : _opts$signal2.addEventListener == null ? void 0 : _opts$signal2.addEventListener("abort", abort);
  })["finally"](function () {
    var _opts$signal3;
    return opts == null ? void 0 : (_opts$signal3 = opts.signal) == null ? void 0 : _opts$signal3.removeEventListener == null ? void 0 : _opts$signal3.removeEventListener("abort", abort);
  });
  res.cancel = cancel;
  return res;
}
function getAdm(target) {
  return target[$mobx];
}
// Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
// and skip either the internal values map, or the base object with its property descriptors!
var objectProxyTraps = {
  has: function has(target, name) {
    if ( true && globalState.trackingDerivation) {
      warnAboutProxyRequirement("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead.");
    }
    return getAdm(target).has_(name);
  },
  get: function get(target, name) {
    return getAdm(target).get_(name);
  },
  set: function set(target, name, value) {
    var _getAdm$set_;
    if (!isStringish(name)) {
      return false;
    }
    if ( true && !getAdm(target).values_.has(name)) {
      warnAboutProxyRequirement("add a new observable property through direct assignment. Use 'set' from 'mobx' instead.");
    }
    // null (intercepted) -> true (success)
    return (_getAdm$set_ = getAdm(target).set_(name, value, true)) != null ? _getAdm$set_ : true;
  },
  deleteProperty: function deleteProperty(target, name) {
    var _getAdm$delete_;
    if (true) {
      warnAboutProxyRequirement("delete properties from an observable object. Use 'remove' from 'mobx' instead.");
    }
    if (!isStringish(name)) {
      return false;
    }
    // null (intercepted) -> true (success)
    return (_getAdm$delete_ = getAdm(target).delete_(name, true)) != null ? _getAdm$delete_ : true;
  },
  defineProperty: function defineProperty(target, name, descriptor) {
    var _getAdm$definePropert;
    if (true) {
      warnAboutProxyRequirement("define property on an observable object. Use 'defineProperty' from 'mobx' instead.");
    }
    // null (intercepted) -> true (success)
    return (_getAdm$definePropert = getAdm(target).defineProperty_(name, descriptor)) != null ? _getAdm$definePropert : true;
  },
  ownKeys: function ownKeys(target) {
    if ( true && globalState.trackingDerivation) {
      warnAboutProxyRequirement("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead.");
    }
    return getAdm(target).ownKeys_();
  },
  preventExtensions: function preventExtensions(target) {
    die(13);
  }
};
function asDynamicObservableObject(target, options) {
  var _target$$mobx, _target$$mobx$proxy_;
  assertProxies();
  target = asObservableObject(target, options);
  return (_target$$mobx$proxy_ = (_target$$mobx = target[$mobx]).proxy_) != null ? _target$$mobx$proxy_ : _target$$mobx.proxy_ = new Proxy(target, objectProxyTraps);
}
function hasInterceptors(interceptable) {
  return interceptable.interceptors_ !== undefined && interceptable.interceptors_.length > 0;
}
function registerInterceptor(interceptable, handler) {
  var interceptors = interceptable.interceptors_ || (interceptable.interceptors_ = []);
  interceptors.push(handler);
  return once(function () {
    var idx = interceptors.indexOf(handler);
    if (idx !== -1) {
      interceptors.splice(idx, 1);
    }
  });
}
function interceptChange(interceptable, change) {
  var prevU = untrackedStart();
  try {
    // Interceptor can modify the array, copy it to avoid concurrent modification, see #1950
    var interceptors = [].concat(interceptable.interceptors_ || []);
    for (var i = 0, l = interceptors.length; i < l; i++) {
      change = interceptors[i](change);
      if (change && !change.type) {
        die(14);
      }
      if (!change) {
        break;
      }
    }
    return change;
  } finally {
    untrackedEnd(prevU);
  }
}
function hasListeners(listenable) {
  return listenable.changeListeners_ !== undefined && listenable.changeListeners_.length > 0;
}
function registerListener(listenable, handler) {
  var listeners = listenable.changeListeners_ || (listenable.changeListeners_ = []);
  listeners.push(handler);
  return once(function () {
    var idx = listeners.indexOf(handler);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  });
}
function notifyListeners(listenable, change) {
  var prevU = untrackedStart();
  var listeners = listenable.changeListeners_;
  if (!listeners) {
    return;
  }
  listeners = listeners.slice();
  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](change);
  }
  untrackedEnd(prevU);
}
function makeObservable(target, annotations, options) {
  var adm = asObservableObject(target, options)[$mobx];
  startBatch();
  try {
    var _annotations;
    if ( true && annotations && target[storedAnnotationsSymbol]) {
      die("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported.");
    }
    // Default to decorators
    (_annotations = annotations) != null ? _annotations : annotations = collectStoredAnnotations(target);
    // Annotate
    ownKeys(annotations).forEach(function (key) {
      return adm.make_(key, annotations[key]);
    });
  } finally {
    endBatch();
  }
  return target;
}
// proto[keysSymbol] = new Set<PropertyKey>()
var keysSymbol = /*#__PURE__*/Symbol("mobx-keys");
function makeAutoObservable(target, overrides, options) {
  if (true) {
    if (!isPlainObject(target) && !isPlainObject(Object.getPrototypeOf(target))) {
      die("'makeAutoObservable' can only be used for classes that don't have a superclass");
    }
    if (isObservableObject(target)) {
      die("makeAutoObservable can only be used on objects not already made observable");
    }
  }
  // Optimization: avoid visiting protos
  // Assumes that annotation.make_/.extend_ works the same for plain objects
  if (isPlainObject(target)) {
    return extendObservable(target, target, overrides, options);
  }
  var adm = asObservableObject(target, options)[$mobx];
  // Optimization: cache keys on proto
  // Assumes makeAutoObservable can be called only once per object and can't be used in subclass
  if (!target[keysSymbol]) {
    var proto = Object.getPrototypeOf(target);
    var keys = new Set([].concat(ownKeys(target), ownKeys(proto)));
    keys["delete"]("constructor");
    keys["delete"]($mobx);
    addHiddenProp(proto, keysSymbol, keys);
  }
  startBatch();
  try {
    target[keysSymbol].forEach(function (key) {
      return adm.make_(key,
      // must pass "undefined" for { key: undefined }
      !overrides ? true : key in overrides ? overrides[key] : true);
    });
  } finally {
    endBatch();
  }
  return target;
}
var SPLICE = "splice";
var UPDATE = "update";
var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859
var arrayTraps = {
  get: function get(target, name) {
    var adm = target[$mobx];
    if (name === $mobx) {
      return adm;
    }
    if (name === "length") {
      return adm.getArrayLength_();
    }
    if (typeof name === "string" && !isNaN(name)) {
      return adm.get_(parseInt(name));
    }
    if (hasProp(arrayExtensions, name)) {
      return arrayExtensions[name];
    }
    return target[name];
  },
  set: function set(target, name, value) {
    var adm = target[$mobx];
    if (name === "length") {
      adm.setArrayLength_(value);
    }
    if (_typeof(name) === "symbol" || isNaN(name)) {
      target[name] = value;
    } else {
      // numeric string
      adm.set_(parseInt(name), value);
    }
    return true;
  },
  preventExtensions: function preventExtensions() {
    die(15);
  }
};
var ObservableArrayAdministration = /*#__PURE__*/function () {
  // this is the prop that gets proxied, so can't replace it!

  function ObservableArrayAdministration(name, enhancer, owned_, legacyMode_) {
    if (name === void 0) {
      name =  true ? "ObservableArray@" + getNextId() : 0;
    }
    this.owned_ = void 0;
    this.legacyMode_ = void 0;
    this.atom_ = void 0;
    this.values_ = [];
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.enhancer_ = void 0;
    this.dehancer = void 0;
    this.proxy_ = void 0;
    this.lastKnownLength_ = 0;
    this.owned_ = owned_;
    this.legacyMode_ = legacyMode_;
    this.atom_ = new Atom(name);
    this.enhancer_ = function (newV, oldV) {
      return enhancer(newV, oldV,  true ? name + "[..]" : 0);
    };
  }
  var _proto = ObservableArrayAdministration.prototype;
  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.dehanceValues_ = function dehanceValues_(values) {
    if (this.dehancer !== undefined && values.length > 0) {
      return values.map(this.dehancer);
    }
    return values;
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }
    if (fireImmediately) {
      listener({
        observableKind: "array",
        object: this.proxy_,
        debugObjectName: this.atom_.name_,
        type: "splice",
        index: 0,
        added: this.values_.slice(),
        addedCount: this.values_.length,
        removed: [],
        removedCount: 0
      });
    }
    return registerListener(this, listener);
  };
  _proto.getArrayLength_ = function getArrayLength_() {
    this.atom_.reportObserved();
    return this.values_.length;
  };
  _proto.setArrayLength_ = function setArrayLength_(newLength) {
    if (typeof newLength !== "number" || isNaN(newLength) || newLength < 0) {
      die("Out of range: " + newLength);
    }
    var currentLength = this.values_.length;
    if (newLength === currentLength) {
      return;
    } else if (newLength > currentLength) {
      var newItems = new Array(newLength - currentLength);
      for (var i = 0; i < newLength - currentLength; i++) {
        newItems[i] = undefined;
      } // No Array.fill everywhere...
      this.spliceWithArray_(currentLength, 0, newItems);
    } else {
      this.spliceWithArray_(newLength, currentLength - newLength);
    }
  };
  _proto.updateArrayLength_ = function updateArrayLength_(oldLength, delta) {
    if (oldLength !== this.lastKnownLength_) {
      die(16);
    }
    this.lastKnownLength_ += delta;
    if (this.legacyMode_ && delta > 0) {
      reserveArrayBuffer(oldLength + delta + 1);
    }
  };
  _proto.spliceWithArray_ = function spliceWithArray_(index, deleteCount, newItems) {
    var _this = this;
    checkIfStateModificationsAreAllowed(this.atom_);
    var length = this.values_.length;
    if (index === undefined) {
      index = 0;
    } else if (index > length) {
      index = length;
    } else if (index < 0) {
      index = Math.max(0, length + index);
    }
    if (arguments.length === 1) {
      deleteCount = length - index;
    } else if (deleteCount === undefined || deleteCount === null) {
      deleteCount = 0;
    } else {
      deleteCount = Math.max(0, Math.min(deleteCount, length - index));
    }
    if (newItems === undefined) {
      newItems = EMPTY_ARRAY;
    }
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_,
        type: SPLICE,
        index: index,
        removedCount: deleteCount,
        added: newItems
      });
      if (!change) {
        return EMPTY_ARRAY;
      }
      deleteCount = change.removedCount;
      newItems = change.added;
    }
    newItems = newItems.length === 0 ? newItems : newItems.map(function (v) {
      return _this.enhancer_(v, undefined);
    });
    if (this.legacyMode_ || "development" !== "production") {
      var lengthDelta = newItems.length - deleteCount;
      this.updateArrayLength_(length, lengthDelta); // checks if internal array wasn't modified
    }

    var res = this.spliceItemsIntoValues_(index, deleteCount, newItems);
    if (deleteCount !== 0 || newItems.length !== 0) {
      this.notifyArraySplice_(index, newItems, res);
    }
    return this.dehanceValues_(res);
  };
  _proto.spliceItemsIntoValues_ = function spliceItemsIntoValues_(index, deleteCount, newItems) {
    if (newItems.length < MAX_SPLICE_SIZE) {
      var _this$values_;
      return (_this$values_ = this.values_).splice.apply(_this$values_, [index, deleteCount].concat(newItems));
    } else {
      // The items removed by the splice
      var res = this.values_.slice(index, index + deleteCount);
      // The items that that should remain at the end of the array
      var oldItems = this.values_.slice(index + deleteCount);
      // New length is the previous length + addition count - deletion count
      this.values_.length += newItems.length - deleteCount;
      for (var i = 0; i < newItems.length; i++) {
        this.values_[index + i] = newItems[i];
      }
      for (var _i = 0; _i < oldItems.length; _i++) {
        this.values_[index + newItems.length + _i] = oldItems[_i];
      }
      return res;
    }
  };
  _proto.notifyArrayChildUpdate_ = function notifyArrayChildUpdate_(index, newValue, oldValue) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      type: UPDATE,
      debugObjectName: this.atom_.name_,
      index: index,
      newValue: newValue,
      oldValue: oldValue
    } : null;
    // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
    // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled
    if ( true && notifySpy) {
      spyReportStart(change);
    }
    this.atom_.reportChanged();
    if (notify) {
      notifyListeners(this, change);
    }
    if ( true && notifySpy) {
      spyReportEnd();
    }
  };
  _proto.notifyArraySplice_ = function notifyArraySplice_(index, added, removed) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: SPLICE,
      index: index,
      removed: removed,
      added: added,
      removedCount: removed.length,
      addedCount: added.length
    } : null;
    if ( true && notifySpy) {
      spyReportStart(change);
    }
    this.atom_.reportChanged();
    // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
    if (notify) {
      notifyListeners(this, change);
    }
    if ( true && notifySpy) {
      spyReportEnd();
    }
  };
  _proto.get_ = function get_(index) {
    if (this.legacyMode_ && index >= this.values_.length) {
      console.warn( true ? "[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : 0);
      return undefined;
    }
    this.atom_.reportObserved();
    return this.dehanceValue_(this.values_[index]);
  };
  _proto.set_ = function set_(index, newValue) {
    var values = this.values_;
    if (this.legacyMode_ && index > values.length) {
      // out of bounds
      die(17, index, values.length);
    }
    if (index < values.length) {
      // update at index in range
      checkIfStateModificationsAreAllowed(this.atom_);
      var oldValue = values[index];
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          type: UPDATE,
          object: this.proxy_,
          index: index,
          newValue: newValue
        });
        if (!change) {
          return;
        }
        newValue = change.newValue;
      }
      newValue = this.enhancer_(newValue, oldValue);
      var changed = newValue !== oldValue;
      if (changed) {
        values[index] = newValue;
        this.notifyArrayChildUpdate_(index, newValue, oldValue);
      }
    } else {
      // For out of bound index, we don't create an actual sparse array,
      // but rather fill the holes with undefined (same as setArrayLength_).
      // This could be considered a bug.
      var newItems = new Array(index + 1 - values.length);
      for (var i = 0; i < newItems.length - 1; i++) {
        newItems[i] = undefined;
      } // No Array.fill everywhere...
      newItems[newItems.length - 1] = newValue;
      this.spliceWithArray_(values.length, 0, newItems);
    }
  };
  return ObservableArrayAdministration;
}();
function createObservableArray(initialValues, enhancer, name, owned) {
  if (name === void 0) {
    name =  true ? "ObservableArray@" + getNextId() : 0;
  }
  if (owned === void 0) {
    owned = false;
  }
  assertProxies();
  var adm = new ObservableArrayAdministration(name, enhancer, owned, false);
  addHiddenFinalProp(adm.values_, $mobx, adm);
  var proxy = new Proxy(adm.values_, arrayTraps);
  adm.proxy_ = proxy;
  if (initialValues && initialValues.length) {
    var prev = allowStateChangesStart(true);
    adm.spliceWithArray_(0, 0, initialValues);
    allowStateChangesEnd(prev);
  }
  return proxy;
}
// eslint-disable-next-line
var arrayExtensions = {
  clear: function clear() {
    return this.splice(0);
  },
  replace: function replace(newItems) {
    var adm = this[$mobx];
    return adm.spliceWithArray_(0, adm.values_.length, newItems);
  },
  // Used by JSON.stringify
  toJSON: function toJSON() {
    return this.slice();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function splice(index, deleteCount) {
    for (var _len = arguments.length, newItems = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      newItems[_key - 2] = arguments[_key];
    }
    var adm = this[$mobx];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return adm.spliceWithArray_(index);
      case 2:
        return adm.spliceWithArray_(index, deleteCount);
    }
    return adm.spliceWithArray_(index, deleteCount, newItems);
  },
  spliceWithArray: function spliceWithArray(index, deleteCount, newItems) {
    return this[$mobx].spliceWithArray_(index, deleteCount, newItems);
  },
  push: function push() {
    var adm = this[$mobx];
    for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }
    adm.spliceWithArray_(adm.values_.length, 0, items);
    return adm.values_.length;
  },
  pop: function pop() {
    return this.splice(Math.max(this[$mobx].values_.length - 1, 0), 1)[0];
  },
  shift: function shift() {
    return this.splice(0, 1)[0];
  },
  unshift: function unshift() {
    var adm = this[$mobx];
    for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      items[_key3] = arguments[_key3];
    }
    adm.spliceWithArray_(0, 0, items);
    return adm.values_.length;
  },
  reverse: function reverse() {
    // reverse by default mutates in place before returning the result
    // which makes it both a 'derivation' and a 'mutation'.
    if (globalState.trackingDerivation) {
      die(37, "reverse");
    }
    this.replace(this.slice().reverse());
    return this;
  },
  sort: function sort() {
    // sort by default mutates in place before returning the result
    // which goes against all good practices. Let's not change the array in place!
    if (globalState.trackingDerivation) {
      die(37, "sort");
    }
    var copy = this.slice();
    copy.sort.apply(copy, arguments);
    this.replace(copy);
    return this;
  },
  remove: function remove(value) {
    var adm = this[$mobx];
    var idx = adm.dehanceValues_(adm.values_).indexOf(value);
    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }
    return false;
  }
};
/**
 * Wrap function from prototype
 * Without this, everything works as well, but this works
 * faster as everything works on unproxied values
 */
addArrayExtension("concat", simpleFunc);
addArrayExtension("flat", simpleFunc);
addArrayExtension("includes", simpleFunc);
addArrayExtension("indexOf", simpleFunc);
addArrayExtension("join", simpleFunc);
addArrayExtension("lastIndexOf", simpleFunc);
addArrayExtension("slice", simpleFunc);
addArrayExtension("toString", simpleFunc);
addArrayExtension("toLocaleString", simpleFunc);
// map
addArrayExtension("every", mapLikeFunc);
addArrayExtension("filter", mapLikeFunc);
addArrayExtension("find", mapLikeFunc);
addArrayExtension("findIndex", mapLikeFunc);
addArrayExtension("flatMap", mapLikeFunc);
addArrayExtension("forEach", mapLikeFunc);
addArrayExtension("map", mapLikeFunc);
addArrayExtension("some", mapLikeFunc);
// reduce
addArrayExtension("reduce", reduceLikeFunc);
addArrayExtension("reduceRight", reduceLikeFunc);
function addArrayExtension(funcName, funcFactory) {
  if (typeof Array.prototype[funcName] === "function") {
    arrayExtensions[funcName] = funcFactory(funcName);
  }
}
// Report and delegate to dehanced array
function simpleFunc(funcName) {
  return function () {
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
}
// Make sure callbacks recieve correct array arg #2326
function mapLikeFunc(funcName) {
  return function (callback, thisArg) {
    var _this2 = this;
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName](function (element, index) {
      return callback.call(thisArg, element, index, _this2);
    });
  };
}
// Make sure callbacks recieve correct array arg #2326
function reduceLikeFunc(funcName) {
  return function () {
    var _this3 = this;
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    // #2432 - reduce behavior depends on arguments.length
    var callback = arguments[0];
    arguments[0] = function (accumulator, currentValue, index) {
      return callback(accumulator, currentValue, index, _this3);
    };
    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
}
var isObservableArrayAdministration = /*#__PURE__*/createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
function isObservableArray(thing) {
  return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
}
var _Symbol$iterator, _Symbol$toStringTag;
var ObservableMapMarker = {};
var ADD = "add";
var DELETE = "delete";
// just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
// But: https://github.com/mobxjs/mobx/issues/1556
_Symbol$iterator = Symbol.iterator;
_Symbol$toStringTag = Symbol.toStringTag;
var ObservableMap = /*#__PURE__*/function () {
  // hasMap, not hashMap >-).

  function ObservableMap(initialData, enhancer_, name_) {
    var _this = this;
    if (enhancer_ === void 0) {
      enhancer_ = deepEnhancer;
    }
    if (name_ === void 0) {
      name_ =  true ? "ObservableMap@" + getNextId() : 0;
    }
    this.enhancer_ = void 0;
    this.name_ = void 0;
    this[$mobx] = ObservableMapMarker;
    this.data_ = void 0;
    this.hasMap_ = void 0;
    this.keysAtom_ = void 0;
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = enhancer_;
    this.name_ = name_;
    if (!isFunction(Map)) {
      die(18);
    }
    this.keysAtom_ = createAtom( true ? this.name_ + ".keys()" : 0);
    this.data_ = new Map();
    this.hasMap_ = new Map();
    allowStateChanges(true, function () {
      _this.merge(initialData);
    });
  }
  var _proto = ObservableMap.prototype;
  _proto.has_ = function has_(key) {
    return this.data_.has(key);
  };
  _proto.has = function has(key) {
    var _this2 = this;
    if (!globalState.trackingDerivation) {
      return this.has_(key);
    }
    var entry = this.hasMap_.get(key);
    if (!entry) {
      var newEntry = entry = new ObservableValue(this.has_(key), referenceEnhancer,  true ? this.name_ + "." + stringifyKey(key) + "?" : 0, false);
      this.hasMap_.set(key, newEntry);
      onBecomeUnobserved(newEntry, function () {
        return _this2.hasMap_["delete"](key);
      });
    }
    return entry.get();
  };
  _proto.set = function set(key, value) {
    var hasKey = this.has_(key);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: hasKey ? UPDATE : ADD,
        object: this,
        newValue: value,
        name: key
      });
      if (!change) {
        return this;
      }
      value = change.newValue;
    }
    if (hasKey) {
      this.updateValue_(key, value);
    } else {
      this.addValue_(key, value);
    }
    return this;
  };
  _proto["delete"] = function _delete(key) {
    var _this3 = this;
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        name: key
      });
      if (!change) {
        return false;
      }
    }
    if (this.has_(key)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var _change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: this.data_.get(key).value_,
        name: key
      } : null;
      if ( true && notifySpy) {
        spyReportStart(_change);
      } // TODO fix type
      transaction(function () {
        var _this3$hasMap_$get;
        _this3.keysAtom_.reportChanged();
        (_this3$hasMap_$get = _this3.hasMap_.get(key)) == null ? void 0 : _this3$hasMap_$get.setNewValue_(false);
        var observable = _this3.data_.get(key);
        observable.setNewValue_(undefined);
        _this3.data_["delete"](key);
      });
      if (notify) {
        notifyListeners(this, _change);
      }
      if ( true && notifySpy) {
        spyReportEnd();
      }
      return true;
    }
    return false;
  };
  _proto.updateValue_ = function updateValue_(key, newValue) {
    var observable = this.data_.get(key);
    newValue = observable.prepareNewValue_(newValue);
    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: UPDATE,
        object: this,
        oldValue: observable.value_,
        name: key,
        newValue: newValue
      } : null;
      if ( true && notifySpy) {
        spyReportStart(change);
      } // TODO fix type
      observable.setNewValue_(newValue);
      if (notify) {
        notifyListeners(this, change);
      }
      if ( true && notifySpy) {
        spyReportEnd();
      }
    }
  };
  _proto.addValue_ = function addValue_(key, newValue) {
    var _this4 = this;
    checkIfStateModificationsAreAllowed(this.keysAtom_);
    transaction(function () {
      var _this4$hasMap_$get;
      var observable = new ObservableValue(newValue, _this4.enhancer_,  true ? _this4.name_ + "." + stringifyKey(key) : 0, false);
      _this4.data_.set(key, observable);
      newValue = observable.value_; // value might have been changed
      (_this4$hasMap_$get = _this4.hasMap_.get(key)) == null ? void 0 : _this4$hasMap_$get.setNewValue_(true);
      _this4.keysAtom_.reportChanged();
    });
    var notifySpy = isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ADD,
      object: this,
      name: key,
      newValue: newValue
    } : null;
    if ( true && notifySpy) {
      spyReportStart(change);
    } // TODO fix type
    if (notify) {
      notifyListeners(this, change);
    }
    if ( true && notifySpy) {
      spyReportEnd();
    }
  };
  _proto.get = function get(key) {
    if (this.has(key)) {
      return this.dehanceValue_(this.data_.get(key).get());
    }
    return this.dehanceValue_(undefined);
  };
  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.keys = function keys() {
    this.keysAtom_.reportObserved();
    return this.data_.keys();
  };
  _proto.values = function values() {
    var self = this;
    var keys = this.keys();
    return makeIterable({
      next: function next() {
        var _keys$next = keys.next(),
          done = _keys$next.done,
          value = _keys$next.value;
        return {
          done: done,
          value: done ? undefined : self.get(value)
        };
      }
    });
  };
  _proto.entries = function entries() {
    var self = this;
    var keys = this.keys();
    return makeIterable({
      next: function next() {
        var _keys$next2 = keys.next(),
          done = _keys$next2.done,
          value = _keys$next2.value;
        return {
          done: done,
          value: done ? undefined : [value, self.get(value)]
        };
      }
    });
  };
  _proto[_Symbol$iterator] = function () {
    return this.entries();
  };
  _proto.forEach = function forEach(callback, thisArg) {
    for (var _iterator = _createForOfIteratorHelperLoose(this), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
        key = _step$value[0],
        value = _step$value[1];
      callback.call(thisArg, value, key, this);
    }
  }
  /** Merge another object into this object, returns this. */;
  _proto.merge = function merge(other) {
    var _this5 = this;
    if (isObservableMap(other)) {
      other = new Map(other);
    }
    transaction(function () {
      if (isPlainObject(other)) {
        getPlainObjectKeys(other).forEach(function (key) {
          return _this5.set(key, other[key]);
        });
      } else if (Array.isArray(other)) {
        other.forEach(function (_ref) {
          var key = _ref[0],
            value = _ref[1];
          return _this5.set(key, value);
        });
      } else if (isES6Map(other)) {
        if (other.constructor !== Map) {
          die(19, other);
        }
        other.forEach(function (value, key) {
          return _this5.set(key, value);
        });
      } else if (other !== null && other !== undefined) {
        die(20, other);
      }
    });
    return this;
  };
  _proto.clear = function clear() {
    var _this6 = this;
    transaction(function () {
      untracked(function () {
        for (var _iterator2 = _createForOfIteratorHelperLoose(_this6.keys()), _step2; !(_step2 = _iterator2()).done;) {
          var key = _step2.value;
          _this6["delete"](key);
        }
      });
    });
  };
  _proto.replace = function replace(values) {
    var _this7 = this;
    // Implementation requirements:
    // - respect ordering of replacement map
    // - allow interceptors to run and potentially prevent individual operations
    // - don't recreate observables that already exist in original map (so we don't destroy existing subscriptions)
    // - don't _keysAtom.reportChanged if the keys of resulting map are indentical (order matters!)
    // - note that result map may differ from replacement map due to the interceptors
    transaction(function () {
      // Convert to map so we can do quick key lookups
      var replacementMap = convertToMap(values);
      var orderedData = new Map();
      // Used for optimization
      var keysReportChangedCalled = false;
      // Delete keys that don't exist in replacement map
      // if the key deletion is prevented by interceptor
      // add entry at the beginning of the result map
      for (var _iterator3 = _createForOfIteratorHelperLoose(_this7.data_.keys()), _step3; !(_step3 = _iterator3()).done;) {
        var key = _step3.value;
        // Concurrently iterating/deleting keys
        // iterator should handle this correctly
        if (!replacementMap.has(key)) {
          var deleted = _this7["delete"](key);
          // Was the key removed?
          if (deleted) {
            // _keysAtom.reportChanged() was already called
            keysReportChangedCalled = true;
          } else {
            // Delete prevented by interceptor
            var value = _this7.data_.get(key);
            orderedData.set(key, value);
          }
        }
      }
      // Merge entries
      for (var _iterator4 = _createForOfIteratorHelperLoose(replacementMap.entries()), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
          _key = _step4$value[0],
          _value = _step4$value[1];
        // We will want to know whether a new key is added
        var keyExisted = _this7.data_.has(_key);
        // Add or update value
        _this7.set(_key, _value);
        // The addition could have been prevent by interceptor
        if (_this7.data_.has(_key)) {
          // The update could have been prevented by interceptor
          // and also we want to preserve existing values
          // so use value from _data map (instead of replacement map)
          var _value2 = _this7.data_.get(_key);
          orderedData.set(_key, _value2);
          // Was a new key added?
          if (!keyExisted) {
            // _keysAtom.reportChanged() was already called
            keysReportChangedCalled = true;
          }
        }
      }
      // Check for possible key order change
      if (!keysReportChangedCalled) {
        if (_this7.data_.size !== orderedData.size) {
          // If size differs, keys are definitely modified
          _this7.keysAtom_.reportChanged();
        } else {
          var iter1 = _this7.data_.keys();
          var iter2 = orderedData.keys();
          var next1 = iter1.next();
          var next2 = iter2.next();
          while (!next1.done) {
            if (next1.value !== next2.value) {
              _this7.keysAtom_.reportChanged();
              break;
            }
            next1 = iter1.next();
            next2 = iter2.next();
          }
        }
      }
      // Use correctly ordered map
      _this7.data_ = orderedData;
    });
    return this;
  };
  _proto.toString = function toString() {
    return "[object ObservableMap]";
  };
  _proto.toJSON = function toJSON() {
    return Array.from(this);
  };
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */
  _proto.observe_ = function observe_(listener, fireImmediately) {
    if ( true && fireImmediately === true) {
      die("`observe` doesn't support fireImmediately=true in combination with maps.");
    }
    return registerListener(this, listener);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _createClass(ObservableMap, [{
    key: "size",
    get: function get() {
      this.keysAtom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return "Map";
    }
  }]);
  return ObservableMap;
}();
// eslint-disable-next-line
var isObservableMap = /*#__PURE__*/createInstanceofPredicate("ObservableMap", ObservableMap);
function convertToMap(dataStructure) {
  if (isES6Map(dataStructure) || isObservableMap(dataStructure)) {
    return dataStructure;
  } else if (Array.isArray(dataStructure)) {
    return new Map(dataStructure);
  } else if (isPlainObject(dataStructure)) {
    var map = new Map();
    for (var key in dataStructure) {
      map.set(key, dataStructure[key]);
    }
    return map;
  } else {
    return die(21, dataStructure);
  }
}
var _Symbol$iterator$1, _Symbol$toStringTag$1;
var ObservableSetMarker = {};
_Symbol$iterator$1 = Symbol.iterator;
_Symbol$toStringTag$1 = Symbol.toStringTag;
var ObservableSet = /*#__PURE__*/function () {
  function ObservableSet(initialData, enhancer, name_) {
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }
    if (name_ === void 0) {
      name_ =  true ? "ObservableSet@" + getNextId() : 0;
    }
    this.name_ = void 0;
    this[$mobx] = ObservableSetMarker;
    this.data_ = new Set();
    this.atom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = void 0;
    this.name_ = name_;
    if (!isFunction(Set)) {
      die(22);
    }
    this.atom_ = createAtom(this.name_);
    this.enhancer_ = function (newV, oldV) {
      return enhancer(newV, oldV, name_);
    };
    if (initialData) {
      this.replace(initialData);
    }
  }
  var _proto = ObservableSet.prototype;
  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }
    return value;
  };
  _proto.clear = function clear() {
    var _this = this;
    transaction(function () {
      untracked(function () {
        for (var _iterator = _createForOfIteratorHelperLoose(_this.data_.values()), _step; !(_step = _iterator()).done;) {
          var value = _step.value;
          _this["delete"](value);
        }
      });
    });
  };
  _proto.forEach = function forEach(callbackFn, thisArg) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this), _step2; !(_step2 = _iterator2()).done;) {
      var value = _step2.value;
      callbackFn.call(thisArg, value, value, this);
    }
  };
  _proto.add = function add(value) {
    var _this2 = this;
    checkIfStateModificationsAreAllowed(this.atom_);
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: ADD,
        object: this,
        newValue: value
      });
      if (!change) {
        return this;
      }
      // ideally, value = change.value would be done here, so that values can be
      // changed by interceptor. Same applies for other Set and Map api's.
    }

    if (!this.has(value)) {
      transaction(function () {
        _this2.data_.add(_this2.enhancer_(value, undefined));
        _this2.atom_.reportChanged();
      });
      var notifySpy =  true && isSpyEnabled();
      var notify = hasListeners(this);
      var _change = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ADD,
        object: this,
        newValue: value
      } : null;
      if (notifySpy && "development" !== "production") {
        spyReportStart(_change);
      }
      if (notify) {
        notifyListeners(this, _change);
      }
      if (notifySpy && "development" !== "production") {
        spyReportEnd();
      }
    }
    return this;
  };
  _proto["delete"] = function _delete(value) {
    var _this3 = this;
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        oldValue: value
      });
      if (!change) {
        return false;
      }
    }
    if (this.has(value)) {
      var notifySpy =  true && isSpyEnabled();
      var notify = hasListeners(this);
      var _change2 = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: value
      } : null;
      if (notifySpy && "development" !== "production") {
        spyReportStart(_change2);
      }
      transaction(function () {
        _this3.atom_.reportChanged();
        _this3.data_["delete"](value);
      });
      if (notify) {
        notifyListeners(this, _change2);
      }
      if (notifySpy && "development" !== "production") {
        spyReportEnd();
      }
      return true;
    }
    return false;
  };
  _proto.has = function has(value) {
    this.atom_.reportObserved();
    return this.data_.has(this.dehanceValue_(value));
  };
  _proto.entries = function entries() {
    var nextIndex = 0;
    var keys = Array.from(this.keys());
    var values = Array.from(this.values());
    return makeIterable({
      next: function next() {
        var index = nextIndex;
        nextIndex += 1;
        return index < values.length ? {
          value: [keys[index], values[index]],
          done: false
        } : {
          done: true
        };
      }
    });
  };
  _proto.keys = function keys() {
    return this.values();
  };
  _proto.values = function values() {
    this.atom_.reportObserved();
    var self = this;
    var nextIndex = 0;
    var observableValues = Array.from(this.data_.values());
    return makeIterable({
      next: function next() {
        return nextIndex < observableValues.length ? {
          value: self.dehanceValue_(observableValues[nextIndex++]),
          done: false
        } : {
          done: true
        };
      }
    });
  };
  _proto.replace = function replace(other) {
    var _this4 = this;
    if (isObservableSet(other)) {
      other = new Set(other);
    }
    transaction(function () {
      if (Array.isArray(other)) {
        _this4.clear();
        other.forEach(function (value) {
          return _this4.add(value);
        });
      } else if (isES6Set(other)) {
        _this4.clear();
        other.forEach(function (value) {
          return _this4.add(value);
        });
      } else if (other !== null && other !== undefined) {
        die("Cannot initialize set from " + other);
      }
    });
    return this;
  };
  _proto.observe_ = function observe_(listener, fireImmediately) {
    // ... 'fireImmediately' could also be true?
    if ( true && fireImmediately === true) {
      die("`observe` doesn't support fireImmediately=true in combination with sets.");
    }
    return registerListener(this, listener);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.toJSON = function toJSON() {
    return Array.from(this);
  };
  _proto.toString = function toString() {
    return "[object ObservableSet]";
  };
  _proto[_Symbol$iterator$1] = function () {
    return this.values();
  };
  _createClass(ObservableSet, [{
    key: "size",
    get: function get() {
      this.atom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: _Symbol$toStringTag$1,
    get: function get() {
      return "Set";
    }
  }]);
  return ObservableSet;
}();
// eslint-disable-next-line
var isObservableSet = /*#__PURE__*/createInstanceofPredicate("ObservableSet", ObservableSet);
var descriptorCache = /*#__PURE__*/Object.create(null);
var REMOVE = "remove";
var ObservableObjectAdministration = /*#__PURE__*/function () {
  function ObservableObjectAdministration(target_, values_, name_,
  // Used anytime annotation is not explicitely provided
  defaultAnnotation_) {
    if (values_ === void 0) {
      values_ = new Map();
    }
    if (defaultAnnotation_ === void 0) {
      defaultAnnotation_ = autoAnnotation;
    }
    this.target_ = void 0;
    this.values_ = void 0;
    this.name_ = void 0;
    this.defaultAnnotation_ = void 0;
    this.keysAtom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.proxy_ = void 0;
    this.isPlainObject_ = void 0;
    this.appliedAnnotations_ = void 0;
    this.pendingKeys_ = void 0;
    this.target_ = target_;
    this.values_ = values_;
    this.name_ = name_;
    this.defaultAnnotation_ = defaultAnnotation_;
    this.keysAtom_ = new Atom( true ? this.name_ + ".keys" : 0);
    // Optimization: we use this frequently
    this.isPlainObject_ = isPlainObject(this.target_);
    if ( true && !isAnnotation(this.defaultAnnotation_)) {
      die("defaultAnnotation must be valid annotation");
    }
    if (true) {
      // Prepare structure for tracking which fields were already annotated
      this.appliedAnnotations_ = {};
    }
  }
  var _proto = ObservableObjectAdministration.prototype;
  _proto.getObservablePropValue_ = function getObservablePropValue_(key) {
    return this.values_.get(key).get();
  };
  _proto.setObservablePropValue_ = function setObservablePropValue_(key, newValue) {
    var observable = this.values_.get(key);
    if (observable instanceof ComputedValue) {
      observable.set(newValue);
      return true;
    }
    // intercept
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: UPDATE,
        object: this.proxy_ || this.target_,
        name: key,
        newValue: newValue
      });
      if (!change) {
        return null;
      }
      newValue = change.newValue;
    }
    newValue = observable.prepareNewValue_(newValue);
    // notify spy & observers
    if (newValue !== globalState.UNCHANGED) {
      var notify = hasListeners(this);
      var notifySpy =  true && isSpyEnabled();
      var _change = notify || notifySpy ? {
        type: UPDATE,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: observable.value_,
        name: key,
        newValue: newValue
      } : null;
      if ( true && notifySpy) {
        spyReportStart(_change);
      }
      observable.setNewValue_(newValue);
      if (notify) {
        notifyListeners(this, _change);
      }
      if ( true && notifySpy) {
        spyReportEnd();
      }
    }
    return true;
  };
  _proto.get_ = function get_(key) {
    if (globalState.trackingDerivation && !hasProp(this.target_, key)) {
      // Key doesn't exist yet, subscribe for it in case it's added later
      this.has_(key);
    }
    return this.target_[key];
  }
  /**
   * @param {PropertyKey} key
   * @param {any} value
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */;
  _proto.set_ = function set_(key, value, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    // Don't use .has(key) - we care about own
    if (hasProp(this.target_, key)) {
      // Existing prop
      if (this.values_.has(key)) {
        // Observable (can be intercepted)
        return this.setObservablePropValue_(key, value);
      } else if (proxyTrap) {
        // Non-observable - proxy
        return Reflect.set(this.target_, key, value);
      } else {
        // Non-observable
        this.target_[key] = value;
        return true;
      }
    } else {
      // New prop
      return this.extend_(key, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true
      }, this.defaultAnnotation_, proxyTrap);
    }
  }
  // Trap for "in"
  ;

  _proto.has_ = function has_(key) {
    if (!globalState.trackingDerivation) {
      // Skip key subscription outside derivation
      return key in this.target_;
    }
    this.pendingKeys_ || (this.pendingKeys_ = new Map());
    var entry = this.pendingKeys_.get(key);
    if (!entry) {
      entry = new ObservableValue(key in this.target_, referenceEnhancer,  true ? this.name_ + "." + stringifyKey(key) + "?" : 0, false);
      this.pendingKeys_.set(key, entry);
    }
    return entry.get();
  }
  /**
   * @param {PropertyKey} key
   * @param {Annotation|boolean} annotation true - use default annotation, false - ignore prop
   */;
  _proto.make_ = function make_(key, annotation) {
    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }
    if (annotation === false) {
      return;
    }
    assertAnnotable(this, annotation, key);
    if (!(key in this.target_)) {
      var _this$target_$storedA;
      // Throw on missing key, except for decorators:
      // Decorator annotations are collected from whole prototype chain.
      // When called from super() some props may not exist yet.
      // However we don't have to worry about missing prop,
      // because the decorator must have been applied to something.
      if ((_this$target_$storedA = this.target_[storedAnnotationsSymbol]) != null && _this$target_$storedA[key]) {
        return; // will be annotated by subclass constructor
      } else {
        die(1, annotation.annotationType_, this.name_ + "." + key.toString());
      }
    }
    var source = this.target_;
    while (source && source !== objectPrototype) {
      var descriptor = getDescriptor(source, key);
      if (descriptor) {
        var outcome = annotation.make_(this, key, descriptor, source);
        if (outcome === 0 /* Cancel */) {
          return;
        }
        if (outcome === 1 /* Break */) {
          break;
        }
      }
      source = Object.getPrototypeOf(source);
    }
    recordAnnotationApplied(this, annotation, key);
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */;
  _proto.extend_ = function extend_(key, descriptor, annotation, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }
    if (annotation === false) {
      return this.defineProperty_(key, descriptor, proxyTrap);
    }
    assertAnnotable(this, annotation, key);
    var outcome = annotation.extend_(this, key, descriptor, proxyTrap);
    if (outcome) {
      recordAnnotationApplied(this, annotation, key);
    }
    return outcome;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */;
  _proto.defineProperty_ = function defineProperty_(key, descriptor, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    try {
      startBatch();
      // Delete
      var deleteOutcome = this.delete_(key);
      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      }
      // ADD interceptor
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: descriptor.value
        });
        if (!change) {
          return null;
        }
        var newValue = change.newValue;
        if (descriptor.value !== newValue) {
          descriptor = _extends({}, descriptor, {
            value: newValue
          });
        }
      }
      // Define
      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key, descriptor);
      }
      // Notify
      this.notifyPropertyAddition_(key, descriptor.value);
    } finally {
      endBatch();
    }
    return true;
  }
  // If original descriptor becomes relevant, move this to annotation directly
  ;

  _proto.defineObservableProperty_ = function defineObservableProperty_(key, value, enhancer, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    try {
      startBatch();
      // Delete
      var deleteOutcome = this.delete_(key);
      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      }
      // ADD interceptor
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: value
        });
        if (!change) {
          return null;
        }
        value = change.newValue;
      }
      var cachedDescriptor = getCachedObservablePropDescriptor(key);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: true,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      };
      // Define
      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key, descriptor);
      }
      var observable = new ObservableValue(value, enhancer,  true ? this.name_ + "." + key.toString() : 0, false);
      this.values_.set(key, observable);
      // Notify (value possibly changed by ObservableValue)
      this.notifyPropertyAddition_(key, observable.value_);
    } finally {
      endBatch();
    }
    return true;
  }
  // If original descriptor becomes relevant, move this to annotation directly
  ;

  _proto.defineComputedProperty_ = function defineComputedProperty_(key, options, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    try {
      startBatch();
      // Delete
      var deleteOutcome = this.delete_(key);
      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      }
      // ADD interceptor
      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: undefined
        });
        if (!change) {
          return null;
        }
      }
      options.name || (options.name =  true ? this.name_ + "." + key.toString() : 0);
      options.context = this.proxy_ || this.target_;
      var cachedDescriptor = getCachedObservablePropDescriptor(key);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: false,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      };
      // Define
      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key, descriptor);
      }
      this.values_.set(key, new ComputedValue(options));
      // Notify
      this.notifyPropertyAddition_(key, undefined);
    } finally {
      endBatch();
    }
    return true;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */;
  _proto.delete_ = function delete_(key, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }
    // No such prop
    if (!hasProp(this.target_, key)) {
      return true;
    }
    // Intercept
    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_ || this.target_,
        name: key,
        type: REMOVE
      });
      // Cancelled
      if (!change) {
        return null;
      }
    }
    // Delete
    try {
      var _this$pendingKeys_, _this$pendingKeys_$ge;
      startBatch();
      var notify = hasListeners(this);
      var notifySpy =  true && isSpyEnabled();
      var observable = this.values_.get(key);
      // Value needed for spies/listeners
      var value = undefined;
      // Optimization: don't pull the value unless we will need it
      if (!observable && (notify || notifySpy)) {
        var _getDescriptor;
        value = (_getDescriptor = getDescriptor(this.target_, key)) == null ? void 0 : _getDescriptor.value;
      }
      // delete prop (do first, may fail)
      if (proxyTrap) {
        if (!Reflect.deleteProperty(this.target_, key)) {
          return false;
        }
      } else {
        delete this.target_[key];
      }
      // Allow re-annotating this field
      if (true) {
        delete this.appliedAnnotations_[key];
      }
      // Clear observable
      if (observable) {
        this.values_["delete"](key);
        // for computed, value is undefined
        if (observable instanceof ObservableValue) {
          value = observable.value_;
        }
        // Notify: autorun(() => obj[key]), see #1796
        propagateChanged(observable);
      }
      // Notify "keys/entries/values" observers
      this.keysAtom_.reportChanged();
      // Notify "has" observers
      // "in" as it may still exist in proto
      (_this$pendingKeys_ = this.pendingKeys_) == null ? void 0 : (_this$pendingKeys_$ge = _this$pendingKeys_.get(key)) == null ? void 0 : _this$pendingKeys_$ge.set(key in this.target_);
      // Notify spies/listeners
      if (notify || notifySpy) {
        var _change2 = {
          type: REMOVE,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: value,
          name: key
        };
        if ( true && notifySpy) {
          spyReportStart(_change2);
        }
        if (notify) {
          notifyListeners(this, _change2);
        }
        if ( true && notifySpy) {
          spyReportEnd();
        }
      }
    } finally {
      endBatch();
    }
    return true;
  }
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */;
  _proto.observe_ = function observe_(callback, fireImmediately) {
    if ( true && fireImmediately === true) {
      die("`observe` doesn't support the fire immediately property for observable objects.");
    }
    return registerListener(this, callback);
  };
  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };
  _proto.notifyPropertyAddition_ = function notifyPropertyAddition_(key, value) {
    var _this$pendingKeys_2, _this$pendingKeys_2$g;
    var notify = hasListeners(this);
    var notifySpy =  true && isSpyEnabled();
    if (notify || notifySpy) {
      var change = notify || notifySpy ? {
        type: ADD,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: key,
        newValue: value
      } : null;
      if ( true && notifySpy) {
        spyReportStart(change);
      }
      if (notify) {
        notifyListeners(this, change);
      }
      if ( true && notifySpy) {
        spyReportEnd();
      }
    }
    (_this$pendingKeys_2 = this.pendingKeys_) == null ? void 0 : (_this$pendingKeys_2$g = _this$pendingKeys_2.get(key)) == null ? void 0 : _this$pendingKeys_2$g.set(true);
    // Notify "keys/entries/values" observers
    this.keysAtom_.reportChanged();
  };
  _proto.ownKeys_ = function ownKeys_() {
    this.keysAtom_.reportObserved();
    return ownKeys(this.target_);
  };
  _proto.keys_ = function keys_() {
    // Returns enumerable && own, but unfortunately keysAtom will report on ANY key change.
    // There is no way to distinguish between Object.keys(object) and Reflect.ownKeys(object) - both are handled by ownKeys trap.
    // We can either over-report in Object.keys(object) or under-report in Reflect.ownKeys(object)
    // We choose to over-report in Object.keys(object), because:
    // - typically it's used with simple data objects
    // - when symbolic/non-enumerable keys are relevant Reflect.ownKeys works as expected
    this.keysAtom_.reportObserved();
    return Object.keys(this.target_);
  };
  return ObservableObjectAdministration;
}();
function asObservableObject(target, options) {
  var _options$name;
  if ( true && options && isObservableObject(target)) {
    die("Options can't be provided for already observable objects.");
  }
  if (hasProp(target, $mobx)) {
    if ( true && !(getAdministration(target) instanceof ObservableObjectAdministration)) {
      die("Cannot convert '" + getDebugName(target) + "' into observable object:" + "\nThe target is already observable of different type." + "\nExtending builtins is not supported.");
    }
    return target;
  }
  if ( true && !Object.isExtensible(target)) {
    die("Cannot make the designated object observable; it is not extensible");
  }
  var name = (_options$name = options == null ? void 0 : options.name) != null ? _options$name :  true ? (isPlainObject(target) ? "ObservableObject" : target.constructor.name) + "@" + getNextId() : 0;
  var adm = new ObservableObjectAdministration(target, new Map(), String(name), getAnnotationFromOptions(options));
  addHiddenProp(target, $mobx, adm);
  return target;
}
var isObservableObjectAdministration = /*#__PURE__*/createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);
function getCachedObservablePropDescriptor(key) {
  return descriptorCache[key] || (descriptorCache[key] = {
    get: function get() {
      return this[$mobx].getObservablePropValue_(key);
    },
    set: function set(value) {
      return this[$mobx].setObservablePropValue_(key, value);
    }
  });
}
function isObservableObject(thing) {
  if (isObject(thing)) {
    return isObservableObjectAdministration(thing[$mobx]);
  }
  return false;
}
function recordAnnotationApplied(adm, annotation, key) {
  var _adm$target_$storedAn;
  if (true) {
    adm.appliedAnnotations_[key] = annotation;
  }
  // Remove applied decorator annotation so we don't try to apply it again in subclass constructor
  (_adm$target_$storedAn = adm.target_[storedAnnotationsSymbol]) == null ? true : delete _adm$target_$storedAn[key];
}
function assertAnnotable(adm, annotation, key) {
  // Valid annotation
  if ( true && !isAnnotation(annotation)) {
    die("Cannot annotate '" + adm.name_ + "." + key.toString() + "': Invalid annotation.");
  }
  /*
  // Configurable, not sealed, not frozen
  // Possibly not needed, just a little better error then the one thrown by engine.
  // Cases where this would be useful the most (subclass field initializer) are not interceptable by this.
  if (__DEV__) {
      const configurable = getDescriptor(adm.target_, key)?.configurable
      const frozen = Object.isFrozen(adm.target_)
      const sealed = Object.isSealed(adm.target_)
      if (!configurable || frozen || sealed) {
          const fieldName = `${adm.name_}.${key.toString()}`
          const requestedAnnotationType = annotation.annotationType_
          let error = `Cannot apply '${requestedAnnotationType}' to '${fieldName}':`
          if (frozen) {
              error += `\nObject is frozen.`
          }
          if (sealed) {
              error += `\nObject is sealed.`
          }
          if (!configurable) {
              error += `\nproperty is not configurable.`
              // Mention only if caused by us to avoid confusion
              if (hasProp(adm.appliedAnnotations!, key)) {
                  error += `\nTo prevent accidental re-definition of a field by a subclass, `
                  error += `all annotated fields of non-plain objects (classes) are not configurable.`
              }
          }
          die(error)
      }
  }
  */
  // Not annotated
  if ( true && !isOverride(annotation) && hasProp(adm.appliedAnnotations_, key)) {
    var fieldName = adm.name_ + "." + key.toString();
    var currentAnnotationType = adm.appliedAnnotations_[key].annotationType_;
    var requestedAnnotationType = annotation.annotationType_;
    die("Cannot apply '" + requestedAnnotationType + "' to '" + fieldName + "':" + ("\nThe field is already annotated with '" + currentAnnotationType + "'.") + "\nRe-annotating fields is not allowed." + "\nUse 'override' annotation for methods overridden by subclass.");
  }
}

// Bug in safari 9.* (or iOS 9 safari mobile). See #364
var ENTRY_0 = /*#__PURE__*/createArrayEntryDescriptor(0);
/**
 * This array buffer contains two lists of properties, so that all arrays
 * can recycle their property definitions, which significantly improves performance of creating
 * properties on the fly.
 */
var OBSERVABLE_ARRAY_BUFFER_SIZE = 0;
// Typescript workaround to make sure ObservableArray extends Array
var StubArray = function StubArray() {};
function inherit(ctor, proto) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ctor.prototype, proto);
  } else if (ctor.prototype.__proto__ !== undefined) {
    ctor.prototype.__proto__ = proto;
  } else {
    ctor.prototype = proto;
  }
}
inherit(StubArray, Array.prototype);
// Weex proto freeze protection was here,
// but it is unclear why the hack is need as MobX never changed the prototype
// anyway, so removed it in V6
var LegacyObservableArray = /*#__PURE__*/function (_StubArray, _Symbol$toStringTag, _Symbol$iterator) {
  _inheritsLoose(LegacyObservableArray, _StubArray);
  function LegacyObservableArray(initialValues, enhancer, name, owned) {
    var _this;
    if (name === void 0) {
      name =  true ? "ObservableArray@" + getNextId() : 0;
    }
    if (owned === void 0) {
      owned = false;
    }
    _this = _StubArray.call(this) || this;
    var adm = new ObservableArrayAdministration(name, enhancer, owned, true);
    adm.proxy_ = _assertThisInitialized(_this);
    addHiddenFinalProp(_assertThisInitialized(_this), $mobx, adm);
    if (initialValues && initialValues.length) {
      var prev = allowStateChangesStart(true);
      // @ts-ignore
      _this.spliceWithArray(0, 0, initialValues);
      allowStateChangesEnd(prev);
    }
    {
      // Seems that Safari won't use numeric prototype setter untill any * numeric property is
      // defined on the instance. After that it works fine, even if this property is deleted.
      Object.defineProperty(_assertThisInitialized(_this), "0", ENTRY_0);
    }
    return _this;
  }
  var _proto = LegacyObservableArray.prototype;
  _proto.concat = function concat() {
    this[$mobx].atom_.reportObserved();
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }
    return Array.prototype.concat.apply(this.slice(),
    //@ts-ignore
    arrays.map(function (a) {
      return isObservableArray(a) ? a.slice() : a;
    }));
  };
  _proto[_Symbol$iterator] = function () {
    var self = this;
    var nextIndex = 0;
    return makeIterable({
      next: function next() {
        return nextIndex < self.length ? {
          value: self[nextIndex++],
          done: false
        } : {
          done: true,
          value: undefined
        };
      }
    });
  };
  _createClass(LegacyObservableArray, [{
    key: "length",
    get: function get() {
      return this[$mobx].getArrayLength_();
    },
    set: function set(newLength) {
      this[$mobx].setArrayLength_(newLength);
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return "Array";
    }
  }]);
  return LegacyObservableArray;
}(StubArray, Symbol.toStringTag, Symbol.iterator);
Object.entries(arrayExtensions).forEach(function (_ref) {
  var prop = _ref[0],
    fn = _ref[1];
  if (prop !== "concat") {
    addHiddenProp(LegacyObservableArray.prototype, prop, fn);
  }
});
function createArrayEntryDescriptor(index) {
  return {
    enumerable: false,
    configurable: true,
    get: function get() {
      return this[$mobx].get_(index);
    },
    set: function set(value) {
      this[$mobx].set_(index, value);
    }
  };
}
function createArrayBufferItem(index) {
  defineProperty(LegacyObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
}
function reserveArrayBuffer(max) {
  if (max > OBSERVABLE_ARRAY_BUFFER_SIZE) {
    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max + 100; index++) {
      createArrayBufferItem(index);
    }
    OBSERVABLE_ARRAY_BUFFER_SIZE = max;
  }
}
reserveArrayBuffer(1000);
function createLegacyArray(initialValues, enhancer, name) {
  return new LegacyObservableArray(initialValues, enhancer, name);
}
function getAtom(thing, property) {
  if (_typeof(thing) === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      if (property !== undefined) {
        die(23);
      }
      return thing[$mobx].atom_;
    }
    if (isObservableSet(thing)) {
      return thing.atom_;
    }
    if (isObservableMap(thing)) {
      if (property === undefined) {
        return thing.keysAtom_;
      }
      var observable = thing.data_.get(property) || thing.hasMap_.get(property);
      if (!observable) {
        die(25, property, getDebugName(thing));
      }
      return observable;
    }
    if (isObservableObject(thing)) {
      if (!property) {
        return die(26);
      }
      var _observable = thing[$mobx].values_.get(property);
      if (!_observable) {
        die(27, property, getDebugName(thing));
      }
      return _observable;
    }
    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
      return thing;
    }
  } else if (isFunction(thing)) {
    if (isReaction(thing[$mobx])) {
      // disposer function
      return thing[$mobx];
    }
  }
  die(28);
}
function getAdministration(thing, property) {
  if (!thing) {
    die(29);
  }
  if (property !== undefined) {
    return getAdministration(getAtom(thing, property));
  }
  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
    return thing;
  }
  if (isObservableMap(thing) || isObservableSet(thing)) {
    return thing;
  }
  if (thing[$mobx]) {
    return thing[$mobx];
  }
  die(24, thing);
}
function getDebugName(thing, property) {
  var named;
  if (property !== undefined) {
    named = getAtom(thing, property);
  } else if (isAction(thing)) {
    return thing.name;
  } else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing)) {
    named = getAdministration(thing);
  } else {
    // valid for arrays as well
    named = getAtom(thing);
  }
  return named.name_;
}
var toString = objectPrototype.toString;
function deepEqual(a, b, depth) {
  if (depth === void 0) {
    depth = -1;
  }
  return eq(a, b, depth);
}
// Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.
function eq(a, b, depth, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  }
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) {
    return false;
  }
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) {
    return b !== b;
  }
  // Exhaust primitive checks
  var type = _typeof(a);
  if (type !== "function" && type !== "object" && _typeof(b) != "object") {
    return false;
  }
  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className !== toString.call(b)) {
    return false;
  }
  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return "" + a === "" + b;
    case "[object Number]":
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) {
        return +b !== +b;
      }
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case "[object Date]":
    case "[object Boolean]":
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case "[object Symbol]":
      return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);
    case "[object Map]":
    case "[object Set]":
      // Maps and Sets are unwrapped to arrays of entry-pairs, adding an incidental level.
      // Hide this extra level by increasing the depth.
      if (depth >= 0) {
        depth++;
      }
      break;
  }
  // Unwrap any wrapped objects.
  a = unwrap(a);
  b = unwrap(b);
  var areArrays = className === "[object Array]";
  if (!areArrays) {
    if (_typeof(a) != "object" || _typeof(b) != "object") {
      return false;
    }
    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
      return false;
    }
  }
  if (depth === 0) {
    return false;
  } else if (depth < 0) {
    depth = -1;
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  }
  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);
  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) {
      return false;
    }
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], depth - 1, aStack, bStack)) {
        return false;
      }
    }
  } else {
    // Deep compare objects.
    var keys = Object.keys(a);
    var key;
    length = keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (Object.keys(b).length !== length) {
      return false;
    }
    while (length--) {
      // Deep compare each member
      key = keys[length];
      if (!(hasProp(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack))) {
        return false;
      }
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}
function unwrap(a) {
  if (isObservableArray(a)) {
    return a.slice();
  }
  if (isES6Map(a) || isObservableMap(a)) {
    return Array.from(a.entries());
  }
  if (isES6Set(a) || isObservableSet(a)) {
    return Array.from(a.entries());
  }
  return a;
}
function makeIterable(iterator) {
  iterator[Symbol.iterator] = getSelf;
  return iterator;
}
function getSelf() {
  return this;
}
function isAnnotation(thing) {
  return (
    // Can be function
    thing instanceof Object && typeof thing.annotationType_ === "string" && isFunction(thing.make_) && isFunction(thing.extend_)
  );
}

/**
 * (c) Michel Weststrate 2015 - 2020
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get a global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */
["Symbol", "Map", "Set"].forEach(function (m) {
  var g = getGlobal();
  if (typeof g[m] === "undefined") {
    die("MobX requires global '" + m + "' to be available or polyfilled");
  }
});
if ((typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "undefined" ? "undefined" : _typeof(__MOBX_DEVTOOLS_GLOBAL_HOOK__)) === "object") {
  // See: https://github.com/andykog/mobx-devtools/
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: {
      getDebugName: getDebugName
    },
    $mobx: $mobx
  });
}


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!****************************************************************************!*\
  !*** ./cartridges/app_custom_sfra/cartridge/client/default/js/checkout.js ***!
  \****************************************************************************/


var processInclude = __webpack_require__(/*! base/util */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/util.js");
$(document).ready(function () {
  processInclude(__webpack_require__(/*! base/checkout */ "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/js/checkout.js"));
  processInclude(__webpack_require__(/*! ../../../../../int_adyen_SFRA/cartridge/client/default/js/checkout */ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/checkout.js"));
  processInclude(__webpack_require__(/*! ./checkout/billing */ "./cartridges/app_custom_sfra/cartridge/client/default/js/checkout/billing.js"));
});
}();
/******/ })()
;
//# sourceMappingURL=checkout.js.map