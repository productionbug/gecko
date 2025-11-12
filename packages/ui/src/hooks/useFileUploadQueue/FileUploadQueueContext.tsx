import { createContext } from "react";

import type { FileUploadQueueContextProps } from "./types";

const FileUploadQueueContext = createContext<FileUploadQueueContextProps | null>(null);

export default FileUploadQueueContext;
