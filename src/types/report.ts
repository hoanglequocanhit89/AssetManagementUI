export interface Report {
    id?: number;
    category: string;
    total: number;
    assigned: number;
    available: number;
    notAvailable: number;
    waiting: number;
    recycled: number;
}