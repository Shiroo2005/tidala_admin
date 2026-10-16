import { motion } from "framer-motion";

export const DashboardSkeletons = () => {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-10 w-10 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>
      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-96 lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
      </div>
    </motion.div>
  );
};
