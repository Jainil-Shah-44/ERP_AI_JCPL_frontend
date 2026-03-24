"use client";

import { useEffect, useRef, useState } from "react";
import { searchVendors } from "@/services/vendormaster.service";
import { Vendor } from "@/types/master";

type Props = {
  value?: string;
  displayName?: string;
  onSelect: (vendor: Vendor) => void;
};

export default function VendorSelect({
  value,
  displayName,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 🔹 Prefill for edit mode
  useEffect(() => {
    if (displayName) {
      setQuery(displayName);
    }
  }, [displayName]);

  // 🔍 Search API
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const res = await searchVendors(query);
      setVendors(res || []);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // ❌ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        className="border p-2 w-full"
        placeholder="Search Vendor..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && vendors.length > 0 && (
        <div className="absolute bg-white border w-full z-10 max-h-60 overflow-auto">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(v);
                setQuery(v.name);
                setOpen(false);
              }}
            >
              <div className="font-medium">{v.name}</div>
              <div className="text-xs text-gray-500">
                {v.address_line1}, {v.address_line2}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}