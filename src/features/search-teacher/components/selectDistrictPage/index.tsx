import type { District, Province } from "@/shared/types/common.type";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useGetDistricstByProvinceId } from "../../hooks/useGetDistrictsByProvinceId";
import { SelectDistrictHeader } from "./SelectDistrictHeader";
import { SelectDistrictList } from "./SelectDistrictList";
import { SelectDistrictSearch } from "./SelectDistrictSearch";
interface Props {
  province: Province;
  onClose: () => void;
  onSelect?: (district: District) => void;
  selectedDistricts?: District[];
  setSelectedListDistricts: (p: District[]) => void;
  onMultiSelect?: (districts: District[]) => void;
  maxSelected?: number;
}

const normalizeText = (text: string) =>
  text
    .normalize("NFD") // chuẩn hóa unicode
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .toLowerCase()
    .trim();

const SelectDistrictPage = ({
  province,
  onClose,
  onSelect,
  selectedDistricts = [],
  setSelectedListDistricts,
  onMultiSelect,
  maxSelected = 10,
}: Props) => {
  const [mounted, setMounted] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<District[]>(selectedDistricts);

  const { listDistricts, isLoadingListDistricts, isErrorFetchListDistricts } =
    useGetDistricstByProvinceId(province.id);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 300);
  };

  const handleToggleSelect = (district: District) => {
    if (onMultiSelect) {
      setSelected((prev) => {
        const isSelected = prev.some((d) => d.id === district.id);
        if (isSelected) return prev.filter((d) => d.id !== district.id);

        // BỎ CHỌN → luôn cho
        if (isSelected) {
          return prev.filter((d) => d.id !== district.id);
        }

        // ĐÃ ĐỦ SỐ LƯỢNG → KHÔNG CHO CHỌN THÊM
        if (prev.length >= maxSelected) {
          return prev;
        }
        return [...prev, district];
      });
    } else if (onSelect) {
      onSelect(district);
      handleClose();
    }
  };

  const handleConfirm = () => {
    if (onMultiSelect) {
      onMultiSelect(selected);
      handleClose();
    }
  };

  const filtered = useMemo(() => {
    const k = normalizeText(keyword);
    if (!k) return listDistricts;

    return listDistricts?.filter((d) => normalizeText(d.name).includes(k));
  }, [keyword, listDistricts]);

  const handleClearSelected = () => {
    setSelected([]);
    setSelectedListDistricts([]);
  };

  return createPortal(
    <div
      className={`
        fixed inset-0 z-60 bg-white flex flex-col
        transition-transform duration-300
        ${mounted ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <SelectDistrictHeader
        handleClose={onClose}
        onMultiSelect={onMultiSelect}
        selected={selected}
      />

      <SelectDistrictSearch
        keyword={keyword}
        province={province}
        setKeyword={setKeyword}
      />

      {/* LIST */}
      <SelectDistrictList
        filtered={filtered}
        handleClearSelected={handleClearSelected}
        handleToggleSelect={handleToggleSelect}
        isErrorFetchListDistricts={isErrorFetchListDistricts}
        isLoadingListDistricts={isLoadingListDistricts}
        onMultiSelect={onMultiSelect}
        province={province}
        selected={selected}
      />

      {/* CONFIRM BUTTON */}
      {onMultiSelect && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <button
            onClick={handleConfirm}
            className={`
              w-full py-3 rounded-xl font-semibold text-[16px] transition-all
              text-white active:scale-[0.98]
            `}
            style={{
              backgroundColor: "#137FEC",
              color: "#fff",
            }}
          >
            Xác nhận ({selected.length})
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
};

export default SelectDistrictPage;
