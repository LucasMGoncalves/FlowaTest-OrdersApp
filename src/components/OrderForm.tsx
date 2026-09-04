import { useState } from "react";
import type {
    ChangeEvent,
    ComponentPropsWithoutRef,
} from "react";

import {
    Order,
    ORDER_SIDES,
    type Side
} from "../models/Order";
import type { Symbol } from "../models/Symbol";

interface OrderFormProps {
    order: Order;
    symbols: Symbol[];
    loading: boolean;
    symbolsLoading: boolean;
    onChange: (order: Order) => void;
    onSubmit: () => void;
}

type FormSubmitHandler = NonNullable<
    ComponentPropsWithoutRef<"form">["onSubmit"]
>;

export function OrderForm({
    order,
    symbols,
    loading,
    symbolsLoading,
    onChange,
    onSubmit,
}: OrderFormProps) {
    const [priceInput, setPriceInput] = useState<string>(
        order.price > 0
            ? order.price.toFixed(2).replace(".", ",")
            : ""
    );

    const formDisabled: boolean =
        loading || symbolsLoading;

    const handleSubmit: FormSubmitHandler = (event) => {
        event.preventDefault();
        onSubmit();
    };

    const handleSymbolChange = (
        event: ChangeEvent<HTMLSelectElement>
    ): void => {
        onChange(
            order.withChanges({
                symbol: event.currentTarget.value,
            })
        );
    };

    const handleSideChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        const side = event.currentTarget.value as Side;

        onChange(
            order.withChanges({
                side,
            })
        );
    };

    const handleAmountChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        const value: string =
            event.currentTarget.value;

        const amount: number =
            value === "" ? 0 : Number(value);

        onChange(
            order.withChanges({
                amount,
            })
        );
    };

    const handlePriceChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        let value: string =
            event.currentTarget.value;

        // Allow only numbers and comma.
        value = value.replace(/[^0-9,]/g, "");

        // Allow only one comma.
        const commaIndex: number =
            value.indexOf(",");

        if (commaIndex >= 0) {
            const integerPart: string =
                value.substring(0, commaIndex);

            const decimalPart: string =
                value
                    .substring(commaIndex + 1)
                    .replace(/,/g, "")
                    .substring(0, 2);

            value = `${integerPart},${decimalPart}`;
        }

        setPriceInput(value);

        const normalizedValue: string =
            value.replace(",", ".");

        const price: number =
            normalizedValue === ""
                ? 0
                : Number(normalizedValue);

        onChange(
            order.withChanges({
                price: Number.isFinite(price)
                    ? price
                    : 0,
            })
        );
    };

    const handlePriceBlur = (): void => {
        if (order.price > 0) {
            setPriceInput(
                order.price
                    .toFixed(2)
                    .replace(".", ",")
            );
        } else {
            setPriceInput("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="mb-3">
                <label
                    htmlFor="symbol"
                    className="form-label"
                >
                    Simbolo:
                </label>

                <select
                    id="symbol"
                    name="symbol"
                    className="form-select"
                    value={order.symbol}
                    onChange={handleSymbolChange}
                    disabled={formDisabled}
                    required
                >
                    <option value="">
                        {symbolsLoading
                            ? "Carregando ..."
                            : "Selecione"}
                    </option>

                    {symbols.map(
                        (symbol: Symbol) => (
                            <option
                                key={symbol.code}
                                value={symbol.code}
                            >
                                {symbol.code}
                            </option>
                        )
                    )}
                </select>
            </div>

            <fieldset
                className="mb-3"
                disabled={formDisabled}
            >
                <legend className="form-label fs-6">
                    Lado:
                </legend>

                {ORDER_SIDES.map((side) => {
                    const id = `side-${side}`;

                    return (
                        <div
                            className="form-check form-check-inline"
                            key={side}
                        >
                            <input
                                className="form-check-input"
                                type="radio"
                                id={id}
                                name="side"
                                value={side}
                                checked={order.side === side}
                                onChange={handleSideChange}
                            />

                            <label
                                className="form-check-label"
                                htmlFor={id}
                            >
                                {side}
                            </label>
                        </div>
                    );
                })}
            </fieldset>

            <div className="mb-3">
                <label
                    htmlFor="amount"
                    className="form-label"
                >
                    Quantidade:
                </label>

                <input
                    id="amount"
                    name="amount"
                    type="number"
                    className="form-control"
                    min="0.01"
                    step="any"
                    value={
                        order.amount === 0
                            ? ""
                            : order.amount
                    }
                    onChange={
                        handleAmountChange
                    }
                    disabled={formDisabled}
                    required
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="price"
                    className="form-label"
                >
                    Preço (R$):
                </label>

                <input
                    id="price"
                    name="price"
                    type="text"
                    className="form-control"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={priceInput}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    disabled={formDisabled}
                    required
                    aria-describedby="price-help"
                />

                <div
                    id="price-help"
                    className="form-text"
                >
                    Informe um valor de 0,01 a 999,99.
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={formDisabled}
            >
                {loading ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        />
                        Criando ordem ...
                    </>
                ) : (
                    "Criar ordem"
                )}
            </button>
        </form>
    );
}