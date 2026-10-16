import type { CarType } from "@/shared/types/common.type";

export interface ITeachingCarCreateRequest {
  brand: string;
  model: string;
  productionYear: number;
  type: CarType;
  description: string;
  imageUrl: string;
}
