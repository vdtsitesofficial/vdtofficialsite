/**
 * Five filled stars. Purely decorative: every review VDT has is 5 stars, so
 * this is a fixed graphic rather than a rating component, and it carries an
 * aria-label instead of any rating markup.
 *
 * Note there is deliberately no schema.org rating attached anywhere this is
 * used - see the note in lib/testimonials.ts.
 */
export default function Stars({ size = 14 }: { size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#f5a623"
          aria-hidden
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}
