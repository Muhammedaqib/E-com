"use client";

import { useState, useTransition } from "react";
import { formatMoney } from "@/lib/format";
import { updateInvoiceAction } from "@/lib/actions/admin-invoice";
import Link from "next/link";

export function InvoiceView({ order }: { order: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const parsedAddress = JSON.parse(order.address);
  const [address, setAddress] = useState(parsedAddress);
  const [items, setItems] = useState(order.items);

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateInvoiceAction(order.id, { ...address, items });
      if (res.success) {
        setIsEditing(false);
      } else {
        alert(res.error);
      }
    });
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(items.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddItem = () => {
    const newItem = {
      id: `new-${Date.now()}`,
      title: "New Item",
      description: "",
      price: 0,
      quantity: 1,
      productId: "CUSTOM"
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert("Invoice must have at least one item.");
      return;
    }
    setItems(items.filter((i: any) => i.id !== id));
  };

  const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white p-8 shadow-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-lg min-h-[1000px] flex flex-col">
      <div className="flex justify-between items-start border-b border-slate-200 pb-8 dark:border-slate-800">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Invoice</h1>
          <p className="mt-2 text-slate-500 font-medium">#{order.id}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-amber-600">BazarMart</h2>
          <p className="text-sm text-slate-500">123 Marketplace Ave, Digital City</p>
          <p className="text-sm text-slate-500">contact@bazarmart.com</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-12">
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Billed To</h3>
          {isEditing ? (
            <div className="space-y-2">
              <input 
                className="w-full text-sm border p-1 dark:bg-slate-950 dark:border-slate-700" 
                value={address.fullName} 
                onChange={e => setAddress({...address, fullName: e.target.value})} 
              />
              <input 
                className="w-full text-sm border p-1 dark:bg-slate-950 dark:border-slate-700" 
                value={address.line1} 
                onChange={e => setAddress({...address, line1: e.target.value})} 
              />
              <input 
                className="w-full text-sm border p-1 dark:bg-slate-950 dark:border-slate-700" 
                value={address.line2 || ""} 
                onChange={e => setAddress({...address, line2: e.target.value})} 
                placeholder="Line 2 (optional)"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  className="w-full text-sm border p-1 dark:bg-slate-950 dark:border-slate-700" 
                  value={address.city} 
                  onChange={e => setAddress({...address, city: e.target.value})} 
                />
                <input 
                  className="w-full text-sm border p-1 dark:bg-slate-950 dark:border-slate-700" 
                  value={address.postalCode} 
                  onChange={e => setAddress({...address, postalCode: e.target.value})} 
                />
              </div>
              <input 
                className="w-full text-sm border p-1 dark:bg-slate-950 dark:border-slate-700" 
                value={address.phone} 
                onChange={e => setAddress({...address, phone: e.target.value})} 
              />
            </div>
          ) : (
            <div className="text-slate-700 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">{address.fullName}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.postalCode}</p>
              <p className="mt-2 text-sm">{address.phone}</p>
              <p className="mt-1 text-sm">{order.user.email}</p>
            </div>
          )}
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">Details</h3>
          <div className="text-slate-700 dark:text-slate-300 space-y-1">
            <p><span className="text-slate-400">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><span className="text-slate-400">Status:</span> {order.status}</p>
            <p><span className="text-slate-400">Payment:</span> Credit Card</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-900 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white dark:border-white">
              <th className="py-4">Description</th>
              <th className="py-4 text-center">Price</th>
              <th className="py-4 text-center">Qty</th>
              <th className="py-4 text-right">Total</th>
              {isEditing && <th className="py-4 text-right print:hidden">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item: any) => (
              <tr key={item.id} className="text-sm">
                <td className="py-6">
                  {isEditing ? (
                    <div className="space-y-1">
                      <input 
                        className="w-full border p-1 font-bold dark:bg-slate-950 dark:border-slate-700" 
                        value={item.title} 
                        onChange={e => handleItemChange(item.id, 'title', e.target.value)} 
                        placeholder="Item title"
                      />
                      <textarea 
                        className="w-full border p-1 text-xs dark:bg-slate-950 dark:border-slate-700" 
                        value={item.description || ""} 
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)} 
                        placeholder="Detailed description (optional)"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500 whitespace-pre-wrap">{item.description}</p>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-tight">ID: {item.productId || 'Manual'}</p>
                </td>
                <td className="py-6 text-center">
                  {isEditing ? (
                    <input 
                      type="number" 
                      className="w-24 border p-1 text-center dark:bg-slate-950 dark:border-slate-700" 
                      value={isNaN(item.price) ? "" : item.price} 
                      onChange={e => handleItemChange(item.id, 'price', parseInt(e.target.value, 10) || 0)} 
                    />
                  ) : (
                    formatMoney(item.price)
                  )}
                </td>
                <td className="py-6 text-center">
                  {isEditing ? (
                    <input 
                      type="number" 
                      className="w-16 border p-1 text-center dark:bg-slate-950 dark:border-slate-700" 
                      value={isNaN(item.quantity) ? "" : item.quantity} 
                      onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value, 10) || 0)} 
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="py-6 text-right font-bold text-slate-900 dark:text-white">
                  {formatMoney(item.price * item.quantity)}
                </td>
                {isEditing && (
                  <td className="py-6 text-right print:hidden">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isEditing && (
          <div className="mt-4 print:hidden">
            <button
              onClick={handleAddItem}
              className="text-xs font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              + Add Item
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 pt-10 border-t-2 border-slate-900 dark:border-white">
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatMoney(total)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t border-slate-200 pt-3 dark:border-slate-800 text-slate-900 dark:text-white">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center text-xs text-slate-400 uppercase tracking-widest">
        Thank you for your business
      </div>

      {/* Admin Controls */}
      <div className="mt-10 flex gap-4 print:hidden justify-center bg-slate-50 p-6 rounded-xl dark:bg-slate-800/50">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition shadow-sm"
            >
              Edit Invoice
            </button>
            <button
              onClick={() => window.print()}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm dark:bg-white dark:text-slate-900"
            >
              Print Invoice
            </button>
            <Link
              href={`/admin/orders/${order.id}`}
              className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200"
            >
              Back to Order
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-500 transition disabled:opacity-50 shadow-sm"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setAddress(parsedAddress);
                setItems(order.items);
                setIsEditing(false);
              }}
              className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-200"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
