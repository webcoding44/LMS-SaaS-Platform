import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <main className="min-h-[calc(100vh-76px)] items-center justify-center max-sm:min-h-[calc(100vh-66px)]">
        <SignIn />
    </main>
}