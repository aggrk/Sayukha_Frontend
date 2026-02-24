"use client";

import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function UserOnly({ children }) {
  const { user, authChecked } = useContext(AuthenticationContext);
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user === null) {
      router.push("/login");
    }
  }, [user, authChecked]);

  if (!authChecked || !user)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral/50 backdrop-blur-sm z-50">
        <div className="text-center space-y-4">
          <LoadingSpinner />
        </div>
      </div>
    );

  return <>{children}</>;
}
