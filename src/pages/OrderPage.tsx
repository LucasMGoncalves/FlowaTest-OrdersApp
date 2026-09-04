import { useEffect, useState } from "react";
import axios from "axios";

import { Order } from "../models/Order";
import type { Symbol } from "../models/Symbol";

import { OrderForm } from "../components/OrderForm";

import { createOrder } from "../services/orderService";
import { getSymbols } from "../services/symbolService";

interface PageAlert {
  type: "success" | "danger";
  message: string;
}

export function OrderPage() {
  const [order, setOrder] = useState<Order>(
    () => new Order()
  );

  const [symbols, setSymbols] =
    useState<Symbol[]>([]);

  const [symbolsLoading, setSymbolsLoading] =
    useState<boolean>(true);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [alert, setAlert] =
    useState<PageAlert | null>(null);

  useEffect(() => {
    const loadSymbols = async (): Promise<void> => {
      try {
        setSymbolsLoading(true);
        setAlert(null);

        const result: Symbol[] =
          await getSymbols();

        setSymbols(result);

        if (result.length > 0) {
          setOrder((currentOrder) =>
            currentOrder.withChanges({
              symbol:
                currentOrder.symbol ||
                result[0].code,
            })
          );
        }
      } catch {
        setAlert({
          type: "danger",
          message: "Falha ao carregar os símbolos.",
        });
      } finally {
        setSymbolsLoading(false);
      }
    };

    void loadSymbols();
  }, []);

  const handleOrderChange = (
    newOrder: Order
  ): void => {
    setOrder(newOrder);

    if (alert) {
      setAlert(null);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setAlert(null);

    const validationError: string | null =
      order.validate();

    if (validationError) {
      setAlert({
        type: "danger",
        message: validationError,
      });

      return;
    }

    try {
      setLoading(true);

      const response: unknown =
        await createOrder(order);

      let message =
        "Ordem criada com sucesso!";

      if (typeof response === "string") {
        message = response;
      } else if (
        response &&
        typeof response === "object" &&
        "message" in response &&
        typeof response.message === "string"
      ) {
        message = response.message;
      }

      setAlert({
        type: "success",
        message,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData: unknown =
          error.response?.data;

        let message =
          "Error ao criar ordem.";

        if (
          typeof responseData === "string"
        ) {
          message = responseData;
        } else if (
          responseData &&
          typeof responseData === "object" &&
          "message" in responseData &&
          typeof responseData.message === "string"
        ) {
          message = responseData.message;
        } else if (
          error.message
        ) {
          message = error.message;
        }

        setAlert({
          type: "danger",
          message,
        });

        return;
      }

      setAlert({
        type: "danger",
        message:
          "Erro inesperado ao criar ordem.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <section className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h2 text-center mb-4">
                Teste Flowa - Criar Ordem
              </h1>

              {alert && (
                <div
                  className={`alert alert-${alert.type}`}
                  role="alert"
                >
                  {alert.message}
                </div>
              )}

              <OrderForm
                order={order}
                symbols={symbols}
                loading={loading}
                symbolsLoading={
                  symbolsLoading
                }
                onChange={
                  handleOrderChange
                }
                onSubmit={handleSubmit}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}