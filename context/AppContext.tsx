"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Appointment, AppointmentStatus, Patient, User } from "@/lib/types";

type ModalState =
  | { type: "appointment"; appointment: Appointment }
  | { type: "new"; date: string; time: string }
  | { type: "atendimento"; appointment: Appointment }
  | null;

interface AppContextValue {
  currentUser: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User } | { error: string }>;
  logout: () => Promise<void>;

  appointments: Appointment[];
  appointmentsLoading: boolean;
  refreshAppointments: () => Promise<void>;

  modal: ModalState;
  openAppointment: (a: Appointment) => void;
  openNewSlot: (date: string, time: string) => void;
  closeModal: () => void;

  approveAppointment: (id: string) => Promise<void>;
  rejectAppointment: (id: string) => Promise<void>;
  addAppointment: (a: Omit<Appointment, "id">) => Promise<void>;

  patients: Patient[];
  patientsLoading: boolean;
  refreshPatients: () => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;

  openAtendimento: (a: Appointment) => void;
  saveAtendimento: (appointmentId: string, formData: FormData) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error ?? `Erro na requisição (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const [modal, setModal] = useState<ModalState>(null);

  // Carrega sessão atual ao montar
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiFetch<{ user: User }>("/api/auth/me");
        if (active) setCurrentUser(data.user);
      } catch {
        if (active) setCurrentUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const refreshAppointments = useCallback(async () => {
    setAppointmentsLoading(true);
    try {
      const data = await apiFetch<{ appointments: Appointment[] }>("/api/appointments");
      setAppointments(data.appointments);
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  const refreshPatients = useCallback(async () => {
    setPatientsLoading(true);
    try {
      const data = await apiFetch<{ patients: Patient[] }>("/api/patients");
      setPatients(data.patients);
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  // Carrega dados sempre que o usuário muda (login/logout)
  useEffect(() => {
    if (!currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset intencional ao deslogar
      setAppointments([]);
      setPatients([]);
      return;
    }
    refreshAppointments().catch(() => {});
    if (currentUser.role !== "paciente") {
      refreshPatients().catch(() => {});
    }
  }, [currentUser, refreshAppointments, refreshPatients]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ user: User } | { error: string }> => {
      try {
        const data = await apiFetch<{ user: User }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setCurrentUser(data.user);
        return { user: data.user };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Erro ao entrar." };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setCurrentUser(null);
  }, []);

  const openAppointment = useCallback((a: Appointment) => {
    setModal({ type: "appointment", appointment: a });
  }, []);

  const openNewSlot = useCallback((date: string, time: string) => {
    setModal({ type: "new", date, time });
  }, []);

  const openAtendimento = useCallback((a: Appointment) => {
    setModal({ type: "atendimento", appointment: a });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const approveAppointment = useCallback(async (id: string) => {
    const data = await apiFetch<{ appointment: Appointment }>(
      `/api/appointments/${id}/approve`,
      { method: "POST" }
    );
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "confirmado" as AppointmentStatus } : a))
    );
    setModal(null);
    return data;
  }, []);

  const rejectAppointment = useCallback(async (id: string) => {
    await apiFetch(`/api/appointments/${id}/reject`, { method: "POST" });
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setModal(null);
  }, []);

  const addAppointment = useCallback(async (a: Omit<Appointment, "id">) => {
    const { patient, ...rest } = a;
    const data = await apiFetch<{ appointment: Appointment }>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({ ...rest, patientName: patient }),
    });
    setAppointments((prev) => [...prev, data.appointment]);
  }, []);

  const updatePatient = useCallback(async (id: string, data: Partial<Patient>) => {
    const result = await apiFetch<{ patient: Patient }>(`/api/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    setPatients((prev) => prev.map((p) => (p.id === id ? result.patient : p)));
  }, []);

  const saveAtendimento = useCallback(async (appointmentId: string, formData: FormData) => {
    const res = await fetch(`/api/appointments/${appointmentId}/atendimento`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error ?? `Erro ao salvar atendimento (${res.status})`);
    }
    await refreshPatients();
    setModal(null);
  }, [refreshPatients]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authLoading,
        login,
        logout,
        appointments,
        appointmentsLoading,
        refreshAppointments,
        modal,
        openAppointment,
        openNewSlot,
        closeModal,
        approveAppointment,
        rejectAppointment,
        addAppointment,
        patients,
        patientsLoading,
        refreshPatients,
        updatePatient,
        openAtendimento,
        saveAtendimento,
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
