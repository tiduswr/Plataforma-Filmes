import clsx from "clsx";
import { UnderlineHoverLinkProps } from "./types";

const UnderlineHoverLink : React.FC<UnderlineHoverLinkProps> = ({
  title,
  icon,
  prepEndIcon = false,
  hoverColor = "bg-blue-700",
  desc = "",
}) => {
  return (
    <>
      <a
        href="#"
        className={clsx(
          "relative cursor-pointer flex flex-row gap-1 items-center group p-1 transition duration-300 overflow-hidden justify-center",
          prepEndIcon ? "pr-2" : "pl-2"
        )}
        aria-label={desc}
      >
        {prepEndIcon ? <>{icon}{title}</> : <>{title}{icon}</>}
        <span
          className={clsx(
            "absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-500 h-0.5",
            hoverColor
          )}
        ></span>
      </a>
    </>
  );
};

export default UnderlineHoverLink;