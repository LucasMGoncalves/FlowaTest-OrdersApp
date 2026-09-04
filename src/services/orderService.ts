import api from "./api";
import { Order } from "../models/Order";

export async function createOrder(order: Order): Promise<unknown> {
  const response = await api.post(
    "/orders/create",
    {
      Symbol: order.symbol,
      Side: order.side,
      Amount: order.amount,
      Price: order.price,
    }
  );

  return response.data;
}