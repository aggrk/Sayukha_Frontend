import { Loader2, Trash2, X } from "lucide-react";

export default function DeleteDialog({ onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 border-gray-soft/60 w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl duration-200">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Trash2 size={18} className="text-red" />
            </div>
            <h3 className="font-heading text-base font-bold text-black">
              Delete Account
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-dark/40 hover:text-dark/70 cursor-pointer transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <p className="font-body text-dark/60 mb-6 text-sm leading-relaxed">
          Are you sure you want to permanently delete your account? This action{" "}
          <span className="text-red font-semibold">cannot be undone</span> and
          all your data will be permanently removed from our servers.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red hover:bg-red-dark flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Yes, Delete My Account"
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-light text-dark/70 hover:bg-gray-soft flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
