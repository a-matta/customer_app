"use strict";

const path = require("path");

const { readJSONFromFile, writeJSONToFile } = require("./reader-writer");
const { storageFile, adapterFile } = require("./storageConfig.json");

const { adapt } = require(path.join(__dirname, adapterFile)); //load file as module
const storageFilePath = path.join(__dirname, storageFile);

async function getAllFromStorage() {
  let result = readJSONFromFile(storageFilePath);
  return result;
}

async function getOneFromStorage(customerId) {
  const storage = await readJSONFromFile(storageFilePath);
  return storage.find((item) => item.customerId == customerId) || null;
}

async function addToStorage(newObject) {
  const storage = await readJSONFromFile(storageFilePath);
  storage.push(adapt(newObject));
  return await writeJSONToFile(storageFilePath, storage);
}

async function updateStorage(updatedObject) {
  const storage = await readJSONFromFile(storageFilePath);
  const oldObject = storage.find(
    (item) => item.customerId == updatedObject.customerId
  );
  if (oldObject) {
    Object.assign(oldObject, adapt(updatedObject));
    return await writeJSONToFile(storageFilePath, storage);
  }
}

async function removeFromStorage(customerId) {
  const storage = await readJSONFromFile(storageFilePath);
  const i = storage.findIndex((item) => item.customerId == customerId);
  if (i < 0) return false;
  storage.splice(i, 1);
  return await writeJSONToFile(storageFilePath, storage);
}

module.exports = {
  getAllFromStorage,
  getOneFromStorage,
  addToStorage,
  updateStorage,
  removeFromStorage,
};
