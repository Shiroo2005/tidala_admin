export interface ITrainingLevelPrice {
  trainingLevelId: string;
  priceFrom: number | null;
  priceTo: number | null;
  validPriceRange: boolean;
}
