import { PaymentMethodValidator } from "../src/paymentMethodValidator";

describe("Payment Method Validator", () => {
  it.each`
    paymentMethod              | isValid
    ${"1234123412341234"}      | ${"valid"}
    ${"1111 2222 3333 4444"}   | ${"valid"}
    ${"1111 2222 3333 444B"}   | ${"invalid"}
    ${"1111 2222 3333 4444 5"} | ${"invalid"}
    ${"1111 2222 3333"}        | ${"invalid"}
    ${""}                      | ${"invalid"}
    ${undefined}               | ${"invalid"}
    `("payment method ${paymentMethod} should be ${isValid}", ({ paymentMethod, isValid }) => {
    const paymentMethodValidator = new PaymentMethodValidator();
    expect(paymentMethodValidator.validate(paymentMethod)).toEqual(isValid);
  });
});
