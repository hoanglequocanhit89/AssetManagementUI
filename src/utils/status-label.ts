export const getStatusLabel = (status: string): string => {
    switch (status) {
        case "WAITING":
            return "Waiting for Acceptance";
        case "ACCEPTED":
            return "Accepted";
        case "DECLINED":
            return "Declined";
        default:
            return status;
    }
};
