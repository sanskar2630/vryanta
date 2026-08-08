
CREATE TYPE public.app_role AS ENUM ('job_seeker','employer','admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  headline text,
  about text,
  location text,
  phone text,
  avatar_url text,
  account_type text NOT NULL DEFAULT 'job_seeker',
  visibility text NOT NULL DEFAULT 'public',
  skills text[] NOT NULL DEFAULT '{}',
  languages jsonb NOT NULL DEFAULT '[]',
  desired_titles text[] NOT NULL DEFAULT '{}',
  preferred_locations text[] NOT NULL DEFAULT '{}',
  expected_salary text,
  work_modes text[] NOT NULL DEFAULT '{}',
  job_types text[] NOT NULL DEFAULT '{}',
  is_fresher boolean NOT NULL DEFAULT true,
  resume_url text,
  company_name text,
  company_type text,
  company_website text,
  notify_job_alerts boolean NOT NULL DEFAULT true,
  notify_application_updates boolean NOT NULL DEFAULT true,
  notify_employer_messages boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Employers view public profiles" ON public.profiles FOR SELECT TO authenticated
  USING (visibility = 'public' AND account_type = 'job_seeker' AND public.has_role(auth.uid(),'employer'));
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree text NOT NULL,
  institution text NOT NULL,
  field text,
  start_year text,
  end_year text,
  grade text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO authenticated;
GRANT ALL ON public.education TO service_role;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own education" ON public.education FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Employers view education of public profiles" ON public.education FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'employer') AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = education.user_id AND p.visibility = 'public'));

CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  start_date text,
  end_date text,
  is_current boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own experience" ON public.experience FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Employers view experience of public profiles" ON public.experience FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'employer') AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = experience.user_id AND p.visibility = 'public'));

CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text,
  issue_date text,
  credential_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own certifications" ON public.certifications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Employers view certs of public profiles" ON public.certifications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'employer') AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = certifications.user_id AND p.visibility = 'public'));

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL DEFAULT 'Full-time',
  work_mode text NOT NULL DEFAULT 'On-site',
  stipend text,
  qualification text,
  summary text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  requirements text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT ON public.jobs TO anon;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views published jobs" ON public.jobs FOR SELECT USING (status = 'published');
CREATE POLICY "Employers manage own jobs" ON public.jobs FOR ALL TO authenticated USING (employer_id = auth.uid()) WITH CHECK (employer_id = auth.uid());
CREATE POLICY "Admins manage jobs" ON public.jobs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_ref text NOT NULL,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  job_title text NOT NULL,
  company text NOT NULL,
  location text,
  cover_note text,
  match_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Applied',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_ref)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own applications" ON public.applications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Employers view applications to own jobs" ON public.applications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.employer_id = auth.uid()));
CREATE POLICY "Employers update applications to own jobs" ON public.applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.employer_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.employer_id = auth.uid()));
CREATE POLICY "Admins manage applications" ON public.applications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_ref text NOT NULL,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  job_title text NOT NULL,
  company text NOT NULL,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_ref)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_jobs TO authenticated;
GRANT ALL ON public.saved_jobs TO service_role;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved jobs" ON public.saved_jobs FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  keywords text,
  category text,
  location text,
  frequency text NOT NULL DEFAULT 'daily',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_alerts TO authenticated;
GRANT ALL ON public.job_alerts TO service_role;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON public.job_alerts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  chosen text := COALESCE(NEW.raw_user_meta_data->>'account_type','job_seeker');
BEGIN
  IF chosen NOT IN ('job_seeker','employer') THEN chosen := 'job_seeker'; END IF;

  INSERT INTO public.profiles (id, full_name, email, account_type, company_name, company_type, location, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email,''),
    chosen,
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'company_type',
    NEW.raw_user_meta_data->>'location',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, chosen::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
