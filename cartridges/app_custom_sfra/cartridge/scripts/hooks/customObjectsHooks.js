'use strict';

var toCamel = function (s) {
    // eslint-disable-next-line no-useless-escape
    return s.replace(/(\-[a-z])/g, function ($1) { return $1.toUpperCase().replace('-', ''); });
};

/**
 *  Custom Object Modify Get Hook
 * @param {Object} scriptObject - the database objec
 * @param {Object} doc - the document
 */
exports.modifyGETResponse = function (customObject, doc) {
    if (customObject.type === 'OCCustomAPI') {
        var result = require('*/cartridge/scripts/apis/' + toCamel(customObject.custom.ID)).get(request.httpParameters);
        // var cust = require('../apis/getCustomer');
        // var res = cust.get(request.httpParameters);
        doc.c__result = result;
    }
};
