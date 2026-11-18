'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const navItems = [
    { label:'Home', href: '/' },
    { label: 'Companions', href: '/companions' },
    { label: 'My Journey', href: '/my-journey' },
]

const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => {
    const pathname = usePathname();

    return (
        <nav aria-label="Main navigation" className="flex items-center gap-1 max-md:flex-col max-md:items-stretch">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    aria-current={pathname === href ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn('nav-link', (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))) && 'nav-link-active')}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems
