import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { supabase } from "../../lib/supabase";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
