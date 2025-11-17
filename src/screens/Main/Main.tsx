import React from "react";
import { NavigationSection } from "./sections/NavigationSection";
import { ReviewListSection } from "./sections/ReviewListSection";

export const Main = (): JSX.Element => {
  return (
    <div className="bg-slate-900 w-full min-w-[1440px] flex flex-col">
      <NavigationSection />
      <ReviewListSection />
    </div>
  );
};
