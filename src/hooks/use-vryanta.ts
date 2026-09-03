import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { NotificationRow } from "@/lib/notifications";
import {
  curatedUnifiedJobs,
  employerJobToUnified,
  type EmployerJobRow,
  type ProfileRow,
  type UnifiedJob,
} from "@/lib/vryanta";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user: (session?.user ?? null) as User | null, loading };
}

export function useProfile() {
  const { user } = useSession();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data as ProfileRow | null;
    },
  });

  return { ...query, userId, user };
}

export function useResumeSections() {
  const { user } = useSession();
  const userId = user?.id;

  return useQuery({
    queryKey: ["resume-sections", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [education, experience, certifications, projects] = await Promise.all([
        supabase.from("education").select("*").eq("user_id", userId!).order("created_at", { ascending: false }),
        supabase.from("experience").select("*").eq("user_id", userId!).order("created_at", { ascending: false }),
        supabase.from("certifications").select("*").eq("user_id", userId!).order("created_at", { ascending: false }),
        supabase.from("projects").select("*").eq("user_id", userId!).order("created_at", { ascending: false }),
      ]);
      if (education.error) throw education.error;
      if (experience.error) throw experience.error;
      if (certifications.error) throw certifications.error;
      if (projects.error) throw projects.error;
      return {
        education: education.data ?? [],
        experience: experience.data ?? [],
        certifications: certifications.data ?? [],
        projects: projects.data ?? [],
      };
    },
  });
}

/** The single resume record for the signed-in user (created lazily by the resume builder). */
export function useResume() {
  const { user } = useSession();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ["resume", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("resumes").select("*").eq("user_id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return { ...query, userId };
}


export function useAllJobs() {
  return useQuery({
    queryKey: ["all-jobs"],
    queryFn: async (): Promise<UnifiedJob[]> => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const employerJobs = ((data ?? []) as EmployerJobRow[]).map(employerJobToUnified);
      return [...employerJobs, ...curatedUnifiedJobs];
    },
  });
}

export function useSavedJobs() {
  const { user } = useSession();
  const userId = user?.id;
  return useQuery({
    queryKey: ["saved-jobs", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useApplications() {
  const { user } = useSession();
  const userId = user?.id;
  return useQuery({
    queryKey: ["applications", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useJobAlerts() {
  const { user } = useSession();
  const userId = user?.id;
  return useQuery({
    queryKey: ["job-alerts", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_alerts")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNotifications() {
  const { user } = useSession();
  const userId = user?.id;
  const query = useQuery({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<NotificationRow[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as NotificationRow[];
    },
  });
  const unread = (query.data ?? []).filter((row) => !row.is_read).length;
  return { ...query, unread, userId };
}

