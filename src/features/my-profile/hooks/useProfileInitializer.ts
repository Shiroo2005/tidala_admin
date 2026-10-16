import { useEffect, type Dispatch, type SetStateAction } from "react";

import type { AuthUser } from "@/features/auth/types/authContext.type";
import {
  mapTags,
  mapTeachingAreas,
  mapTrainingLevels,
  mapTrainingPrices,
} from "../mapper/profile-mapper";
import type { AccountFormState, TeacherProfileFormState } from "../types";

interface Props {
  user: AuthUser | null;
  setAccountForm: Dispatch<SetStateAction<AccountFormState>>;
  setTeacherProfileForm: Dispatch<SetStateAction<TeacherProfileFormState>>;
}

export const useProfileInitializer = ({
  user,
  setAccountForm,
  setTeacherProfileForm,
}: Props) => {
  useEffect(() => {
    if (!user?.appUser) return;

    const baseUser = user.appUser;

    setAccountForm({
      fullName: baseUser.fullName,
      email: baseUser.email,
      phoneNumber: baseUser.phoneNumber || "",
      avatarUrl: baseUser.avatarUrl,
    });

    if (baseUser.role === "TEACHER") {
      const profile = baseUser.teacherProfile;
      if (!profile) return;
      setTeacherProfileForm({
        coverImageUrl: profile.coverImageUrl || "",
        contactPhoneNumber: profile.contactPhoneNumber,
        zalo: profile.zalo,
        bio: profile.bio || "",
        description: profile.description || "",
        locationAddress: "",
        locationPlaceId: "",
        latitude: profile.latitude ?? null,
        longitude: profile.longitude ?? null,
        realPhotos: profile.realPhotos,
        teachingAreas: mapTeachingAreas(profile.districts),
        selectedTrainingLevels: mapTrainingLevels(profile.trainings),
        trainingLevelPrices: mapTrainingPrices(profile.trainings),
        practiceCenters: profile.drivingCenters
          .filter((c) => c.type === "PRACTICE_GROUND")
          .map((c) => ({
            description: c.address,
            place_id: c.id,
            structured_formatting: {
              main_text: c.name,
              secondary_text: c.address,
            },
            source: "EXISTING",
            type: "PRACTICE_GROUND",
          })),
        examinationCenters: profile.drivingCenters
          .filter((c) => c.type === "TEST_CENTER")
          .map((c) => ({
            description: c.address,
            place_id: c.id,
            structured_formatting: {
              main_text: c.name,
              secondary_text: c.address,
            },
            source: "EXISTING",
            type: "TEST_CENTER",
          })),
        teachingCars: profile.teachingCars,
        experienceYears: profile.experienceYears,
        studentsTrained: profile.studentsTrained,
        specialtyTags: mapTags(profile.tags, "specialty"),
        styleTags: mapTags(profile.tags, "style"),
        hasCurrentStudents: profile.hasCurrentStudents,
      });
    }
  }, [user, setAccountForm, setTeacherProfileForm]);
};
