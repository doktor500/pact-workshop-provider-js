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
