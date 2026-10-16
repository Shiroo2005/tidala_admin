import imageCompression from "browser-image-compression";

export type CompressImageFileOptions = {
  /** Max output size in MB (best-effort). */
  maxSizeMB: number;
  /** Resize max edge. Defaults to 1920 to keep quality reasonable. */
  maxWidthOrHeight?: number;
  /** Initial quality hint (0..1). Defaults to 0.8. */
  initialQuality?: number;
  /** Use web worker for performance. Defaults to true. */
  useWebWorker?: boolean;
  /** If false, only compress when file exceeds maxSizeMB. Defaults to false. */
  alwaysCompress?: boolean;
  /** Force output mime type. Defaults to input file.type. */
  fileType?: string;
  /** Convert output to WebP. Defaults to true. */
  convertToWebp?: boolean;
};

const mbToBytes = (mb: number) => mb * 1024 * 1024;

const isAppleBrowser = () => {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);

  return isIOS || isSafari;
};

const getFileNameWithExtension = (fileName: string, extension: string) => {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return `${baseName}.${extension}`;
};

export async function compressImageFile(
  file: File,
  options: CompressImageFileOptions,
): Promise<File> {
  const {
    maxSizeMB,
    maxWidthOrHeight = 1920,
    initialQuality = 0.8,
    useWebWorker = true,
    alwaysCompress = false,
    fileType = file.type,
    convertToWebp = true,
  } = options;

  const shouldUseJpegFallback = convertToWebp && isAppleBrowser();
  const outputFileType = shouldUseJpegFallback
    ? "image/jpeg"
    : convertToWebp
      ? "image/webp"
      : fileType;
  const shouldConvertType = file.type !== outputFileType;

  const maxBytes = mbToBytes(maxSizeMB);
  if (!alwaysCompress && !shouldConvertType && file.size <= maxBytes) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      initialQuality,
      useWebWorker,
      fileType: outputFileType,
    });

    const nextName = shouldUseJpegFallback
      ? getFileNameWithExtension(file.name, "jpg")
      : convertToWebp
        ? getFileNameWithExtension(file.name, "webp")
        : file.name;

    if (compressed instanceof File) {
      if (compressed.type === outputFileType && compressed.name === nextName) {
        return compressed;
      }
      return new File([compressed], nextName, {
        type: outputFileType,
        lastModified: Date.now(),
      });
    }

    return new File([compressed], nextName, {
      type: outputFileType,
      lastModified: Date.now(),
    });
  } catch {
    // If compression fails, keep original file when it is already within size limit.
    if (file.size <= maxBytes) return file;
    throw new Error("Compress failed");
  }
}
