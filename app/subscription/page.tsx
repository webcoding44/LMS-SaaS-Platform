import {PricingTable} from "@clerk/nextjs";

const Subscription = () => {
    return (
        <main className="max-w-[1080px]">
            <section className="space-y-2">
                <p className="text-sm font-semibold text-primary">LEARN WITHOUT LIMITS</p>
                <h1>Choose a plan that fits your curiosity</h1>
                <p className="text-sm leading-6 text-muted-foreground">Manage your membership and unlock more room for personalized learning.</p>
            </section>
            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm max-sm:p-3">
                <PricingTable />
            </section>
        </main>
    )
}
export default Subscription
