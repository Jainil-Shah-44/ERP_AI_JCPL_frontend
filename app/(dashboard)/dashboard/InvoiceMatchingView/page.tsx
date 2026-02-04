// app/finance/invoice-matching/[id]/page.tsx   or   components/InvoiceMatchingView.tsx

import { CheckCircle2, AlertCircle, FileText, Printer } from "lucide-react";

export default function InvoiceMatchingView() {
    return (
         <div className="min-h-screen bg-gray-50 py-4">
            <div className="mx-auto max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-white px-6 py-5 text-black">
                    <h1 className="text-2xl font-bold">Invoice & 3-Way Matching</h1>
                    <p className="text-black mt-1 text-sm">
                        Verify invoice against PO, GRN, and QC records
                    </p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Invoice Summary Card */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 font-medium text-gray-800 border-b flex items-center justify-between">
                            <div>Invoice INV-2025-8432</div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                <CheckCircle2 size={16} />
                                All Matched
                            </div>
                        </div>

                        <div className="p-6 space-y-4 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-gray-500">Supplier</div>
                                    <div className="font-medium mt-1">Supplier A</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Invoice Date</div>
                                    <div className="font-medium mt-1">Jan 14, 2026</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Invoice Amount</div>
                                    <div className="font-medium mt-1">₹14,750.00</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3-Way Matching Checklist */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            3-Way Matching Checklist
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                <CheckCircle2 className="text-green-600" size={20} />
                                <div>
                                    <div className="font-medium">PO Matched</div>
                                    <div className="text-sm text-green-700">PO-2025-1842</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                <CheckCircle2 className="text-green-600" size={20} />
                                <div>
                                    <div className="font-medium">GRN Matched</div>
                                    <div className="text-sm text-green-700">GRN-5421</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                <CheckCircle2 className="text-green-600" size={20} />
                                <div>
                                    <div className="font-medium">QC Matched</div>
                                    <div className="text-sm text-green-700">Approved</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                <CheckCircle2 className="text-green-600" size={20} />
                                <div>
                                    <div className="font-medium">Invoice Matched</div>
                                    <div className="text-sm text-green-700">All values</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Comparison Table */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Detailed Comparison
                        </h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Parameter
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            PO / GRN Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Invoice Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            PO Number
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            PO-2025-1842
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            PO-2025-1842
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-green-700">
                                                <CheckCircle2 size={16} />
                                                Matched
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            Material
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            Sodium Hydroxide
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            Sodium Hydroxide
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-green-700">
                                                <CheckCircle2 size={16} />
                                                Matched
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            Quantity
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            5000 kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            5000 kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-green-700">
                                                <CheckCircle2 size={16} />
                                                Matched
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            Unit Price
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            ₹2.50 / kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            ₹2.50 / kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-green-700">
                                                <CheckCircle2 size={16} />
                                                Matched
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            Total Amount
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            ₹14,750.00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            ₹14,750.00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-green-700">
                                                <CheckCircle2 size={16} />
                                                Matched
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tally Integration Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-start gap-4">
                        <CheckCircle2 className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                        <div className="text-sm text-blue-800">
                            <strong>Tally Integration:</strong> Upon approval, purchase data will be automatically synced to Tally for accounting.
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <button className="flex-1 bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} />
                            Approve for Payment
                        </button>

                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition shadow-sm">
                            Request Clarification
                        </button>

                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                            <FileText size={18} />
                            View Documents
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}