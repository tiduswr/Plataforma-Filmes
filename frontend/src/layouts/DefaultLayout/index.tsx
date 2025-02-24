import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      setIsReady(true);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main ref={mainRef}>
        <Outlet />
      </main>
      {isReady && <Footer mainRef={mainRef} />}
    </div>
  );
};

export default DefaultLayout;
