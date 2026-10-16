import { useCallback, useState } from "react";
import type { BasicInfoFormState, TeachingInfoFormState } from "../../types";

export const useTeachingInfoForm = (
  clearError: (
    key: keyof BasicInfoFormState | keyof TeachingInfoFormState,
  ) => void,
) => {
  const [teachingInfoForm, setTeachingInfoForm] =
    useState<TeachingInfoFormState>({
      coverImageUrl: "",
      zalo: "",
      bio: "",
      description: "",
      locationAddress: "",
      locationPlaceId: "",
      latitude: null,
      longitude: null,
      realPhotos: [],
      teachingAreas: [],
      selectedTrainingLevels: [],
      trainingLevelPrices: {},
      practiceCenters: [],
      examinationCenters: [],
      teachingCars: [],
      experienceYears: null,
      studentsTrained: null,
      specialtyTags: [],
      styleTags: [],
      hasCurrentStudents: false,
    });
  const setCoverImageUrl = useCallback(
    (url: string | null) => {
      setTeachingInfoForm((prev) => ({
        ...prev,
        coverImageUrl: url,
      }));

      clearError("coverImageUrl");
    },
    [clearError],
  );

  const setTeacherProfileField = useCallback(
    <K extends keyof TeachingInfoFormState>(
      key: K,
      value: TeachingInfoFormState[K],
    ) => {
      setTeachingInfoForm((prev) => ({ ...prev, [key]: value }));
      clearError(key);
    },
    [clearError],
  );

  const setTrainingLevels = useCallback(
    (levels: TeachingInfoFormState["selectedTrainingLevels"]) => {
      setTeachingInfoForm((prev) => ({
        ...prev,
        selectedTrainingLevels: levels,
        trainingLevelPrices: levels.reduce<
          TeachingInfoFormState["trainingLevelPrices"]
        >((acc, lvl) => {
          acc[lvl.id] = prev.trainingLevelPrices[lvl.id] ?? {
            from: 0,
            to: 0,
            isContactOnly: false,
          };
          return acc;
        }, {}),
      }));
      clearError("selectedTrainingLevels");
      clearError("trainingLevelPrices");
    },
    [clearError],
  );
  return {
    teachingInfoForm,
    setTeachingInfoForm,
    setTeacherProfileField,
    setTrainingLevels,
    setCoverImageUrl,
  };
};
