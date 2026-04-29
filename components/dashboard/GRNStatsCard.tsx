"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Package } from "lucide-react";
import { getGRNDashboardStats } from "@/services/dashboard.service";

type GRNStats = {
  DRAFT: number;
  SUBMITTED: number;
};

export default function GRNStatsCard() {
  const [stats, setStats] = useState<GRNStats>({
    DRAFT: 0,
    SUBMITTED: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // You will need to build this endpoint in your FastAPI dashboard router
        const data = await apiFetch("/dashboard/grn-stats", {
          method: "GET",
        });

        if (data && Object.keys(data).length > 0) {
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error loading GRN stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Update this path if your GRN page is located elsewhere
  const basePath = "/dashboard/grn";
  
  // Calculate percentages safely for the visual bar
  const total = stats.DRAFT + stats.SUBMITTED || 1; // Fallback to 1 prevents divide-by-zero
  const draftPct = Math.round((stats.DRAFT / total) * 100);
  const submittedPct = 100 - draftPct;

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-50 text-orange-600 p-2 rounded-md">
          <Package size={20} />
        </div>
        <h2 className="text-gray-700 font-semibold text-sm">Goods Receipt Notes</h2>
      </div>

      {loading ? (
        <div className="mt-auto space-y-4 animate-pulse">
           <div className="flex justify-between items-end">
             <div className="w-16 h-8 bg-gray-100 rounded"></div>
             <div className="w-16 h-8 bg-gray-100 rounded"></div>
           </div>
           <div className="w-full h-2 bg-gray-100 rounded-full"></div>
        </div>
      ) : (
        <div className="mt-auto space-y-4">
          {/* Clickable Status Numbers */}
          <div className="flex justify-between items-end">
            <Link href={`${basePath}?status=DRAFT`} className="group cursor-pointer transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide group-hover:text-gray-700 transition-colors">
                  Draft
                </p>
              </div>
              <p className="font-semibold text-gray-800 text-3xl group-hover:text-gray-600 transition-colors">
                {stats.DRAFT}
              </p>
            </Link>

            <Link href={`${basePath}?status=SUBMITTED`} className="group cursor-pointer transition-transform hover:-translate-y-0.5 text-right">
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide group-hover:text-gray-700 transition-colors">
                  Submitted
                </p>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <p className="font-semibold text-gray-800 text-3xl group-hover:text-blue-600 transition-colors">
                {stats.SUBMITTED}
              </p>
            </Link>
          </div>

          {/* Visual Ratio Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
            {stats.DRAFT > 0 && (
              <div 
                className="h-full bg-gray-400 transition-all duration-500" 
                style={{ width: `${draftPct}%` }}
              ></div>
            )}
            {stats.SUBMITTED > 0 && (
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${submittedPct}%` }}
              ></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}