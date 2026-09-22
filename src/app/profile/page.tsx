"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin-shell";
import { AppearancePreference, DensityPreference, readAccountPreferences, useResolvedAppearance } from "@/components/account-preferences";
import styles from "./profile.module.css";

type Profile = {
  name: string;
  email: string;
  phone: string;
  title: string;
  organization: string;
  role: string;
};

const initialProfile: Profile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@aegisacademy.edu",
  phone: "+91 98765 43210",
  title: "Transport Manager",
  organization: "Aegis Academy",
  role: "Administrator",
};

type Errors = Partial<Record<keyof Profile, string>>;

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<Errors>({});
  const [avatarError, setAvatarError] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);
  const [appearance, setAppearance] = useState<AppearancePreference>("Dark");
  const [density, setDensity] = useState<DensityPreference>("Comfortable");
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(profile) !== JSON.stringify(savedProfile) || avatar !== savedAvatar;
  const resolvedTheme = useResolvedAppearance(appearance);

  useEffect(() => {
    const sync = window.setTimeout(() => {
      const preferences = readAccountPreferences();
      setAppearance(preferences.appearance);
      setDensity(preferences.density);
    }, 0);
    return () => window.clearTimeout(sync);
  }, []);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(field: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
  }

  function validate() {
    const next: Errors = {};
    if (profile.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) next.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s()-]{7,}$/.test(profile.phone)) next.phone = "Enter a valid phone number.";
    if (!profile.title.trim()) next.title = "Job title is required.";
    if (!profile.organization.trim()) next.organization = "Organization is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!validate()) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    window.setTimeout(() => {
      setSavedProfile(profile);
      setSavedAvatar(avatar);
      setStatus("success");
    }, 800);
  }

  function cancel() {
    setProfile(savedProfile);
    setAvatar(savedAvatar);
    setErrors({});
    setAvatarError("");
    setStatus("idle");
  }

  function chooseAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setAvatarError("Choose a JPG, PNG, or WebP image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result));
      setStatus("idle");
      setAvatarError("");
    };
    reader.readAsDataURL(file);
  }

  const initials = profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "SJ";

  return (
    <AdminShell active="Profile" theme={resolvedTheme} density={density.toLowerCase() as "comfortable" | "compact"}>
      <main className={styles.page}>
        <header className={styles.heading}>
          <div><p className={styles.eyebrow}>ACCOUNT</p><h1>My Profile</h1><p>Manage your personal information and profile photo.</p></div>
          {dirty && <span className={styles.unsaved}>● Unsaved changes</span>}
        </header>

        <div className={styles.layout}>
          <aside className={styles.summary}>
            <div className={styles.avatarWrap}>
              <div className={styles.largeAvatar}>{avatar ? <Image src={avatar} alt="Profile preview" width={98} height={98} unoptimized /> : initials}</div>
              <button type="button" className={styles.camera} onClick={() => fileRef.current?.click()} aria-label="Change profile photo">✎</button>
            </div>
            <h2>{profile.name || "Your name"}</h2>
            <p>{profile.title || "Job title"}</p>
            <span className={styles.role}>{profile.role}</span>
            <dl>
              <div><dt>Organization</dt><dd>{profile.organization}</dd></div>
              <div><dt>Email</dt><dd>{profile.email}</dd></div>
              <div><dt>Phone</dt><dd>{profile.phone}</dd></div>
            </dl>
          </aside>

          <form className={styles.formCard} onSubmit={save} noValidate>
            <div className={styles.sectionHead}><div><h2>Personal information</h2><p>Update how your details appear across Trackio.</p></div><span className={styles.mockBadge}>Local preview</span></div>
            <div className={styles.avatarEditor}>
              <div className={styles.smallAvatar}>{avatar ? <Image src={avatar} alt="" width={58} height={58} unoptimized /> : initials}</div>
              <div><strong>Profile photo</strong><p>JPG, PNG, or WebP. Maximum 5 MB.</p><div className={styles.inlineActions}><button type="button" onClick={() => fileRef.current?.click()}>Change photo</button>{avatar && <button type="button" className={styles.textButton} onClick={() => setAvatar(null)}>Remove</button>}</div></div>
              <input ref={fileRef} className={styles.fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseAvatar} />
            </div>
            {avatarError && <p className={styles.avatarError} role="alert">{avatarError}</p>}

            <div className={styles.fields}>
              <Field label="Full name" value={profile.name} error={errors.name} onChange={(value) => update("name", value)} autoComplete="name" />
              <Field label="Email address" type="email" value={profile.email} error={errors.email} onChange={(value) => update("email", value)} autoComplete="email" />
              <Field label="Phone number" type="tel" value={profile.phone} error={errors.phone} onChange={(value) => update("phone", value)} autoComplete="tel" />
              <Field label="Job title" value={profile.title} error={errors.title} onChange={(value) => update("title", value)} autoComplete="organization-title" />
              <Field label="Organization" value={profile.organization} error={errors.organization} onChange={(value) => update("organization", value)} autoComplete="organization" />
              <label className={styles.field}><span>Role</span><input value={profile.role} readOnly aria-describedby="role-help" /><small id="role-help">Contact an account owner to change your role.</small></label>
            </div>

            {status === "error" && !avatarError && <div className={`${styles.notice} ${styles.error}`} role="alert">Please review the highlighted fields and try again.</div>}
            {status === "success" && <div className={`${styles.notice} ${styles.success}`} role="status">Changes applied to this preview. They are not permanently saved because no profile API is connected.</div>}
            <div className={styles.footer}>
              <p>Changes are kept only for this browser session.</p>
              <button type="button" onClick={cancel} disabled={!dirty || status === "saving"}>Cancel</button>
              <button className={styles.primary} type="submit" disabled={!dirty || status === "saving"}>{status === "saving" ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </div>
      </main>
    </AdminShell>
  );
}

function Field({ label, value, error, onChange, type = "text", autoComplete }: { label: string; value: string; error?: string; onChange: (value: string) => void; type?: string; autoComplete?: string }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return <label className={styles.field} htmlFor={id}><span>{label} <b>*</b></span><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} autoComplete={autoComplete} />{error && <small className={styles.fieldError} id={`${id}-error`}>{error}</small>}</label>;
}
