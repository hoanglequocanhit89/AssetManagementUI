export interface Asset {
    id: number,
    assetCode: string,
    name: string,
    categoryName: string,
    state: string;
    status: string;
    category: string;
    canDelete: boolean
};

export interface Category {
    id: number,
    name: string
}

export interface History {
    id: number,
    assignedTo: string,
    assignedBy: string,
    assignedDate: string,
    returnedDate: string
};

export interface Category {
    id: number,
    name: string
}

export interface AssetDetail extends Asset {
    category: string,
    status: string,
    installedDate: string,
    location: string,
    specification: string,
    assignments: History[]
}

export interface CreateAssetRequest {
    name: string;
    specification: string;
    installedDate: string;
    state: "AVAILABLE" | "NOT_AVAILABLE" | "ASSIGNED" | "WAITING" | "RECYCLED";
    categoryId?: number;
}

export type EditAssetRequest = Omit<CreateAssetRequest, "categoryId">

export interface EditAssetResponse extends CreateAssetRequest {
    assetCode: string;
    categoryName: string;
    locationName: string;
}
