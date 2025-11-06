"use client";

import Link from "next/link";

export default function AuthButtons({ small }: { small?: boolean }) {
  const base = small ? "px-3 py-1 text-sm" : "px-4 py-2";

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login" className={`bg-blue-600 hover:bg-blue-700 text-white rounded ${base}`}>
        Log in
      </Link>
      <Link href="/auth/logout" className={`border border-gray-300 rounded text-gray-800 ${base}`}>
        Log out
      </Link>
    </div>
  );
}
