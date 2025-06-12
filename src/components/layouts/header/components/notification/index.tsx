import { useEffect, useRef, useState } from "react";
import { Notification, NotificationDropdownProps } from "../../../../../types/notification";
import { formatNotificationTime } from "../../../../../utils/time-notification-format";
import { useNavigate } from "react-router-dom";
import { generateNotificationMessage } from "../../../../../utils/notification-label";

const NotificationDropdown = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  userRole
}: NotificationDropdownProps) => {
  const [open, setOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickNotification = (id: number, assetName: string) => {
    onMarkAsRead(id);
    if (userRole === 'ADMIN') {
      navigate(`/manage-assignment?keyword=${encodeURIComponent(assetName)}`)
    }
  };

  return (
    <div ref={notifRef} className="relative text-white text-2xl ml-auto z-50">
      <button onClick={() => setOpen(!open)} className="relative focus:outline-none">
        <i className="fa-solid fa-bell"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[300px] max-h-[300px] overflow-y-auto bg-white border rounded shadow-lg z-10 py-2">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No notifications</p>
          ) : (
            <>
              <div className="px-4 pb-2 flex justify-end">
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={onMarkAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
              <div className="overflow-y-auto max-h-[240px]">
                {notifications
                  .filter(n => !n.isRead)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .length > 0 && (
                    <p className="px-4 py-1 text-sm font-semibold text-black bg-gray-100">Unread</p>
                  )}

                {notifications
                  .filter(n => !n.isRead)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleClickNotification(n.id, n.assetName)}
                      className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer text-black font-medium"
                    >
                      <p>{generateNotificationMessage(n.type, n.senderName, n.assetName, userRole)}</p>
                      <span className="text-xs text-gray-400">{formatNotificationTime(n.createdAt)}</span>
                    </div>
                  ))}

                {notifications
                  .filter(n => n.isRead)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .length > 0 && (
                    <p className="px-4 py-1 text-sm font-semibold text-gray-500 bg-gray-50">Read</p>
                  )}

                {notifications
                  .filter(n => n.isRead)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleClickNotification(n.id, n.assetName)}
                      className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer text-gray-500 font-normal"
                    >
                      <p>{generateNotificationMessage(n.type, n.senderName, n.assetName, userRole)}</p>
                      <span className="text-xs text-gray-400">{formatNotificationTime(n.createdAt)}</span>
                    </div>
                  ))}
              </div>
            </>
          )
          }
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;