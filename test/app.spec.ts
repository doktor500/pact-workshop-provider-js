const supertest = require("supertest");

const server = require("../src/server");
const request = supertest(server);

describe("Payment Service", () => {
  it("validates a payment method", async () => {
    const response = await request.get("/validate-payment-method/1234123412341234");
    expect(response.body).toEqual({ state: "valid" });
  });
});
