// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  PackageCheck,
  Beaker,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BiSolidCategory } from "react-icons/bi";
import { FcDepartment } from "react-icons/fc";
import { MdOutlineFactory } from "react-icons/md";
import { FaLayerGroup, FaRegUserCircle, FaWarehouse } from "react-icons/fa";
import { SiMaterialdesignicons } from "react-icons/si";
import { PiUniteSquareFill } from "react-icons/pi";
import { CiShop } from "react-icons/ci";

interface SidebarProps {
  isCollapsed: boolean ;
  setIsCollapsed: (value: boolean) => false;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 shadow-sm
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
        md:relative md:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header - always visible toggle button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                JC
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">Jeevan</h1>
                <p className="text-xs text-gray-500">Chemicals</p>
              </div>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Scrollable content */}
        <nav className="flex-1 overflow-y-auto px-2 py-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"
              } py-2.5 rounded-lg transition-colors mb-4 ${isActive("/dashboard")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <LayoutDashboard size={20} className="min-w-[20px]" />
            {!isCollapsed && <span className="text-sm">Dashboard</span>}
          </Link>
          <div className="mb-4">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                MASTER
              </div>
            )}
            <div className="space-y-1">
               <Link href="/dashboard/master/usermaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors
               ${isActive("dashboard/master/usermaster") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <FaRegUserCircle  size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>User Master</span>}
              </Link>

              <Link href="/dashboard/master/categorymaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors
               ${isActive("dashboard/master/categorymastern") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <BiSolidCategory size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Category Master</span>}
              </Link>

              <Link href="/dashboard/master/departmentmaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors 
                  ${isActive("/dashboard/master/departmentmaster") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} >
                <FcDepartment size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Department Master</span>}
              </Link>

              <Link href="/dashboard/master/factorymaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/master/factorymaster")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <MdOutlineFactory size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Factory Master</span>}
              </Link>
              <Link href="/dashboard/master/group" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/master/group")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <FaLayerGroup size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Group Master</span>}
              </Link>
              <Link href="/dashboard/master/rawmaterialmaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/master/rawmaterialmaster")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <SiMaterialdesignicons size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Rawmaterial Master</span>}
              </Link>
              <Link href="/dashboard/master/unitmaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/master/unitmaster")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <PiUniteSquareFill size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Unit Master</span>}
              </Link>
              <Link href="/dashboard/master/vendormaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/master/vendormaster")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <CiShop size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Vendor Master</span>}
              </Link>
              <Link href="/dashboard/master/warehousemaster" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/master/warehousemaster")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <FaWarehouse size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Warehouse Master</span>}
              </Link>
            </div>
          </div>
          {/* PROCUREMENT */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                PROCUREMENT
              </div>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/procurement/purchase-requisition" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors
               ${isActive("/dashboard/procurement/purchase-requisition") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <FileText size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Purchase Requisition</span>}
              </Link>

              <Link href="/dashboard/procurement/rfq-management" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors 
                  ${isActive("/dashboard/procurement/rfq-management") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} >
                <ShoppingCart size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>RFQ Management</span>}
              </Link>

              <Link href="/dashboard/procurement/purchase-order" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/PurchaseOrders")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <PackageCheck size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Purchase Orders</span>}
              </Link>
            </div>
          </div>

          {/* WAREHOUSE */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                WAREHOUSE
              </div>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/grn" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/warehouse/grn")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <PackageCheck size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>GRN</span>}
              </Link>
            </div>
          </div>

          {/* QUALITY */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                QUALITY
              </div>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/QCampling" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/QCampling")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <Beaker size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>QC Sampling</span>}
              </Link>
            </div>
          </div>

          {/* FINANCE */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                FINANCE
              </div>
            )}
            <div className="space-y-1">
              <Link href="/dashboard/InvoiceMatchingView" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/dashboard/InvoiceMatchingView")
                ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} >
                <DollarSign size={20} className="min-w-[20px]" />
                {!isCollapsed && <span>Invoices & Matching</span>}
              </Link>
            </div>
          </div>

          {/* Bottom links */}
          {/* <div className="mt-auto border-t border-gray-200 pt-4 px-2 space-y-1">
            <Link href="/reports" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/reports")
              ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} >
              <BarChart3 size={20} className="min-w-[20px]" />
              {!isCollapsed && <span>Reports</span>}
            </Link>

            <Link href="/settings" className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-sm transition-colors ${isActive("/settings")
              ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
              <Settings size={20} className="min-w-[20px]" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </div> */}
        </nav>
      </div>
    </aside>
  );
}