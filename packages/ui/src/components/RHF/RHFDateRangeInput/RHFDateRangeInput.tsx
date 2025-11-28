import type { FC } from "react";

import { DateRangeInput } from "../../DateRangeInput";
import { RHFController } from "../RHFController";
import type { RHFDateRangeInputProps } from "./RHFDateRangeInput.types";

const RHFDateRangeInput: FC<RHFDateRangeInputProps> = ({ name, control, onChange, ...rest }) => {
  return (
    <RHFController
      control={control}
      name={name}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;
        const hasError = Boolean(fieldState.error);

        return (
          <DateRangeInput
            value={field.value || undefined}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            {...rest}
            hasError={hasError}
          />
        );
      }}
    />
  );
};

RHFDateRangeInput.displayName = "RHFDateRangeInput";

export default RHFDateRangeInput;
