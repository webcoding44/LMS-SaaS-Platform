import {getCompanion} from "@/lib/actions/companion.actions";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getSubjectColor} from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionPageProps {
    params: Promise<{ id: string}>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params;
    const companion = await getCompanion(id);
    const user = await currentUser();

    const { name, subject, topic, duration } = companion;

    if(!user) redirect('/sign-in');
    if(!name) redirect('/companions')

    return (
        <main>
            <article className="rounded-border flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="subject-icon size-14" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <Image src={`/icons/${subject}.svg`} alt="" width={28} height={28} />
                    </div>

                    <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl">
                                {name}
                            </h1>
                            <div className="subject-badge">
                                {subject}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{topic}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Image src="/icons/clock.svg" alt="" width={16} height={16} />
                    {duration} minute lesson
                </div>
            </article>

            <CompanionComponent
                {...companion}
                companionId={id}
                userName={user.firstName!}
                userImage={user.imageUrl!}
            />
        </main>
    )
}

export default CompanionSession
