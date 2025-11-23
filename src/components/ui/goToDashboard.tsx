import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

export const GoToDashboard = (): JSX.Element => {
  const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center mt-4">
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2 h-auto">
            <ArrowLeft />
            <span className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">
                Go to Dashboard
            </span>
            </Button>
        </div>
    );
};