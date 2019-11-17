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
    if (isBlackListed) return PaymentMethodStatus.Fraud;
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
