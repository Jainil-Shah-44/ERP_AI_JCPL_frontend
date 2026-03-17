// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  PackageCheck,
  Beaker,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import { BiSolidCategory } from "react-icons/bi";
import { FcDepartment } from "react-icons/fc";
import { MdOutlineFactory } from "react-icons/md";
import { FaLayerGroup, FaRegUserCircle, FaWarehouse } from "react-icons/fa";
import { SiMaterialdesignicons } from "react-icons/si";
import { PiUniteSquareFill } from "react-icons/pi";
import { CiShop } from "react-icons/ci";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {

  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const storedPermissions = JSON.parse(
      localStorage.getItem("permissions") || "[]"
    );
    setPermissions(storedPermissions);
  }, []);

  const canAccess = (perm: string) => permissions.includes(perm);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

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

        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">

          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
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
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-5">

          {/* Dashboard */}

          <Link
            href="/dashboard"
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"}
            py-2.5 rounded-lg mb-4
            ${isActive("/dashboard")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>

          {/* ================= MASTER ================= */}

          <div className="mb-4">

            <button
              onClick={() => toggleMenu("master")}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
            >
              <span>MASTER</span>
              {!isCollapsed &&
                (openMenu === "master"
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />)}
            </button>

            {openMenu === "master" && (

              <div className="space-y-1 mt-2">

                {canAccess("USER_MANAGE") && (
                  <Link href="/dashboard/master/usermaster"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                    ${isActive("/dashboard/master/usermaster")
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100"}`}>

                    <FaRegUserCircle size={20} />
                    {!isCollapsed && <span>User Master</span>}

                  </Link>
                )}

                {canAccess("CATEGORY_EDIT") && (
                  <Link href="/dashboard/master/categorymaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <BiSolidCategory size={20} />
                    {!isCollapsed && <span>Category Master</span>}

                  </Link>
                )}

                {canAccess("DEPARTMENT_EDIT") && (
                  <Link href="/dashboard/master/departmentmaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <FcDepartment size={20} />
                    {!isCollapsed && <span>Department Master</span>}

                  </Link>
                )}

                {canAccess("FACTORY_EDIT") && (
                  <Link href="/dashboard/master/factorymaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <MdOutlineFactory size={20} />
                    {!isCollapsed && <span>Factory Master</span>}

                  </Link>
                )}

                {canAccess("GROUP_EDIT") && (
                  <Link href="/dashboard/master/group"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <FaLayerGroup size={20} />
                    {!isCollapsed && <span>Group Master</span>}

                  </Link>
                )}

                {canAccess("RAW_MATERIAL_EDIT") && (
                  <Link href="/dashboard/master/rawmaterialmaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <SiMaterialdesignicons size={20} />
                    {!isCollapsed && <span>Rawmaterial Master</span>}

                  </Link>
                )}

                {canAccess("UNIT_EDIT") && (
                  <Link href="/dashboard/master/unitmaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <PiUniteSquareFill size={20} />
                    {!isCollapsed && <span>Unit Master</span>}

                  </Link>
                )}

                {canAccess("VENDOR_EDIT") && (
                  <Link href="/dashboard/master/vendormaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <CiShop size={20} />
                    {!isCollapsed && <span>Vendor Master</span>}

                  </Link>
                )}

                {canAccess("WAREHOUSE_EDIT") && (
                  <Link href="/dashboard/master/warehousemaster"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <FaWarehouse size={20} />
                    {!isCollapsed && <span>Warehouse Master</span>}

                  </Link>
                )}

              </div>

            )}

          </div>

          {/* PROCUREMENT */}

          <div className="mb-4">

            <button
              onClick={() => toggleMenu("procurement")}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
            >
              <span>PROCUREMENT</span>
              {!isCollapsed &&
                (openMenu === "procurement"
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />)}
            </button>

            {openMenu === "procurement" && (

              <div className="space-y-1 mt-2">

                {canAccess("PURCHASE_CREATE") && (
                  <Link href="/dashboard/procurement/purchase-requisition"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <FileText size={20} />
                    {!isCollapsed && <span>Purchase Requisition</span>}

                  </Link>
                )}

                {canAccess("RFQ_VIEW") && (
                  <Link href="/dashboard/procurement/rfq-management"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <ShoppingCart size={20} />
                    {!isCollapsed && <span>RFQ Management</span>}

                  </Link>
                )}

                {canAccess("PO_APPROVE") && (
                  <Link href="/dashboard/procurement/purchase-order"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <PackageCheck size={20} />
                    {!isCollapsed && <span>Purchase Orders</span>}

                  </Link>
                )}

              </div>

            )}

          </div>

          {/* WAREHOUSE */}

          {canAccess("GRN_PROCESS") && (

            <div className="mb-4">

              <button
                onClick={() => toggleMenu("warehouse")}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
              >
                <span>WAREHOUSE</span>
                {!isCollapsed &&
                  (openMenu === "warehouse"
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />)}
              </button>

              {openMenu === "warehouse" && (

                <div className="space-y-1 mt-2">

                  <Link href="/dashboard/grn"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <PackageCheck size={20} />
                    {!isCollapsed && <span>GRN</span>}

                  </Link>

                </div>

              )}

            </div>
          )}

          {/* QUALITY */}

          {canAccess("QC_PROCESS") && (

            <div className="mb-4">

              <button
                onClick={() => toggleMenu("quality")}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
              >
                <span>QUALITY</span>
                {!isCollapsed &&
                  (openMenu === "quality"
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />)}
              </button>

              {openMenu === "quality" && (

                <div className="space-y-1 mt-2">

                  <Link href="/dashboard/QCampling"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <Beaker size={20} />
                    {!isCollapsed && <span>QC Sampling</span>}

                  </Link>

                </div>

              )}

            </div>
          )}

          {/* FINANCE */}

          {canAccess("INVOICE_MATCH") && (

            <div className="mb-4">

              <button
                onClick={() => toggleMenu("finance")}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
              >
                <span>FINANCE</span>
                {!isCollapsed &&
                  (openMenu === "finance"
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />)}
              </button>

              {openMenu === "finance" && (

                <div className="space-y-1 mt-2">

                  <Link href="/dashboard/InvoiceMatchingView"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100">

                    <DollarSign size={20} />
                    {!isCollapsed && <span>Invoices & Matching</span>}

                  </Link>

                </div>

              )}

            </div>
          )}

        </nav>
      </div>
    </aside>
  );
}