import paymentMethodRepository from "../src/paymentMethodRepository";

describe("Payment method repository", () => {
  it("returns if apyment method is blacklisted", async () =>{
    await paymentMethodRepository.blackList("9999999999999999");
    
    expect(await paymentMethodRepository.isBlackListed("1234123412341234")).toBe(false);
    expect(await paymentMethodRepository.isBlackListed("9999999999999999")).toBe(true);
  });
});
