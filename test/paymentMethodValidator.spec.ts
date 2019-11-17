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
