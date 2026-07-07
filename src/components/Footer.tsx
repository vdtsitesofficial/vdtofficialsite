export default function Footer() {
  return (
    <footer
      className="themed-section border-t"
      style={{
        background: "var(--theme-bg)",
        borderColor: "var(--theme-line)",
        color: "var(--theme-ink-muted)",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span style={{ fontFamily: "var(--theme-font-body)" }}>
          &copy; {new Date().getFullYear()} VDT Sites
        </span>
        <nav
          aria-label="Legal"
          className="flex items-center gap-5 font-mono uppercase tracking-[0.18em] text-[10px]"
        >
          <a
            href="/terms-of-service"
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-ink-muted)" }}
          >
            Terms
          </a>
          <a
            href="/privacy-policy"
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-ink-muted)" }}
          >
            Privacy
          </a>
          <a
            href="/cookie-policy"
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-ink-muted)" }}
          >
            Cookies
          </a>
        </nav>
        <a
          href="https://vdtsites.com"
          target="_blank"
          rel="noreferrer"
          className="font-mono uppercase tracking-[0.18em] text-[10px] transition-opacity hover:opacity-70"
          style={{ color: "var(--theme-ink-muted)" }}
        >
          Site by VDTSITES.COM
        </a>
      </div>
    </footer>
  );
}
