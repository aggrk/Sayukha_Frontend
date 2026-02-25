"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({
  id,
  placeholder,
  register: reg,
  name,
  rules,
  errors,
  watch,
}) {
  const [show, setShow] = useState(false);
  const hasError = !!errors?.[name];

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="off"
        {...reg(name, rules)}
        className={`bg-gray-light font-body focus:border-green focus:ring-green/25 w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-black transition-all duration-200 outline-none focus:ring-2 ${
          hasError ? "border-red bg-red/5" : "border-gray-soft"
        }`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="text-dark/40 hover:text-dark/70 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
