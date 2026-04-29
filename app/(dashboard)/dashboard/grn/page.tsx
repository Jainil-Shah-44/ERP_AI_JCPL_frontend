// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import DataTable from "@/components/layout/DataTable";
// import Button from "@/components/ui/Button";
// import { getGRNList } from "@/services/grn.service";
// import { apiFetch } from "@/lib/api";

// export default function GRNListPage() {
//   const [data, setData] = useState([]);
//   const router = useRouter();
//   const [factories, setFactories] = useState<any[]>([]);
//   const [selectedFactory, setSelectedFactory] = useState("");

//   const fetchData = async () => {
//     let url = "/grn";

//     if (selectedFactory) {
//       url += `?factory_id=${selectedFactory}`;
//     }

//     const res = await apiFetch(url);
//     setData(res.data || []);
//   };

//   useEffect(() => {
//     apiFetch("/masters/factories/")
//       .then((data) => setFactories(data))
//       .catch((err) => console.error(err));
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [selectedFactory]);

//   const columns = [
//     {
//       header: "GRN Number",
//       accessor: "grn_number",
//     },
//     {
//       header: "PO Ref",
//       accessor: "plot_no", // ✅ from backend
//     },
//     {
//       header: "Factory",
//       accessor: "factory_name",
//       render: (row: any) => row.factory_name || "-",
//     },
//     {
//       header: "Status",
//       accessor: "status",
//     },
//     {
//       header: "Created At",
//       render: (row: any) => {
//         if (!row.created_at) return "-";

//         const date = new Date(row.created_at);

//         const formattedDate = date.toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         });

//         const formattedTime = date.toLocaleTimeString("en-GB", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         });

//         return `${formattedDate} ${formattedTime}`;
//       },
//     },
//     {
//       header: "Actions",
//       render: (row: any) => (
//         <div className="flex gap-2">
//           <button
//             className="text-blue-600"
//             onClick={(e) => {
//               e.stopPropagation();
//               router.push(`/dashboard/grn/${row.id}`);
//             }}
//           >
//             View
//           </button>

//           {row.status === "DRAFT" && (
//             <button
//               className="text-green-600"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 router.push(`/dashboard/grn/edit/${row.id}`);
//               }}
//             >
//               Edit
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h1>GRN</h1>

//         <div className="flex gap-2">
//           <select
//             className="border rounded px-3 py-2"
//             value={selectedFactory}
//             onChange={(e) => setSelectedFactory(e.target.value)}
//           >
//             <option value="">All Factories</option>

//             {factories.map((f) => (
//               <option key={f.id} value={f.id}>
//                 {f.name}
//               </option>
//             ))}
//           </select>

//           <Button onClick={() => router.push("/dashboard/grn/create")}>
//             Create GRN
//           </Button>
//         </div>
//       </div>
//       <DataTable
//         data={data}
//         columns={columns}
//         onRowClick={(row: any) => router.push(`/dashboard/grn/${row.id}`)}
//       />
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/layout/DataTable";
import Button from "@/components/ui/Button";
import { getGRNList } from "@/services/grn.service";
import { apiFetch } from "@/lib/api";

const STATUS_TABS = ["ALL", "DRAFT", "SUBMITTED"];

export default function GRNListPage() {
  const router = useRouter();
  
  // 1. Read URL parameters
  const searchParams = useSearchParams();
  const statusQuery = searchParams.get("status");

  // 2. Initialize active tab based on URL
  const [activeTab, setActiveTab] = useState(() => {
    return statusQuery && STATUS_TABS.includes(statusQuery.toUpperCase())
      ? statusQuery.toUpperCase()
      : "ALL";
  });

  const [data, setData] = useState([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [selectedFactory, setSelectedFactory] = useState("");

  // 3. Listen for URL changes if user clicks dashboard links again
  useEffect(() => {
    if (statusQuery && STATUS_TABS.includes(statusQuery.toUpperCase())) {
      setActiveTab(statusQuery.toUpperCase());
    } else if (!statusQuery) {
      setActiveTab("ALL");
    }
  }, [statusQuery]);

  useEffect(() => {
    apiFetch("/masters/factories/")
      .then((data) => setFactories(data))
      .catch((err) => console.error(err));
  }, []);

  // 4. Fetch data relies on both Factory and Tab state
  useEffect(() => {
    const fetchData = async () => {
      let url = "/grn?";

      if (selectedFactory) {
        url += `factory_id=${selectedFactory}&`;
      }
      if (activeTab !== "ALL") {
        url += `status=${activeTab}&`;
      }

      // Clean up trailing '?' or '&'
      if (url.endsWith("?") || url.endsWith("&")) {
        url = url.slice(0, -1);
      }

      const res = await apiFetch(url);
      setData(res.data || []);
    };

    fetchData();
  }, [selectedFactory, activeTab]);

  const columns = [
    {
      header: "GRN Number",
      accessor: "grn_number",
    },
    {
      header: "PO Ref",
      accessor: "plot_no", // ✅ from backend
    },
    {
      header: "Factory",
      accessor: "factory_name",
      render: (row: any) => row.factory_name || "-",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Created At",
      render: (row: any) => {
        if (!row.created_at) return "-";

        const date = new Date(row.created_at);

        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      header: "Actions",
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/grn/${row.id}`);
            }}
          >
            View
          </button>

          {row.status === "DRAFT" && (
            <button
              className="text-green-600"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/grn/edit/${row.id}`);
              }}
            >
              Edit
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">GRN</h1>

        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2 bg-white"
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
          >
            <option value="">All Factories</option>

            {factories.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <Button onClick={() => router.push("/dashboard/grn/create")}>
            Create GRN
          </Button>
        </div>
      </div>

      {/* 5. TABS UI */}
      <div className="flex gap-3 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              const newUrl = tab === "ALL" 
                ? "/dashboard/warehouse/grn" // adjust path if needed
                : `/dashboard/warehouse/grn?status=${tab}`;
              window.history.pushState(null, '', newUrl);
            }}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable
        data={data}
        columns={columns}
        onRowClick={(row: any) => router.push(`/dashboard/grn/${row.id}`)}
      />
    </div>
  );
}