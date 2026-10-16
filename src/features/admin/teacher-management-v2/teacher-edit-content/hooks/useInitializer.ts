import {
  mapTags,
  mapTeachingAreas,
  mapTrainingLevels,
  mapTrainingPrices,
} from "@/features/my-profile/mapper/profile-mapper";

import type { CarType, TeacherDetail } from "@/shared/types/common.type";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { BasicInfoFormState, TeachingInfoFormState } from "../../types";

interface Props {
  teacherDetail: TeacherDetail | undefined;
  setBasicInfoForm: Dispatch<SetStateAction<BasicInfoFormState>>;
  setTeachingInfoForm: Dispatch<SetStateAction<TeachingInfoFormState>>;
}

export const useInitializer = ({
  teacherDetail,
  setBasicInfoForm,
  setTeachingInfoForm,
}: Props) => {
  useEffect(() => {
    if (!teacherDetail) return;

    setBasicInfoForm({
      fullName: teacherDetail.fullName,
      email: teacherDetail.contactEmail,
      phoneNumber: teacherDetail.phone,
      avatarUrl: teacherDetail.avatarUrl,
    });

    setTeachingInfoForm({
      zalo: teacherDetail.zalo,
      bio: teacherDetail.bio || "",
      description: teacherDetail.description || "",
      locationAddress: "",
      locationPlaceId: "",
      latitude: null,
      longitude: null,
      realPhotos: teacherDetail.realPhotos,
      coverImageUrl: teacherDetail.coverImageUrl || "",
      teachingAreas: mapTeachingAreas(teacherDetail.districts),

      selectedTrainingLevels: mapTrainingLevels(teacherDetail.trainings),
      trainingLevelPrices: mapTrainingPrices(teacherDetail.trainings),
      practiceCenters: teacherDetail.drivingCenters
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
      examinationCenters: teacherDetail.drivingCenters
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
      teachingCars: teacherDetail.teachingCars.map((car) => ({
        brand: car.brand,
        model: car.model,
        productionYear: car.productionYear,
        type: car.type as CarType,
        description: car.description,
        imageUrl: car.imageUrl,
      })),

      experienceYears: teacherDetail.experienceYears,
      studentsTrained: teacherDetail.studentsTrained,
      specialtyTags: mapTags(teacherDetail.tags, "specialty"),
      styleTags: mapTags(teacherDetail.tags, "style"),
      hasCurrentStudents: teacherDetail.hasCurrentStudents,
    });
  }, [teacherDetail, setBasicInfoForm, setTeachingInfoForm]);
};
