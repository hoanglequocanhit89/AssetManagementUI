export interface Notification {
    id: number;
    senderName: string,
    type: string,
    assetName: string,
    isRead: boolean,
    createdAt: string
}

export interface NotificationDropdownProps {
    notifications: Notification[];
}