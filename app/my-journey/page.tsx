import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getUserSessionCount,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";
import Link from "next/link";
import { ArrowRight, Bookmark, Check, Plus } from "lucide-react";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const [companions, sessionHistory, bookmarkedCompanions, sessionCount] = await Promise.all([
    getUserCompanions(user.id),
    getUserSessions(user.id),
    getBookmarkedCompanions(user.id),
    getUserSessionCount(user.id),
  ]);

  return (
    <main>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm max-sm:p-5">
        <div className="flex min-w-0 items-center gap-4">
          <Image
            src={user.imageUrl}
            alt=""
            width={76}
            height={76}
            className="size-[76px] rounded-full border border-border object-cover"
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">YOUR LEARNING JOURNEY</p>
            <h1 className="text-2xl">
              {user.firstName || "Learner"} {user.lastName}
            </h1>
            <p className="break-all text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-3 sm:w-auto">
          <div className="min-w-[110px] rounded-xl bg-[#dce9de] p-4 max-sm:min-w-0 max-sm:p-3">
            <Check size={18} className="mb-3 text-primary" />
            <p className="text-2xl font-bold">{sessionCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Lessons completed</p>
          </div>
          <div className="min-w-[110px] rounded-xl bg-[#d8e8e2] p-4 max-sm:min-w-0 max-sm:p-3">
            <Plus size={18} className="mb-3 text-[#2c7668]" />
            <p className="text-2xl font-bold">{companions.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Companions made</p>
          </div>
          <div className="min-w-[110px] rounded-xl bg-[#efe4d2] p-4 max-sm:min-w-0 max-sm:p-3">
            <Bookmark size={18} className="mb-3 text-[#805a2b]" />
            <p className="text-2xl font-bold">{bookmarkedCompanions.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Saved companions</p>
          </div>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <CompanionsList
          companions={bookmarkedCompanions}
          title="Bookmarked companions"
          emptyMessage="Save companions from the library and they will be easy to find here."
          emptyAction={{ href: "/companions", label: "Explore companions" }}
        />
        <CompanionsList
          companions={sessionHistory}
          title="Recent sessions"
          emptyMessage="Your completed voice lessons will appear here."
          emptyAction={{ href: "/companions", label: "Find a lesson" }}
        />
        <CompanionsList
          companions={companions}
          title="My companions"
          classNames="lg:col-span-2"
          emptyMessage="Create a companion for a topic you want to understand better."
          emptyAction={{ href: "/companions/new", label: "Create a companion" }}
        />
      </div>
      {companions.length === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#cbdccd] bg-[#dce9de] p-5">
          <div>
            <h2 className="font-bold">Make learning personal</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a companion tailored to the topics you want to learn.</p>
          </div>
          <Link href="/companions/new" className="btn-primary">Create your first companion <ArrowRight size={16} /></Link>
        </div>
      )}
    </main>
  );
};
export default Profile;
