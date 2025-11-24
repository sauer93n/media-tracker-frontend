
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReviewListSection } from "./sections/ReviewListSection";
import { apiClient, type User } from "../../lib/api/auth";

export const Main = (): JSX.Element => {
  const [, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await apiClient.auth.getSession(true);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.key]);

  return (
    <div className="bg-slate-900 h-full w-full min-w-[1440px] flex flex-col">
      <ReviewListSection />
    </div>
  );
};
