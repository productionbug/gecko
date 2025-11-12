import { useCallback, useContext, useEffect, useRef, useState } from "react";

import FileUploadQueueContext from "./FileUploadQueueContext";
import type {
  FileUploadResponse,
  QueueFileUploaderQueue,
  UploadID,
  WatchFileUploadQueueOverload
} from "./types";
import { FileUploadStatus } from "./types";

// TODO: need to refactor this later

/**
 * Watch the file upload queue and get the status of the file upload.
 * @example
 *
 * ```js
 * const Progress = ({ id }: { id: UploadID }) => {
 *   const files = useWatchFileUploadQueue(); // -> this will watch all the files
 *   // const files = useWatchFileUploadQueue(id); // -> this will watch a single file
 *
 *   return (
 *     <>
 *       {files.map((file) => {
 *         return (
 *           <div className="h-2 w-full bg-gray-200">
 *             <div className="h-full bg-green-500" style={{ width: `${file.progress}%` }} />
 *           </div>
 *         );
 *       })}
 *     </>
 *   );
 * };
 * ```
 * ---
 * */
const useWatchFileUploadQueue: WatchFileUploadQueueOverload = <D = unknown, E = unknown>(
  ...ids: UploadID[]
) => {
  const context = useContext(FileUploadQueueContext);
  if (!context) {
    throw new Error("useWatchFileUploadQueue must be used within FileUploadQueueProvider");
  }

  const { find, queue = [] } = context;

  const watchedQueues = useRef<Record<string, boolean | undefined>>({});

  const queueItems = !ids.length ? queue : ids.map((id) => find(id));

  const [state, setState] = useState<FileUploadResponse<D, E>[]>(() => {
    return (queueItems ?? []).map((item, index) => {
      if (item === undefined) {
        return {
          id: ids[index],
          progress: 0,
          status: FileUploadStatus.Pending
        };
      }

      const { uploader, id } = item;

      return {
        id,
        data: uploader.data,
        error: uploader.error,
        progress: uploader.progress,
        status: uploader.status
      } as FileUploadResponse<D, E>;
    });
  });

  const updateState = useCallback((id: UploadID, data: Partial<FileUploadResponse<D, E>>) => {
    setState((prev) => {
      return prev.map((prevItem) => {
        if (prevItem.id === id) {
          return { ...prevItem, ...data };
        }

        return prevItem;
      });
    });
  }, []);

  const addNewItemToState = useCallback(
    (item: QueueFileUploaderQueue) => {
      setState((prev) => {
        const insertIndex = queueItems.findIndex((e) => e?.id === item.id);

        if (insertIndex === -1) return prev;

        return prev
          .slice(0, insertIndex)
          .concat({
            id: item.id,
            data: undefined,
            error: undefined,
            status: item.uploader.status,
            progress: item.uploader.progress || 0
          })
          .concat(prev.slice(insertIndex));
      });
    },
    [queueItems]
  );

  useEffect(() => {
    if (queueItems === undefined) return;

    const newItems: QueueFileUploaderQueue[] = [];

    queueItems.forEach((item) => {
      if (item === undefined || watchedQueues.current[item.id]) return;

      newItems.push(item);
    });

    newItems.forEach((item) => {
      const { uploader, id } = item || {};

      if (!uploader || !id) return;

      addNewItemToState(item);
      watchedQueues.current[id] = true;

      if (uploader.status !== FileUploadStatus.Uploaded) {
        uploader.onProgress((progress) => {
          updateState(id, { progress });
        });

        uploader.onCompleted<D, E>((status, data) => {
          updateState(id, { status, data });
        });

        uploader.onError<E>((status, error) => {
          updateState(id, { status, error });
        });

        uploader.onAbort((status) => {
          updateState(id, { status });
        });
      }
    });
  }, [addNewItemToState, queue, queueItems, updateState]);

  useEffect(() => {
    const removedItems = Object.keys(watchedQueues.current)
      .filter((id) => !queueItems.find((item) => item?.id === id))
      .map((id) => id);

    if (!removedItems.length) return;

    removedItems.forEach((id) => {
      watchedQueues.current[id] = undefined;
      setState((prev) => prev.filter((item) => item.id !== id));
    });
  }, [queueItems]);

  if (ids.length === 1) {
    const item = state[0] as FileUploadResponse<D, E> & FileUploadResponse<D, E>[];
    return item ?? { progress: 0, status: FileUploadStatus.Pending };
  }

  return state as unknown as FileUploadResponse<D, E>[] & FileUploadResponse<D, E>;
};

export default useWatchFileUploadQueue;
