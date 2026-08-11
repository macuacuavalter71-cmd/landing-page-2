import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/veriscope/Header";
import { ContextBridge, Footer, Hero } from "@/components/veriscope/Hero";
import { PrimeSection } from "@/components/veriscope/PrimeSection";
import { CommunitySection } from "@/components/veriscope/CommunitySection";
import { Delivery } from "@/components/veriscope/Delivery";

const title = "Veriscope — Session Matrix access & Prime reveal";
const description =
  "Your Session Matrix Pine Script v6 is ready — copy or download it, and see what Veriscope Prime shows once you know when to look.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ContextBridge />
        <PrimeSection />

        <CommunitySection
          slug="prime_feedback"
          title="What Do You Think of Veriscope Prime?"
          subtitle="Share your first impression."
          postBody="First look at Veriscope Prime — structure across three layers, order blocks and fair value gaps tracked through their lifecycle, liquidity mapped where it builds, all synced to a higher timeframe."
        />

        <Delivery />

        <CommunitySection
          slug="session_matrix_feedback"
          title="How Are You Using the Session Matrix?"
          subtitle="Tell us what you think now that you have it."
          postBody="The Veriscope Session Matrix is yours — Pine Script v6, no subscription, no account. Sessions, kill zones and session fingerprint stats, answering one question: when is the chart worth watching?"
        />
      </main>
      <Footer />
    </div>
  );
}
