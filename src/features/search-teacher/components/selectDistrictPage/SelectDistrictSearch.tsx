import type { Province } from "@/shared/types/common.type";
import type { Dispatch, SetStateAction } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface Props {
  setKeyword: Dispatch<SetStateAction<string>>;
  keyword: string;
  province: Province;
}

export const SelectDistrictSearch = ({
  keyword,
  province,
  setKeyword,
}: Props) => {
  return (
    <div className="px-4 py-4">
      <div
        className="
            flex items-center gap-3
            rounded-2xl bg-slate-100
            px-4 py-3
            focus-within:ring-2 focus-within:ring-slate-300
        "
      >
        <HiSearch className="text-slate-400 text-[18px]" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={`Tìm trong ${province.name}`}
          className="
            w-full bg-transparent outline-none
            text-[15px] text-slate-800
            placeholder:text-slate-400
        "
        />
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="text-slate-400 active:scale-90"
          >
            <HiX className="text-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
};
