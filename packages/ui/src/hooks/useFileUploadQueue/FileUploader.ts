import type { FileUploaderOptions, UploadID } from "./types";
import { FileUploadStatus } from "./types";

class FileUploader {
  private _id: UploadID;
  private xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();

  private _data: unknown;
  private _error: unknown;
  private _progress = 0;

  public status: FileUploadStatus = FileUploadStatus.Pending;

  constructor(id?: string | number) {
    this._id = id || Math.random() + new Date().getTime();
  }

  get id() {
    return this._id;
  }

  get progress() {
    return this._progress;
  }

  get data() {
    return this._data;
  }

  get error() {
    return this._error;
  }

  /**
   * Start the request
   * @example
   * ```js
   * const uploader = new FileUploader();
   *
   * uploader.start("https://example.com/upload", {
   *  method: "POST",
   *  body: formData,
   *  headers: {
   *    Authorization: "Bearer token",
   *   "Content-Type": "multipart/form-data",
   *  },
   * });
   * ```
   * */
  start = (url: string, options?: FileUploaderOptions) => {
    if (this.status === FileUploadStatus.Uploading) {
      console.warn("File is already uploading");
      return;
    }

    const { headers, body, withCredentials = false, method = "POST" } = options || {};

    this.status = FileUploadStatus.Uploading;

    this.onProgress();
    this.onAbort();
    this.onError();
    this.onCompleted();

    this.xmlHttpRequest.open(method, url, true);
    this.xmlHttpRequest.withCredentials = withCredentials;
    this.setHeaders(headers);
    this.xmlHttpRequest.send(body);
  };

  /**
   * Abort the Request
   * */
  cancel = () => {
    this.xmlHttpRequest.abort();
  };

  /**
   * Remove all event listeners from the XMLHttpRequest
   * It's your responsibility to call this method when you're done with the uploader
   * */
  removeListeners = () => {
    this.xmlHttpRequest.upload.onprogress = null;
    this.xmlHttpRequest.onload = null;
    this.xmlHttpRequest.onabort = null;
    this.xmlHttpRequest.onerror = null;
  };

  /**
   * @param callback - A function that will be called with the progress percentage
   * */
  onProgress = (callback?: (progress: number) => void) => {
    this.xmlHttpRequest.upload.addEventListener("progress", (event: ProgressEvent) => {
      if (event.lengthComputable) {
        this.status = FileUploadStatus.Uploading;
        this._progress = Math.round((event.loaded / event.total) * 100);
        callback?.(this._progress);
      } else {
        console.warn("Unable to compute progress information since the total size is unknown");
        callback?.(0);
      }
    });
  };

  /**
   * @param callback - A function that will be called with the status and data
   * when the request is successfully completed
   * */
  onCompleted = <T = unknown, E = unknown>(
    callback?: (status: FileUploadStatus, data: T, error: E) => void
  ) => {
    this.xmlHttpRequest.addEventListener("load", () => {
      if (this.xmlHttpRequest.readyState !== 4) return;

      if (this.xmlHttpRequest.status >= 200 && this.xmlHttpRequest.status <= 299) {
        this.status = FileUploadStatus.Uploaded;
        this._data = this.parseResponse<T>(this.xmlHttpRequest);
      } else {
        this.status = FileUploadStatus.Error;
        this._error = this.parseResponse<E>(this.xmlHttpRequest);
      }

      callback?.(this.status, this._data as T, this._error as E);
    });
  };

  /**
   * @param callback - A function that will be called when the request is aborted
   * */
  onAbort = (callback?: (status: FileUploadStatus) => void) => {
    this.xmlHttpRequest.addEventListener("abort", () => {
      this.status = FileUploadStatus.Aborted;
      callback?.(this.status);
    });
  };

  /**
   * @param callback - A function that will be called when the request fails
   * */
  onError = <E>(callback?: (status: FileUploadStatus, error: E) => void) => {
    this.xmlHttpRequest.addEventListener("error", () => {
      this.status = FileUploadStatus.Error;
      callback?.(this.status, this.parseResponse<E>(this.xmlHttpRequest));
    });
  };

  // ------------------------------
  //
  // Private methods
  //
  // ------------------------------

  /**
   * Response parser that will return the response as JSON if the Content-Type is application/json
   * and as a string otherwise
   * */
  private parseResponse = <T>(req: XMLHttpRequest): T => {
    const contentType = req.getResponseHeader("Content-Type");

    if (contentType && contentType.startsWith("application/json")) {
      return JSON.parse(req.responseText);
    }

    return req.responseText as T;
  };

  /**
   * Set headers to the XMLHttpRequest
   * */
  private setHeaders = (headers?: Record<string, string>) => {
    if (!headers) return;

    Object.entries(headers).forEach(([key, value]) => {
      this.xmlHttpRequest.setRequestHeader(key, value);
    });
  };
}

export default FileUploader;
