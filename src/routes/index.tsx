import * as React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "src/pages";
import Login from "src/pages/auth/login";
import ForgotPassword from "src/pages/forgot-password";
import ProfileSetup from "src/pages/profile-setup";
import ResetPassword from "src/pages/reset-password";
import { getIsLoggedIn } from "src/store/selectors/entities/auth";
import { AIChatbot } from "src/components/ai-chatbot";

export function isArrayWithLength(arr: TArrayOfObjects) {
  return Array.isArray(arr) && arr.length;
}

// Dashboard wrapper component that includes the chatbot
const DashboardWrapper: React.FC = () => {
  return (
    <>
      <Dashboard />
      <AIChatbot />
    </>
  );
};

export const Router: React.FC = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/*" element={<DashboardWrapper />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Login />} />
            <Route path="/login" element={<Login />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/account-setup" element={<ProfileSetup />}></Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
