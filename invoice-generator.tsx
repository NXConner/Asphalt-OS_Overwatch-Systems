'use client';

import { forwardRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface InvoiceProps {
  job: any;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

export const InvoiceGenerator = forwardRef<HTMLDivElement, InvoiceProps>(
  ({ job, invoiceNumber, invoiceDate, dueDate, items, subtotal, tax, total, notes }, ref) => {
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-sm text-gray-600">
              <div>Invoice #: {invoiceNumber}</div>
              <div>Date: {format(invoiceDate, 'MM/dd/yyyy')}</div>
              <div>Due Date: {format(dueDate, 'MM/dd/yyyy')}</div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">Your Company Name</h2>
            <div className="text-sm text-gray-600 mt-2">
              <div>123 Business St</div>
              <div>City, State 12345</div>
              <div>Phone: (555) 123-4567</div>
              <div>Email: info@company.com</div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">BILL TO:</h3>
          <div className="text-sm text-gray-900">
            <div className="font-medium">{job.contactName || 'Customer Name'}</div>
            <div>{job.address}</div>
            {job.contactEmail && <div>{job.contactEmail}</div>}
            {job.contactPhone && <div>{job.contactPhone}</div>}
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">JOB DETAILS:</h3>
          <div className="text-sm text-gray-900">
            <div><span className="font-medium">Job:</span> {job.title}</div>
            <div><span className="font-medium">Type:</span> {job.type.replace('_', ' ')}</div>
            {job.description && <div><span className="font-medium">Description:</span> {job.description}</div>}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 text-sm font-semibold text-gray-700">DESCRIPTION</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-700">QTY</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-700">RATE</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-700">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 text-sm text-gray-900">{item.description}</td>
                <td className="text-right py-3 text-sm text-gray-900">{item.quantity}</td>
                <td className="text-right py-3 text-sm text-gray-900">${item.rate.toFixed(2)}</td>
                <td className="text-right py-3 text-sm text-gray-900">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">Tax:</span>
              <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-2">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">NOTES:</h3>
            <p className="text-sm text-gray-600">{notes}</p>
          </div>
        )}

        {/* Payment Terms */}
        <div className="border-t pt-6 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-700 mb-2">PAYMENT TERMS:</h3>
          <p>Payment is due within 30 days. Please make checks payable to Your Company Name.</p>
          <p className="mt-2">Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

InvoiceGenerator.displayName = 'InvoiceGenerator';
