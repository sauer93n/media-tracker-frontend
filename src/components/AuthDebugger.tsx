import { useEffect, useState } from "react";
import { apiClient, type AuthSession } from "../lib/api";

export const AuthDebugger = (): JSX.Element => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await apiClient.auth.getSession();
        setSession(session);
        setLastChecked(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = apiClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLastChecked(new Date().toLocaleTimeString());
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await apiClient.auth.getSession();
      setSession(session);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Status Debugger</h3>
      
      <div className="text-sm space-y-1">
        <div>
          <strong>Status:</strong>{" "}
          {loading ? (
            <span className="text-yellow-400">Checking...</span>
          ) : session?.authenticated ? (
            <span className="text-green-400">Authenticated</span>
          ) : (
            <span className="text-red-400">Not Authenticated</span>
          )}
        </div>
        
        {session?.user && (
          <div>
            <strong>User:</strong> {session.user.email}
          </div>
        )}
        
        <div>
          <strong>Last Checked:</strong> {lastChecked}
        </div>
      </div>

      <button
        onClick={handleRefresh}
        className="mt-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        disabled={loading}
      >
        {loading ? "Checking..." : "Refresh"}
      </button>
    </div>
  );
};
