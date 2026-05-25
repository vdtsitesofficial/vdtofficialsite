import AboutSection from "@/components/AboutSection";
import ContactForm from "@/components/ContactForm";
import CtaSection from "@/components/CtaSection";
import FluidFooterMark from "@/components/FluidFooterMark";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import PreviewBanner from "@/components/PreviewBanner";
import PreviewEndStrip from "@/components/PreviewEndStrip";
import ProcessSection from "@/components/ProcessSection";
import ProfessionalIntegrations from "@/components/ProfessionalIntegrations";
import SiteNav from "@/components/SiteNav";
import ThemeProvider from "@/components/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="min-h-screen flex flex-col">
        {/* Always-visible context strip: this is a showcase, not the brand. */}
        <PreviewBanner />

        <div className="relative">
          <SiteNav activeHref="/" />
          <HeroCarousel />
        </div>

        {/* Theme-specific capability demos that render in-page (not just
            inside the hero). Each component checks the active theme and
            returns null when it isn't its turn. */}
        <ProfessionalIntegrations />

        {/* Hand-off strip between the preview (above) and VDT's actual
            brand story (below). Stays consistent regardless of theme. */}
        <PreviewEndStrip />

        <AboutSection />
        <ProcessSection />
        <CtaSection />

        <section
          id="form"
          className="themed-section py-24 px-6 sm:px-12"
          style={{
            background: "var(--theme-bg-alt)",
            color: "var(--theme-ink)",
          }}
        >
          <div className="mx-auto max-w-xl">
            <p
              className="text-[11px] tracking-[0.32em] uppercase mb-3"
              style={{ color: "var(--theme-ink-muted)" }}
            >
              Tell us everything
            </p>
            <h2
              className="text-4xl sm:text-5xl mb-3 leading-none"
              style={{ fontFamily: "var(--theme-font-display)" }}
            >
              Send a message
            </h2>
            <p
              className="text-sm mb-10"
              style={{
                color: "var(--theme-ink-muted)",
                fontFamily: "var(--theme-font-body)",
              }}
            >
              Drop a note and it lands in the inbox.
            </p>
            <ContactForm />
          </div>
        </section>

        {/* Apechain-style cursor-reactive fluid wordmark. Real Navier-
            Stokes solver + particle text. Sits between the contact
            form and the link/copyright footer. Saved component pattern
            in the vault → Shared/Fluid Footer Wordmark.md. */}
        <FluidFooterMark word="VDTSITES" />

        <Footer />
      </main>
    </ThemeProvider>
  );
}
