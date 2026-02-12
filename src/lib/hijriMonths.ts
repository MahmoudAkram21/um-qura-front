/** Arabic names for Hijri months (1 = Muharram, 12 = Dhu al-Hijjah) */
export const HIJRI_MONTH_NAMES_AR: Record<number, string> = {
  1: "محرم",
  2: "صفر",
  3: "ربيع الأول",
  4: "ربيع الآخر",
  5: "جمادى الأولى",
  6: "جمادى الآخرة",
  7: "رجب",
  8: "شعبان",
  9: "رمضان",
  10: "شوال",
  11: "ذو القعدة",
  12: "ذو الحجة",
};

export const HIJRI_MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: HIJRI_MONTH_NAMES_AR[i + 1],
}));
