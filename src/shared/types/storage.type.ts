export const UploadItemStatus = {
  IDLE: "IDLE",
  UPLOADING: "UPLOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;
export type UploadItemStatusType = keyof typeof UploadItemStatus;

export interface UploadFileItem {
  id: string;
  file: File;
  preview: string;
  status: UploadItemStatusType;
  objectKey?: string;
  progress?: number;
  error?: string;
}

export interface PresignRequestItem {
  objectKey: string;
  fileSize: number;
  contentType: string;
}

export interface PresignRequest {
  files: PresignRequestItem[];
}
