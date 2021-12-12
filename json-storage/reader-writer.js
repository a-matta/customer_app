"use strict";

const fs = require("fs/promises");

async function readJSONFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`Unable to read file ${filePath}`, err);
    return [];
  }
}

async function writeJSONToFile(filePath, jsonData) {
  try {
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4)),
      {
        encoding: "utf8",
        flag: "w",
      };
    return true;
  } catch (err) {
    console.log(`Unable to write to ${filePath}`, err);
    return false;
  }
}

module.exports = { readJSONFromFile, writeJSONToFile };
