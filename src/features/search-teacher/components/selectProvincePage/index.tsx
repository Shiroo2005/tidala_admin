import type { Province } from "@/shared/types/common.type";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useGetProvincesListV2 } from "../../hooks/useGetProvincesListV2";
import { SelectProvinceHeader } from "./SelectProvinceHeader";
import { SelectProvinceList } from "./SelectProvinceList";
import { SelectProvinceSearch } from "./SelectProvinceSearch";

interface Props {
  onClose: () => void;
  onSelect: (province: Province) => void;
  selectedProvince: Province | null;
  /**
   * Nếu true, chỉ hiện các tỉnh có giáo viên (dùng cho tìm kiếm).
   * Nếu false, hiện tất cả (dùng cho onboard/update profile).
   * Default: true.
   */
  showAllTeachersOnly?: boolean;
}

/**
 * =========================
 * Utils
 * =========================
 * Normalize text để search:
 * - bỏ dấu tiếng Việt
 * - lowercase
 * - trim khoảng trắng
 */
const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const SelectProvincePage = ({
  onClose,
  onSelect,
  selectedProvince,
  showAllTeachersOnly = true,
}: Props) => {
  /**
   * =========================
   * State
   * =========================
   */
  const [mounted, setMounted] = useState(false);
  const [keyword, setKeyword] = useState("");

  /**
   * =========================
   * Data fetching
   * =========================
   */
  const { listProvinces, isLoadingListProvinces, isErrorFetchListProvince } =
    useGetProvincesListV2();

  /**
   * =========================
   * Lifecycle
   * =========================
   * Delay mount để animation mượt (slide từ dưới lên)
   */
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  /**
   * =========================
   * Handlers
   * =========================
   */
  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 300);
  };

  /**
   * =========================
   * Derived data
   * =========================
   * Filter province theo keyword (đã normalize)
   */
  const filtered = useMemo(() => {
    const k = normalizeText(keyword);
    let baseList = listProvinces || [];

    if (showAllTeachersOnly) {
      baseList = baseList.filter((p) => p.teacherCounts && p.teacherCounts > 0);

      // Always include Thành phố Hồ Chí Minh (ID from dataset) even if teacherCounts === 0
      const HCMC_ID = "92f4bad8-0020-43e7-a9d6-48b0eec0e998";
      const hcm = (listProvinces || []).find((p) => p.id === HCMC_ID);
      if (hcm && !baseList.some((p) => p.id === hcm.id)) {
        baseList = [hcm, ...baseList];
      }
    }

    if (!k) return baseList;

    return baseList.filter((d) => normalizeText(d.name).includes(k));
  }, [keyword, listProvinces, showAllTeachersOnly]);

  return createPortal(
    <div
      className={`
        fixed inset-0 z-60 bg-white flex flex-col
        transition-transform duration-300
        ${mounted ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <SelectProvinceHeader handleClose={handleClose} />

      <SelectProvinceSearch keyword={keyword} setKeyword={setKeyword} />

      <SelectProvinceList
        isLoadingListProvinces={isLoadingListProvinces}
        filtered={filtered}
        isErrorFetchListProvince={isErrorFetchListProvince}
        selectedProvince={selectedProvince}
        onSelect={onSelect}
        handleClose={handleClose}
      />
    </div>,
    document.body,
  );
};

export default SelectProvincePage;
