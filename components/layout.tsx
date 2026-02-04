// app/layout.tsx
"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full antialiased bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex h-full">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

          <main
            className={`
              flex-1 overflow-y-auto
              transition-all duration-300
              ${isCollapsed ? "md:ml-1" : "md:ml-1"}
            `}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}