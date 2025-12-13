import React, { useState, useEffect, JSX } from "react";
import { useLocation } from "react-router-dom";
import { NavigationSection } from "../../screens/Main/sections/NavigationSection";
import { apiClient, type User } from "../../lib/api/auth";
import { Toaster } from "react-hot-toast";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // This effect fetches the user session on every navigation
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await apiClient.auth.getSession(true);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("[PageLayout] Error checking auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.key]); // Re-runs whenever the route changes

  return (
    <div className="bg-slate-900 h-screen w-full min-w-[1440px] flex flex-col">
      <NavigationSection user={user} loading={loading} />
      <main className="flex-1 h-full w-full flex flex-col overflow-hidden">
        {children}
        <div>
          <Toaster position="bottom-right" toasterId="page-layout" />
        </div>
      </main>
    </div>
  );
};