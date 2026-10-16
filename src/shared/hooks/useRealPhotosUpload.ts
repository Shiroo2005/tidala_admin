import { useCallback } from "react";
import { useImagesUpload } from "./useImagesUpload";
import { UploadItemStatus } from "../types/storage.type";
import type { UploadFileItem } from "../types/storage.type";
import type { TeacherProfileFormErrors } from "@/features/auth/types/teacherSetup/state/teacherProfileSetupFormState.type";

interface UseRealPhotosUploadReturn {
  /** Danh sách files đang quản lý */
  files: UploadFileItem[];
  /** Đang upload */
  isUploading: boolean;
  /** Thêm files mới */
  addPhotos: (files: File[] | FileList) => void;
  /** Xóa 1 file theo id */
  removePhoto: (id: string) => void;
  /** Xóa tất cả */
  clearPhotos: () => void;
  /** Upload tất cả và trả về mảng object keys */
  uploadPhotos: (items?: UploadFileItem[]) => Promise<string[]>;
  /** Lấy danh sách object keys đã upload */
  getUploadedUrls: () => string[];

  clearFieldError?: (field: keyof TeacherProfileFormErrors) => void;
}

/**
 * Hook wrapper cho upload nhiều ảnh thực tế
 * Sử dụng Presigned URL để upload lên S3/Storage
 */
export const useRealPhotosUpload = (
  maxPhotos: number = 6,
): UseRealPhotosUploadReturn => {
  const { files, addFiles, removeFile, clearFiles, uploadFiles } =
    useImagesUpload();

  const isUploading = files.some(
    (f) => f.status === UploadItemStatus.UPLOADING,
  );

  /**
   * Upload tất cả photos và trả về mảng object keys
   * @param itemsToUpload Optional: Danh sách items cần upload ngay (dùng cho auto-upload)
   */
  const uploadPhotos = useCallback(
    async (itemsToUpload?: UploadFileItem[]): Promise<string[]> => {
      const results = await uploadFiles("real-photos", itemsToUpload);
      return Object.values(results);
    },
    [uploadFiles],
  );

  /**
   * Thêm photos mới (giới hạn maxPhotos)
   */
  const addPhotos = useCallback(
    async (input: File[] | FileList) => {
      const list = Array.from(input);
      const currentCount = files.length;
      const remainingSlots = maxPhotos - currentCount;

      if (remainingSlots <= 0) {
        alert(`Chỉ được upload tối đa ${maxPhotos} ảnh`);
        return;
      }

      // Nếu user select nhiều hơn số slot còn lại, chỉ lấy số lượng cần thiết
      const filesToProcess = list.slice(0, remainingSlots);

      // Validate files
      const validFiles = filesToProcess.filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(`"${file.name}" không phải là file ảnh`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`"${file.name}" vượt quá 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const newItems = await addFiles(validFiles);
        // Tự động upload ngay sau khi thêm
        try {
          uploadPhotos(newItems);
        } catch (error) {
          console.error("Auto upload photos failed:", error);
        }
      }

      // Thông báo nếu có files bị bỏ qua
      const skippedCount = list.length - validFiles.length;
      if (skippedCount > 0) {
        alert(
          `Đã bỏ qua ${skippedCount} file không hợp lệ hoặc vượt quá giới hạn`,
        );
      }
    },
    [files.length, maxPhotos, addFiles, uploadPhotos],
  );

  /**
   * Xóa 1 photo
   */
  const removePhoto = useCallback(
    (id: string) => {
      removeFile(id);
    },
    [removeFile],
  );

  /**
   * Xóa tất cả
   */
  const clearPhotos = useCallback(() => {
    clearFiles();
  }, [clearFiles]);

  /**
   * Lấy danh sách object keys đã upload thành công
   */
  const getUploadedUrls = useCallback((): string[] => {
    return files
      .filter((f) => f.status === UploadItemStatus.SUCCESS && f.objectKey)
      .map((f) => f.objectKey!);
  }, [files]);

  return {
    files,
    isUploading,
    addPhotos,
    removePhoto,
    clearPhotos,
    uploadPhotos,
    getUploadedUrls,
  };
};
