import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        target?: string;
        stroke?: string;
        state?: string;
        intro?: string;
        loading?: string;
        "current-color"?: string;
      };
    }
  }
}
