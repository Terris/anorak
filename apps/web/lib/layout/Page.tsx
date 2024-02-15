import { cn } from "@repo/utils";

export function Page({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("w-full p-8", className)}>{children}</div>;
}
