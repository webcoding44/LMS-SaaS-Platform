'use client';

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import { Search } from "lucide-react";

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';
    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchQuery.trim()) {
                params.set("topic", searchQuery.trim());
            } else {
                params.delete("topic");
            }
            const queryString = params.toString();
            router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery, router, searchParams, pathname]);

    return (
        <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-input bg-white px-3 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Search size={17} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
                type="search"
                aria-label="Search companions by name or topic"
                placeholder="Search by name or topic"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </label>
    )
}
export default SearchInput
