import DeleteAccountCard from "./components/DeleteAccountCard";
import ChangePasswordCard from "./components/ChangePasswordCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  return (
    <div className="bg-white-soft flex min-h-screen flex-col items-center px-4 py-10 sm:px-6 lg:px-10">
      {/* Page Header */}
      <div className="mb-8 flex w-full max-w-2xl items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Settings
          </h1>
          <p className="font-body text-dark/50 mt-1 text-sm">
            Manage your security settings and account preferences
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-dark hover:text-green-light inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-200"
        >
          <ArrowLeft size={13} />
          Back to Dashboard
        </Link>
      </div>

      {/* Cards Stack */}
      <div className="flex max-w-2xl flex-col gap-6">
        <ChangePasswordCard />
        <DeleteAccountCard />
      </div>
    </div>
  );
}
