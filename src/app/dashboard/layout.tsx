import { serverNow } from "@/lib/server-clock";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: subscription }] = user
    ? await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("status, current_period_end, plans:plan_id(name)").eq("user_id", user.id).maybeSingle(),
      ])
    : [{ data: null }, { data: null }];

  const active = subscription?.status === "active" &&
    !!subscription.current_period_end &&
    new Date(subscription.current_period_end).getTime() > serverNow();
  const plan = Array.isArray(subscription?.plans) ? subscription.plans[0] : subscription?.plans;

  return (
    <DashboardShell
      name={profile?.full_name || user?.email?.split("@")[0] || "Membre"}
      planName={active ? plan?.name || "VIP" : null}
      periodEnd={active ? subscription?.current_period_end || null : null}
    >
      {children}
    </DashboardShell>
  );
}
