-- Replace has_role() usage in policies with inline, self-scoped role lookups
-- so EXECUTE on the SECURITY DEFINER helper can be revoked from app users.

DROP POLICY IF EXISTS "Admins read all roles" ON public.user_roles;

DROP POLICY IF EXISTS "Employers view public profiles" ON public.profiles;
CREATE POLICY "Employers view public profiles" ON public.profiles
FOR SELECT TO authenticated
USING (
  visibility = 'public'
  AND account_type = 'job_seeker'
  AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'employer'::public.app_role)
);

DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles" ON public.profiles
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "Employers view education of public profiles" ON public.education;
CREATE POLICY "Employers view education of public profiles" ON public.education
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'employer'::public.app_role)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = education.user_id AND p.visibility = 'public')
);

DROP POLICY IF EXISTS "Employers view experience of public profiles" ON public.experience;
CREATE POLICY "Employers view experience of public profiles" ON public.experience
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'employer'::public.app_role)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = experience.user_id AND p.visibility = 'public')
);

DROP POLICY IF EXISTS "Employers view certs of public profiles" ON public.certifications;
CREATE POLICY "Employers view certs of public profiles" ON public.certifications
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'employer'::public.app_role)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = certifications.user_id AND p.visibility = 'public')
);

DROP POLICY IF EXISTS "Admins manage jobs" ON public.jobs;
CREATE POLICY "Admins manage jobs" ON public.jobs
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage applications" ON public.applications;
CREATE POLICY "Admins manage applications" ON public.applications
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;