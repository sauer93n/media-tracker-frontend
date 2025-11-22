import { LogInIcon, LogOutIcon, UserPlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { apiClient, type User } from "../../../../lib/api/auth";

interface NavigationSectionProps {
  user: User | null;
  loading: boolean;
}

export const NavigationSection = ({ user, loading }: NavigationSectionProps): JSX.Element => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await apiClient.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="flex w-full items-center justify-between px-40 py-3 bg-transparent backdrop-blur-[5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5px)_brightness(100%)] bg-[linear-gradient(90deg,rgba(6,10,17,0.6)_55%,rgba(44,65,174,0.6)_98%)]">
      <div className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
        <a href="/">Media Tracker</a>
      </div>

      <nav className="inline-flex items-center justify-center gap-2.5">
        {!loading && (
          <>
            {user ? (
              <div className="inline-flex items-center gap-4">
                <span className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                  {user.username}
                </span>
                <Button
                  onClick={handleSignOut}
                  className="bg-[#00116a] rounded-lg inline-flex items-center justify-center gap-2.5 p-2 h-auto hover:opacity-90"
                >
                  <LogOutIcon className="w-6 h-6 text-white" />
                  <span className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                    Sign out
                  </span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-[#2b41ae] rounded-lg inline-flex items-center justify-center gap-2.5 p-2 h-auto hover:opacity-90"
                >
                  <UserPlusIcon className="w-6 h-6 text-white" />
                  <span className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                    Sign up
                  </span>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-[#00116a] rounded-lg inline-flex items-center justify-center gap-2.5 p-2 h-auto hover:opacity-90"
                >
                  <LogInIcon className="w-6 h-6 text-white" />
                  <span className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                    Log in
                  </span>
                </Button>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
};
