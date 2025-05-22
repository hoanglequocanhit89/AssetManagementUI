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

