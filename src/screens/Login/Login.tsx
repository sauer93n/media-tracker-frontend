import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiClient } from "../../lib/api";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await apiClient.auth.getSession();
        if (session && session.authenticated) {
          setIsAlreadyLoggedIn(true);
          // Auto-redirect after 3 seconds or user can click button
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await apiClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#0c0d27] border-0 shadow-[4px_4px_4px_#00000040]">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="[font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal]">
                Log In
              </h1>
              <p className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">
                Welcome back to Media Tracker
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="[font-family:'Jura',Helvetica] font-normal text-red-500 text-sm tracking-[0] leading-[normal]">
                  {error}
                </p>
              </div>
            )}

            {isAlreadyLoggedIn && (
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
                <div className="flex flex-col gap-3 text-center">
                  <p className="[font-family:'Jura',Helvetica] font-medium text-green-500 text-sm tracking-[0] leading-[normal]">
                    You are already logged in!
                  </p>
                  <p className="[font-family:'Jura',Helvetica] font-light text-green-400 text-xs tracking-[0] leading-[normal]">
                    Redirecting to dashboard in 3 seconds...
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-green-600 hover:bg-green-700 rounded-lg px-6 py-2 h-auto mt-2"
                  >
                    <span className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">
                      Go to Dashboard Now
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {isCheckingAuth && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7167fa]"></div>
                <span className="ml-3 [font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">
                  Checking authentication status...
                </span>
              </div>
            )}

            {!isCheckingAuth && !isAlreadyLoggedIn && (
              <>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#1a1b3a] border border-[#2b41ae] rounded-lg px-4 py-3 [font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] focus:outline-none focus:border-[#7167fa]"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#1a1b3a] border border-[#2b41ae] rounded-lg px-4 py-3 [font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] focus:outline-none focus:border-[#7167fa]"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#00116a] rounded-lg px-8 py-3 h-auto hover:opacity-90 hover:bg-[#00116a]"
              >
                <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
                  {loading ? "Logging in..." : "Log In"}
                </span>
              </Button>
              </form>

              <div className="flex justify-center gap-1">
                <span className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                  Don't have an account?
                </span>
                <button
                  onClick={() => navigate("/signup")}
                  className="[font-family:'Jura',Helvetica] font-normal text-[#7167fa] text-sm tracking-[0] leading-[normal] hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Sign up
                </button>
              </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
