"use strict";

const path = require("path");

/**
 * Allows to configure aliases for you require loading
 */
module.exports.aliasConfig = {
  // enter all aliases to configure

  alias: {
    base: path.resolve(
      process.cwd(), // eslint-disable-next-line max-len
      "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base/cartridge/client/default/"
    ),
    plugin: path.resolve(
      process.cwd(), // eslint-disable-next-line max-len
      "./cartridges/int_adyen_SFRA/cartridge/client/default/"
    ),
    plugin: path.resolve(
      process.cwd(), // eslint-disable-next-line max-len
      "./cartridges/plugin_wishlists/cartridges/plugin_wishlists/cartridge/client/default/"
    ),
    custom: path.resolve(
      process.cwd(), // eslint-disable-next-line max-len
      "./cartridges/app_custom_sfra/cartridge/client/default/"
    ),
    // plugin: path.resolve(
    //   process.cwd(), // eslint-disable-next-line max-len
    //   "./cartridges/sfra_giftcert/cartridges/sfra_giftcert/cartridge/client/default/"
    // ),
  },
};

/**
 * Allows copying files to static folder
 */
module.exports.copyConfig = {
  "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base": [
    { from: "./node_modules/font-awesome/fonts/", to: "default/fonts" },
    { from: "./node_modules/flag-icon-css/flags", to: "default/fonts/flags" },
  ],
  // "storefront-reference-architecture-master/cartridges/int_adyen_SFRA": [
  //   { from: "./node_modules/font-awesome/fonts/", to: "default/fonts" },
  //   { from: "./node_modules/flag-icon-css/flags", to: "default/fonts/flags" },
  // ],
};

/**
 * Allows custom include path config
 */
module.exports.includeConfig = {
  "storefront-reference-architecture/cartridges/app_storefront_base": {
    scss: ["my-custom-node_modules"],
  },
};

/**
 * Exposes cartridges included in the project
 */
module.exports.cartridges = [
  "./cartridges/storefront-reference-architecture/cartridges/app_storefront_base",
  "./cartridges/bm_adyen",
  "./cartridges/int_adyen_overlay",
  "./cartridges/int_adyen_SFRA",
  "./cartridges/app_custom_sfra",
  "./cartridges/plugin_wishlists/cartridges/plugin_wishlists",
];

/**
 * Lint options
 */
module.exports.lintConfig = {
  eslintFix: true,
  stylelintFix: true,
};
