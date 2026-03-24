"use client";

import { useEffect, useRef, useState } from "react";
import { searchFactories } from "@/services/factorymaster.service";
import { Factory } from "@/types/master";

type Props = {
  value?: string;
  displayName?: string;
  onSelect: (factory: Factory) => void;
};

export default function FactorySelect({
  value,
  displayName,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 🔹 Prefill for edit mode
  useEffect(() => {
    if (displayName) {
      setQuery(displayName);
    }
  }, [displayName]);

  // 🔍 Search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const res = await searchFactories(query);
      setFactories(res || []);
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        className="border p-2 w-full"
        placeholder="Search Factory..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && factories.length > 0 && (
        <div className="absolute bg-white border w-full z-10 max-h-60 overflow-auto">
          {factories.map((f) => (
            <div
              key={f.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(f);
                setQuery(f.name);
                setOpen(false);
              }}
            >
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-gray-500">
                GSTIN: {f.gstin}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}