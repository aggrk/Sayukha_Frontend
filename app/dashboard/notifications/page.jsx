"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Receipt,
  BarChart2,
  Briefcase,
  Check,
  CheckCheck,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import api from "../../../lib/api";
import { formatDate } from "../../../lib/utils";
import Link from "next/link";

// ── Type Config ───────────────────────────────────────────────────────────────
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

// ── Filter Tab ────────────────────────────────────────────────────────────────
const FilterTab = ({ label, active, count, onClick }) => (
  <button
    onClick={onClick}
    className={`font-body flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-green text-white shadow-sm"
        : "text-dark hover:bg-gray-low-light"
    }`}
  >
    {label}
    {count > 0 && (
      <span
        className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? "bg-white/25 text-white" : "bg-gray-low-soft text-dark"}`}
      >
        {count}
      </span>
    )}
  </button>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="border-gray-low-soft flex animate-pulse items-start gap-4 rounded-xl border bg-white p-4">
    <div className="bg-gray-low-soft h-9 w-9 shrink-0 rounded-full" />
    <div className="flex-1 space-y-2 py-0.5">
      <div className="bg-gray-low-soft h-3.5 w-3/4 rounded" />
      <div className="bg-gray-low-soft h-3 w-1/3 rounded" />
    </div>
    <div className="bg-gray-low-soft h-5 w-14 rounded-full" />
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ filter }) => (
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

// ── Notification Card ─────────────────────────────────────────────────────────
const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  isMarkingRead,
  isDeleting,
}) => {
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
          className="text-red hover:bg-red/10 rounded-lg p-1.5 transition-colors disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useFetch(
    "notifications",
    "/notifications",
  );

  const notifications = data?.data || data || [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const readCount = notifications.filter((n) => !!n.read_at).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read_at;
    if (filter === "read") return !!n.read_at;
    return true;
  });

  // ── Mutations ──
  const markAsRead = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  const deleteNotification = useMutation({
    mutationFn: (id) => api.delete(`/notifications/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  const markAllAsRead = useMutation({
    mutationFn: () => api.patch("/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  return (
    <div className="font-body bg-gray-low-light min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* ── Back Link ── */}
        <Link
          href="/dashboard"
          className="font-body group text-dark/50 hover:text-green mb-5 inline-flex items-center gap-1.5 text-sm transition-colors duration-150"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          />
          Back to Dashboard
        </Link>

        {/* ── Header ── */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-black">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-green rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="font-body text-dark/45 mt-0.5 text-sm">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="font-body bg-green active:bg-green hover:bg-green-light flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-60"
            >
              <CheckCheck size={15} />
              {markAllAsRead.isPending ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="border-gray-low-soft mb-4 flex w-fit items-center gap-1.5 rounded-xl border bg-white p-1.5 shadow-sm">
          <FilterTab
            label="All"
            active={filter === "all"}
            count={notifications.length}
            onClick={() => setFilter("all")}
          />
          <FilterTab
            label="Unread"
            active={filter === "unread"}
            count={unreadCount}
            onClick={() => setFilter("unread")}
          />
          <FilterTab
            label="Read"
            active={filter === "read"}
            count={readCount}
            onClick={() => setFilter("read")}
          />
        </div>

        {/* ── Card Container ── */}
        <div className="border-gray-low-soft overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* Error */}
          {isError && (
            <div className="p-8 text-center">
              <p className="font-body text-red text-sm">
                {error?.response?.data?.message ||
                  "Failed to load notifications. Please try again."}
              </p>
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="space-y-2.5 p-4">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* List */}
          {!isLoading && !isError && (
            <>
              {filteredNotifications.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <div className="space-y-2 p-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={(id) => markAsRead.mutate(id)}
                      onDelete={(id) => deleteNotification.mutate(id)}
                      isMarkingRead={markAsRead.isPending}
                      isDeleting={deleteNotification.isPending}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer count */}
        {!isLoading && !isError && filteredNotifications.length > 0 && (
          <p className="font-body text-dark/30 mt-4 text-center text-xs">
            Showing {filteredNotifications.length} notification
            {filteredNotifications.length > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
