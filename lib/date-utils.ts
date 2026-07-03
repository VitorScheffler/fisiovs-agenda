// Utilitários de data baseados na data real do dispositivo/servidor.
// A agenda usa semanas de Segunda a Sábado (índices 0-5, day=0 é Segunda).

const MONTH_NAMES_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** Retorna a data de hoje (zerando horas) */
export function getToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Retorna a Segunda-feira da semana corrente (semana de hoje).
 * getDay(): 0 = Domingo, 1 = Segunda ... 6 = Sábado.
 */
export function getStartOfWeek(date: Date = getToday()): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0-6, Dom-Sáb
  // Quantos dias subtrair para chegar à Segunda. Se for Domingo (0), volta 6 dias.
  const diffToMonday = dow === 0 ? 6 : dow - 1;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDDMM(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

/** Datas (dd/mm) de Segunda a Sábado da semana corrente */
export function getCurrentWeekDates(): string[] {
  const monday = getStartOfWeek();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return formatDDMM(d);
  });
}

/**
 * Índice (0-5, Seg-Sáb) do dia de hoje dentro da semana corrente,
 * ou null se hoje for Domingo (fora da grade da agenda).
 */
export function getTodayIndex(): number | null {
  const dow = getToday().getDay(); // 0-6, Dom-Sáb
  if (dow === 0) return null; // Domingo não aparece na grade Seg-Sáb
  return dow - 1; // Segunda(1)->0 ... Sábado(6)->5
}

/** Rótulo legível do intervalo da semana corrente, ex: "9 – 14 de junho, 2026" */
export function getCurrentWeekLabel(): string {
  const monday = getStartOfWeek();
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  const startDay = monday.getDate();
  const endDay = saturday.getDate();
  const year = saturday.getFullYear();

  if (monday.getMonth() === saturday.getMonth()) {
    return `${startDay} – ${endDay} de ${MONTH_NAMES_PT[saturday.getMonth()]}, ${year}`;
  }
  // Semana cruza dois meses
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
    const dow = new Date(year, month, date).getDay(); // 0=Dom..6=Sáb
    const labelIndex = dow === 0 ? 6 : dow - 1; // 0=Seg..6=Dom
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
  const weekdayNames = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado",
  ];
  const today = getToday();
  const weekday = weekdayNames[today.getDay()];
  const month = MONTH_NAMES_PT[today.getMonth()];
  return `${weekday}, ${today.getDate()} de ${month}`;
}
