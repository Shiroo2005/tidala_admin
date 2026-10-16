import { APP_PATHS } from "@/shared/constants/appPaths";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-slate-50">
      {/* background glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-400 blur-[150px] opacity-30 -top-20 -left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-400 blur-[150px] opacity-30 bottom-0 right-0"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center relative z-10">
        {/* illustration */}
        <div className="flex justify-center">
          <img
            src="https://cdn-dev.tidala.vn/public/404.svg"
            alt="404 illustration"
            width={420}
            height={380}
            className="drop-shadow-xl"
          />
        </div>

        {/* text */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Xỉn rồi, về nhà đi bạn êy 🍻
          </h1>

          <p className="text-gray-500 mt-5 text-lg max-w-md mx-auto md:mx-0">
            Trang bạn đang tìm có vẻ đã biến mất. Có thể bạn nhập sai đường dẫn
            hoặc nó đã được chuyển sang nơi khác.
          </p>

          <button
            onClick={() => navigate(APP_PATHS.HOME, { replace: true })}
            className="inline-block mt-8 px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
