import { Children, useId, useMemo } from "react";

import { usePreventDefault } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import createLabel from "../../../utils/createLabel";
import isEqual from "../../../utils/isEqual";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { isSelectTrigger } from "../Select.utils";
import { useSelectTrigger } from "../hooks/useSelectTrigger";
import { useSelect } from "../useSelect";
import type { SelectButtonProps } from "./SelectButton.types";
import { sortMultiSelectValue } from "./SelectButton.utils";

/**
 * Internal default `SelectButton` component used to render the trigger button
 * if `SelectTrigger` is not provided.
 * */
function SelectButton({ prefix, suffix, className }: SelectButtonProps) {
  const {
    disabled,
    inputRef,
    setInputRef,
    value,
    keyword,
    filterable: _filterable,
    openMenu,
    closeMenu,
    open,
    multiple,
    placeholder,
    placeholderClassName,
    children
  } = useSelect();

  const id = useId();

  const { hasValue, handleInputChange, handleKeyboardInteraction } = useSelectTrigger();

  const trigger = useMemo(() => Children.toArray(children).find(isSelectTrigger), [children]);

  if (trigger) {
    return trigger;
  }

  const filterable = _filterable === true || _filterable === "inline";

  return (
    <div
      className={classNames(
        "HPuiSelectButton",
        disabled ? "HPuiSelectButton--disabled" : "HPuiSelectButton--enabled",
        multiple && hasValue && "HPuiSelectButton--multi-select-default",
        !filterable && "HPuiSelectButton--readonly",
        className
      )}
      onClick={() => {
        if (open && !keyword) {
          closeMenu();
          return;
        }

        openMenu();
        inputRef?.current?.focus();
      }}
      aria-disabled={disabled}>
      <DynamicComponentRenderer component={prefix} />

      <div className="HPuiSelectButton__content">
        {hasValue ? (
          <SelectButtonContent />
        ) : (
          <span
            className={classNames(
              "HPuiSelectButton__value HPuiSelectButton__value--placeholder",
              placeholderClassName,
              keyword && filterable && "HPuiSelectButton__value--hidden"
            )}>
            {placeholder ?? "Select Item"}
          </span>
        )}

        <div
          className={classNames(
            "HPuiSelectButton__search",
            !open && hasValue && "HPuiSelectButton__search--focusonly",
            !filterable && "HPuiSelectButton__search--focusonly",
            multiple &&
            Array.isArray(value) &&
            !!value?.length &&
            "HPuiSelectButton__search--multi-selected"
          )}
          data-keyword={filterable ? keyword : ""}>
          <input
            id={id}
            ref={(r) => {
              setInputRef(r);
            }}
            value={filterable ? keyword : ""}
            disabled={disabled}
            className={classNames(
              "HPuiSelectButton__search__input",
              open && !hasValue && "HPuiSelectButton__search__input--initial",
              !multiple && hasValue && "HPuiSelectButton__search__input--initial",
              !filterable && "HPuiSelectButton__search__input--readonly"
            )}
            onKeyDown={handleKeyboardInteraction}
            onFocusCapture={openMenu}
            onChange={
              filterable
                ? handleInputChange
                : // To prevent the react warning about uncontrolled input
                () => null
            }
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>

      <DynamicComponentRenderer
        component={
          suffix ?? <span className="HPicon__arrow-right HPuiSelectTrigger__arrow-right-icon" />
        }
      />
    </div>
  );
}

function SelectButtonContent() {
  const {
    value,
    options,
    keyword,
    open,
    multiple,
    filterable: _filterable,
    handleChange,
    closeMenu,
    disabled
  } = useSelect();

  const filterable = _filterable === true || _filterable === "inline";

  const { preventDefault, attachPreventDefault } = usePreventDefault();

  if (multiple && Array.isArray(value) && !!value?.length) {
    const selectedOptions = sortMultiSelectValue(value, options).map((o) => {
      const { props, value, label } = o;
      const selectCurrentOption = () => handleChange(value);

      const remove = () => {
        // eslint-disable-next-line react/prop-types
        props?.onRemove?.({
          preventDefault,
          selectCurrentOption,
          value,
          focused: false,
          selected: true,
          closeMenu,
          filteredKeyword: keyword
        });

        attachPreventDefault(selectCurrentOption);
      };

      return { value, label, remove };
    });

    return selectedOptions.map((option) => {
      const { remove, value, label } = option;

      return (
        <div
          key={JSON.stringify({ value, label })}
          className={classNames(
            "HPuiSelectButton__multiselected-chip",
            disabled && "HPuiSelectButton__multiselected-chip--disabled"
          )}>
          <span>{option.label}</span>

          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove();
              }}
              disabled={disabled}
              className={classNames(
                "HPuiSelectButton__multiselected-chip__clear-button",
                disabled && "HPuiSelectButton__multiselected-chip__clear-button--disabled"
              )}>
              <span
                className={classNames("HPuiSelectButton__multiselected-chip__clear-button__icon")}
              />
            </button>
          )}
        </div>
      );
    });
  }

  if (open && keyword && filterable) {
    return null;
  }

  const selectedOptionLabel =
    value !== undefined
      ? (options.find((option) => isEqual(option.value, value))?.label ?? createLabel(value))
      : null;

  // To display like ghost text when filterable is true
  if (open && selectedOptionLabel && filterable) {
    return (
      <span className="HPuiSelectButton__value HPuiSelectButton__value--placeholder">
        {selectedOptionLabel}
      </span>
    );
  }

  return (
    <span className="HPuiSelectButton__value HPuiSelectButton__value--selected">
      {selectedOptionLabel}
    </span>
  );
}

SelectButton.displayName = "SelectButton";

export default SelectButton;
