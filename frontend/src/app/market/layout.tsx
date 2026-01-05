import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { auth0 } from "@/lib/auth0";

export default async function MarketLayout({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    // Fetch session server-side (returns null if not logged in - no error)
    const session = await auth0.getSession();

    // Extract safe user info to pass to client components
    const user = session?.user
        ? {
            name: session.user.name,
            email: session.user.email,
            picture: session.user.picture,
            nickname: session.user.nickname,
        }
        : null;

    return (
        <>
            <DashboardNavbar user={user} />
            {children}
        </>
    );
}