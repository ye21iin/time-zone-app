import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryLinkButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function PrimaryLinkButton({
  href,
  children,
  className = "",
}: PrimaryLinkButtonProps) {
  return (
    <Link
      href={href}
      className={
        "rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 " +
        className
      }
    >
      {children}
    </Link>
  );
}
