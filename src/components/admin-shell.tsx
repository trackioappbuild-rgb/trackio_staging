import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["⌂", "Dashboard", "/"], ["⌘", "Trips", "/trips"], ["♙", "Students", "/students/new"],
  ["♧", "Parents & Guardians", "#"], ["▣", "Drivers", "/drivers/new"], ["▱", "Vehicles", "#"],
  ["⌘", "Routes & Stops", "#"], ["⌁", "Live Operations", "#"], ["♧", "Alerts", "/alerts"],
  ["✓", "Reports", "#"], ["⚙", "Settings", "/settings"],
] as const;

export function AdminShell({ active, children, theme = "dark", density = "comfortable" }: { active: string; children: ReactNode; theme?: "dark" | "light"; density?: "comfortable" | "compact" }) {
  return <div className="app-shell" data-account-theme={theme} data-account-density={density}><aside className="sidebar"><div className="brand"><span className="brand-mark"><i/><i/></span><strong>trackio</strong></div><div className="academy"><span className="academy-icon">♙</span><div><strong>Aegis Academy</strong><small>Administrator</small></div><span>⌄</span></div><p className="menu-label">MAIN MENU</p><nav>{links.map(([icon,label,href])=><Link className={label===active?"active":""} href={href} key={label}><span className="nav-icon">{icon}</span><span>{label}</span>{label==="Alerts"&&<b className="badge">3</b>}</Link>)}</nav><Link className={active==="Profile"?"user-card active-account":"user-card"} href="/profile" aria-label="Open Sarah Johnson's profile"><span className="avatar">SJ</span><div><strong>Sarah Johnson</strong><small>Transport Manager</small></div><span>⋮</span></Link><button className="collapse">← <span>Collapse Menu</span></button></aside><div className="workspace"><header className="topbar"><button className="mobile-menu" aria-label="Open menu">☰</button><div className="search"><span>⌕</span><span>Search students, parents, routes, buses...</span><kbd>⌘ K</kbd></div><div className="top-actions"><button aria-label="Notifications">♧<b>3</b></button><button aria-label="Messages">▱</button><Link href="/settings" aria-label="Settings">⚙</Link><Link className="mini-avatar" href="/profile" aria-label="Profile">SJ</Link></div></header>{children}</div></div>;
}

export function Steps({ labels, current = 1 }: { labels: readonly string[]; current?: number }) {
  return <div className="steps">{labels.map((label,index)=><div className={index+1===current?"current":index+1<current?"done":""} key={label}><span>{index+1<current?"✓":index+1}</span><strong>{label}</strong><small>{index+1===current?"Current step":""}</small></div>)}</div>;
}

export function Field({ label, placeholder, wide = false }: { label: string; placeholder: string; wide?: boolean }) {
  return <label className={wide?"field wide":"field"}><span>{label}{!label.includes("Optional")&&<b> *</b>}</span><div>{placeholder}</div></label>;
}
