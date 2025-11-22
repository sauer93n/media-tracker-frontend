export const FooterSection = (): JSX.Element => {
  return (
    <footer className="flex w-full items-center justify-between px-40 py-6 bg-transparent backdrop-blur-[5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5px)_brightness(100%)] bg-[linear-gradient(90deg,rgba(6,10,17,0.6)_55%,rgba(44,65,174,0.6)_98%)] mt-auto">
      <div className="flex flex-col gap-2">
        <h3 className="[font-family:'Jura',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
          Media Tracker
        </h3>
        <p className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal] opacity-80">
          Track and review your favorite movies, TV shows, and more
        </p>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col gap-2">
          <h4 className="[font-family:'Jura',Helvetica] font-semibold text-white text-sm tracking-[0] leading-[normal]">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-1">
            <li>
              <a href="#" className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal] opacity-80 hover:opacity-100 transition-opacity">
                About
              </a>
            </li>
            <li>
              <a href="#" className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal] opacity-80 hover:opacity-100 transition-opacity">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal] opacity-80 hover:opacity-100 transition-opacity">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="[font-family:'Jura',Helvetica] font-semibold text-white text-sm tracking-[0] leading-[normal]">
            Contact
          </h4>
          <ul className="flex flex-col gap-1">
            <li>
              <a href="#" className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal] opacity-80 hover:opacity-100 transition-opacity">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="[font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal] opacity-80 hover:opacity-100 transition-opacity">
                Feedback
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="[font-family:'Jura',Helvetica] font-light text-white text-xs tracking-[0] leading-[normal] opacity-60">
          © {new Date().getFullYear()} Media Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
