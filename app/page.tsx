import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const Page = async () => {
  const [companions, recentSessions] = await Promise.all([
    getAllCompanions({ limit: 3 }),
    getRecentSessions(10),
  ]);

  const recentSessionsCompanions = Array.from(
    new Map(
      recentSessions.map((companion) => [companion.id, companion])
    ).values()
  );

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-[#d5e2d7] bg-gradient-to-br from-[#fbfcf8] via-[#f6f9f3] to-[#e2eee4] p-8 shadow-sm max-sm:p-6">
        <div className="max-w-2xl space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles size={16} /> A LITTLE MORE CURIOUS, EVERY DAY</p>
          <h1 className="text-4xl leading-tight max-sm:text-3xl">Learn something new, <span className="text-primary">your way.</span></h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">Meet your AI learning companion and turn the subjects you care about into thoughtful voice conversations.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/companions" className="btn-primary"><BookOpen size={17} /> Explore companions</Link>
            <Link href="/companions/new" className="btn-secondary">Create a companion <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div aria-hidden="true" className="hidden size-44 shrink-0 items-center justify-center rounded-full bg-[#dcebe3] text-primary lg:flex">
          <div className="flex size-32 items-center justify-center rounded-full border border-[#fbfcf8] bg-[#fbfcf8] shadow-sm">
            <BookOpen size={54} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular companions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find a friendly guide for whatever you want to explore.</p>
          </div>
          <Link href="/companions" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex">Browse all <ArrowRight size={15} /></Link>
        </div>
        <div className="companions-grid">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-5 lg:flex-row">
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames="lg:flex-1"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;