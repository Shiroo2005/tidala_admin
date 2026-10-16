import type { FormErrors } from "../hooks/useProfileForm";

export const mapUpdateMyProfileApiFieldErrors = (
  fieldErrors: Record<string, string>,
): {
  mappedErrors: Partial<FormErrors>;
  unknownMessages: string[];
} => {
  const mappedErrors: Partial<FormErrors> = {};
  const unknownMessages: string[] = [];

  Object.entries(fieldErrors).forEach(([field, message]) => {
    switch (field) {
      // ===== Account =====
      case "fullName":
        mappedErrors.fullName = message;
        break;

      case "email":
        mappedErrors.email = message;
        break;

      case "phoneNumber":
        mappedErrors.phoneNumber = message;
        break;
      case "contactPhoneNumber":
        mappedErrors.contactPhoneNumber = message;
        break;

      case "avatarUrl":
        mappedErrors.avatarUrl = message;
        break;

      // ===== Basic =====

      case "zalo":
        mappedErrors.zalo = message;
        break;

      case "bio":
        mappedErrors.bio = message;
        break;

      case "location":
      case "lat":
      case "lng":
      case "latitude":
      case "longitude":
        mappedErrors.latitude = message;
        break;

      case "realPhotos":
        mappedErrors.realPhotos = message;
        break;

      case "coverImageUrl":
        mappedErrors.coverImageUrl = message;
        break;

      // ===== Teaching =====

      case "teachingAreas":
        mappedErrors.teachingAreas = message;
        break;

      case "selectedTrainingLevels":
      case "trainingLevels":
        mappedErrors.selectedTrainingLevels = message;
        break;

      case "trainingLevelPrices":
      case "prices":
        mappedErrors.trainingLevelPrices = message;
        break;

      case "practiceCenters":
      case "drivingCenters":
        mappedErrors.practiceCenters = message;
        break;

      case "examinationCenters":
        mappedErrors.examinationCenters = message;
        break;

      case "teachingCars":
        mappedErrors.teachingCars = message;
        break;

      // ===== Experience =====

      case "experienceYears":
        mappedErrors.experienceYears = message;
        break;

      case "studentsTrained":
        mappedErrors.studentsTrained = message;
        break;

      case "hasCurrentStudents":
        mappedErrors.hasCurrentStudents = message;
        break;

      // ===== Tags =====

      case "specialtyTags":
      case "styleTags":
      case "tags":
        mappedErrors.tags = message;
        break;

      default:
        unknownMessages.push(message);
        break;
    }
  });

  return { mappedErrors, unknownMessages };
};
