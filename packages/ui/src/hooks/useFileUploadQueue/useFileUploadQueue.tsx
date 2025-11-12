import { useRef, useState } from "react";

import QueueFileUploader from "./QueueFileUploader";
import type { FileUploadQueueOptions, QueueFileUploaderQueue } from "./types";

const useFileUploadQueue = (url: string, rootOptions?: FileUploadQueueOptions) => {
  const [queue, setQueue] = useState<QueueFileUploaderQueue[]>([]);

  // eslint-disable-next-line react-hooks/refs
  const fileUploader = useRef(
    new QueueFileUploader(url, {
      options: rootOptions,
      onQueueChange: (newQueue) => {
        setQueue(() => [...newQueue]);
      }
    })
  ).current;

  return { ...fileUploader, queue };
};

export default useFileUploadQueue;
