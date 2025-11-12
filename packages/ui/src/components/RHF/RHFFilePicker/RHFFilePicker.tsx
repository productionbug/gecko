import { useFilePicker } from "../../../hooks";
import { FilePlus, FolderPlus } from "../../../icons";
import { classNames } from "../../../utils/classNames";
import { Spinner } from "../../Spinner";
import { RHFController } from "../RHFController";
import type { RHFFilePickerProps, RHFFilePickerRendererProps } from "./RHFFilePicker.types";

/**
 * A file picker component with drag-and-drop support for React Hook Form.
 *
 * Features include:
 * - File and directory selection
 * - Drag-and-drop support
 * - File preview URLs
 * - Duplicate detection and optional removal
 * - Custom UI via render prop
 *
 * Selected files have additional properties:
 * - `preview`: URL for displaying file content
 * - `duplicatedWith`: Array of files this file duplicates
 *
 * @example
 * ```tsx
 * // Basic usage - accept all file types
 * <RHFFilePicker name="files" />
 *
 * // Restrict to images only
 * <RHFFilePicker name="images" accept="image/*" />
 *
 * // Remove duplicates automatically
 * <RHFFilePicker
 *   name="files"
 *   accept="image/*"
 *   removeDuplicates
 * />
 * ```
 *
 * Custom UI example:
 * ```tsx
 * <RHFFilePicker
 *   name="dropped_files"
 *   removeDuplicates={false}
 *   onChange={(files, newFiles) => console.log(files, newFiles)}
 *   onError={(e) => console.log(e)}
 *   accept="image/*"
 *   render={({
 *     dropzoneRef,
 *     dragging,
 *     loading,
 *     field: { value: files },
 *     openFilePicker,
 *   }) => (
 *     <div
 *       ref={dropzoneRef}
 *       className={classNames(
 *         "relative flex h-[500px] w-full flex-col rounded border-2 border-dashed",
 *         loading && "cursor-wait",
 *         dragging ? "border-primary-400" : "border-gray-300"
 *       )}
 *     >
 *       {!!files?.length && (
 *         <div
 *           style={{ scrollbarWidth: "none" }}
 *           className="w-full flex-1 flex-col overflow-y-auto text-start grid grid-cols-3 gap-x-3 gap-y-3 p-2 pb-16 place-content-start"
 *         >
 *           {files.map((file) => {
 *             return (
 *               <img
 *                 key={file.preview}
 *                 src={file.preview}
 *                 alt={file.name}
 *                 className="inline-block aspect-square w-full h-20 object-contain rounded border border-gray-300"
 *               />
 *             );
 *           })}
 *         </div>
 *       )}

 *       <div className="absolute left-0 right-0 border bg-white p-1.5 bottom-0 flex flex-row gap-2">
 *         <Button
 *           variant="outlined"
 *           className="flex-1"
 *           onClick={() => openFilePicker()}
 *         >
 *           Select Images
 *         </Button>

 *         <Button
 *           className="flex-1"
 *           onClick={() => openFilePicker({ directory: true })}
 *         >
 *           Select Directory
 *         </Button>
 *       </div>

 *       {!loading && !files?.length && (
 *         <div className="flex flex-1 items-center justify-center">
 *           <span>Drop images here</span>
 *         </div>
 *       )}

 *       {loading && (
 *         <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
 *           Loading...
 *         </div>
 *       )}
 *     </div>
 *   )}
 * />
 * ```
 *
 * */
function RHFFilePicker<T extends HTMLElement = HTMLDivElement>(props: RHFFilePickerProps<T>) {
  const { name, control, ...rest } = props;

  return (
    <RHFController
      control={control}
      name={name}
      render={(renderProps) => {
        return <RHFFilePickerRenderer<T> {...rest} {...renderProps} />;
      }}
    />
  );
}

function RHFFilePickerRenderer<T extends HTMLElement = HTMLDivElement>({
  accept,
  removeDuplicates,
  onChange,
  onError,
  render,
  keepOldFiles,
  transform,
  field,
  fieldState,
  formState
}: RHFFilePickerRendererProps<T>) {
  const filePicker = useFilePicker<T>({
    files: field.value,
    setFiles: field.onChange,
    accept,
    removeDuplicates,
    keepOldFiles,
    transform,
    onChange: async (files, newFiles) => {
      field.onChange(files);

      await onChange?.(files, newFiles);
    },
    onError
  });

  const { dropzoneRef, openFilePicker, loading, dragging } = filePicker;

  if (render && typeof render === "function") {
    return render({ ...filePicker, field, fieldState, formState });
  }

  const { value } = field;
  const { error } = fieldState;

  return (
    <div
      className={classNames(
        "HPuiRHFFilePicker",
        loading && "HPuiRHFFilePicker--loading",
        dragging && "HPuiRHFFilePicker--dragging",
        error && "HPuiRHFFilePicker--error"
      )}
      ref={dropzoneRef as unknown as React.RefObject<HTMLDivElement>}>
      {Boolean(value?.length) && (
        <ul className="HPuiRHFFilePicker__file-list" style={{ scrollbarWidth: "none" }}>
          {value.map((file) => {
            return (
              <li className="HPuiRHFFilePicker__file-item" key={file.preview}>
                {file.name}{" "}
              </li>
            );
          })}
        </ul>
      )}

      <div className="HPuiRHFFilePicker__button-container">
        <button
          className="HPuiRHFFilePicker__button"
          onClick={() => openFilePicker()}
          type="button">
          <FilePlus className="HPuiRHFFilePicker__button-icon" />
        </button>

        <button
          className="HPuiRHFFilePicker__button"
          onClick={() => openFilePicker({ directory: true })}
          type="button">
          <FolderPlus className="HPuiRHFFilePicker__button-icon" />
        </button>
      </div>

      {!loading && !value?.length && (
        <div className="HPuiRHFFilePicker__empty-state">
          <span>Drop files here to upload</span>
        </div>
      )}

      {loading ? (
        <div className="HPuiRHFFilePicker__loading-overlay">
          <Spinner />
        </div>
      ) : null}
    </div>
  );
}

RHFFilePicker.displayName = "RHFFilePicker";

export default RHFFilePicker;
