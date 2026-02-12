import type { CalendarSeason, LoginResult, Occasion, OccasionsSections, PaginatedStars, Season, Star } from "@/types/api";
declare function getToken(): string | null;
declare function clearToken(): void;
export declare function setOnUnauthorized(fn: () => void): void;
/** Auth */
export declare function login(email: string, password: string): Promise<LoginResult>;
/** Public calendar */
export declare function getCalendar(): Promise<CalendarSeason[]>;
/** Admin seasons */
export declare function listSeasons(): Promise<Season[]>;
export declare function getSeasonById(id: number): Promise<Season>;
export declare function createSeason(body: {
    name: string;
    colorHex: string;
    iconName: string;
    duration: string;
    sortOrder: number;
}): Promise<Season>;
export declare function updateSeason(id: number, body: Partial<{
    name: string;
    colorHex: string;
    iconName: string;
    duration: string;
    sortOrder: number;
}>): Promise<Season>;
export declare function deleteSeason(id: number): Promise<void>;
/** Admin stars */
export declare function listStars(params?: {
    page?: number;
    limit?: number;
    seasonId?: number;
}): Promise<PaginatedStars>;
export declare function getStarById(id: number): Promise<Star>;
export declare function createStar(body: {
    seasonId: number;
    name: string;
    startDate: string;
    endDate: string;
    description?: string | null;
    weatherInfo?: string | null;
    agriculturalInfo?: string[];
    tips?: string[];
}): Promise<Star>;
export declare function updateStar(id: number, body: Partial<{
    name: string;
    startDate: string;
    endDate: string;
    description: string | null;
    weatherInfo: string | null;
    agriculturalInfo: string[];
    tips: string[];
}>): Promise<Star>;
export declare function deleteStar(id: number): Promise<void>;
/** Public: get occasions sections (today, current month, next month, year) */
export declare function getOccasionsSections(): Promise<OccasionsSections>;
/** Admin occasions */
export declare function listOccasions(params?: {
    page?: number;
    limit?: number;
}): Promise<{
    occasions: Occasion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function getOccasionById(id: number): Promise<Occasion>;
export declare function createOccasion(body: {
    hijriMonth: number;
    hijriDay: number;
    title: string;
    prayerTitle: string;
    prayerText?: string | null;
}): Promise<Occasion>;
export declare function updateOccasion(id: number, body: Partial<{
    hijriMonth: number;
    hijriDay: number;
    title: string;
    prayerTitle: string;
    prayerText: string | null;
}>): Promise<Occasion>;
export declare function deleteOccasion(id: number): Promise<void>;
export { getToken, clearToken };
