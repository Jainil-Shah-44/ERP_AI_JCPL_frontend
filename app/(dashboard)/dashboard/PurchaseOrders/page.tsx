import Button from '@/components/ui/Button';
import { CheckCircle, CheckCircle2, Clock, XCircle } from 'lucide-react'; // or heroicons/react
import { FiEdit } from 'react-icons/fi';

export default function PurchaseOrderReview() {
    const po = {
        number: 'PO-2025-1842',
        createdDate: 'Jan 12, 2026',
        creator: 'Rajesh Kumar (Procurement)',
        supplier: {
            name: 'Supplier A',
            contact: '+91 98765 43210',
            email: 'contact@suppliera.com',
            terms: 'Net 30',
        },
        material: 'Sodium Hydroxide (NaOH)',
        quantity: 5000,
        unit: 'kg',
        unitPrice: 2.50,
        deliveryDate: 'Feb 15, 2026',
        subtotal: 12500.00,
        gst: 2250.00, // 18%
        total: 14750.00,
        status: 'Pending Approval',
    };

    // const approvalSteps = [
    //     { name: 'Manager', status: 'Approved', completed: true },
    //     { name: 'Finance', status: 'Approved', completed: true },
    //     { name: 'Plant Head', status: 'Pending', completed: false },
    // ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r bg-white px-4 py-4 text-black">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Purchase Order</h1>
                            <p className="text-black mt-1">Review and approve purchase order</p>
                        </div>

                    </div>
                </div>
                <div className='bg-white border border-[#DCE1E7] rounded-lg p-4'>
                    {/* PO Info Bar */}
                    <div className="px-6 py-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                PO #{po.number}
                            </h2>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Created: {po.createdDate} • Created by: {po.creator}
                            </p>
                        </div>
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium text-sm">
                            <Clock className="w-4 h-4 mr-1.5" />
                            {po.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x">
                        {/* Supplier Information */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Supplier Information
                            </h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Supplier Name</dt>
                                    <dd className="font-medium">{po.supplier.name}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Contact</dt>
                                    <dd className="font-medium">{po.supplier.contact}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Email</dt>
                                    <dd className="font-medium">{po.supplier.email}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Payment Terms</dt>
                                    <dd className="font-medium">{po.supplier.terms}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Order Details */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Order Details
                            </h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Material</dt>
                                    <dd className="font-medium">{po.material}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Quantity</dt>
                                    <dd className="font-medium">
                                        {po.quantity.toLocaleString()} {po.unit}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Unit Price</dt>
                                    <dd className="font-medium">₹{po.unitPrice.toFixed(2)} / {po.unit}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Delivery Date</dt>
                                    <dd className="font-medium">{po.deliveryDate}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-6 border-t">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                        <div className="bg-gray-50 rounded-lg p-5 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{po.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">GST (18%)</span>
                                <span className="font-medium">₹{po.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="pt-3 border-t flex justify-between text-base font-bold">
                                <span>Total Amount</span>
                                <span className="text-green-700">₹{po.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Approval Flow */}
                    <div className="w-full mx-auto px-4 py-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Flow</h3>
                        </div>

                        {/* Main horizontal flow container */}
                        <div className="relative flex items-center md:justify-center gap-6 md:gap-16">
                            {/* Step 1 - Manager */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className="w-10 h-10 rounded-full bg-[#198754] flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                                <p className="mt-3 font-medium text-gray-800">Manager</p>
                                <p className="text-sm text-green-600 font-medium mt-1">Approved</p>
                            </div>

                            {/* Connector 1 */}
                            <div className="flex-1 h-1 bg-[#198754] relative top-[0px] z-0" />

                            {/* Step 2 - Finance */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className="w-10 h-10 rounded-full bg-[#198754] flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                                <p className="mt-3 font-medium text-gray-800">Finance</p>
                                <p className="text-sm text-green-600 font-medium mt-1">Approved</p>
                            </div>

                            {/* Connector 2 */}
                            <div className="flex-1 h-1 bg-[#198754] relative top-[0px] z-0" />

                            {/* Step 3 - Plant Head (Pending) */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md border-2 border-yellow-500">
                                    <div className="w-5 h-5 rounded-full bg-white" /> {/* yellow dot */}
                                </div>
                                <p className="mt-3 font-medium text-gray-800">Plant Head</p>
                                <p className="text-sm text-yellow-600 font-medium mt-1">Pending</p>
                            </div>
                        </div>

                        {/* Mobile-friendly status labels below (optional fallback) */}
                        <div className="md:hidden mt-6 flex justify-between text-sm text-center px-2">
                            <div className="text-green-600 font-medium">Approved</div>
                            <div className="text-green-600 font-medium">Approved</div>
                            <div className="text-yellow-600 font-medium">Pending</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-5 bg-gray-50 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left group */}
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            <Button variant="outline" className='border border-red-600 text-red-600'>
                                <XCircle className="w-5 h-5 mr-2" />
                                Reject
                            </Button>
                            <Button variant="green">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Approve
                            </Button>
                        </div>

                        {/* Right side */}
                        <button className="order-3 px-6 py-3 bg-white  text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition shadow-sm flex items-center justify-center gap-2 min-w-[160px]">
                            <FiEdit className="w-5 h-5" />  Digital Signature
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}