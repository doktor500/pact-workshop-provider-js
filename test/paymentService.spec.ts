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
