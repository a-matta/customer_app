"use strict";

function adapt(item) {
  return {
    customerId: +item.customerId,
    firstname: item.firstname,
    lastname: item.lastname,
    favoriteIceCream: item.favoriteIceCream,
    address: item.address,
  };
}

module.exports = { adapt };
