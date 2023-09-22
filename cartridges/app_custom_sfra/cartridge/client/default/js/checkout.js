'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('base/checkout'));
    processInclude(require('../../../../../int_adyen_SFRA/cartridge/client/default/js/checkout'));
    processInclude(require('./checkout/billing'));
});
