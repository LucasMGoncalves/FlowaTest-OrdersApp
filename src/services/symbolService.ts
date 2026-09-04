import type { Symbol } from "../models/Symbol";

const symbols: Symbol[] = [
  { code: "PETR4" },
  { code: "VALE3" },
  { code: "VIIA4" },
];

export async function getSymbols(): Promise<Symbol[]> {
  return Promise.resolve(symbols);
}