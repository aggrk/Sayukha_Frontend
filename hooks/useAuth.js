import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  return context;
};
