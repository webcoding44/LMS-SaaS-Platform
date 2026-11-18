"use client";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const query = searchParams.get("subject") || "";

    const [subject, setSubject] = useState(query || "all");

    useEffect(() => {
        setSubject(query || "all");
    }, [query]);

    const updateSubject = (value: string) => {
        setSubject(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") params.delete("subject");
        else params.set("subject", value);
        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    };

    return (
        <Select onValueChange={updateSubject} value={subject}>
            <SelectTrigger aria-label="Filter by subject" className="input w-full min-w-[150px] capitalize">
                <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="capitalize">
                        {subject}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SubjectFilter;