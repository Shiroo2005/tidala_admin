import car from "@/assets/car.svg";
import tidalaLogo from "@/assets/Tidala_Logo.webp";

const getPublicImageUrl = (fileName: string) => fileName.includes("avatar") ? "/demo/avatar.svg" : "/demo/cover.svg";

export const imageUrls = {
  logo: {
    tidala: tidalaLogo,
  },
  fallback: {
    avatar: getPublicImageUrl("fallback-avatar.jpg"),
  },
  public: {
    faviconApp: "/favicon-app.png",
    appIcon512: "/app-icon-512.png",
    defaultPostThumbnail: getPublicImageUrl("default-post-thumbnail.jpg"),
    ogImage: "/og-image.png",
  },
  home: {
    searchDesktop: getPublicImageUrl("search_desktop_1600.jpg"),
    searchSlider: [
      getPublicImageUrl("SearchSectionSlider_1.jpeg"),
      getPublicImageUrl("SearchSectionSlider_2.jpeg"),
      getPublicImageUrl("SearchSectionSlider_3.jpeg"),
      getPublicImageUrl("SearchSectionSlider_4.jpeg"),
      getPublicImageUrl("SearchSectionSlider_6.jpeg"),
      getPublicImageUrl("SearchSectionSlider_7.jpeg"),
    ],
    promotions: {
      refund: getPublicImageUrl("Promotion_1_1200.jpg"),
      teacherNotebook: getPublicImageUrl("Promotion_4_1200.jpg"),
      shareExperience: getPublicImageUrl("Promotion_5_1200.jpg"),
    },
    topProvinces: {
      daNang: getPublicImageUrl("DaNang_900.jpg"),
      dongNai: getPublicImageUrl("DongNai.jpg"),
      haiPhong: getPublicImageUrl("HaiPhong.jpg"),
      haNoi: getPublicImageUrl("HaNoi_900.jpg"),
      tayNinh: getPublicImageUrl("TayNinh.jpg"),
      tphcm: getPublicImageUrl("TPHCM_900.jpg"),
    },
    areYouATeacher: getPublicImageUrl("AreYouATeacherSection_1.jpeg"),
  },
  notebook: {
    mascot: getPublicImageUrl("linh_vat.png"),
    car,
  },
  support: {
    supportPage: getPublicImageUrl("SupportPageImage.jpg"),
    signatureBuiGiaHuy: getPublicImageUrl("SignatureOfBuiGiaHuy.jpg"),
  },
} as const;
