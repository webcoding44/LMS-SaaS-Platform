import CompanionForm from "@/components/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";

const NewCompanion = async () => {
    const { userId } = await auth();
    if(!userId) redirect('/sign-in');

    const canCreateCompanion = await newCompanionPermissions();

    return (
        <main className="max-w-[720px]">
            {canCreateCompanion ? (
                <article className="flex w-full flex-col gap-5">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-primary">PERSONALIZE YOUR LEARNING</p>
                        <h1>Create a companion</h1>
                        <p className="text-sm leading-6 text-muted-foreground">Set up a tutor for a subject you want to understand better. You can start a voice lesson right after creation.</p>
                    </div>
                    <CompanionForm />
                </article>
                ) : (
                    <article className="companion-limit">
                        <Image src="/images/limit.svg" alt="Companion limit reached" width={360} height={230} />
                        <div className="cta-badge">
                            Upgrade your plan
                        </div>
                        <h1>You’ve Reached Your Limit</h1>
                        <p className="max-w-md text-muted-foreground">You’ve reached your companion limit. Upgrade to create more companions and unlock premium features.</p>
                        <Link href="/subscription" className="btn-primary w-full justify-center" >
                            Upgrade My Plan
                        </Link>
                    </article>
                )}
        </main>
    )
}

export default NewCompanion
