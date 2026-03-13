"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://103.196.187.61:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.replace("/login");
    }
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded hover:bg-gray-100"
          >
            ☰
          </button>
        )}
        <span className="font-semibold text-gray-800">
          Jeevan Chemicals Pvt. Ltd.
        </span>
      </div>

      {/* Right Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
        >
          U
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-50">
            <div className="px-4 py-2 text-sm text-gray-600 border-b">
              Signed in
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
