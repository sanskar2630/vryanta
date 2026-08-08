import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({ meta: [{ title: "Signing you in — Vryanta" }, { name: "robots", content: "noindex" }] }),
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function go() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!data.session) {
        navigate({ to: "/auth/login", replace: true });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", data.session.user.id)
        .maybeSingle();
      navigate({ to: profile?.account_type === "employer" ? "/employer" : "/dashboard", replace: true });
    }
    void go();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center px-5 text-sm text-muted-foreground">
      Signing you in…
    </div>
  );
}
