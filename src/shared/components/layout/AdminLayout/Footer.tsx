export default function Footer() {
  return (
    <footer className="bg-transparent py-6 px-4 md:px-8 border-t border-slate-200/60 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="font-semibold text-slate-700">Tidala Admin.</span>
          <span>Đã đăng ký bản quyền.</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm">
          <a
            href="#!"
            className="text-slate-500 hover:text-primary transition-colors font-medium"
          >
            Hỗ trợ kĩ thuật
          </a>

          <a
            href="#!"
            className="text-slate-500 hover:text-primary transition-colors font-medium"
          >
            Tài liệu
          </a>
        </div>
      </div>
    </footer>
  );
}
