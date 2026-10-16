import type { DrivingCenterFormItem } from "@/features/account/types/type";
import { useMutation } from "@tanstack/react-query";
import { createBulkDrivingCenter } from "../services/create-bulk-driving-center";

export const useDrivingCenterBulkCreate = () => {
  const mutation = useMutation({
    mutationFn: createBulkDrivingCenter,
  });

  return {
    createDrivingCenters: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};

export const buildCreateDrivingCenterPayload = (
  centers: DrivingCenterFormItem[],
) =>
  centers.map((c) => ({
    name: c.structured_formatting.main_text,
    type: c.type,
    address: c.description,
    placeId: c.place_id,
  }));
