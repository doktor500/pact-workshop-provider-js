import express from "express";

import paymentMethodRepository from "./paymentMethodRepository";
import { PaymentMethodValidator } from "./paymentMethodValidator";

const cors = require("cors");
const app = express();

const paymentMethodValidator = new PaymentMethodValidator(paymentMethodRepository);

app.use(cors());

app.get("/validate-payment-method/:paymentMethod", async (request, response) => {
  const validationResult = await paymentMethodValidator.validate(request.params.paymentMethod);
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ status: validationResult }));
});

module.exports = app;
