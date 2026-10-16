import { FiLoader } from "react-icons/fi";

type LoadMoreButtonProps = {
  onClick: () => void;
  isLoading?: boolean;
  visible?: boolean;
};

export const LoadMoreButton = ({
  onClick,
  isLoading = false,
  visible = true,
}: LoadMoreButtonProps) => {
  if (!visible) return null;

  return (
    <div className="flex justify-center py-4">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`
          flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium
          rounded-xl border transition-all duration-200
          ${
            isLoading
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 shadow-sm"
          }
        `}
      >
        {isLoading && (
          <FiLoader size={16} className="animate-spin" />
        )}
        {isLoading ? "Đang tải..." : "Xem thêm"}
      </button>
    </div>
  );
};
