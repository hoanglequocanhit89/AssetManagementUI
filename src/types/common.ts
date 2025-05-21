export interface BaseResponse<T> {
    data: {
        content: T[]
        totalPages: number;
        totalElements: number;
        size: number;
        page: number;
        empty: boolean;
    }
    message: string;
}

export interface BaseParams {
    page: number;
    size: number;
    sortBy: string;
    sortDir: string;
    [key: string]: string | number | undefined;
}