import { AlertCircle } from "lucide-react";

export default function FormField({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-dark text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red font-body mt-0.5 flex items-center gap-1 text-xs">
          <AlertCircle size={11} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
