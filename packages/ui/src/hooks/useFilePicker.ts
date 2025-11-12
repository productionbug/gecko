import { useCallback, useEffect, useRef, useState } from "react";

import { FilePicker } from "../lib";
import type {
  FilePickerFile,
  OpenFilePickerFn,
  UseFilePickerOptions,
  UseFilePickerReturn
} from "../types";

/**
 * Reuseable file picker handler hook that supports drag and drop, file selection and directory selection.
 * Unlike native file input, selected files will have `preview` and `duplicatedWith` properties.
 * You can use preview url to display the image or file content.
 * For the sake of handling duplicates, `duplicatedWith` property will be set if the file is already selected.
 * You can also pass `removeDuplicates` prop to remove duplicates automatically.
 * If you want to support drag and drop, you need to pass `ref` to the element.
 *
 * When file picker is successfully completed, `onChange` callback will be called with selected files and result.
 * result is an object with file size as key and array of files that have the same size as value.(possible duplicates)
 * You will rarely need to use `result` but it's there if you need it.
 *
 * Usage:
 * ```ts
 * const Component = () => {
 *   const { files, dropzoneRef, dragging, openFilePicker, loading } = useFilePicker({
 *    accept: "image/*",
 *    removeDuplicates: false,
 *    keepOldFiles: false,
 *    onChange: (files, newFiles) => {
 *      setFiles(files);
 *      console.log(files, newFiles);
 *    },
 *    onStart: () => console.log("File picker started"),
 *    onError: (error) => console.error(error),
 *   });
 *  
 *   return (
 *     <div
 *       ref={dropzoneRef}
 *       onClick={() => openFilePicker()}
 *       style={{
 *         scrollbarWidth: "thin",
 *       }}
 *       className={classNames(
 *         "p-2 flex h-[150px] w-[400px] overflow-y-auto bg-gray-100 rounded cursor-pointer",
 *         dragging
 *           ? "border-2 border-dashed border-blue-400"
 *           : "border-2 border-dashed border-gray-300"
 *       )}
 *       >
 *       {loading && <div className="absolute inset-1">Loading...</div>}
 *       {!!files.length && (
 *         <ul className="list-dist flex gap-2 flex-col w-full text-start">
 *           {files
 *             .filter((f) => !f.duplicatedWith)
 *             .map((file, i) => {
 *               const len = files.filter(
 *                 (f) => f.duplicatedWith?.preview === file.preview
 *               ).length;

 *               return (
 *                 <li key={file.name + i.toString()}>
 *                   {file.name}, has {len} duplicated files
 *                 </li>
 *               );
 *             })}
 *         </ul>
 *       )}
 *    </div>
 *   )
 * }
 * ```
 * */
function useFilePicker<T extends HTMLElement>(
  options?: UseFilePickerOptions
): UseFilePickerReturn<T> {
  const {
    accept = "*",
    removeDuplicates = false,
    onChange,
    keepOldFiles,
    onStart,
    onError,
    transform,
    files = [],
    setFiles
  } = options || {};

  const dropzoneRef = useRef<T>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleOnChange = useCallback(
    async (res: FilePickerFile[]) => {
      const transformedRes = transform ? await transform(res) : res;

      const _result = keepOldFiles ? [...files].concat(transformedRes) : transformedRes;

      if (setFiles) setFiles(_result);

      await onChange?.(_result, transformedRes);
    },
    [transform, keepOldFiles, files, onChange, setFiles]
  );

  const openFilePicker: OpenFilePickerFn = async (options) => {
    if (loading) return;

    try {
      const handler = new FilePicker(accept, removeDuplicates, {
        oldFiles: files
      });
      const res = await handler.open({
        ...options,
        onChangeStart: () => {
          onStart?.();
          setLoading(() => true);
        }
      });

      await handleOnChange(res);

      return res;
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(() => false);
    }
  };

  useEffect(() => {
    const el = dropzoneRef.current;

    if (!el) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(() => true);
    };

    const handleDragEnter = () => {
      setDragging(() => true);
    };

    const handleDragLeave = () => {
      setDragging(() => false);
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!e.dataTransfer?.items.length || loading) return;

      try {
        setDragging(() => false);
        setLoading(() => true);

        onStart?.();

        const handler = new FilePicker(accept, removeDuplicates, {
          oldFiles: files
        });

        const res = await handler.onDrop(e.dataTransfer.items);
        await handleOnChange(res);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setLoading(() => false);
      }
    };

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragenter", handleDragEnter);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragenter", handleDragEnter);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [accept, files, handleOnChange, loading, onError, onStart, removeDuplicates]);

  return {
    dropzoneRef,
    files,
    dragging,
    openFilePicker,
    loading
  };
}

export default useFilePicker;
