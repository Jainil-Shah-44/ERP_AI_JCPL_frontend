"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

interface Props {
  onParsed: (rows: any[]) => void;
}

export default function ExcelUpload({ onParsed }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\r?\n|\r/g, " ") // remove newline
      .replace(/\s+/g, " ") // collapse spaces
      .trim();

  const getValue = (row: Record<string, any>, possibleKeys: string[]) => {
    const key = Object.keys(row).find((k) => {
      const normalized = normalize(k);

      return possibleKeys.some((p) => normalized.includes(normalize(p)));
    });

    return key ? row[key] : "";
  };

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
        defval: "", // ⭐ CRITICAL FIX
      });
      if (!json.length) {
        setToast({
          msg: "Excel sheet empty",
          type: "error",
        });
        return;
      }

      console.log(Object.keys(json[0]));
      console.log(XLSX.utils.sheet_to_json(sheet, { header: 1 }));

      const parsed = json
        .filter((r) => getValue(r, ["ITEM DESCRIPTION"]))
        .map((r) => {
          const requestDateRaw = getValue(r, ["DATE OF REQUEST"]);
          const prDate = formatDate(requestDateRaw) || null;

          // 🔥 FIXED ARRIVAL DETECTION
          const arrivalKey = Object.keys(r).find((k) =>
            normalize(k).includes("arrival"),
          );

          // SAFE ACCESS
          const arrivalRaw =
            arrivalKey && r[arrivalKey] !== undefined ? r[arrivalKey] : "";

          const arrivalDate = formatDate(arrivalRaw);

          // FINAL LOGIC
          let requiredDate = arrivalDate;

          if (!requiredDate && prDate) {
            const d = new Date(prDate);
            d.setDate(d.getDate() + 7);

            requiredDate = `${d.getFullYear()}-${String(
              d.getMonth() + 1,
            ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          }

          if (!arrivalDate) {
            console.log("No arrival date → fallback to +7 days");
          }

          console.log("Row keys:", Object.keys(r));
          console.log("Row data:", r);
          console.log("Arrival key:", arrivalKey);
          console.log("Arrival value:", arrivalRaw);

          return {
            pr_date: prDate || null,

            material_name: String(getValue(r, ["ITEM DESCRIPTION"])).trim(),

            unit: String(
              getValue(r, ["UNIT OF MEASURE", "Unit", "UOM"]),
            ).trim(),

            description: String(getValue(r, ["Size"])).trim(),

            qty: Number(getValue(r, ["Qty"])) || 0,

            factory_name: String(getValue(r, ["PLOT NO", "PLOT NO."])).trim(),

            department: String(getValue(r, ["Department"])).trim(),

            required_by_date: requiredDate || null,

            remarks: String(getValue(r, ["REMARKS"])).trim(),
          };
        });

      setRows(parsed);
    } catch (err) {
      setToast({
        msg: "Failed to read Excel file",
        type: "error",
      });
    }
  };

  const formatDate = (value: any) => {
    if (!value) return "";

    // ---------------- EXCEL SERIAL NUMBER ----------------
    if (typeof value === "number") {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed) return "";

      return `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
    }

    // ---------------- DATE OBJECT ----------------
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return "";

      return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
    }

    // ---------------- STRING HANDLING ----------------
    if (typeof value === "string") {
      let clean = value.trim();

      if (!clean) return "";

      // Replace dots with slashes (1.2.2024 → 1/2/2024)
      clean = clean.replace(/\./g, "/");

      // Replace multiple spaces
      clean = clean.replace(/\s+/g, " ");

      // ---------------- DD/MM/YYYY or MM/DD/YYYY ----------------
      const slashMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (slashMatch) {
        let [_, d, m, y] = slashMatch;

        // Normalize year
        if (y.length === 2) y = "20" + y;

        // Heuristic: if first > 12 → it's DD/MM
        if (Number(d) > 12) {
          return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        } else {
          // assume DD/MM (India context)
          return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
      }

      // ---------------- DD-MM-YYYY ----------------
      const dashMatch = clean.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
      if (dashMatch) {
        let [_, d, m, y] = dashMatch;

        if (y.length === 2) y = "20" + y;

        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }

      // ---------------- TEXT MONTH FORMATS ----------------
      // e.g. 1 Mar 2024 / Mar 1 2024
      const parsedDate = new Date(clean);
      if (!isNaN(parsedDate.getTime())) {
        return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
      }
    }

    return "";
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {rows.length === 0 && (
        <div className="flex justify-center">
          <div
            className="w-full max-w-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg p-10 text-center cursor-pointer transition"
            onClick={() => document.getElementById("excel-upload")?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile({ target: { files: [file] } });
            }}
          >
            <p className="text-sm font-medium">Upload Excel File</p>
            <p className="text-xs text-gray-400 mt-1">
              Drag & drop .xlsx here or click to browse
            </p>
          </div>

          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}

      {rows.length > 0 && (
        <>
          <table className="border w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Material</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Department</th>
                <th className="p-2">Expected Arrival Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.material_name}</td>

                  <td className="p-2">{r.unit}</td>

                  <td className="p-2">{r.qty}</td>

                  <td className="p-2">{r.department}</td>

                  <td className="p-2">{r.required_by_date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            title="Import Into PR"
            onClick={async () => {
              console.log("Import button clicked", rows);
              await onParsed(rows);
            }}
          />
        </>
      )}

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          position="top-center"
          autoClose={2000}
        />
      )}
    </div>
  );
}
