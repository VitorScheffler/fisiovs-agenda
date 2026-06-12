"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { appointments as initialAppointments } from "@/lib/mock-data";
import { findUser } from "@/lib/users";
import { PATIENTS } from "@/lib/patients";

type Patient = (typeof PATIENTS)[number];

type User = NonNullable<ReturnType<typeof findUser>>;

type ModalState =
  | { type: "appointment"; appointment: Appointment }
  | { type: "new"; day: number; time: string }
  | null;

interface AppContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  appointments: Appointment[];
  modal: ModalState;
  openAppointment: (a: Appointment) => void;
  openNewSlot: (day: number, time: string) => void;
  closeModal: () => void;
  approveAppointment: (id: string) => void;
  rejectAppointment: (id: string) => void;
  addAppointment: (a: Appointment) => void;
  patients: Patient[];
  updatePatient: (id: string, data: Partial<Patient>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [modal, setModal] = useState<ModalState>(null);
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);

  const login = useCallback((email: string, password: string): User | null => {
    const user = findUser(email, password);
    if (user) setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const openAppointment = useCallback((a: Appointment) => {
    setModal({ type: "appointment", appointment: a });
  }, []);

  const openNewSlot = useCallback((day: number, time: string) => {
    setModal({ type: "new", day, time });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const approveAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "confirmado" as AppointmentStatus } : a
      )
    );
    setModal(null);
  }, []);

  const rejectAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setModal(null);
  }, []);

  const addAppointment = useCallback((a: Appointment) => {
    setAppointments((prev) => [...prev, a]);
  }, []);

  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser, login, logout,
        appointments, modal,
        openAppointment, openNewSlot, closeModal,
        approveAppointment, rejectAppointment, addAppointment,
        patients, updatePatient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}