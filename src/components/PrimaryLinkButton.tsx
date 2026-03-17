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
        "bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition " +
        className
      }
    >
      {children}
    </Link>
  );
}

