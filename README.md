### Provider Step 1 (Verifying an existing contract)

When we previously ran (in the consumer) the `test/payments/paymentServiceClient.spec.ts` test, it passed, but it also 
generated a `pacts/paymentserviceclient-paymentservice.json` pact file that we can use to validate our assumptions in 
the provider side.

Pact can verify the provider against the generated pact file. It can get the pact file from any URL (like a URL
generated from the last successful CI build), but in this case, we are just going to use the local file for now.

Run `yarn add -D @pact-foundation/pact` and create this test file `test/paymentService.spec.ts` with the
following content:

```typescript
import { Verifier } from "@pact-foundation/pact";
import * as path from "path";
const server = require("../src/server");

describe("Payment service", () => {
    const SERVER_HOST = "localhost";
    const SERVER_PORT = 4567;

    it("validates the expectations Payment service client", async () => {
        const options = {
            pactUrls: [
                path.resolve(
                    process.cwd(),
                    "../pact-workshop-consumer-js/pacts/paymentserviceclient-paymentservice.json"
                )
            ],
            provider: "PaymentService",
            providerBaseUrl: `http://${SERVER_HOST}:${SERVER_PORT}`,
        };

        server.listen(SERVER_PORT);

        await new Verifier(options).verifyProvider();
    }, 10000);
});
```

In the `pact-workshop-provider-js` directory run `yarn test`. You should see the test failing, because the provider 
is not compatible with the contract that the consumer has defined. Fix the implementation in `pact-workshop-provider-js`
in order for the provider become compatible with the contract. Run `yarn test` in the `pact-workshop-provider-js` until
you see all the tests green. 

Once all the tests are green, you have successfully verified your first contract, congratulations!

You can run `yarn start` both in the `pact-workshop-consumer-js` and `pact-workshop-provider-js` directories, use a 16
digit credit card number and see a successful validation of the payment method.

Navigate to the directory in where you checked out `pact-workshop-consumer-js`, run
`git clean -df && git checkout . && git checkout consumer-step2` and follow the instructions in the Consumers' readme
file
