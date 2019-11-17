import express from "express";

import { PaymentMethodValidator } from "./paymentMethodValidator";

const cors = require("cors");
const app = express();
const paymentMethodValidator = new PaymentMethodValidator();

app.use(cors());

app.get("/validate-payment-method/:paymentMethod", (request, response) => {
  const validationResult = paymentMethodValidator.validate(request.params.paymentMethod);
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ state: validationResult }));
});

module.exports = app;
