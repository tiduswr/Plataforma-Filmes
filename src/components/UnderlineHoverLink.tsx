import { ReactNode } from "react";

interface UnderlineHoverLinkProps {
  title: string;
  icon: ReactNode;
  prepEndIcon?: boolean;
  hoverColor?: string;
  desc?: string;
}

const UnderlineHoverLink = ({ title, icon, prepEndIcon = false, hoverColor = "blue-700", desc = ""} : UnderlineHoverLinkProps) => {
  return (
    <>
      <a 
        href="#" 
        className={`relative flex flex-row gap-1 items-center group p-1 ${prepEndIcon ? "pr-2" : "pl-2"} transition duration-300 overflow-hidden justify-center`}
        aria-label={desc}
      >
        {prepEndIcon ? <>{icon}{title}</> : <>{title}{icon}</>}
        <span className={`absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-500 h-0.5 bg-${hoverColor}`}></span>
      </a>
    </>
  );
};

export default UnderlineHoverLink;
