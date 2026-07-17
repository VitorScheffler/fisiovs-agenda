type AvatarProps = {
  src?: string | null;
  initials: string;
  color?: string;
  size?: string; // classes tailwind de tamanho, ex: "w-11 h-11"
  className?: string;
};

/**
 * Exibe a foto do usuário/paciente se houver, ou um círculo com as
 * iniciais (mesmo estilo já usado antes de existir upload de foto).
 */
export function Avatar({ src, initials, color, size = "w-11 h-11", className = "" }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arquivo local em /public/uploads, sem otimização necessária
      <img
        src={src}
        alt={initials}
        className={`${size} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-[14px] font-medium shrink-0 ${color ?? "bg-[var(--color-pine-100)] text-[var(--color-pine-700)]"} ${className}`}
    >
      {initials}
    </div>
  );
}
