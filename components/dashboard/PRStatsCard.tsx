"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPRDashboardStats } from "@/services/dashboard.service";
import { FileText } from "lucide-react";

type PRStats = {
  DRAFT: number;
  SUBMITTED: number;
  REJECTED: number;
  APPROVED: number;
};

export default function PRStatsCard() {
  const [stats, setStats] = useState<PRStats>({
    DRAFT: 0,
    SUBMITTED: 0,
    REJECTED: 0,
    APPROVED: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPRDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading PR stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const basePath = "/dashboard/procurement/purchase-requisition";

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-md">
          <FileText size={20} />
        </div>
        <h2 className="text-gray-700 font-semibold text-sm">Purchase Requisitions</h2>
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
            label="Draft" 
            count={stats.DRAFT} 
            dotColor="bg-gray-400" 
            href={`${basePath}?status=DRAFT`} 
          />
          <StatBlock 
            label="Submitted" 
            count={stats.SUBMITTED} 
            dotColor="bg-blue-500" 
            href={`${basePath}?status=SUBMITTED`} 
          />
          <StatBlock 
            label="Rejected" 
            count={stats.REJECTED} 
            dotColor="bg-red-500" 
            href={`${basePath}?status=REJECTED`} 
          />
          <StatBlock 
            label="Approved" 
            count={stats.APPROVED} 
            dotColor="bg-green-500" 
            href={`${basePath}?status=APPROVED`} 
          />
        </div>
      )}
    </div>
  );
}

// Updated to act as a clickable Next.js Link
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
      {/* The number itself turns blue on hover to invite the click */}
      <span className="font-semibold text-gray-800 text-xl pl-4 group-hover:text-blue-600 transition-colors">
        {count}
      </span>
    </Link>
  );
}