# sfra_giftcert: Gift Certificates plugin for Storefront Reference Architecture (SFRA)

**Disclaimer**
This plugin is intended to demonstrate the gift certificate features provided by the B2C Commerce Script API as standard. 
It is not intended to be used in a production environment as is.

## Capabilities

This plugin enhances the app_storefront_base cartridge by providing gift certificate functionality, including the following capabilities:
* Buy a gift certificate, including setting the recipient name, recipient email, amount, recipient message
* Send the gift certificate by email to the recipient
* Check a gift certificate balance
* Use a gift certificate as a payment method

## Limitations

* Cannot mix products and gift certificate in the same basket:
  * Adding a gift certificate to basket will remove any products already there
  * Adding a product to basket will remove any gift certificate already there
* Cannot add to basket more than 1 gift certificate

## Demonstration

Recorded demonstration:
[MP4](https://org62.my.salesforce.com/sfc/p/000000000062/a/0M000000O8UP/0BntP9ieIY7Fpf2ugXTKnK4Mn.an.d5WSCBO1Bc_W0k)

## Requirements

Tested with app_storefront_base version 4.2.1

## Installation

#### Set base path

Edit package.json and set the `base` property of the `paths` object to point to a standard app_storefront_base cartridge, eg.

```
  "paths": {
    "base": "/Users/user1/projects/project1/storefront-reference-architecture/cartridges/app_storefront_base"
  }
```

#### Install dependencies

```
npm install
```

#### Compile Client-Side JS

```
npm run compile:js
```

#### Upload the cartridge to your instance

```
npm run uploadCartridge
```

#### Add the cartridge to your cartridge path

```
sfra_giftcert:app_storefront_base
```

#### Create the gift certificate payment method and payment processor

In Business Manager:
* Go to Merchant Tools > Ordering > Payment Processors
* Create a payment processor with ID: BASIC_GIFT_CERTIFICATE
* Go to Merchant Tools > Ordering > Payment Methods
* Create and enable a payment method with ID: GIFT_CERTIFICATE
* Set the payment processor BASIC_GIFT_CERTIFICATE for the payment method GIFT_CERTIFICATE

#### Link to the gift certificate landing page

In Business Manager:
* Go to Merchant Tools > Content > Content Assets
* Open footer-support
* Add/Edit the following line
```
<li><a href="$httpsUrl('GiftCertificate-Landing')$" title="Go to Gift Certificates">Gift Certificates</a></li>
```


