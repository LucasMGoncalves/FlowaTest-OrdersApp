export const ORDER_SIDES = ["BUY", "SELL"] as const;
export type Side = (typeof ORDER_SIDES)[number];

export class Order {
  public symbol: string;
  public side: Side;
  public amount: number;
  public price: number;

  constructor(
    symbol: string = "",
    side: Side = "BUY",
    amount: number = 1,
    price: number = 0
  ) {
    this.symbol = symbol;
    this.side = side;
    this.amount = amount;
    this.price = price;
  }

  withChanges(changes: Partial<Order>): Order {
    return new Order(
      changes.symbol ?? this.symbol,
      changes.side ?? this.side,
      changes.amount ?? this.amount,
      changes.price ?? this.price
    );
  }

  validate(): string | null {
    if (!this.symbol) {
      return "Simbolo é obrigatório.";
    }

    if (!Number.isFinite(this.amount) || this.amount <= 0 || this.amount > 100000) {
      return "Quantidade deve ser maior que 0 e menor que 100.000.";
    }

    if (
      !Number.isFinite(this.price) || this.price <= 0 || this.price >= 1000 ||
      Math.round(this.price * 100) !== this.price * 100
    ) {
      return "Preço deve ser maior que 0, menor que 999,99 e somente duas casas decimais.";
    }

    return null;
  }
}