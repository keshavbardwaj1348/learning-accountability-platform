import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../api/auth";

const NavItem = ({ to, label, active }) => {
    return (
        <Link
            to={to}
            className={`rounded-lg px-3 py-2 text-sm border ${active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
        >
            {label}
        </Link>
    );
};

export default function Navbar() {
    const location = useLocation();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: async () => {
            await queryClient.clear();
            window.location.href = "/login";
        },
    });

    const pathname = location.pathname;

    return (
        <div className="sticky top-0 z-50 border-b theme-border bg-black/80 backdrop-blur">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <Link to="/dashboard" className="text-sm font-semibold text-white">
                    LearnFlow
                </Link>

                <div className="flex items-center gap-2">
                    <NavItem to="/dashboard" label="Dashboard" active={pathname === "/dashboard"} />
                    <NavItem
                        to="/daily/1/1"
                        label="Daily"
                        active={pathname.startsWith("/daily")}
                    />

                    <NavItem to="/dsa" label="DSA" active={pathname === "/dsa"} />
                    <NavItem to="/analytics" label="Analytics" active={pathname === "/analytics"} />
                    <NavItem to="/settings" label="Settings" active={pathname === "/settings"} />
                    <NavItem to="/roadmap" label="Roadmap" active={pathname === "/roadmap"} />
                    <NavItem to="/roadmap-full" label="8 Weeks" active={pathname === "/roadmap-full"} />

                    <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="rounded-lg px-3 py-2 text-sm border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-60"
                    >
                        {logoutMutation.isPending ? "..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
}
