"use strict";

const http = require("http");
const path = require("path");

const express = require("express");
const app = express();

const { port, host, storage } = require("./serverConfig.json");

const DataStorage = require(path.join(
  __dirname,
  storage.storageFolder,
  storage.dataLayer
));
const dataStorage = new DataStorage();
const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pageviews"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const menuPath = path.join(__dirname, "menu.html");

app.get("/", (req, res) => res.sendFile(menuPath));

app.get("/all", (req, res) => {
  dataStorage
    .getAll()
    .then((data) => res.render("allCustomers", { result: data }));
});

app.get("/getCustomer", (req, res) =>
  res.render("getCustomer", {
    title: "Get",
    header: "Get",
    action: "/getCustomer",
  })
);

app.post("/getCustomer", (req, res) => {
  if (!req.body) res.sendStatus(500);
  const customerId = req.body.customerId;
  dataStorage
    .getOne(customerId)
    .then((customer) => res.render("customerPage", { result: customer }))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/removeCustomer", (req, res) =>
  res.render("getCustomer", {
    title: "Remove",
    header: "Remove a customer ",
    action: "/removeCustomer",
  })
);

app.post("/removeCustomer", (req, res) => {
  if (!req.body) res.sendStatus(500);
  const customerId = req.body.customerId;
  dataStorage
    .remove(customerId)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/inputForm", (req, res) =>
  res.render("form", {
    title: "Add Customer",
    header: "Add a new Customer ",
    action: "/insert",
    customerId: { value: "", readonly: "" },
    firstname: { value: "", readonly: "" },
    lastname: { value: "", readonly: "" },
    favoriteIceCream: { value: "", readonly: "" },
    address: { value: "", readonly: "" },
  })
);

app.post("/insert", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .insert(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/updateForm", (req, res) =>
  res.render("form", {
    title: "Update Customer",
    header: "Update Customer data",
    action: "/updatedata",
    customerId: { value: "", readonly: "" },
    firstname: { value: "", readonly: "" },
    lastname: { value: "", readonly: "" },
    favoriteIceCream: { value: "", readonly: "" },
    address: { value: "", readonly: "" },
  })
);

app.post("/updatedata", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .getOne(req.body.customerId)
    .then((customer) =>
      res.render("form", {
        title: "Update Customer",
        header: "Update Customer data",
        action: "/update",
        customerId: { value: customer.customerId, readonly: "readonly" },
        firstname: { value: customer.firstname, readonly: "" },
        lastname: { value: customer.lastname, readonly: "" },
        favoriteIceCream: { value: customer.favoriteIceCream, readonly: "" },
        address: { value: customer.address, readonly: "" },
      })
    )
    .catch((error) => sendErrorPage(res, error));
});

app.post("/update", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .update(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

server.listen(port, host, () => console.log(`${host}:${port} Serving..`));

function sendErrorPage(res, error, title = "Error", header = "Error") {
  sendStatusPage(res, error, title.header);
}

function sendStatusPage(res, status, title = "Status", header = "Status") {
  return res.render("statusPage", { title, header, status });
}
