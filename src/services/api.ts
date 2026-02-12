import axios, { type AxiosError } from "axios";
import type {
  ApiResponse,
  CalendarSeason,
  LoginResult,
  Occasion,
  OccasionsSections,
  PaginatedStars,
  Prayer,
  Season,
  Star,
} from "@/types/api";

/** Backend returns snake_case for stars/calendar; normalize to frontend shape */
interface RawStarItem {
  id: number;
  name: string;
  seasonId?: number;
  season_name?: string;
  start_date: string;
  end_date: string;
  description?: string | null;
  weather_info?: string | null;
  agricultural_info?: string[];
  tips?: string[];
}
function rawStarToStar(r: RawStarItem, seasonId?: number, seasonName?: string): Star {
  return {
    id: r.id,
    seasonId: seasonId ?? r.seasonId ?? 0,
    name: r.name,
    startDate: r.start_date,
    endDate: r.end_date,
    description: r.description ?? null,
    weatherInfo: r.weather_info ?? null,
    agriculturalInfo: Array.isArray(r.agricultural_info) ? r.agricultural_info : [],
    tips: Array.isArray(r.tips) ? r.tips : [],
    createdAt: "",
    updatedAt: "",
    season: seasonName != null ? { id: seasonId ?? 0, name: seasonName, colorHex: "", iconName: "", duration: "", sortOrder: 0 } : undefined,
  };
}
interface RawCalendarSeason {
  id: number;
  season_name: string;
  duration: string;
  color_hex: string;
  icon_name: string;
  stars: RawStarItem[];
}
function rawCalendarToSeason(raw: RawCalendarSeason): CalendarSeason {
  return {
    id: raw.id,
    name: raw.season_name,
    colorHex: raw.color_hex,
    iconName: raw.icon_name,
    duration: raw.duration,
    sortOrder: 0,
    stars: raw.stars.map((s) => rawStarToStar(s, raw.id, raw.season_name)),
  };
}

/** API base URL. Set VITE_API_BASE_URL in .env (e.g. https://api.example.com/api/v1) or leave unset for same-origin /api/v1. */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

function clearToken(): void {
  localStorage.removeItem("admin_token");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401) {
      clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(err);
  }
);

/** Auth */
export async function login(email: string, password: string): Promise<LoginResult> {
  const { data } = await api.post<ApiResponse<LoginResult>>("/auth/login", {
    email,
    password,
  });
  return data.data;
}

/** Public calendar */
export async function getCalendar(): Promise<CalendarSeason[]> {
  const { data } = await api.get<ApiResponse<RawCalendarSeason[]>>("/stars/calendar");
  return (data.data as RawCalendarSeason[]).map(rawCalendarToSeason);
}

/** Admin seasons */
export async function listSeasons(): Promise<Season[]> {
  const { data } = await api.get<ApiResponse<Season[]>>("/admin/seasons");
  return data.data;
}

export async function getSeasonById(id: number): Promise<Season> {
  const { data } = await api.get<ApiResponse<Season>>(`/admin/seasons/${id}`);
  return data.data;
}

export async function createSeason(body: {
  name: string;
  colorHex: string;
  iconName: string;
  duration: string;
  sortOrder: number;
}): Promise<Season> {
  const { data } = await api.post<ApiResponse<Season>>("/admin/seasons", body);
  return data.data;
}

export async function updateSeason(
  id: number,
  body: Partial<{
    name: string;
    colorHex: string;
    iconName: string;
    duration: string;
    sortOrder: number;
  }>
): Promise<Season> {
  const { data } = await api.put<ApiResponse<Season>>(`/admin/seasons/${id}`, body);
  return data.data;
}

export async function deleteSeason(id: number): Promise<void> {
  await api.delete(`/admin/seasons/${id}`);
}

/** Admin stars */
export async function listStars(params?: {
  page?: number;
  limit?: number;
  seasonId?: number;
}): Promise<PaginatedStars> {
  const { data } = await api.get<ApiResponse<{ stars: RawStarItem[]; total: number; page: number; limit: number; totalPages: number }>>("/admin/stars", {
    params,
  });
  const d = data.data;
  return {
    stars: d.stars.map((s) => rawStarToStar(s, s.seasonId, s.season_name)),
    total: d.total,
    page: d.page,
    limit: d.limit,
    totalPages: d.totalPages,
  };
}

export async function getStarById(id: number): Promise<Star> {
  const { data } = await api.get<ApiResponse<RawStarItem>>(`/admin/stars/${id}`);
  const r = data.data as RawStarItem;
  return rawStarToStar(r, r.seasonId, r.season_name);
}

export async function createStar(body: {
  seasonId: number;
  name: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  weatherInfo?: string | null;
  agriculturalInfo?: string[];
  tips?: string[];
}): Promise<Star> {
  const { data } = await api.post<ApiResponse<Star>>("/admin/stars", body);
  return data.data;
}

export async function updateStar(
  id: number,
  body: Partial<{
    name: string;
    startDate: string;
    endDate: string;
    description: string | null;
    weatherInfo: string | null;
    agriculturalInfo: string[];
    tips: string[];
  }>
): Promise<Star> {
  const { data } = await api.put<ApiResponse<Star>>(`/admin/stars/${id}`, body);
  return data.data;
}

export async function deleteStar(id: number): Promise<void> {
  await api.delete(`/admin/stars/${id}`);
}

/** Occasions: raw shape from backend (snake_case) */
interface RawOccasion {
  id: number;
  hijri_month: number;
  hijri_day: number;
  title: string;
  prayer_title: string;
  prayer_text: string | null;
  hijri_display?: string;
  created_at?: string;
  updated_at?: string;
}

function rawOccasionToOccasion(r: RawOccasion): Occasion {
  return {
    id: r.id,
    hijriMonth: r.hijri_month,
    hijriDay: r.hijri_day,
    title: r.title,
    prayerTitle: r.prayer_title,
    prayerText: r.prayer_text ?? null,
    hijriDisplay: r.hijri_display,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Public: get occasions sections (today, current month, next month, year) */
export async function getOccasionsSections(): Promise<OccasionsSections> {
  const { data } = await api.get<ApiResponse<{
    today: RawOccasion[];
    currentMonth: RawOccasion[];
    nextMonth: RawOccasion[];
    year: RawOccasion[];
  }>>("/occasions");
  const d = data.data;
  return {
    today: d.today.map(rawOccasionToOccasion),
    currentMonth: d.currentMonth.map(rawOccasionToOccasion),
    nextMonth: d.nextMonth.map(rawOccasionToOccasion),
    year: d.year.map(rawOccasionToOccasion),
  };
}

/** Admin occasions */
export async function listOccasions(params?: { page?: number; limit?: number }): Promise<{
  occasions: Occasion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const { data } = await api.get<ApiResponse<{
    occasions: RawOccasion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>>("/admin/occasions", { params });
  const d = data.data;
  return {
    occasions: d.occasions.map(rawOccasionToOccasion),
    total: d.total,
    page: d.page,
    limit: d.limit,
    totalPages: d.totalPages,
  };
}

export async function getOccasionById(id: number): Promise<Occasion> {
  const { data } = await api.get<ApiResponse<RawOccasion>>(`/admin/occasions/${id}`);
  return rawOccasionToOccasion(data.data);
}

export async function createOccasion(body: {
  hijriMonth: number;
  hijriDay: number;
  title: string;
  prayerTitle: string;
  prayerText?: string | null;
}): Promise<Occasion> {
  const { data } = await api.post<ApiResponse<RawOccasion>>("/admin/occasions", body);
  return rawOccasionToOccasion(data.data);
}

export async function updateOccasion(
  id: number,
  body: Partial<{
    hijriMonth: number;
    hijriDay: number;
    title: string;
    prayerTitle: string;
    prayerText: string | null;
  }>
): Promise<Occasion> {
  const { data } = await api.put<ApiResponse<RawOccasion>>(`/admin/occasions/${id}`, body);
  return rawOccasionToOccasion(data.data);
}

export async function deleteOccasion(id: number): Promise<void> {
  await api.delete(`/admin/occasions/${id}`);
}

/** Admin prayers (backend returns snake_case) */
interface RawPrayer {
  id: number;
  text: string;
  created_at?: string;
  updated_at?: string;
}

function rawPrayerToPrayer(r: RawPrayer): Prayer {
  return {
    id: r.id,
    text: r.text,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listPrayers(params?: { page?: number; limit?: number }): Promise<{
  prayers: Prayer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const { data } = await api.get<ApiResponse<{
    prayers: RawPrayer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>>("/admin/prayers", { params });
  const d = data.data;
  return {
    prayers: d.prayers.map(rawPrayerToPrayer),
    total: d.total,
    page: d.page,
    limit: d.limit,
    totalPages: d.totalPages,
  };
}

export async function getPrayerById(id: number): Promise<Prayer> {
  const { data } = await api.get<ApiResponse<RawPrayer>>(`/admin/prayers/${id}`);
  return rawPrayerToPrayer(data.data);
}

export async function createPrayer(body: { text: string }): Promise<Prayer> {
  const { data } = await api.post<ApiResponse<RawPrayer>>("/admin/prayers", body);
  return rawPrayerToPrayer(data.data);
}

export async function updatePrayer(id: number, body: { text: string }): Promise<Prayer> {
  const { data } = await api.put<ApiResponse<RawPrayer>>(`/admin/prayers/${id}`, body);
  return rawPrayerToPrayer(data.data);
}

export async function deletePrayer(id: number): Promise<void> {
  await api.delete(`/admin/prayers/${id}`);
}

export { getToken, clearToken };
