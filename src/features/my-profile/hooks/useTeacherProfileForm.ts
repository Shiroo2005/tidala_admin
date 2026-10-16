import { useState } from "react";
import type { AccountFormState, TeacherProfileFormState } from "../types";

export const useTeacherProfileForm = (
  clearError: (
    key: keyof TeacherProfileFormState | keyof AccountFormState,
  ) => void,
) => {
  const [teacherProfileForm, setTeacherProfileForm] =
    useState<TeacherProfileFormState>({
      coverImageUrl: "",
      contactPhoneNumber: "",
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

  const setCoverImageUrl = (url: string | null) => {
    setTeacherProfileForm((prev) => ({
      ...prev,
      coverImageUrl: url,
    }));

    clearError("coverImageUrl");
  };

  const setTeacherProfileField = <K extends keyof TeacherProfileFormState>(
    key: K,
    value: TeacherProfileFormState[K],
  ) => {
    setTeacherProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const setTrainingLevels = (
    levels: TeacherProfileFormState["selectedTrainingLevels"],
  ) => {
    setTeacherProfileForm((prev) => ({
      ...prev,
      selectedTrainingLevels: levels,
      trainingLevelPrices: levels.reduce<
        TeacherProfileFormState["trainingLevelPrices"]
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
  };

  return {
    teacherProfileForm,
    setTeacherProfileForm,
    setTeacherProfileField,
    setTrainingLevels,
    setCoverImageUrl,
  };
};
