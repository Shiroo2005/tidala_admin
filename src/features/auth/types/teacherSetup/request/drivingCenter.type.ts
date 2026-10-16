export interface IDrivingCenterCreateRequest {
  placeId: string;
  name: string;
  type: "TEST_CENTER" | "PRACTICE_GROUND";
  address: string;
}
