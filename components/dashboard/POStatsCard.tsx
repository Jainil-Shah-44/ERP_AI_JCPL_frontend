"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { ShoppingCart } from "lucide-react";

type POStats = {
  ALL: number;
  DRAFT: number;
  RELEASED: number;
  CANCELLED: number;
};

export default function POStatsCard() {
  const [stats, setStats] = useState<POStats>({
    ALL: 0,
    DRAFT: 0,
    RELEASED: 0,
    CANCELLED: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch("/dashboard/po-stats", {
          method: "GET",
        });

        if (data && Object.keys(data).length > 0) {
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error loading PO stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const basePath = "/dashboard/procurement/purchase-order";

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-md">
          <ShoppingCart size={20} />
        </div>
        <h2 className="text-gray-700 font-semibold text-sm">Purchase Orders</h2>
      </div>

      {/* 2x2 Grid Layout */}
      {loading ? (
        <div className="animate-pulse grid grid-cols-2 gap-3 mt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-md w-full"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-1">
          <StatBlock 
            label="All" 
            count={stats.ALL} 
            dotColor="bg-blue-500" 
            href={basePath} // No status parameter so it shows everything
          />
          <StatBlock 
            label="Draft" 
            count={stats.DRAFT} 
            dotColor="bg-gray-400" 
            href={`${basePath}?status=DRAFT`} 
          />
          <StatBlock 
            label="Released" 
            count={stats.RELEASED} 
            dotColor="bg-emerald-500" 
            href={`${basePath}?status=RELEASED`} 
          />
          <StatBlock 
            label="Cancelled" 
            count={stats.CANCELLED} 
            dotColor="bg-red-500" 
            href={`${basePath}?status=CANCELLED`} 
          />
        </div>
      )}
    </div>
  );
}

// Sub-component
function StatBlock({ 
  label, 
  count, 
  dotColor, 
  href 
}: { 
  label: string; 
  count: number; 
  dotColor: string; 
  href: string;
}) {
  return (
    <Link 
      href={href}
      className="group flex flex-col justify-center p-3 bg-gray-50 border border-gray-100 rounded-md hover:bg-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wide group-hover:text-gray-700 transition-colors">
          {label}
        </span>
      </div>
      <span className="font-semibold text-gray-800 text-xl pl-4 group-hover:text-emerald-600 transition-colors">
        {count || 0}
      </span>
    </Link>
  );
}