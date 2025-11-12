import type { PropsWithChildren } from "react";

import type FileUploader from "./FileUploader";

export interface FileUploaderOptions {
  method?: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  body: FormData;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export enum FileUploadStatus {
  Pending = "Pending",
  Queued = "Queued",
  Uploading = "Uploading",
  Uploaded = "Uploaded",
  Error = "Error",
  Aborted = "Aborted"
}

export type UploadID = string | number;

export interface FileUploadQueueOptions extends Omit<FileUploaderOptions, "body"> {
  /**
   * Maximum number of files that can be uploaded concurrently
   * Default is 2
   * */
  maxConcurrentTasks?: number;
}

export interface FileUploadData extends FileUploaderOptions {
  /**
   * Unique identifier for the file
   * */
  id: string | number;

  /**
   * Incase you want to upload the file to a different url
   * instead of the url provided in the hook
   * You rarely need this
   * */
  url?: string;
}

export interface QueueFileUploaderQueue extends FileUploadData {
  uploader: FileUploader;
  resolve?: (value: unknown) => void;
  promise?: Promise<unknown>;
}

export interface QueueFileUploaderInstance {
  /**
   * Add file upload data to the queue
   * */
  addToQueue: (data: FileUploadData) => void;

  /**
   * Change status to `Queued` and start uploading the file
   * if `maxConcurrentTasks` is not reached
   * */
  start: <T, E>(id: string | number) => Promise<FileUploadResult<T, E>>;

  /**
   * Cancel the upload of a file
   * */
  cancel: (id: string | number) => void;

  /**
   * Remove the file from the queue
   * All data related to the file will be deleted
   * */
  remove: (id: string | number) => void;

  /**
   * Restart the upload of a file
   * */
  restart: <T, E>(id: string | number) => Promise<FileUploadResult<T, E>>;

  /**
   * Find a file in the queue
   * */
  find: (id: UploadID) => QueueFileUploaderQueue | undefined;
}

export interface FileUploadResult<Data = unknown, Error = unknown> {
  status: FileUploadStatus;
  data?: Data;
  error?: Error;
}

export interface FileUploadResponse<Data = unknown, Error = unknown>
  extends FileUploadResult<Data, Error> {
  id: UploadID;

  progress: number;
}

export interface FileUploadQueueResponse extends QueueFileUploaderInstance, PropsWithChildren {}

export interface FileUploadQueueContextProps extends FileUploadQueueResponse {
  /**
   * Get all the files in the queue
   * */
  queue: QueueFileUploaderQueue[];
}

export interface WatchFileUploadQueueOverload {
  <D = unknown, E = unknown>(): FileUploadResponse<D, E>[];
  <D = unknown, E = unknown>(id: UploadID): FileUploadResponse<D, E>;
  <D = unknown, E = unknown>(...ids: UploadID[]): FileUploadResponse<D, E>[];
}
