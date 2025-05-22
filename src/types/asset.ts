export interface Asset {
    id: number,
    assetCode: string,
    name: string,
    categoryName: string,
    state: string
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
    installedDate: string,
    location: string,
    specification: string,
    assignments: History[]
}


// id: number;
// name: string;
// assetCode: string;
// specification: string;
// installedDate: string;
// state: "AVAILABLE" | "NOT_AVAILABLE" | "ASSIGNED" | "WAITING" | "RECYCLED";
// categoryId ?: number;
// categoryName: string;
// locationName: string;
// }

// export interface CreateAssetRequest = Omit<Asset, "id" | "assetCode" | "categoryName" | "locationName">
export interface CreateAssetRequest {
    name: string;
    specification: string;
    installedDate: string;
    state: "AVAILABLE" | "NOT_AVAILABLE" | "ASSIGNED" | "WAITING" | "RECYCLED";
    categoryId?: number;
}
