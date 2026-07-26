'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TripForm from '@/components/TripForm';
import TripTable from '@/components/TripTable';
import { INITIAL_TRIPS, INITIAL_TAXIS } from '@/lib/data';
import { Trip, Taxi } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { FileText, Coins, CheckCircle, Navigation, ShieldCheck, Car, Key, Settings } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Dynamic state for mock database storage
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [taxis, setTaxis] = useState<Taxi[]>(INITIAL_TAXIS);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // ----------------------------------------------------
  // TRIP LOGIC (ADD / EDIT / DELETE)
  // ----------------------------------------------------
  const handleAddOrEditTrip = (data: Omit<Trip, 'id' | 'status'> & { id?: string }) => {
    if (data.id) {
      // Edit mode
      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === data.id
            ? { ...trip, ...data, amount: Number(data.amount) }
            : trip
        )
      );
      setEditingTrip(null);
    } else {
      // Add mode
      const newTrip: Trip = {
        id: `tr-${Date.now()}`,
        taxiNumber: data.taxiNumber,
        driverName: data.driverName,
        from: data.from,
        destination: data.destination,
        amount: Number(data.amount),
        date: data.date,
        status: 'Running', // default status
      };

      setTrips((prev) => [newTrip, ...prev]);

      // Automatically update the taxi status in the fleet to 'On Trip'
      setTaxis((prev) =>
        prev.map((t) =>
          t.number === data.taxiNumber ? { ...t, status: 'On Trip', tripsCompleted: t.tripsCompleted + 1 } : t
        )
      );
    }
  };

  const handleEditSelect = (trip: Trip) => {
    setEditingTrip(trip);
    // Auto shift view to the trip-entry tab if not already there
    setActiveTab('trip-entry');
  };

  const handleDeleteTrip = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trip record?')) {
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    }
  };

  // ----------------------------------------------------
  // TAXI FLEET STATUS CONTROLS
  // ----------------------------------------------------
  const handleTaxiStatusChange = (taxiId: string, newStatus: Taxi['status']) => {
    setTaxis((prev) =>
      prev.map((taxi) =>
        taxi.id === taxiId ? { ...taxi, status: newStatus } : taxi
      )
    );
  };

  // ----------------------------------------------------
  // STATS COMPUTATION (Computed live from current state)
  // ----------------------------------------------------
  const totalTripsCount = trips.length;
  const completedTripsCount = trips.filter((t) => t.status === 'Completed').length;
  const activeTaxisCount = taxis.filter((t) => t.status === 'On Trip').length;
  const totalRevenue = trips
    .filter((t) => t.status === 'Completed' || t.status === 'Running')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Dashboard Portal Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Header bar */}
        <Header activeTab={activeTab} onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Dynamic Workspace Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          {/* TAB 1: SYSTEM OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Top Welcome banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-primary to-primary-hover text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-xl sm:text-2xl font-bold font-heading">Welcome back, Accountant</h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    You have full access to record and monitor taxi journeys originating from Dang to destinations nationwide. Update vehicle schedules and verify fare collections below.
                  </p>
                </div>
              </div>

              {/* Stat Card Panel Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1: Total Trips recorded */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Today's Total Runs</span>
                    <h3 className="text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {totalTripsCount}
                    </h3>
                  </div>
                </div>

                {/* Stat 2: Total Revenue Collected */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Revenue Logged</span>
                    <h3 className="text-xl sm:text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {formatCurrency(totalRevenue)}
                    </h3>
                  </div>
                </div>

                {/* Stat 3: Taxis On Trip */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Vehicles On Trip</span>
                    <h3 className="text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {activeTaxisCount} <span className="text-xs text-text-secondary font-medium">/ 10</span>
                    </h3>
                  </div>
                </div>

                {/* Stat 4: Completed Trips */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Completed Runs</span>
                    <h3 className="text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {completedTripsCount}
                    </h3>
                  </div>
                </div>

              </div>

              {/* Grid block: Recent items list & quick shortcut */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Column 1 & 2: Trip Table list shortcut */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                      Recent Trip Entries
                    </h4>
                    <button
                      onClick={() => setActiveTab('trip-entry')}
                      className="text-xs font-bold text-accent hover:underline hover:text-accent-hover"
                    >
                      Manage All
                    </button>
                  </div>
                  <TripTable
                    trips={trips}
                    onEditTrip={handleEditSelect}
                    onDeleteTrip={handleDeleteTrip}
                  />
                </div>

                {/* Column 3: Quick Info Card */}
                <div className="space-y-6">
                  <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                    Administrative Quick Stats
                  </h4>
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 text-sm">
                    <div className="flex items-center space-x-3 text-primary font-semibold border-b border-slate-50 pb-3">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      <span>Security & Verification</span>
                    </div>
                    <ul className="space-y-3.5 text-xs text-text-secondary">
                      <li className="flex justify-between">
                        <span>Total Fleet Vehicles</span>
                        <span className="font-bold text-text-dark">10 Taxis</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Active Drivers Checked</span>
                        <span className="font-bold text-text-dark">10 Drivers</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Base Origin Office</span>
                        <span className="font-bold text-text-dark">Ghorahi, Dang</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Average Trip Amount</span>
                        <span className="font-bold text-text-dark">
                          {formatCurrency(totalTripsCount ? Math.round(totalRevenue / totalTripsCount) : 0)}
                        </span>
                      </li>
                    </ul>
                    <hr className="border-slate-50" />
                    <button
                      onClick={() => setActiveTab('trip-entry')}
                      className="w-full py-3 text-xs text-center font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-primary rounded-xl transition-all"
                    >
                      + Create New Log
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TRIP ENTRY FORM & TABLE ARCHIVE */}
          {activeTab === 'trip-entry' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Entry Column */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <TripForm
                  onSubmitTrip={handleAddOrEditTrip}
                  editingTrip={editingTrip}
                  onCancelEdit={() => setEditingTrip(null)}
                />
              </div>

              {/* Table Column */}
              <div className="lg:col-span-8 h-full">
                <TripTable
                  trips={trips}
                  onEditTrip={handleEditSelect}
                  onDeleteTrip={handleDeleteTrip}
                />
              </div>

            </div>
          )}

          {/* TAB 3: FLEET STATUS MANAGEMENT */}
          {activeTab === 'fleet' && (
            <div className="space-y-6">
              
              {/* Info panel */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-3">
                <Settings className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-bold">Accountant Tip: Active Taxi Dispatch</p>
                  <p className="mt-0.5 leading-relaxed font-medium">
                    When you register a new trip for a taxi, its status is automatically changed to "On Trip". You can manually override any vehicle's status to "Available" or "Maintenance" below once the driver reports back or checks into the garage.
                  </p>
                </div>
              </div>

              {/* List table */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="font-bold text-primary font-heading flex items-center">
                    <Car className="w-5 h-5 text-accent mr-2" />
                    <span>Vehicle Availability Control Room</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-primary uppercase select-none">
                        <th className="px-6 py-4">Vehicle plate</th>
                        <th className="px-6 py-4">Assigned Driver</th>
                        <th className="px-6 py-4">Total Runs</th>
                        <th className="px-6 py-4">Capacity</th>
                        <th className="px-6 py-4">Current Status</th>
                        <th className="px-6 py-4">Status Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {taxis.map((taxi) => (
                        <tr key={taxi.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                            {taxi.number}
                          </td>
                          <td className="px-6 py-3.5 text-text-dark font-medium whitespace-nowrap">
                            {taxi.driverName}
                          </td>
                          <td className="px-6 py-3.5 text-text-secondary whitespace-nowrap">
                            {taxi.tripsCompleted} runs
                          </td>
                          <td className="px-6 py-3.5 text-text-secondary text-xs whitespace-nowrap">
                            {taxi.seats} seats ({taxi.hasAC ? 'AC' : 'No AC'})
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                taxi.status === 'Available'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : taxi.status === 'On Trip'
                                  ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                                  : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}
                            >
                              {taxi.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <select
                              value={taxi.status}
                              onChange={(e) =>
                                handleTaxiStatusChange(taxi.id, e.target.value as Taxi['status'])
                              }
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none bg-white cursor-pointer hover:border-slate-300"
                            >
                              <option value="Available">Set Available</option>
                              <option value="On Trip">Set On Trip</option>
                              <option value="Maintenance">Set Maintenance</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}
