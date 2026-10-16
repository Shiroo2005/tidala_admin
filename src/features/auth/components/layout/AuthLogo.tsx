import { imageUrls } from "@/shared/constants/imageUrls";
export const AuthLogo = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <img src={imageUrls.public.faviconApp} alt="Tidala Logo" className="w-20 h-20" />
      <div className="text-center justify-start text-brand text-4xl font-black font-['Lexend'] tracking-widest">
        TIDALA
      </div>
    </div>
  );
};
