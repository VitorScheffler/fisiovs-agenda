// Utilitários de data baseados na data real do dispositivo/servidor.
// A agenda usa semanas de Segunda a Sábado (índices 0-5, day=0 é Segunda).

const MONTH_NAMES_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const WEEKDAY_SHORT_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAY_LONG_PT = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];

/** Retorna a data de hoje (zerando horas) */
export function getToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Retorna a Segunda-feira da semana, com deslocamento opcional em semanas
 * (weekOffset: -1 = semana passada, +1 = semana que vem).
 */
export function getStartOfWeek(date: Date = getToday(), weekOffset = 0): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0-6, Dom-Sáb
  const diffToMonday = dow === 0 ? 6 : dow - 1;
  d.setDate(d.getDate() - diffToMonday + weekOffset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDDMM(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

/** Formata uma data como yyyy-MM-dd (para comparar/gravar) */
export function toISODate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Converte "yyyy-MM-dd" em Date (meia-noite local) */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Datas (dd/mm) de Segunda a Sábado da semana, com deslocamento opcional */
export function getWeekDates(weekOffset = 0): string[] {
  const monday = getStartOfWeek(getToday(), weekOffset);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return formatDDMM(d);
  });
}

/** Datas (yyyy-MM-dd) de Segunda a Sábado da semana, com deslocamento opcional */
export function getWeekISODates(weekOffset = 0): string[] {
  const monday = getStartOfWeek(getToday(), weekOffset);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toISODate(d);
  });
}

/** Data (yyyy-MM-dd) de um dia específico (0=Seg..5=Sáb) de uma semana com deslocamento */
export function getISODateForWeekday(weekOffset: number, dayIndex: number): string {
  const monday = getStartOfWeek(getToday(), weekOffset);
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  return toISODate(d);
}

/** Nome curto do dia da semana a partir de uma data ISO, ex: "Seg" */
export function formatWeekdayShort(iso: string): string {
  return WEEKDAY_SHORT_PT[fromISODate(iso).getDay()];
}

/** dd/mm a partir de uma data ISO */
export function formatDDMMFromISO(iso: string): string {
  return formatDDMM(fromISODate(iso));
}

/**
 * Índice (0-5, Seg-Sáb) do dia de hoje dentro da semana corrente,
 * ou null se hoje for Domingo (fora da grade da agenda).
 */
export function getTodayIndex(): number | null {
  const dow = getToday().getDay();
  if (dow === 0) return null;
  return dow - 1;
}

/** Rótulo legível do intervalo de uma semana (com deslocamento opcional), ex: "9 – 14 de junho, 2026" */
export function getWeekLabel(weekOffset = 0): string {
  const monday = getStartOfWeek(getToday(), weekOffset);
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  const startDay = monday.getDate();
  const endDay = saturday.getDate();
  const year = saturday.getFullYear();

  if (monday.getMonth() === saturday.getMonth()) {
    return `${startDay} – ${endDay} de ${MONTH_NAMES_PT[saturday.getMonth()]}, ${year}`;
  }
  return `${startDay} de ${MONTH_NAMES_PT[monday.getMonth()]} – ${endDay} de ${MONTH_NAMES_PT[saturday.getMonth()]}, ${year}`;
}

/** Dias do mês atual com seus índices de dia da semana (0=Seg ... 6=Dom), para o mini-calendário */
export function getCurrentMonthCalendarDays(): { label: string; date: number }[] {
  const today = getToday();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const labels = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const dow = new Date(year, month, date).getDay();
    const labelIndex = dow === 0 ? 6 : dow - 1;
    return { label: labels[labelIndex], date };
  });
}

/** Dia de hoje no mês (1-31) */
export function getTodayDateOfMonth(): number {
  return getToday().getDate();
}

/** Nome do mês e ano atuais, ex: "Junho 2026" */
export function getCurrentMonthLabel(): string {
  const today = getToday();
  const name = MONTH_NAMES_PT[today.getMonth()];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${today.getFullYear()}`;
}

/** Rótulo completo do dia de hoje, ex: "Quarta-feira, 10 de junho" */
export function getTodayFullLabel(): string {
  const today = getToday();
  const weekday = WEEKDAY_LONG_PT[today.getDay()];
  const month = MONTH_NAMES_PT[today.getMonth()];
  return `${weekday}, ${today.getDate()} de ${month}`;
}