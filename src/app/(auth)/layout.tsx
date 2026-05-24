export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ background: 'var(--bg-0)' }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      {/* Subtle radial glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(108,99,255,0.12) 0%, transparent 70%)',
        }}
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}