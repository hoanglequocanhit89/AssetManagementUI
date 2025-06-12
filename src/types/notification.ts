import { UserRole } from "./auth";

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
    unreadCount: number;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    userRole: UserRole
}