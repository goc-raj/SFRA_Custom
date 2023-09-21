'use strict';
//var base = require('./base');

/**
 * Updates the Mini-Cart quantity value after the customer has pressed the "Add to Cart" button
 * @param {string} response - ajax response from clicking the add to cart button
 */
function handlePostCartAdd(response) {
    $('.minicart').trigger('count:update', response);
    var messageType = response.error ? 'alert-danger' : 'alert-success';

    if ($('.add-to-cart-messages').length === 0) {
        $('body').append(
            '<div class="add-to-cart-messages"></div>'
        );
    }

    $('.add-to-cart-messages').append(
        '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
        + response.message
        + '</div>'
    );

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
            success: function () {
                // reporting urls hit on the server
            },
            error: function () {
                // no reporting urls hit on the server
            }
        });
    }
}

module.exports= {
    addGiftCertToCart: function () {
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
                    success: function (data) {
                        handlePostCartAdd(data);
                        $('body').trigger('product:afterAddToCart', data);
                        $.spinner().stop();
                        miniCartReportingUrl(data.reportingURL);
                    },
                    error: function () {
                        $.spinner().stop();
                    }
                });
            }
        });
    },

    miniCartReportingUrl: miniCartReportingUrl
};