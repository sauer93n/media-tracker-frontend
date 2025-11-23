import React from "react";
import { GoToDashboard } from "../ui/goToDashboard";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps): JSX.Element => {
  return (
    <div className="bg-slate-900 w-full h-screen flex flex-col items-center px-4">
          <div className="w-full flex flex-start">
            <GoToDashboard />
          </div>
        <div className="w-full flex flex-1 justify-center items-center">
          {children}
        </div>
    </div>  
  );
};