import {getAllCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import SortFilter from "@/components/SortFilter";
import Link from "next/link";
import { SearchX, Sparkles } from "lucide-react";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = typeof filters.subject === "string" ? filters.subject : "";
    const topic = typeof filters.topic === "string" ? filters.topic : "";
    const sort = filters.sort === "name-asc" || filters.sort === "name-desc"
        ? filters.sort
        : "recommended";

    const companions = await getAllCompanions({ limit: 100, subject, topic, sort });
    const hasFilters = Boolean(subject || topic || sort !== "recommended");

    return (
        <main>
            <section className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles size={16} /> YOUR LEARNING LIBRARY</p>
                        <h1>Find your next companion</h1>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Explore focused, friendly tutors and start a voice lesson on any topic.</p>
                    </div>
                </div>
                <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_190px_180px_auto]">
                    <SearchInput />
                    <SubjectFilter />
                    <SortFilter />
                    {hasFilters && (
                        <Link className="btn-secondary" href="/companions">
                            Clear filters
                        </Link>
                    )}
                </div>
            </section>
            <section aria-label="Companion results" className="companions-grid">
                {companions.length ? companions.map((companion) => (
                    <CompanionCard
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                    />
                )) : (
                    <div className="empty-state col-span-full">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <SearchX size={21} />
                        </div>
                        <h2 className="text-lg font-bold">No companions found</h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Try a different name or topic, or clear your filters to see the full library.</p>
                        <Link href="/companions" className="btn-secondary mt-5">Clear search and filters</Link>
                    </div>
                )}
            </section>
        </main>
    )
}

export default CompanionsLibrary
