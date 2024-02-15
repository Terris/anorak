import { NumericFormat } from "react-number-format";
import { Input } from "./Input";
import {
  convertAmountInCentsToDollars,
  convertAmountInputToCentsString,
} from "@repo/utils";

interface CurrencyInputProps {
  name?: string;
  value: number;
  onChange: (amountInCents: string) => void;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  className,
  name,
}: CurrencyInputProps) {
  return (
    <NumericFormat
      name={name}
      value={convertAmountInCentsToDollars(value)}
      prefix="$"
      customInput={Input}
      onChange={(e) =>
        onChange(convertAmountInputToCentsString(e.currentTarget.value))
      }
      className={className}
    />
  );
}
