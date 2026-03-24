"use client";

import { useEffect, useRef, useState } from "react";
import { searchMaterials } from "@/services/rawmaterialmaster.service";
import { Material } from "@/types/master";

type Props = {
  value?: string;
  displayName?: string;
  onSelect: (material: Material) => void;
};

export default function MaterialSelect({
  value,
  displayName,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 🔹 Prefill
  useEffect(() => {
    if (displayName) {
      setQuery(displayName);
    }
  }, [displayName]);

  // 🔍 Search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const res = await searchMaterials(query);
      setMaterials(res || []);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // ❌ Close dropdown
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
        value={query}
        placeholder="Search Material..."
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="border p-1 w-full"
      />

      {open && materials.length > 0 && (
        <div className="absolute bg-white border w-full z-50 max-h-60 overflow-auto">
          {materials.map((m) => (
            <div
              key={m.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(m);
                setQuery(m.material_name);
                setOpen(false);
              }}
            >
              {m.material_name} ({m.unit_name})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}