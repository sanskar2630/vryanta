import { initialsOf } from "@/lib/vryanta";
import { cn } from "@/lib/utils";

export function InitialsAvatar({
  name,
  src,
  className,
}: {
  name?: string | null | undefined;
  src?: string | null | undefined;
  className?: string | undefined;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s profile photo` : "Profile photo"}
        className={cn("size-9 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
