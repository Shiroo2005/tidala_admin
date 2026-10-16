import Skeleton from "@mui/material/Skeleton";

const ListSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="
            w-full
            flex items-center justify-between
            rounded-xl
            px-4 py-4
            border border-slate-200
          "
        >
          <Skeleton variant="text" width={180} height={16} />

          <Skeleton variant="circular" width={18} height={18} />
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;
