
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {cn, getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface CompanionsListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
    emptyMessage?: string;
    emptyAction?: { href: string; label: string };
}

const CompanionsList = ({ title, companions, classNames, emptyMessage, emptyAction }: CompanionsListProps) => {
    return (
        <article className={cn('companion-list', classNames)}>
            <h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>

            {companions?.length ? <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/3">Lesson</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companions?.map(({id, subject, name, topic, duration}, index) => (
                        <TableRow key={`${id}-${name}-${index}`} className="hover:bg-muted/50">
                            <TableCell>
                                <Link href={`/companions/${id}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="subject-icon max-md:hidden" style={{ backgroundColor: getSubjectColor(subject) }}>
                                            <Image
                                                src={`/icons/${subject}.svg`}
                                                alt=""
                                                width={24}
                                                height={24} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <p className="truncate font-semibold text-foreground">
                                                {name}
                                            </p>
                                            <p className="line-clamp-1 text-sm text-muted-foreground">
                                                {topic}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="subject-badge w-fit max-md:hidden">
                                    {subject}
                                </div>
                                <div className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                            <Image src={`/icons/${subject}.svg`} alt="" width={18} height={18} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 w-full justify-end">
                            <p className="text-sm font-medium">
                                        {duration} {' '}
                                <span>min</span>
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> : (
                <div className="rounded-xl bg-muted/60 px-4 py-8 text-center">
                    <p className="text-sm leading-6 text-muted-foreground">
                        {emptyMessage || "Once you complete a lesson, it will show up here."}
                    </p>
                    {emptyAction && (
                        <Link className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline" href={emptyAction.href}>
                            {emptyAction.label}
                        </Link>
                    )}
                </div>
            )}
        </article>
    )
}

export default CompanionsList;