/** API types for Agricultural Calendar & Stars */
export interface Season {
    id: number;
    name: string;
    colorHex: string;
    iconName: string;
    duration: string;
    sortOrder: number;
}
export interface Star {
    id: number;
    seasonId: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string | null;
    weatherInfo: string | null;
    agriculturalInfo: string[];
    tips: string[];
    createdAt: string;
    updatedAt: string;
    season?: Season;
}
export interface CalendarSeason extends Season {
    stars: Star[];
}
export interface LoginResult {
    token: string;
    admin: {
        id: number;
        email: string;
        name: string | null;
    };
}
export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}
export interface PaginatedStars {
    stars: Star[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface Occasion {
    id: number;
    hijriMonth: number;
    hijriDay: number;
    title: string;
    prayerTitle: string;
    prayerText: string | null;
    hijriDisplay?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface OccasionsSections {
    today: Occasion[];
    currentMonth: Occasion[];
    nextMonth: Occasion[];
    year: Occasion[];
}
