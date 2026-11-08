import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { LoginButton } from "./LoginButton";
import { MobileMenu } from "./MobileMenu";
import { NavMenu } from "./NavMenu";

const links = [{ label: "Home", href: "/" }, ...siteConfig.nav];

export function Navbar() {
  return (
    <nav aria-label="Main" className="flex items-center gap-2 lg:contents">
      <NavMenu items={links} />
      {/* The wrapper hides them on phones: Button sets its own display, so a `hidden` class on the button itself loses. Phones have both in the menu sheet. */}
      <div className="hidden items-center gap-2 lg:flex lg:justify-self-end">
        <LoginButton />
        <Button href={siteConfig.downloadHref} size="xs" arrow className="shadow-md hover:shadow-lg">
          Download
        </Button>
      </div>
      <MobileMenu items={links} />
    </nav>
  );
}
