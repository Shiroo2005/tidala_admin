import type { District, Province } from "@/shared/types/common.type";
import { HiCheck, HiX } from "react-icons/hi";
import ListSkeleton from "../ListSkeleton";

interface Props {
  isLoadingListDistricts: boolean;
  isErrorFetchListDistricts: boolean;
  filtered: District[] | undefined;
  province: Province;
  onMultiSelect: ((districts: District[]) => void) | undefined;
  selected: District[];
  handleClearSelected: () => void;
  handleToggleSelect: (district: District) => void;
  maxSelected?: number;
}

export const SelectDistrictList = ({
  filtered,
  isErrorFetchListDistricts,
  isLoadingListDistricts,
  province,
  onMultiSelect,
  selected,
  handleClearSelected,
  handleToggleSelect,
  maxSelected = 10,
}: Props) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-24">
      {isLoadingListDistricts && <ListSkeleton />}

      {isErrorFetchListDistricts && (
        <div className="mt-20 text-center text-slate-400 text-sm">
          Có lỗi xảy ra. Vui lòng thử lại sau.
        </div>
      )}

      {filtered?.length === 0 && !isLoadingListDistricts && (
        <div className="mt-20 text-center text-slate-400 text-sm">
          Không tìm thấy phường của {province.name}
        </div>
      )}

      {!isLoadingListDistricts && (
        <div className="space-y-2">
          {onMultiSelect && selected.length > 0 && (
            // <button
            //   onClick={handleClearSelected}
            //   className="
            //     w-full text-left px-4 py-3
            //     rounded-xl
            //     bg-red-50
            //     text-sm text-red-600
            //     border border-red-200
            //     active:scale-[0.98]
            //   "
            // >
            //   Xoá bộ lọc ({selected.length})
            // </button>
            <button
              onClick={handleClearSelected}
              className="
                  inline-flex items-center gap-1.5
                  px-3 py-1.5
                  rounded-full
                  text-xs font-medium
                  border border-red-200
                  bg-red-50
                  text-red-600
                  transition-all
                  hover:bg-red-100 hover:border-red-300
                  active:scale-95
                "
            >
              <HiX className="text-[14px]" />
              <span>Xoá ({selected.length})</span>
            </button>
          )}
          {filtered?.map((d) => {
            const isSelected = selected.some((s) => s.id === d.id);

            const isDisabled = !isSelected && selected.length >= maxSelected;

            return (
              <button
                key={d.id}
                onClick={() => !isDisabled && handleToggleSelect(d)}
                className={`
                    w-full relative overflow-hidden
                    flex items-center justify-between
                    rounded-xl text-left
                    text-[15px]
                    border transition
                    ${
                      isSelected
                        ? "bg-[#E7F3FF] border-[#137FEC] text-[#137FEC]"
                        : "bg-white border-slate-200 text-slate-800"
                    }
                    ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-slate-300 active:scale-[0.98]"
                    }
                  `}
              >
                <span className="flex-1 pl-4 py-4">{d.name}</span>

                {/* triangular corner when selected */}
                {onMultiSelect && isSelected && (
                  <div className="shrink-0 mr-3 flex items-center" aria-hidden>
                    <HiCheck
                      style={{ color: "#137FEC" }}
                      className="text-[18px]"
                      strokeWidth={1}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
