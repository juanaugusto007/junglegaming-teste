import BigNumber from 'bignumber.js'

// Configure BigNumber to use standard decimal precision suitable for crypto amounts
BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-18, 20],
})

/**
 * Value Object representing an Ethereum monetary amount.
 * Guarantees zero floating-point drift, immutable operations,
 * and exact string serialization required by the Kurio NFT protocol.
 */
export class EthAmount {
  private readonly value: BigNumber

  private constructor(val: BigNumber.Value) {
    const bn = new BigNumber(val)
    if (bn.isNaN() || !bn.isFinite() || bn.isNegative()) {
      this.value = new BigNumber(0)
    } else {
      this.value = bn
    }
  }

  public static fromString(val: string): EthAmount {
    const sanitized = (val || '0').trim().replace(',', '.')
    return new EthAmount(sanitized)
  }

  public static fromNumber(val: number): EthAmount {
    return new EthAmount(val)
  }

  public static zero(): EthAmount {
    return new EthAmount(0)
  }

  public add(other: EthAmount): EthAmount {
    return new EthAmount(this.value.plus(other.value))
  }

  public subtract(other: EthAmount): EthAmount {
    const res = this.value.minus(other.value)
    return new EthAmount(res.isNegative() ? 0 : res)
  }

  public multiply(quantity: number): EthAmount {
    const q = Math.max(0, Math.floor(quantity))
    return new EthAmount(this.value.multipliedBy(q))
  }

  public percentageDiscount(percent: number): EthAmount {
    const p = Math.max(0, Math.min(100, percent))
    return new EthAmount(this.value.multipliedBy(p).dividedBy(100))
  }

  public isZero(): boolean {
    return this.value.isZero()
  }

  public isGreaterThan(other: EthAmount): boolean {
    return this.value.isGreaterThan(other.value)
  }

  public isLessThan(other: EthAmount): boolean {
    return this.value.isLessThan(other.value)
  }

  public isEqualTo(other: EthAmount): boolean {
    return this.value.isEqualTo(other.value)
  }

  /**
   * Returns exact decimal string suitable for JSON network transfer.
   */
  public toDecimalString(): string {
    return this.value.toFixed()
  }

  /**
   * Returns display string with currency suffix, e.g. "1.19 ETH".
   */
  public toDisplayString(decimals?: number): string {
    if (decimals !== undefined) {
      return `${this.value.toFixed(decimals)} ETH`
    }
    // Remove unnecessary trailing zeroes after decimal point while keeping reasonable format
    const str = this.value.toFixed()
    return `${str} ETH`
  }
}
