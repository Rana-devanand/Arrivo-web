import Image from "next/image";

type AvatarProps = {
  tone: 1 | 2 | 3;
  src?: string;
};

const toneClasses = {
  1: "bg-secondary text-secondary-foreground",
  2: "bg-primary text-primary-foreground",
  3: "bg-accent text-accent-foreground",
} as const;

/** Illustrated silhouette used until real, permitted customer photos are added through `src`. */
export function Avatar({ tone, src }: AvatarProps) {
  if (src) {
    return <Image src={src} alt="" width={56} height={56} className="size-14 rounded-full object-cover" />;
  }
  return (
    <span aria-hidden="true" className={`inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full ${toneClasses[tone]}`}>
      <svg viewBox="0 0 56 56" className="size-full" fill="currentColor">
        <circle cx="28" cy="21" r="9" />
        <path d="M10 56c0-11 8-18 18-18s18 7 18 18Z" />
      </svg>
    </span>
  );
}
