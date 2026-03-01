import { formatDate } from "../../../../lib/utils";
import {
  BarChart2,
  Bell,
  Briefcase,
  Check,
  Receipt,
  Trash2,
} from "lucide-react";

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  isMarkingRead,
  isDeleting,
}) {
  const getTypeConfig = (type) => {
    switch (type) {
      case "expense_added":
        return {
          icon: <Receipt size={16} />,
          label: "Expense",
          bg: "bg-green/10",
          color: "text-green",
          border: "border-green/20",
        };
      case "report_added":
        return {
          icon: <BarChart2 size={16} />,
          label: "Report",
          bg: "bg-blue-50",
          color: "text-blue-600",
          border: "border-blue-100",
        };
      case "supervisor_assigned":
        return {
          icon: <Briefcase size={16} />,
          label: "Project",
          bg: "bg-amber-50",
          color: "text-amber-600",
          border: "border-amber-100",
        };
      default:
        return {
          icon: <Bell size={16} />,
          label: "Notification",
          bg: "bg-gray-low-light",
          color: "text-dark",
          border: "border-gray-low-soft",
        };
    }
  };

  const isRead = !!notification.read_at;
  const config = getTypeConfig(notification.type);

  return (
    <div
      className={`group relative flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
        isRead
          ? "border-gray-low-soft bg-white opacity-60 hover:opacity-100"
          : "border-green/30 hover:border-green/50 bg-white-soft shadow-sm hover:shadow-md"
      }`}
    >
      {/* Unread left accent */}
      {!isRead && (
        <span className="bg-green absolute top-1/2 left-0 h-8 w-0.75 -translate-y-1/2 rounded-r-full" />
      )}

      {/* Type icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${config.bg} ${config.color} ${config.border}`}
      >
        {config.icon}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <p
          className={`font-body text-sm leading-snug ${isRead ? "text-dark/50" : "font-medium text-black"}`}
        >
          {notification.message}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {/* Type badge */}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
          >
            {config.label}
          </span>

          {/* Created date */}
          <span className="font-body text-dark/35 text-xs">
            {formatDate(notification.created_at)}
          </span>

          {/* Read indicator */}
          {isRead && (
            <span className="font-body text-dark/30 flex items-center gap-1 text-xs">
              <Check size={11} />
              Read {formatDate(notification.read_at)}
            </span>
          )}
        </div>
      </div>

      {/* Actions — visible on hover */}
      <div className="flex shrink-0 items-center gap-1 pt-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {!isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            disabled={isMarkingRead}
            title="Mark as read"
            className="text-green hover:bg-green/10 rounded-lg p-1.5 transition-colors disabled:opacity-40"
          >
            <Check size={15} />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          disabled={isDeleting}
          title="Delete"
          className="text-red hover:bg-red/10 cursor-pointer rounded-lg p-1.5 transition-colors disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
