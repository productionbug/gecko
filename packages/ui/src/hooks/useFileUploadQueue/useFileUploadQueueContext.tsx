import { useContext } from "react";

import FileUploadQueueContext from "./FileUploadQueueContext";
import type { FileUploadQueueContextProps } from "./types";
import useWatchFileUploadQueue from "./useWatchFileUploadQueue";

export const FileUploadQueueProvider = ({ children, ...rest }: FileUploadQueueContextProps) => {
  return (
    <FileUploadQueueContext.Provider value={rest}> {children} </FileUploadQueueContext.Provider>
  );
};

export const useFileUploadQueueContext = () => {
  const context = useContext(FileUploadQueueContext);

  if (!context) {
    throw new Error("useFileUploadQueueContext must be used within FileUploadQueueProvider");
  }

  const { children: _, ...rest } = context;

  return { ...rest, watch: useWatchFileUploadQueue };
};
