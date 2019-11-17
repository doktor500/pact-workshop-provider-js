### Provider Step 3 (Working with a PACT broker)

#### Verifying contracts with the pact-broker

In the `pact-workshop-provider-js` directory execute `yarn add -D @pact-foundation/pact-node`.

Modify the `test/pactService.spec.ts` file with the following content in order to publish verification results in
the broker, the file should contain the following content:

```typescript
import { Verifier } from "@pact-foundation/pact";
import { execSync } from "child_process";

import paymentMethodRepository from "../src/paymentMethodRepository";

const server = require("../src/server");
const provider = "PaymentService";

const gitCommit = execSync("git rev-parse HEAD").toString().trim();
const gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

describe("Payment service", () => {
  const HOST = "localhost";
  const SERVER_PORT = 4567;
  const BROKER_PORT = 8000;

  it("validates the expectations Payment service client", async () => {
    const options = {
      consumerVersionTag: process.env.CONSUMER_VERSION_TAG,
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL || `http://${HOST}:${BROKER_PORT}`,
      provider,
      providerBaseUrl: `http://${HOST}:${SERVER_PORT}`,
      providerVersion: gitCommit,
      providerVersionTag: gitBranch,
      publishVerificationResult: process.env.PUBLISH_VERIFICATION_RESULTS === "true",
      stateHandlers: {
        "fraudulent payment method": () => {
          return paymentMethodRepository.blackList("9999999999999999");
        }
      }
    };

    server.listen(SERVER_PORT);

    await new Verifier(options).verifyProvider();
  });
});
```

Execute `PUBLISH_VERIFICATION_RESULTS=true yarn test`. You should see all the tests passing.
When we run this verification, we are using the contract that the consumer published to the broker.

Navigate to your broker URL, you should see the contract verified.
