import { HiChevronDown } from "react-icons/hi";

interface Props {
  handleClose: () => void;
}

export const SelectProvinceHeader = ({ handleClose }: Props) => {
  return (
    <div className="relative pt-2 pb-3 border-b border-gray-100">
      <div className="flex items-center px-4">
        <button onClick={handleClose} className="p-2 active:scale-95">
          <HiChevronDown className="text-[22px] text-slate-600" />
        </button>

        <div className="flex-1 text-center font-semibold text-[18px] text-slate-800">
          Chọn tỉnh / thành phố
        </div>

        <div className="w-9" />
      </div>
    </div>
  );
};
