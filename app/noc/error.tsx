'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Erro ao carregar dashboard NOC.</p>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  );
}