export const generateNotificationMessage = (
    type: string,
    senderName: string,
    assetName: string
): string => {
    switch (type) {
        case "ASSIGNMENT_CREATED":
            return `${senderName} assigned an asset (${assetName}) for you`;
        case "RETURN_REQUEST_CREATED":
            return `${senderName} requested you return an asset (${assetName})`;
        case "RETURN_REQUEST_COMPLETED":
            return `${senderName} completed request for returning with asset ${assetName}`;
        case "RETURN_REQUEST_REJECTED":
            return `${senderName} rejected your returning request for asset (${assetName})`;
        case "ASSIGNMENT_ACCEPTED":
            return `${senderName} accepted your assignment with asset (${assetName})`;
        case "ASSIGNMENT_REJECTED":
            return `${senderName} rejected your assignment with asset (${assetName})`;
        case "USER_RETURN_REQUEST_CREATED":
            return `${senderName} requested for returning with asset (${assetName}) for you`;
        case "ANOTHER_ADMIN_RETURN_REQUEST_CREATED":
            return `${senderName} requested for returning with asset (${assetName}) for you`;
        case "ANOTHER_ADMIN_RETURN_REQUEST_COMPLETED":
            return `${senderName} completed request for returning with asset ${assetName}`;
        case "ANOTHER_ADMIN_RETURN_REQUEST_REJECTED":
            return `${senderName} rejected your returning request for asset (${assetName})`;
        default:
            return `${senderName} sent a notification about asset (${assetName})`;
    }
}