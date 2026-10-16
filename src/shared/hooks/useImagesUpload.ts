import { readDemoImage } from "@/demo/upload";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UploadFileItem } from "../types/storage.type";
import { UploadItemStatus } from "../types/storage.type";
import { compressImageFile } from "../utils/compressImageFile";
import type {
  ImageType,
} from "../types/uploadV2.type";

type UseImagesUploadOptions = {
  maxSizeMB?: number;
  allowedTypes?: string[];
  enableCompression?: boolean;
  compressionMaxWidthOrHeight?: number;
  compressionInitialQuality?: number;
  /** Optional override sent to backend as imageType. */
  defaultImageType?: ImageType;
};

export function useImagesUpload(options?: UseImagesUploadOptions) {
  const optionsRef = useRef<UseImagesUploadOptions>({
    maxSizeMB: 2,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    enableCompression: true,
    compressionMaxWidthOrHeight: 1920,
    compressionInitialQuality: 0.8,
    ...options,
  });

  useEffect(() => {
    if (options) {
      optionsRef.current = {
        ...optionsRef.current,
        ...options,
      };
    }
  }, [options]);

  const [files, setFiles] = useState<UploadFileItem[]>([]);
  // Dùng ref để cleanup preview URLs khi unmount, tránh dependency warning
  const filesRef = useRef<UploadFileItem[]>([]);
  filesRef.current = files;

  // Cleanup preview URLs khi unmount
  useEffect(() => {
    return () => {
      filesRef.current.forEach(
        (f) => f.preview && URL.revokeObjectURL(f.preview),
      );
    };
  }, []);

  const validate = useCallback((file: File) => {
    const {
      maxSizeMB = 3,
      allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    } = optionsRef.current;

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`Max size ${maxSizeMB}MB`);
    }
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      const {
        maxSizeMB = 3,
        allowedTypes = ["image/jpeg", "image/png", "image/webp"],
        enableCompression = true,
        compressionMaxWidthOrHeight = 1920,
        compressionInitialQuality = 0.8,
      } = optionsRef.current;

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type");
      }

      if (!enableCompression) {
        validate(file);
        return file;
      }

      const processed = await compressImageFile(file, {
        maxSizeMB,
        maxWidthOrHeight: compressionMaxWidthOrHeight,
        initialQuality: compressionInitialQuality,
        fileType: file.type,
      });

      validate(processed);
      return processed;
    },
    [validate],
  );

  /** Hàm thêm file mới vào danh sách (async để hỗ trợ compression) */
  const addFiles = useCallback(
    async (input: File[] | FileList) => {
      const list = Array.from(input);
      const newItems: UploadFileItem[] = [];

      for (const rawFile of list) {
        try {
          const file = await processFile(rawFile);
          const id = crypto.randomUUID();
          const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : "";

          newItems.push({
            id,
            file,
            preview,
            status: UploadItemStatus.IDLE,
          });
        } catch (e) {
          // Keep behavior tolerant: skip invalid files.
          const msg = e instanceof Error ? e.message : String(e);
          console.warn("Skipped file:", rawFile.name, msg);
        }
      }

      if (newItems.length > 0) {
        setFiles((prev) => prev.concat(newItems));
      }

      return newItems;
    },
    [processFile],
  );

  /** Hàm xóa file khỏi danh sách */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      // Revoked URL để tránh rò rỉ bộ nhớ
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  /** Hàm xóa tất cả files */
  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      return [];
    });
  }, []);

  const uploadFiles = async (
    folder: string = "images",
    itemsToUpload?: UploadFileItem[],
    imageTypeOverride?: ImageType,
  ): Promise<Record<string, string>> => {
    // Nếu không truyền itemsToUpload, lấy từ state hiện tại (những file đang IDLE)
    const targetFiles =
      itemsToUpload || files.filter((f) => f.status === UploadItemStatus.IDLE);

    if (targetFiles.length === 0) return {};

    // Cập nhật trạng thái đang upload ngay lập tức (trước khi presign để UI responsive)
    setFiles((prev) =>
      prev.map((f) => {
        const target = targetFiles.find((tf) => tf.id === f.id);
        return target ? { ...f, status: UploadItemStatus.UPLOADING } : f;
      }),
    );

    try {
      void folder; void imageTypeOverride;
      const uploadResults: Record<string, string> = {};
      await Promise.all(
        targetFiles.map(async (fileItem) => {
          try {
            const objectKey = await readDemoImage(fileItem.file);
            // Lưu objectKey (không phải URL) để dùng trong payload
            uploadResults[fileItem.id] = objectKey;

            // Cập nhật trạng thái thành công
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id
                  ? {
                      ...f,
                      status: UploadItemStatus.SUCCESS,
                      objectKey,
                    }
                  : f,
              ),
            );
          } catch (error) {
            // Cập nhật trạng thái lỗi
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id
                  ? {
                      ...f,
                      status: UploadItemStatus.ERROR,
                      error: (error as Error).message,
                    }
                  : f,
              ),
            );
          }
        }),
      );

      return uploadResults;
    } catch (error) {
      console.error("Presign mutation failed:", error);
      // Cập nhật trạng thái lỗi cho tất cả các file trong lô này
      setFiles((prev) =>
        prev.map((f) => {
          const target = targetFiles.find((tf) => tf.id === f.id);
          return target
            ? {
                ...f,
                status: UploadItemStatus.ERROR,
                error: (error as Error).message,
              }
            : f;
        }),
      );
      throw error;
    }
  };

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
  };
}
