// src/apps/shared/hooks/useAuth.js
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;