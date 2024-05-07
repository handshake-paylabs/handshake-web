"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isActiveParentMenu = (menus) => {
    return menus.some(
      (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
    );
  };
  return (
    <>
      <li className="js-nav-dropdown group relative">
        <Link
          href="/"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Home
        </Link>
      </li>
      <li className="group">
        <Link
          href="/dashboard"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/create".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Dashboard
        </Link>
      </li>
    </>
  );
}
