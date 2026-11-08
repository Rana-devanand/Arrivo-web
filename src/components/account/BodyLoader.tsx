import Image from "next/image";

/**
 * The dashboard's loader (`public/loader.svg`), shown in the middle of the body while its content loads. `body` fills the space
 * under the top bar and centres the loader in it; `inline` is a smaller one for a part of a screen (a list under a form).
 */
export function BodyLoader({ variant = "body" }: { variant?: "body" | "inline" }) {
  const size = variant === "body" ? 112 : 64;
  return (
    <div aria-busy="true" className={`grid place-items-center ${variant === "body" ? "min-h-[50dvh] flex-1" : "py-10"}`}>
      <p role="status" className="sr-only">
        Loading
      </p>
      <Image src="/loader.svg" alt="" width={size} height={size} unoptimized />
    </div>
  );
}
