import { siteConfig } from "@/config/site";
import { BrandIcon } from "./BrandIcon";
import { Button } from "./Button";

type StoreButtonsProps = {
  className?: string;
  inverse?: boolean;
  size?: "md" | "sm";
};

export function StoreButtons({ className = "", inverse = false, size = "md" }: StoreButtonsProps) {
  const { appStore, playStore } = siteConfig.stores;
  const small = size === "sm";
  const icon = small ? "size-5" : "size-7";
  const caption = small ? "text-[9px]" : "text-[11px]";
  const name = small ? "text-sm" : "text-lg";
  return (
    <div className={`flex flex-wrap ${small ? "gap-2" : "gap-3"} ${className}`}>
      <Button href={appStore.href} variant={inverse ? "inverse" : "primary"} size={size} className="justify-start">
        <BrandIcon name="apple" className={icon} />
        <span className="flex flex-col text-left leading-tight">
          <span className={`whitespace-nowrap font-medium uppercase tracking-wide ${caption}`}>Download on the</span>
          <span className={`whitespace-nowrap font-bold ${name}`}>App Store</span>
          <span className="sr-only"> (Arrivo for iPhone)</span>
        </span>
      </Button>
      <Button href={playStore.href} variant={inverse ? "inverseOutline" : "outline"} size={size} className="justify-start">
        <BrandIcon name="googlePlay" className={icon} />
        <span className="flex flex-col text-left leading-tight">
          <span className={`whitespace-nowrap font-medium uppercase tracking-wide ${caption}`}>Get it on</span>
          <span className={`whitespace-nowrap font-bold ${name}`}>Google Play</span>
          <span className="sr-only"> (Arrivo for Android)</span>
        </span>
      </Button>
    </div>
  );
}
