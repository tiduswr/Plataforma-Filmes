import { RefObject, useEffect, useState } from "react";

type FooterProps = {
  mainRef: RefObject<HTMLElement | null>;
}

const Footer : React.FC<FooterProps> = ( { mainRef : { current : mainObject } } ) => {
  const [isPageShort, setIsPageShort] = useState(false);

  useEffect(() => {

    const checkHeight = () => {
      if (!mainObject) return;
      const totalHeight = mainObject.offsetHeight + mainObject.offsetTop;
      setIsPageShort(totalHeight <= window.innerHeight);
    };

    checkHeight();

    const observer = new ResizeObserver(() => checkHeight());
    if (mainObject) observer.observe(mainObject);

    window.addEventListener("resize", checkHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkHeight);
    };
  }, [mainObject]);

  return (
    <footer
      className={`w-full bg-white shadow-2xs border-t border-gray-200 py-4 ${
        isPageShort ? "absolute bottom-0 left-0" : "relative"
      }`}
    >
      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} PlatFilmes.</p>
      </div>
    </footer>
  );
};

export default Footer;
