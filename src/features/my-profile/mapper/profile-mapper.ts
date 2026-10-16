import type {
  DistrictDetail,
  DrivingCenter,
  Tag,
  TagOption,
  TrainingLevel,
  TrainingLevelDetail,
} from "@/shared/types/common.type";
import type { IGoongAutoCompleteAddress } from "@/shared/types/goong.type";
import type { TeachingArea } from "../components/ui/TeachingAreaSelector";

export const mapDrivingCenterToGoong = (
  centers: DrivingCenter[],
): IGoongAutoCompleteAddress[] =>
  centers.map((item) => ({
    description: item.address,
    place_id: item.id,
    structured_formatting: {
      main_text: item.name,
      secondary_text: item.address,
    },
  }));

export const mapTrainingPrices = (
  trainings: TrainingLevelDetail[],
): Record<string, { from: number; to: number; isContactOnly: boolean }> =>
  trainings.reduce(
    (acc, item) => {
      acc[item.trainingLevelId] = {
        from: item.priceFrom ?? 0,
        to: item.priceTo ?? 0,
        isContactOnly: !item.priceFrom && !item.priceTo,
      };
      return acc;
    },
    {} as Record<string, { from: number; to: number; isContactOnly: boolean }>,
  );

export const mapTeachingAreas = (
  districts: DistrictDetail[],
): TeachingArea[] => {
  return districts.map((d) => ({
    province: {
      id: d.provinceId,
      name: d.provinceName,
    },
    district: {
      id: d.districtId,
      name: d.districtName,
    },
  }));
};

export const mapTrainingLevels = (
  trainings: TrainingLevelDetail[],
): TrainingLevel[] => {
  return trainings.map((t) => ({
    id: t.trainingLevelId,
    name: t.trainingLevelName,
    description: t.trainingLevelDescription || "",
  }));
};

export const mapTags = (tags: Tag[], opt: TagOption): Tag[] => {
  return tags.filter((t) => t.type === opt);
};
