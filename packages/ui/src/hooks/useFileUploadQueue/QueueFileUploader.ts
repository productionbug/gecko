import delay from "../../utils/delay";
import FileUploader from "./FileUploader";
import type {
  FileUploadData,
  FileUploadQueueOptions,
  FileUploadResult,
  QueueFileUploaderInstance,
  QueueFileUploaderQueue,
  UploadID
} from "./types";
import { FileUploadStatus } from "./types";

class QueueFileUploader implements QueueFileUploaderInstance {
  private queue: QueueFileUploaderQueue[] = [];
  private maxConcurrentTasks: number;
  private rootOptions?: FileUploadQueueOptions;
  private url: string;
  private onQueueChange?: (queue: QueueFileUploaderQueue[]) => void;

  constructor(
    url: string,
    {
      options,
      onQueueChange
    }: {
      options?: FileUploadQueueOptions;
      /**
       * Callback that will be called when the queue is changed
       * Like adding a new file to the queue, removing a file from the queue, etc.
       * */
      onQueueChange?: (queue: QueueFileUploaderQueue[]) => void;
    }
  ) {
    this.url = url;
    this.maxConcurrentTasks = options?.maxConcurrentTasks || 2;
    this.rootOptions = options;
    this.onQueueChange = onQueueChange;
  }

  addToQueue = (data: FileUploadData | FileUploadData[]) => {
    const dataArr = Array.isArray(data) ? data : [data];

    dataArr.forEach((data) => {
      if (this.find(data.id)) {
        console.warn(`File with id ${data.id} already exists in the queue`);
        return;
      }

      const uploader = new FileUploader(data.id);
      const queueData = { ...data, uploader };

      this.queue.push(queueData);
      this.onQueueChange?.(this.queue);
    });
  };

  start = <D = unknown, E = unknown>(id: UploadID): Promise<FileUploadResult<D, E>> => {
    const data = this.find(id);

    if (!data) {
      throw new Error(`File with id ${id} not found`);
    }

    // if (data.uploader.status !== FileUploadStatus.Pending) {
    const status = data.uploader.status;

    if ([FileUploadStatus.Uploading, FileUploadStatus.Queued].includes(status)) {
      console.warn("File is already in the queue");
      return data.promise! as Promise<FileUploadResult<D, E>>;
    }

    const promise = new Promise((resolve) => {
      data.uploader.status = FileUploadStatus.Queued;
      data.resolve = resolve;
      this.startNextQueueItem();
    });

    // To use when start is called again we need to keep the same promise to get the result
    data.promise = promise;

    return promise as Promise<FileUploadResult<D, E>>;
  };

  cancel = (id: UploadID) => {
    const data = this.find(id);

    if (data && data.uploader.status === FileUploadStatus.Uploading) {
      data.uploader.cancel();
      this.startNextQueueItem();
    }
  };

  remove = (id: UploadID) => {
    const data = this.find(id);

    if (data) {
      if (data.uploader.status === FileUploadStatus.Uploading) {
        data.uploader.cancel();
      }

      data.uploader.removeListeners();
      this.queue = this.queue.filter((uploader) => uploader.id !== id);
      this.onQueueChange?.(this.queue);
      this.startNextQueueItem();
    }
  };

  restart = async <D = unknown, E = unknown>(id: UploadID): Promise<FileUploadResult<D, E>> => {
    const data = this.find(id);

    if (!data) {
      throw new Error(`File with id ${id} not found`);
    }

    const index = this.queue.findIndex((uploader) => uploader.id === id);

    const uploader = new FileUploader(data.id);
    const queueData = { ...data, uploader };

    this.remove(id);

    await delay(1);

    this.queue.splice(index, 0, queueData);
    this.onQueueChange?.(this.queue);

    return this.start<D, E>(id);
  };

  find = (id: UploadID) => {
    return this.queue.find((uploader) => uploader.id === id);
  };

  // ----------------------------
  //
  //
  //  Private methods
  //
  //
  //  ----------------------------

  private startNextQueueItem = () => {
    const uploading = this.queue.filter(
      ({ uploader: { status } }) => status === FileUploadStatus.Uploading
    );

    if (uploading.length >= this.maxConcurrentTasks) return;

    const queued = this.queue.filter(
      ({ uploader: { status } }) => status === FileUploadStatus.Queued
    );

    if (queued.length === 0) {
      return;
    }

    queued
      .slice(0, this.maxConcurrentTasks - uploading.length)
      .forEach(({ uploader, url, resolve, ...data }) => {
        uploader.start(url || this.url, { ...this.rootOptions, ...data });

        uploader.onCompleted((status, data, error) => {
          resolve?.({ status, data, error });
          this.startNextQueueItem();
        });

        uploader.onError((status, error) => {
          resolve?.({ status, error });
          this.startNextQueueItem();
        });

        uploader.onAbort(() => {
          resolve?.({ status: FileUploadStatus.Aborted });
          this.startNextQueueItem();
        });
      });
  };
}

export default QueueFileUploader;
