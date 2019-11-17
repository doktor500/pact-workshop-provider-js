### Provider Step 2 (Using provider state)

In the `pact-workshop-provider-js` directory run again `yarn test` and see how the new contract test added by the
consumer is failing.

In order to define the necessary state in the provider side that is needed to make a test like this to pass,
Pact introduces the concept of "provider states".

First, we are going to create a repository to keep track of fraudulent payment methods, we will use an in-memory
implementation of the repository, but the same approach applies if you persist this state in a real database.

We will start creating a unit test for the repository:

Create a `test/paymentMethodRepository.spec.ts` file with the following content:

```typescript
import paymentMethodRepository from "../src/paymentMethodRepository";

describe("Payment method repository", () => {
  it("returns if payment method is blacklisted", async () =>{
    await paymentMethodRepository.blackList("9999999999999999");

    expect(await paymentMethodRepository.isBlackListed("1234123412341234")).toBe(false);
    expect(await paymentMethodRepository.isBlackListed("9999999999999999")).toBe(true);
  });
});
```

Now create a `src/paymentMethodRepository.ts` file to provide an in-memory implementation of the repository. This file
should contain the following content:

```typescript
export interface PaymentMethodRepository {
  blackList(paymentMethod: string): Promise<void>;
  isBlackListed(paymentMethod: string): Promise<boolean>;
}

class InMemoryPaymentMethodRepository implements PaymentMethodRepository {
  private blackListedPaymentMethods: string[] = [];

  public async blackList(paymentMethod: string): Promise<void> {
    this.blackListedPaymentMethods.push(paymentMethod);
  }

  public async isBlackListed(paymentMethod: string): Promise<boolean> {
    const isBlackListed = this.blackListedPaymentMethods.includes(paymentMethod);
    return Promise.resolve(isBlackListed);
  }
}

const paymentMethodRepository = new InMemoryPaymentMethodRepository();

export default paymentMethodRepository;
```

Additionally, we will access the repository from the `paymentMethodValidator.ts` in order to know if a payment method
has been blacklisted.

Let's start modifying the `/test/paymentMethodValidator.spec.ts` test. It should be updated containing the following
content:

```typescript
import { PaymentMethodRepository } from "../src/paymentMethodRepository";
import { PaymentMethodValidator } from "../src/paymentMethodValidator";

describe("Payment Method Validator", () => {
  it.each`
    paymentMethod              | status
    ${"1234123412341234"}      | ${"valid"}
    ${"1111 2222 3333 4444"}   | ${"valid"}
    ${"1111 2222 3333 444B"}   | ${"invalid"}
    ${"1111 2222 3333 4444 5"} | ${"invalid"}
    ${"1111 2222 3333"}        | ${"invalid"}
    ${""}                      | ${"invalid"}
    ${undefined}               | ${"invalid"}
    ${"9999 9999 9999 9999"}   | ${"fraud"}
    `("payment method ${paymentMethod} should be ${status}", async ({ paymentMethod, status }) => {

    const isFraud = (status === "fraud");
    const paymentMethodRepository = {
      isBlackListed: jest.fn().mockReturnValue(isFraud),
      blackList: jest.fn()
    } as PaymentMethodRepository;

    const paymentMethodValidator = new PaymentMethodValidator(paymentMethodRepository);
    const validationResult = await paymentMethodValidator.validate(paymentMethod);
    expect(validationResult).toEqual(status);
  });
});
```

Note that we now have a new test case for a fraudulent payment method and that we are mocking the collaboration that
happens with the `PaymentMethodRepository`.

We also have to update the `src/paymentMethodValidator.ts` file to use the repository, the updated file, should contain
the following content:

```typescript
import { PaymentMethodRepository } from "./paymentMethodRepository";

const PAYMENT_METHOD_LENGTH = 16;

enum PaymentMethodStatus {
  Valid = "valid",
  Invalid = "invalid",
  Fraud = "fraud"
}

export class PaymentMethodValidator {
  private readonly paymentMethodRepository: PaymentMethodRepository;

  constructor(paymentMethodRepository: PaymentMethodRepository) {
    this.paymentMethodRepository = paymentMethodRepository;
  }

  public async validate(paymentMethod: string): Promise<string> {
    const sanitizedPaymentMethod = this.sanitize(paymentMethod);
    const isValid = this.isNumeric(sanitizedPaymentMethod) && this.hasValidLength(sanitizedPaymentMethod);
    const isBlackListed = await this.paymentMethodRepository.isBlackListed(sanitizedPaymentMethod);
    if (isBlackListed) { return PaymentMethodStatus.Fraud; }
    return isValid ? PaymentMethodStatus.Valid : PaymentMethodStatus.Invalid;
  }

  private isNumeric(paymentMethod: string): boolean {
    return !Number.isNaN(Number(paymentMethod));
  }

  private hasValidLength(paymentMethod: string): boolean {
    return paymentMethod.length === PAYMENT_METHOD_LENGTH;
  }

  private sanitize(paymentMethod: string): string {
    return paymentMethod ? paymentMethod.replace(/\s/g, "") : "";
  }
}
```

Review the new logic added to the `validate` method. The validation now verifies if a payment method is fraudulent
querying the repository.

Update the `src/server.ts` file to inject the `PaymentMethodRepository` dependency in the `PaymentMethodValidator`. The
file should contain the following content:

```typescript
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
```

Finally, go to the `test/PaymentService.spec.ts`, and add a new `stateHandlers` section in the Pact Verifier
options. the file should contain the following content:

```typescript
import { Verifier } from "@pact-foundation/pact";
import * as path from "path";

import paymentMethodRepository from "../src/paymentMethodRepository";

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
                ),
            ],
            provider: "PaymentService",
            providerBaseUrl: `http://${SERVER_HOST}:${SERVER_PORT}`,
            stateHandlers: {
                "fraudulent payment method": () => {
                    return paymentMethodRepository.blackList("9999999999999999");
                }
            },
        };

        server.listen(SERVER_PORT);

        await new Verifier(options).verifyProvider();
    });
});
```

Note how a new provider state is defined, it contains the same name used in the "state" property when the consumer
declared the interaction with the provider and how it setups the desired state in the repository.

Run again `yarn test` and see all the tests passing.

When the tests are green, in the `pact-workshop-consumer-js` directory run
`git clean -df && git checkout . && git checkout consumer-step3`, also clone the
[Broker](https://github.com/doktor500/pact-workshop-broker/) repository and follow the instructions in the **Broker's**
readme file.
