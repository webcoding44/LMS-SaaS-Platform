import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

const Cta = () => {
    return (
        <section className="cta-section">
            <div className="cta-badge">Made for your curiosity</div>
            <h2 className="text-2xl font-bold tracking-tight">
                Your next great lesson starts here.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">Create a voice companion around a subject you want to understand better.</p>
            <Link href="/companions/new" className="btn-primary mt-2 w-full">
                <Plus size={16} aria-hidden="true" />
                Create a companion
                <ArrowRight size={16} aria-hidden="true" className="ml-auto" />
            </Link>
        </section>
    )
}
export default Cta
