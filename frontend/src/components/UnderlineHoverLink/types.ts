import { ReactNode } from "react";

type UnderlineHoverLinkProps = {
  title: string;
  icon: ReactNode;
  prepEndIcon?: boolean;
  hoverColor?: string;
  desc?: string;
  url?: string
};

export type { UnderlineHoverLinkProps };
