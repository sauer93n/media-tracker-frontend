import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { supabase } from "../../lib/supabase";

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
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
                Sign Up
              </h1>
              <p className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">
                Create your Media Tracker account
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="[font-family:'Jura',Helvetica] font-normal text-red-500 text-sm tracking-[0] leading-[normal]">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                <p className="[font-family:'Jura',Helvetica] font-normal text-green-500 text-sm tracking-[0] leading-[normal]">
                  Account created successfully! Redirecting to login...
                </p>
              </div>
            )}

            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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

              <div className="flex flex-col gap-2">
                <label className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-[#1a1b3a] border border-[#2b41ae] rounded-lg px-4 py-3 [font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] focus:outline-none focus:border-[#7167fa]"
                  placeholder="Confirm your password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#2b41ae] rounded-lg px-8 py-3 h-auto hover:opacity-90 hover:bg-[#2b41ae]"
              >
                <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
                  {loading ? "Creating account..." : "Sign Up"}
                </span>
              </Button>
            </form>

            <div className="flex justify-center gap-1">
              <span className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                Already have an account?
              </span>
              <button
                onClick={() => navigate("/login")}
                className="[font-family:'Jura',Helvetica] font-normal text-[#7167fa] text-sm tracking-[0] leading-[normal] hover:underline bg-transparent border-0 cursor-pointer"
              >
                Log in
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
