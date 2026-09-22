"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { AppearancePreference, DensityPreference, readAccountPreferences, saveAccountPreferences, useResolvedAppearance } from "@/components/account-preferences";
import styles from "./settings.module.css";

type Settings = {
  schoolName: string;
  contactEmail: string;
  autoAssign: boolean;
  language: string;
  timeZone: string;
  dateFormat: string;
  distance: string;
  tripAlerts: boolean;
  delayAlerts: boolean;
  attendanceAlerts: boolean;
  maintenanceAlerts: boolean;
  weeklyReport: boolean;
  channels: string[];
  appearance: AppearancePreference;
  density: DensityPreference;
};

const initialSettings: Settings = {
  schoolName: "Aegis Academy",
  contactEmail: "transport@aegisacademy.edu",
  autoAssign: true,
  language: "English (India)",
  timeZone: "Asia/Kolkata (IST)",
  dateFormat: "DD/MM/YYYY",
  distance: "Kilometres",
  tripAlerts: true,
  delayAlerts: true,
  attendanceAlerts: true,
  maintenanceAlerts: false,
  weeklyReport: true,
  channels: ["Email", "In-app"],
  appearance: "Dark",
  density: "Comfortable",
};

const sessions = [
  { id: 1, icon: "⌘", device: "MacBook Pro · Chrome", location: "Bengaluru, India", time: "Current session", current: true },
  { id: 2, icon: "▯", device: "iPhone 15 · Safari", location: "Bengaluru, India", time: "Last active 2 hours ago", current: false },
  { id: 3, icon: "▣", device: "Windows PC · Edge", location: "Chennai, India", time: "Last active 3 days ago", current: false },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(initialSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [passwordError, setPasswordError] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [activeSessions, setActiveSessions] = useState(sessions);
  const dirty = JSON.stringify(settings) !== JSON.stringify(saved);
  const resolvedTheme = useResolvedAppearance(settings.appearance);

  useEffect(() => {
    const sync = window.setTimeout(() => {
      const preferences = readAccountPreferences();
      setSettings((current) => ({ ...current, ...preferences }));
      setSaved((current) => ({ ...current, ...preferences }));
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

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  function toggleChannel(channel: string) {
    const next = settings.channels.includes(channel) ? settings.channels.filter((item) => item !== channel) : [...settings.channels, channel];
    update("channels", next);
  }

  function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (!settings.schoolName.trim() || !/^\S+@\S+\.\S+$/.test(settings.contactEmail)) {
      setStatus("error");
      document.getElementById("organization")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setStatus("saving");
    window.setTimeout(() => {
      setSaved(settings);
      saveAccountPreferences(settings.appearance, settings.density);
      setStatus("success");
    }, 800);
  }

  function changePassword() {
    if (!passwords.current || passwords.next.length < 10 || passwords.next !== passwords.confirm) {
      setPasswordError(!passwords.current ? "Enter your current password." : passwords.next.length < 10 ? "New password must be at least 10 characters." : "New passwords do not match.");
      setPasswordStatus("error");
      return;
    }
    setPasswordError("");
    setPasswordStatus("saving");
    window.setTimeout(() => {
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordStatus("success");
    }, 800);
  }

  return (
    <AdminShell active="Settings" theme={resolvedTheme} density={settings.density.toLowerCase() as "comfortable" | "compact"}>
      <main className={styles.page}>
        <header className={styles.heading}>
          <div><p className={styles.eyebrow}>ADMINISTRATION</p><h1>Settings</h1><p>Configure your organization, notifications, security, and preferences.</p></div>
          {dirty && <span className={styles.unsaved}>● Unsaved changes</span>}
        </header>
        <div className={styles.shell}>
          <nav className={styles.sideNav} aria-label="Settings sections">
            <a href="#general"><span>⚙</span><div><strong>General</strong><small>Defaults and preferences</small></div></a>
            <a href="#organization"><span>⌂</span><div><strong>Organization</strong><small>Academy information</small></div></a>
            <a href="#notifications"><span>♧</span><div><strong>Notifications</strong><small>Alerts and channels</small></div></a>
            <a href="#security"><span>◇</span><div><strong>Security</strong><small>Password and sessions</small></div></a>
            <a href="#appearance"><span>◐</span><div><strong>Appearance</strong><small>Theme and density</small></div></a>
          </nav>

          <form className={styles.content} onSubmit={saveSettings} noValidate>
            <SettingsSection id="general" icon="⚙" title="General preferences" description="Choose regional formats used throughout Trackio.">
              <div className={styles.grid}>
                <Select label="Language" value={settings.language} options={["English (India)", "English (United States)", "Hindi", "Kannada"]} onChange={(value) => update("language", value)} />
                <Select label="Time zone" value={settings.timeZone} options={["Asia/Kolkata (IST)", "Asia/Dubai (GST)", "Europe/London (GMT)", "America/New_York (ET)"]} onChange={(value) => update("timeZone", value)} />
                <Select label="Date format" value={settings.dateFormat} options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} onChange={(value) => update("dateFormat", value)} />
                <Select label="Distance units" value={settings.distance} options={["Kilometres", "Miles"]} onChange={(value) => update("distance", value)} />
              </div>
            </SettingsSection>

            <SettingsSection id="organization" icon="⌂" title="Organization settings" description="Manage the details and operational defaults for your academy.">
              <div className={styles.grid}>
                <TextField label="Organization name" value={settings.schoolName} invalid={status === "error" && !settings.schoolName.trim()} onChange={(value) => update("schoolName", value)} />
                <TextField label="Operations email" type="email" value={settings.contactEmail} invalid={status === "error" && !/^\S+@\S+\.\S+$/.test(settings.contactEmail)} onChange={(value) => update("contactEmail", value)} />
              </div>
              <Toggle checked={settings.autoAssign} onChange={(value) => update("autoAssign", value)} label="Automatically assign available vehicles" description="Suggest eligible vehicles when a new trip is created." />
            </SettingsSection>

            <SettingsSection id="notifications" icon="♧" title="Notification controls" description="Control which operational events should notify you.">
              <div className={styles.toggleList}>
                <Toggle checked={settings.tripAlerts} onChange={(value) => update("tripAlerts", value)} label="Trip activity" description="Trip starts, completions, and cancellations." />
                <Toggle checked={settings.delayAlerts} onChange={(value) => update("delayAlerts", value)} label="Delay and route alerts" description="Delays, route deviations, and geofence events." />
                <Toggle checked={settings.attendanceAlerts} onChange={(value) => update("attendanceAlerts", value)} label="Student attendance" description="Missed pickups and unconfirmed boardings." />
                <Toggle checked={settings.maintenanceAlerts} onChange={(value) => update("maintenanceAlerts", value)} label="Vehicle maintenance" description="Service reminders and compliance expirations." />
                <Toggle checked={settings.weeklyReport} onChange={(value) => update("weeklyReport", value)} label="Weekly operations summary" description="Receive a performance overview every Monday." />
              </div>
              <fieldset className={styles.channels}><legend>Delivery channels</legend>{["Email", "SMS", "In-app"].map((channel) => <label key={channel}><input type="checkbox" checked={settings.channels.includes(channel)} onChange={() => toggleChannel(channel)} /> {channel}</label>)}</fieldset>
            </SettingsSection>

            <SettingsSection id="security" icon="◇" title="Security" description="Update your password and review signed-in devices.">
              <div className={styles.securityBlock}>
                <h3>Change password</h3><p>Use at least 10 characters with a mix of letters, numbers, and symbols.</p>
                <div className={styles.passwordGrid}>
                  <label><span>Current password</span><input name="currentPassword" type="password" autoComplete="current-password" value={passwords.current} onChange={(event) => { setPasswords((current) => ({ ...current, current: event.target.value })); setPasswordStatus("idle"); }} /></label>
                  <label><span>New password</span><input name="newPassword" type="password" autoComplete="new-password" value={passwords.next} onChange={(event) => { setPasswords((current) => ({ ...current, next: event.target.value })); setPasswordStatus("idle"); }} /></label>
                  <label><span>Confirm new password</span><input name="confirmPassword" type="password" autoComplete="new-password" value={passwords.confirm} onChange={(event) => { setPasswords((current) => ({ ...current, confirm: event.target.value })); setPasswordStatus("idle"); }} /></label>
                </div>
                {passwordStatus === "error" && <p className={styles.inlineError} role="alert">{passwordError}</p>}
                {passwordStatus === "success" && <p className={styles.inlineSuccess} role="status">Password change validated in this preview. No account service is connected, so it was not saved.</p>}
                <button className={styles.secondaryButton} type="button" disabled={passwordStatus === "saving"} onClick={changePassword}>{passwordStatus === "saving" ? "Updating…" : "Change password"}</button>
              </div>
              <div className={styles.sessions}><div className={styles.subhead}><div><h3>Active sessions</h3><p>Devices currently signed in to your account. Session actions are preview-only.</p></div><button type="button" onClick={() => setActiveSessions((current) => current.filter((session) => session.current))}>Sign out other devices</button></div>{activeSessions.map((session) => <div className={styles.session} key={session.id}><span className={styles.deviceIcon}>{session.icon}</span><div><strong>{session.device} {session.current && <b>Current</b>}</strong><p>{session.location} · {session.time}</p></div>{!session.current && <button type="button" onClick={() => setActiveSessions((current) => current.filter((item) => item.id !== session.id))}>Sign out</button>}</div>)}</div>
            </SettingsSection>

            <SettingsSection id="appearance" icon="◐" title="Appearance" description="Personalize how Trackio looks on this device.">
              <fieldset className={styles.choiceGroup}><legend>Theme</legend><div>{(["Dark", "Light", "System"] as AppearancePreference[]).map((choice) => <label className={settings.appearance === choice ? styles.selectedChoice : ""} key={choice}><input type="radio" name="appearance" value={choice} checked={settings.appearance === choice} onChange={() => update("appearance", choice)} /><span>{choice === "Dark" ? "◐" : choice === "Light" ? "☼" : "▣"}</span><strong>{choice}</strong><small>{choice === "System" ? "Use device setting" : `${choice} interface`}</small></label>)}</div></fieldset>
              <fieldset className={styles.density}><legend>Display density</legend>{(["Comfortable", "Compact"] as DensityPreference[]).map((choice) => <label key={choice}><input type="radio" name="density" value={choice} checked={settings.density === choice} onChange={() => update("density", choice)} /> <span><strong>{choice}</strong><small>{choice === "Comfortable" ? "More space between items" : "Fit more content on screen"}</small></span></label>)}</fieldset>
            </SettingsSection>

            {status === "error" && <div className={`${styles.notice} ${styles.error}`} role="alert">Enter a valid organization name and operations email.</div>}
            {status === "success" && <div className={`${styles.notice} ${styles.success}`} role="status">Preferences saved on this device. Account settings are not synced because no settings API is connected.</div>}
            <div className={styles.stickyActions}><p>{dirty ? "You have unsaved changes." : "All preview changes are applied."}</p><button type="button" onClick={() => { setSettings(saved); setStatus("idle"); }} disabled={!dirty || status === "saving"}>Discard</button><button className={styles.primaryButton} type="submit" disabled={!dirty || status === "saving"}>{status === "saving" ? "Saving…" : "Save changes"}</button></div>
          </form>
        </div>
      </main>
    </AdminShell>
  );
}

function SettingsSection({ id, icon, title, description, children }: { id: string; icon: string; title: string; description: string; children: ReactNode }) {
  return <section className={styles.card} id={id}><header><span>{icon}</span><div><h2>{title}</h2><p>{description}</p></div></header><div className={styles.cardBody}>{children}</div></section>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className={styles.control}><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function TextField({ label, value, onChange, type = "text", invalid = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; invalid?: boolean }) {
  return <label className={styles.control}><span>{label} <b>*</b></span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={invalid} /></label>;
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (value: boolean) => void; label: string; description: string }) {
  return <label className={styles.toggle}><span><strong>{label}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}
