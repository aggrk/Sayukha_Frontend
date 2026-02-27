"use client";

import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import api from "../../../../lib/api";
import DeleteDialog from "./DeleteDialog";
import { AlertCircle, Trash2, TriangleAlert } from "lucide-react";

export default function DeleteAccountCard() {
  const { logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg("");
    try {
      await api.delete("/users/delete-me");
      if (logout) logout();
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ??
          "Failed to delete account. Please try again.",
      );
      setIsDeleting(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      {showDialog && (
        <DeleteDialog
          onConfirm={handleDelete}
          onCancel={() => !isDeleting && setShowDialog(false)}
          isLoading={isDeleting}
        />
      )}

      <div className="border-gray-soft/50 overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-gray-soft/50 flex items-center gap-3 border-b px-6 py-5 sm:px-8">
          <div className="bg-red/10 flex h-9 w-9 items-center justify-center rounded-xl">
            <Trash2 size={16} className="text-red" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-black">
              Delete Account
            </h2>
            <p className="font-body text-dark/45 text-xs">
              Permanently remove your account and data
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 py-6 sm:px-8">
          {errorMsg && (
            <div className="border-red/20 bg-red/8 font-body text-red mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Warning box */}
          <div className="border-red/20 bg-red/6 mb-6 flex items-start gap-3 rounded-xl border p-4">
            <TriangleAlert size={17} className="text-red mt-0.5 shrink-0" />
            <div>
              <p className="font-heading text-red mb-1 text-sm font-semibold">
                Warning — This action is irreversible
              </p>
              <p className="font-body text-dark/60 text-sm leading-relaxed">
                Deleting your account will permanently erase all your personal
                data. Once confirmed, this cannot be reversed and you will be
                immediately logged out.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="bg-red hover:bg-red-dark flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200"
          >
            <Trash2 size={14} />
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
}
