'use client';

import { useEffect, useMemo, useState } from 'react';
import { Coins, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { DailyRevenue, FleetCar, SessionUser } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface RevenuePanelProps {
  user: SessionUser;
  cars: FleetCar[];
  revenues: DailyRevenue[];
  onChanged: () => Promise<void>;
}

export default function RevenuePanel({ user, cars, revenues, onChanged }: RevenuePanelProps) {
  const isAdmin = user.role === 'admin';
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    carId: '',
    date: today,
    amount: '',
    route: '',
    note: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCar, setFilterCar] = useState('all');

  useEffect(() => {
    if (!form.carId && cars[0]?.id) {
      setForm((f) => ({ ...f, carId: cars[0].id }));
    }
  }, [cars, form.carId]);

  const carMap = useMemo(() => Object.fromEntries(cars.map((c) => [c.id, c])), [cars]);

  const filtered = useMemo(() => {
    if (filterCar === 'all') return revenues;
    return revenues.filter((r) => r.carId === filterCar);
  }, [revenues, filterCar]);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      carId: cars[0]?.id || '',
      date: today,
      amount: '',
      route: '',
      note: '',
    });
    setError(null);
    setShowForm(true);
  };

  const openEdit = (row: DailyRevenue) => {
    setEditingId(row.id);
    setForm({
      carId: row.carId,
      date: row.date,
      amount: String(row.amount),
      route: row.route || '',
      note: row.note || '',
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/revenue/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(form.amount),
            date: form.date,
            route: form.route,
            note: form.note,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
      } else {
        if (!form.carId) {
          throw new Error('Please select a car first.');
        }
        const res = await fetch('/api/revenue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            carId: form.carId,
            date: form.date,
            amount: Number(form.amount),
            route: form.route,
            note: form.note,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Save failed');
      }
      setShowForm(false);
      setEditingId(null);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this daily revenue entry?')) return;
    const res = await fetch(`/api/revenue/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Delete failed');
      return;
    }
    await onChanged();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary font-heading">Daily Revenue</h3>
          <p className="text-xs text-text-secondary mt-1">
            Log each gaadi ka daily collection amount
            {!isAdmin && ' · view only'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={filterCar}
            onChange={(e) => setFilterCar(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white"
          >
            <option value="all">All cars</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.carNumber}
              </option>
            ))}
          </select>
          {isAdmin && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover"
            >
              <Plus className="w-4 h-4" />
              Add Daily Amount
            </button>
          )}
        </div>
      </div>

      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
              {editingId ? 'Edit Daily Revenue' : 'Add Daily Revenue'}
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-xs font-bold text-danger bg-danger/5 border border-danger/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-bold text-primary uppercase">Car</label>
              <select
                required
                disabled={Boolean(editingId)}
                value={form.carId}
                onChange={(e) => setForm((f) => ({ ...f, carId: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white disabled:bg-slate-50"
              >
                <option value="" disabled>
                  Select a car...
                </option>
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.carNumber}
                  </option>
                ))}
              </select>
              {form.carId && (
                <p className="mt-1 text-[11px] text-text-secondary">
                  Saving for: <span className="font-bold text-primary">{carMap[form.carId]?.carNumber}</span>
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Amount (NPR)</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="8500"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Route</label>
              <input
                value={form.route}
                onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))}
                placeholder="e.g. Dang → Butwal"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Note</label>
              <input
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Optional"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || cars.length === 0}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Save Amount'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-primary uppercase">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Car</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Note</th>
                {isAdmin && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filtered.map((row) => {
                const car = carMap[row.carId];
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 whitespace-nowrap text-text-dark font-medium">{row.date}</td>
                    <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                      {car?.carNumber || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-text-secondary whitespace-nowrap">
                      {row.route || '—'}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-accent" />
                        {formatCurrency(row.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-text-secondary">{row.note || '—'}</td>
                    {isAdmin && (
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-2 rounded-lg border border-slate-200 text-primary hover:bg-slate-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-10 text-center text-text-secondary text-sm">
                    No revenue entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
