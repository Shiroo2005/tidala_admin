import type { Province } from "@/shared/types/common.type";
import { HiCheck } from "react-icons/hi";
import ListSkeleton from "../ListSkeleton";

interface Props {
  isLoadingListProvinces: boolean;
  filtered: Province[];
  isErrorFetchListProvince: boolean;
  selectedProvince: Province | null;
  onSelect: (province: Province) => void;
  handleClose: () => void;
}

export const SelectProvinceList = ({
  isLoadingListProvinces,
  filtered,
  isErrorFetchListProvince,
  selectedProvince,
  onSelect,
  handleClose,
}: Props) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-24">
      {isLoadingListProvinces && <ListSkeleton />}

      {!isLoadingListProvinces && filtered.length === 0 && (
        <div className="mt-20 text-center text-slate-400 text-sm">
          Không tìm thấy tỉnh / thành phù hợp
        </div>
      )}

      {isErrorFetchListProvince && (
        <div className="mt-20 text-center text-slate-400 text-sm">
          Đã có lỗi xảy ra. Vui lòng thử lại sau.
        </div>
      )}

      {!isLoadingListProvinces && (
        <div className="space-y-2">
          {filtered.map((p) => {
            const isSelected = selectedProvince?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p);
                  handleClose();
                }}
                className={`
                    w-full
                    flex items-center justify-between
                    rounded-xl
                    px-4 py-4
                    text-left
                    border
                    shadow-sm
                    transition
                    active:scale-[0.98]
                    active:bg-slate-100
                    ${
                      isSelected
                        ? "bg-[#E7F3FF] border-[#137FEC] text-[#137FEC]"
                        : "bg-white border-slate-200 text-gray-900"
                    } 
                    `}
              >
                <span>{p.name}</span>
                {/* <span className="text-slate-400 text-sm">›</span> */}
                {isSelected && (
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
