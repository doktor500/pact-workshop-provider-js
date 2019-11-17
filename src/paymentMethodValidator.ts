const PAYMENT_METHOD_LENGTH = 16;

enum PaymentMethodStatus {
  Valid = "valid",
  Invalid = "invalid",
}

export class PaymentMethodValidator {
  public validate(paymentMethod: string): string {
    const sanitizedPaymentMethod = this.sanitize(paymentMethod);
    const isValid = this.isNumeric(sanitizedPaymentMethod) && this.hasValidLength(sanitizedPaymentMethod);
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
