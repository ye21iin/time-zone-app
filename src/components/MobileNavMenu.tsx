"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import LogoutButton from "./LogoutBtn";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="M6 6 18 18" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

export default function MobileNavMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative md:hidden" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="sr-only">Open menu</span>
        <HamburgerIcon open={open} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Mobile navigation"
          className="absolute right-0 mt-2 w-60 rounded-lg border bg-white shadow-lg p-2"
        >
          <Link
            href="/friends"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Friends
          </Link>
          <Link
            href="/plans"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Plans
          </Link>
          <Link
            href="/plans/add"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            + New plan
          </Link>

          <div className="my-2 h-px bg-gray-100" />
          <div className="px-3 py-2">
            <div className="text-xs text-gray-500 truncate">{email}</div>
            <div className="mt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

