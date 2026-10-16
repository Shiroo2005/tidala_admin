import type { District } from "@/shared/types/common.type";
import { HiChevronDown } from "react-icons/hi";

interface Props {
  handleClose: () => void;
  onMultiSelect: ((districts: District[]) => void) | undefined;
  selected: District[];
}

export const SelectDistrictHeader = ({
  handleClose,
  onMultiSelect,
  selected,
}: Props) => {
  return (
    <div className="relative pt-2 pb-3 border-b border-gray-100">
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-gray-300" />

      <div className="flex items-center px-4">
        <button onClick={handleClose} className="p-2 active:scale-95">
          <HiChevronDown className="text-[22px] text-slate-600" />
        </button>

        <div className="flex-1 text-center font-semibold text-[18px] text-slate-800">
          {onMultiSelect ? `Chọn phường (${selected.length})` : "Chọn phường"}
        </div>
      </div>
    </div>
  );
};
