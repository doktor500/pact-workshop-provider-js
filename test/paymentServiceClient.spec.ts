import * as path from "path";
import { Verifier } from "@pact-foundation/pact";

import paymentMethodRepository from "../src/paymentMethodRepository";

const server = require("../src/server");

describe("Payment service", () => {
  const SERVER_HOST = "localhost";
  const SERVER_PORT = 4567;

  it("validates the expectations Payment service client", async () => {
    const options = {
      provider: "PaymentService",
      providerBaseUrl: `http://${SERVER_HOST}:${SERVER_PORT}`,
      stateHandlers: {
        "fraudulent payment method": () => {
          return paymentMethodRepository.blackList("9999999999999999");
        }
      },
      pactUrls: [
        path.resolve(
          process.cwd(),
          "../pact-workshop-consumer-js/pacts/paymentserviceclient-paymentservice.json"
        ),
      ]
    }

    server.listen(SERVER_PORT);

    await new Verifier(options).verifyProvider();
  });
});
