import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { readDemoImage } from "@/demo/upload";
import type { ImageType } from "@/shared/types/uploadV2.type";
import { compressImageFile } from "@/shared/utils/compressImageFile";

type UseUploadImageOptions = {
  imageType?: ImageType;
  maxSizeMB?: number;
  allowedTypes?: string[];
  enableCompression?: boolean;
  compressionMaxWidthOrHeight?: number;
  compressionInitialQuality?: number;
};

export const useUploadImage = (options?: UseUploadImageOptions) => {
  const {
    maxSizeMB = 2,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    enableCompression = true,
    compressionMaxWidthOrHeight = 1920,
    compressionInitialQuality = 0.8,
  } = options ?? {};

  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<unknown | null>(null);
  const uploadSeq = useRef(0);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      return readDemoImage(file);
    },
  });

  const validate = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`Max size ${maxSizeMB}MB`);
    }
  };

  const processFile = async (file: File) => {
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
  };

  const upload = async (file?: File | null) => {
    if (!file) return undefined;

    setLocalError(null);
    mutation.reset();

    let processedFile: File;
    try {
      processedFile = await processFile(file);
    } catch (error) {
      setLocalError(error);
      throw error;
    }

    const seq = ++uploadSeq.current;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(processedFile);
    setPreview(previewUrl);

    try {
      const objectKey = await mutation.mutateAsync(processedFile);

      if (seq !== uploadSeq.current) return undefined;

      return objectKey;
    } catch (error) {
      setLocalError(error);
      throw error;
    }
  };

  const reset = () => {
    uploadSeq.current += 1;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setLocalError(null);
    mutation.reset();
  };

  return {
    upload,
    preview,
    objectKey: mutation.data ?? null,
    uploading: mutation.isPending,
    error: localError ?? mutation.error,
    reset,
  };
};
