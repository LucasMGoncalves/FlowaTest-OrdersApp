import api from "./api";
import type { Symbol } from "../models/Symbol";

export async function getSymbols(): Promise<Symbol[]> {
  const response = await api.get<Symbol[]>("/symbols");

  return response.data;
}
