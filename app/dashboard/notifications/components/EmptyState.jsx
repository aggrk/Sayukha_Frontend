import { Bell } from "lucide-react";

export default function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-low-light text-dark/25 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <Bell size={24} />
      </div>
      <p className="font-heading text-dark/40 text-sm font-semibold">
        {filter === "unread"
          ? "No unread notifications"
          : filter === "read"
            ? "No read notifications"
            : "No notifications yet"}
      </p>
      <p className="font-body text-dark/30 mt-1 text-xs">
        {filter === "all" ? "You're all caught up!" : "Check back later."}
      </p>
    </div>
  );
}
