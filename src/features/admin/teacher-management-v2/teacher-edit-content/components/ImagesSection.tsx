import { useUploadImage } from "@/shared/hooks/useUploadImage";
import { useRealPhotosUpload } from "@/shared/hooks/useRealPhotosUpload";
import { UploadItemStatus } from "@/shared/types/storage.type";
import { getStorageUrl } from "@/shared/utils/url";
import { Box, CircularProgress, IconButton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdAddAPhoto,
  MdCameraAlt,
  MdClose,
  MdCloudUpload,
} from "react-icons/md";
import type { FormErrors } from "../hooks/useTeacherEditContent";

interface Props {
  avatarUrl: string;
  coverImageUrl: string;
  realPhotos: string[];
  onAvatarChange: (objectKey: string | null) => void;
  onCoverChange: (objectKey: string | null) => void;
  onRealPhotosChange: (urls: string[]) => void;
  formErrors?: FormErrors;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
}

export const ImagesSection = React.memo(
  ({
    avatarUrl,
    coverImageUrl,
    realPhotos,
    onAvatarChange,
    onCoverChange,
    onRealPhotosChange,
    formErrors,
    registerFieldRef,
  }: Props) => {
    const avatar = useUploadImage({ imageType: "AVATAR" });
    const cover = useUploadImage({ imageType: "TEACHER" });
    const photos = useRealPhotosUpload(6);

    // ── Validation state ──
    type ValidationFields = "avatar" | "cover" | "realPhotos";

    const [errors, setErrors] = useState<
      Partial<Record<ValidationFields, string>>
    >({});
    const [touched, setTouched] = useState<
      Partial<Record<ValidationFields, boolean>>
    >({});

    // Use state instead of ref for existing photos (to trigger re-renders)
    const [existingPhotos, setExistingPhotos] = useState<string[]>(realPhotos);

    // Track whether realPhotos change originated from this component's own update
    const isOwnPhotoUpdateRef = useRef(false);

    // Sync when realPhotos prop changes (skip if change originated from us)
    useEffect(() => {
      if (isOwnPhotoUpdateRef.current) {
        isOwnPhotoUpdateRef.current = false;
        return;
      }
      setExistingPhotos(realPhotos);
    }, [realPhotos]);

    // Notify parent when cover uploads complete
    useEffect(() => {
      if (cover.objectKey) {
        onCoverChange(cover.objectKey);
      }
    }, [cover.objectKey, onCoverChange]);

    // Notify parent when avatar uploads complete
    useEffect(() => {
      if (avatar.objectKey) {
        onAvatarChange(avatar.objectKey);
      }
    }, [avatar.objectKey, onAvatarChange]);

    // Notify parent when real photos change
    const prevPhotosRef = useRef<string>("");
    useEffect(() => {
      const newlyUploadedUrls = photos.getUploadedUrls();
      // Deduplicate to prevent any edge case of growing arrays
      const newValues = [...new Set([...existingPhotos, ...newlyUploadedUrls])];
      const newValuesStr = newValues.join(",");

      if (prevPhotosRef.current !== newValuesStr) {
        prevPhotosRef.current = newValuesStr;
        isOwnPhotoUpdateRef.current = true;
        onRealPhotosChange(newValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      existingPhotos,
      photos.files,
      photos.getUploadedUrls,
      onRealPhotosChange,
    ]);

    // ── Validation helpers ──
    const validateAvatar = useCallback((hasAvatar: boolean) => {
      setErrors((prev) => ({
        ...prev,
        avatar: hasAvatar ? undefined : "Ảnh đại diện là bắt buộc",
      }));
    }, []);

    const validateCover = useCallback((hasCover: boolean) => {
      setErrors((prev) => ({
        ...prev,
        cover: hasCover ? undefined : "Ảnh bìa là bắt buộc",
      }));
    }, []);

    const validateRealPhotos = useCallback((count: number) => {
      let errorMsg: string | undefined;
      if (count < 3) {
        errorMsg = `Cần ít nhất 3 ảnh thực tế (hiện có ${count})`;
      } else if (count > 6) {
        errorMsg = `Tối đa 6 ảnh thực tế (hiện có ${count})`;
      }
      setErrors((prev) => ({
        ...prev,
        realPhotos: errorMsg,
      }));
    }, []);

    // Re-validate real photos whenever totalPhotos changes
    const totalPhotos = existingPhotos.length + photos.files.length;

    useEffect(() => {
      if (touched.realPhotos) {
        validateRealPhotos(totalPhotos);
      }
    }, [totalPhotos, touched.realPhotos, validateRealPhotos]);

    // Re-validate avatar when preview changes
    useEffect(() => {
      if (touched.avatar) {
        validateAvatar(!!avatar.preview || !!avatar.objectKey || !!avatarUrl);
      }
    }, [
      avatar.preview,
      avatar.objectKey,
      avatarUrl,
      touched.avatar,
      validateAvatar,
    ]);

    // Re-validate cover when preview changes
    useEffect(() => {
      if (touched.cover) {
        validateCover(!!cover.preview || !!cover.objectKey || !!coverImageUrl);
      }
    }, [
      cover.preview,
      cover.objectKey,
      coverImageUrl,
      touched.cover,
      validateCover,
    ]);

    const handleAvatarSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          void avatar.upload(file).catch(() => undefined);
        }
        e.target.value = "";
        setTouched((prev) => ({ ...prev, avatar: true }));
        validateAvatar(!!file);
      },
      [avatar, validateAvatar],
    );

    const handleCoverSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          void cover.upload(file).catch(() => undefined);
        }
        e.target.value = "";
        setTouched((prev) => ({ ...prev, cover: true }));
        validateCover(!!file);
      },
      [cover, validateCover],
    );

    const handlePhotosSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) photos.addPhotos(e.target.files);
        e.target.value = "";
        setTouched((prev) => ({ ...prev, realPhotos: true }));
      },
      [photos],
    );

    const avatarPreview = avatar.preview || getStorageUrl(avatar.objectKey || avatarUrl);
    const coverPreview = cover.preview || getStorageUrl(cover.objectKey || coverImageUrl);

    const handleRemoveExistingPhoto = useCallback((index: number) => {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
      setTouched((prev) => ({ ...prev, realPhotos: true }));
    }, []);

    const handleRemoveNewPhoto = useCallback(
      (id: string) => {
        photos.removePhoto(id);
        setTouched((prev) => ({ ...prev, realPhotos: true }));
      },
      [photos],
    );

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <h3 className="text-base font-bold text-app-text flex items-center gap-2 border-b border-app-border pb-3">
          🖼️ Hình ảnh
        </h3>

        {/* Avatar */}
        <Box ref={registerFieldRef?.("avatarUrl")}>
          <label className="text-sm font-medium text-app-text block mb-1.5">
            Ảnh đại diện
          </label>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px dashed",
                borderColor: "grey.300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f8fafc",
                position: "relative",
              }}
            >
              {avatarPreview ? (
                <Box
                  component="img"
                  src={avatarPreview}
                  alt="Avatar"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <MdAddAPhoto size={28} color="#94a3b8" />
              )}
              {avatar.uploading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
            <label>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarSelect}
              />
              <Box
                component="span"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1.5,
                  bgcolor: "#f1f5f9",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#e2e8f0" },
                  transition: "background 0.2s",
                }}
              >
                Chọn ảnh
              </Box>
            </label>
          </Box>
          {((touched.avatar && errors.avatar) || formErrors?.avatarUrl) && (
            <p className="text-xs text-app-error mt-1">
              {formErrors?.avatarUrl || errors.avatar}
            </p>
          )}
        </Box>

        {/* Cover Image */}
        <Box ref={registerFieldRef?.("coverImageUrl")}>
          <label className="text-sm font-medium text-app-text block mb-1.5">
            Ảnh bìa
          </label>
          <Box
            sx={{
              width: "100%",
              height: 240,
              borderRadius: 2,
              overflow: "hidden",
              border: coverPreview ? "1px solid" : "2px dashed",
              borderColor: coverPreview ? "grey.200" : "grey.300",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f8fafc",
              position: "relative",
              cursor: "pointer",
              "&:hover .cover-overlay": {
                opacity: 1,
              },
            }}
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverSelect}
            />
            {coverPreview ? (
              <>
                <Box
                  component="img"
                  src={coverPreview}
                  alt="Cover"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Fade-in overlay with Change Button */}
                <Box
                  className="cover-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.15)",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      backdropFilter: "blur(4px)",
                      transition: "background 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <MdCameraAlt size={18} />
                    <span className="text-sm font-semibold">
                      Thay đổi ảnh bìa
                    </span>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                }}
              >
                <MdCloudUpload size={32} />
                <span className="text-xs text-app-placeholder">
                  Nhấp để tải ảnh bìa
                </span>
              </Box>
            )}
            {cover.uploading && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={28} />
              </Box>
            )}
          </Box>
          {((touched.cover && errors.cover) || formErrors?.coverImageUrl) && (
            <p className="text-xs text-app-error mt-1">
              {formErrors?.coverImageUrl || errors.cover}
            </p>
          )}
        </Box>

        {/* Real Photos */}
        <Box ref={registerFieldRef?.("realPhotos")}>
          <label className="text-sm font-medium text-app-text block mb-1.5">
            Ảnh thực tế ({totalPhotos}/6)
          </label>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.5,
            }}
          >
            {/* Existing photos from server */}
            {existingPhotos.map((url, index) => (
              <Box
                key={`existing-${index}`}
                sx={{
                  position: "relative",
                  aspectRatio: "4/3",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  component="img"
                  src={getStorageUrl(url)}
                  alt={`Photo ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveExistingPhoto(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    width: 24,
                    height: 24,
                  }}
                >
                  <MdClose size={14} />
                </IconButton>
              </Box>
            ))}

            {/* Newly added photos */}
            {photos.files.map((item) => (
              <Box
                key={item.id}
                sx={{
                  position: "relative",
                  aspectRatio: "4/3",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box
                  component="img"
                  src={item.preview}
                  alt="New photo"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {item.status === UploadItemStatus.UPLOADING && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: "rgba(255,255,255,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress size={20} />
                  </Box>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveNewPhoto(item.id)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    width: 24,
                    height: 24,
                  }}
                >
                  <MdClose size={14} />
                </IconButton>
              </Box>
            ))}

            {/* Add button */}
            {totalPhotos < 6 && (
              <Box
                component="label"
                sx={{
                  aspectRatio: "4/3",
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: "grey.300",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "#f8fafc",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "grey.400" },
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handlePhotosSelect}
                />
                <MdAddAPhoto size={24} color="#94a3b8" />
                <span className="text-xs text-app-placeholder mt-0.5">
                  Thêm ảnh
                </span>
              </Box>
            )}
          </Box>
          {((touched.realPhotos && errors.realPhotos) ||
            formErrors?.realPhotos) && (
            <p className="text-xs text-app-error mt-1">
              {formErrors?.realPhotos || errors.realPhotos}
            </p>
          )}
        </Box>
      </Box>
    );
  },
);

ImagesSection.displayName = "ImagesSection";
