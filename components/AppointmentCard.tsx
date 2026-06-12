import { Appointment, categoryLabels } from "@/lib/types";

const categoryStyles: Record<Appointment["category"], string> = {
  avaliacao: "bg-[var(--color-cat-avaliacao-bg)] text-[var(--color-cat-avaliacao-fg)]",
  retorno: "bg-[var(--color-cat-retorno-bg)] text-[var(--color-cat-retorno-fg)]",
  tratamento: "bg-[var(--color-cat-tratamento-bg)] text-[var(--color-cat-tratamento-fg)]",
  pilates: "bg-[var(--color-cat-pilates-bg)] text-[var(--color-cat-pilates-fg)]",
  bloqueado: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-cat-bloqueado-fg)]",
};

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const isPending = appointment.status === "pendente";

  return (
    <button
      className={`group h-full w-full text-left rounded-[10px] px-2.5 py-2 flex flex-col gap-0.5 transition-transform hover:-translate-y-0.5 ${
        categoryStyles[appointment.category]
      } ${isPending ? "border border-dashed border-[var(--color-terracotta-600)]" : ""}`}
    >
      <span className="text-[12.5px] font-medium leading-tight truncate">
        {appointment.patient}
      </span>
      <span className="text-[11px] opacity-80 leading-tight truncate">
        {appointment.note ?? categoryLabels[appointment.category]}
      </span>
      {isPending ? (
        <span className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-medium text-[var(--color-terracotta-600)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-600)]" />
          Aguarda aprovação
        </span>
      ) : null}
    </button>
  );
}
