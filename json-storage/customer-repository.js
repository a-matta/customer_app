"use strict";

const { CODES, MESSAGES } = require("./status-codes");

const {
  getAllFromStorage,
  getOneFromStorage,
  addToStorage,
  updateStorage,
  removeFromStorage,
} = require("./storageLayer");

module.exports = class DataStorage {
  get CODES() {
    return CODES;
  }

  getAll() {
    return getAllFromStorage();
  }

  getOne(id) {
    return new Promise(async (resolve, reject) => {
      if (!id) {
        reject(MESSAGES.NOT_FOUND("---empty---"));
      } else {
        const result = await getOneFromStorage(id);
        if (result) {
          resolve(result);
        } else {
          reject(MESSAGES.NOT_FOUND(id));
        }
      }
    });
  }
  insert(customer) {
    return new Promise(async (resolve, reject) => {
      if (customer) {
        if (!customer.customerId) {
          reject(MESSAGES.NOT_INSERTED());
        } else if (await getOneFromStorage(customer.customerId)) {
          reject(MESSAGES.ALREADY_IN_USE(customer.customerId));
        } else if (await addToStorage(customer)) {
          resolve(MESSAGES.INSERT_OK(customer.customerId));
        } else {
          reject(MESSAGES.NOT_INSERTED());
        }
      } else {
        reject(MESSAGES.NOT_INSERTED());
      }
    });
  }

  update(customer) {
    return new Promise(async (resolve, reject) => {
      if (customer) {
        if (await updateStorage(customer)) {
          resolve(MESSAGES.UPDATE_OK(customer.customerId));
        } else {
          reject(MESSAGES.NOT_UPDATED());
        }
      } else {
        reject(MESSAGES.NOT_UPDATED());
      }
    });
  }

  remove(id) {
    return new Promise(async (resolve, reject) => {
      if (!id) {
        reject(MESSAGES.NOT_FOUND("empty"));
      } else if (await removeFromStorage(id)) {
        resolve(MESSAGES.REMOVE_OK(id));
      } else {
        reject(MESSAGES.NOT_REMOVED(id));
      }
    });
  }
};
