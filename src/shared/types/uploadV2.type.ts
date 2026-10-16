export type ImageType = "AVATAR" | "TEACHER";

export interface UploadV2FileItem {
  filename: string;
  fileSize: number;
  contentType: string;
  /** Classification for backend routing. Backend currently accepts: AVATAR | TEACHER */
  imageType?: ImageType;
}

export interface UploadV2FileResponse {
  presignedUrl: string;
  objectKey: string;
}
