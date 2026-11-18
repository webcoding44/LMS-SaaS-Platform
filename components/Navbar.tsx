"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">
            <Link href="/" aria-label="Learnmate home" onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-2.5">
                    <Image
                        src="/images/logo.svg"
                        alt=""
                        width={38}
                        height={38}
                    />
                    <span className="text-lg font-extrabold tracking-tight text-foreground">learnmate</span>
                </div>
            </Link>
            <div className="flex items-center gap-5">
                <div className="hidden items-center gap-6 md:flex">
                    <NavItems />
                    <SignedOut>
                        <SignInButton>
                            <button className="btn-signin">Sign in</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                <button
                    type="button"
                    className="btn-secondary size-10 min-h-10 p-0 md:hidden"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>
            {menuOpen && (
                <div id="mobile-navigation" className="absolute left-0 right-0 top-full flex flex-col gap-3 border-b border-border bg-white px-4 py-4 shadow-lg md:hidden">
                    <NavItems onNavigate={() => setMenuOpen(false)} />
                    <SignedOut>
                        <SignInButton>
                            <button className="btn-signin w-full justify-center">Sign in</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center gap-3 px-3 py-2">
                            <UserButton />
                            <span className="text-sm font-medium text-foreground">Your account</span>
                        </div>
                    </SignedIn>
                </div>
            )}
        </header>
    )
}

export default Navbar
