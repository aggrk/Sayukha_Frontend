"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, ArrowLeft } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import api from "../../../lib/api";
import Link from "next/link";
import FilterTab from "./components/FilterTab";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import NotificationCard from "./components/NotificationCard";

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
                : "There is no notifications yet!"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="font-body bg-green active:bg-green hover:bg-green-light flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-60"
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
