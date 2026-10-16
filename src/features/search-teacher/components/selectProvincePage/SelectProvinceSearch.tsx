import type { Dispatch, SetStateAction } from "react";
import { HiSearch } from "react-icons/hi";

interface Props {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}

export const SelectProvinceSearch = ({ keyword, setKeyword }: Props) => {
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
          placeholder="Tìm tỉnh hoặc thành phố..."
          className="
              w-full bg-transparent outline-none
              text-[15px] text-slate-800
              placeholder:text-slate-400
            "
        />
      </div>
    </div>
  );
};
