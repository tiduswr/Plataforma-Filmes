import { FieldErrors, FieldValues, Path, UseFormClearErrors, UseFormRegister } from "react-hook-form";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  clearErrors: UseFormClearErrors<T>;
}

export type { InputProps };
