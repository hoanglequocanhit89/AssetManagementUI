export const getStatusLabel = (status: string): string => {
    switch (status) {
        case "WAITING":
            return "Waiting for Acceptance";
        case "ACCEPTED":
            return "Accepted";
        case "DECLINED":
            return "Declined";
        case "RETURNED":
            return "Returned";
        case "WAITING_FOR_RETURNING":
            return "Waiting for returning"
        default:
            return status;
    }
};

export const getStatusRequestReturningLabel = (status: string): string => {
    switch (status) {
        case "WAITING":
            return "Waiting for returning";
        case "COMPLETED":
            return "Completed";
        default:
            return status;
    }
}

export const getStatusAssetLabel = (status: string): string => {
    switch (status) {
        case "AVAILABLE":
            return "Available";
        case "NOT_AVAILABLE":
            return "Not Available";
        case "ASSIGNED":
            return "Assigned";
        case "WAITING":
            return "Waiting for Recycling"
        case "RECYCLED":
            return "Recycled";
        default:
            return status;
    }
}
