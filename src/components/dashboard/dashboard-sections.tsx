import Link from "next/link";
import type { ReactNode } from "react";

const stats = [
  { icon: "▣", label: "Active trips", value: "12", note: "Live now", tone: "violet" },
  { icon: "◷", label: "Upcoming trips", value: "5", note: "Next 2 hours", tone: "blue" },
  { icon: "♙", label: "Students in transit", value: "248", note: "Across all trips", tone: "green" },
  { icon: "▰", label: "Vehicles on road", value: "12", note: "Live tracking", tone: "orange" },
  { icon: "!", label: "Important alerts", value: "3", note: "Requires attention", tone: "red" },
] as const;

const trips = [
  {
    name: "Morning Trip 1",
    time: "6:30–8:30 AM",
    vehicle: "Bus 12A",
    registration: "KA 01 FC 4321",
    driver: "Ramesh Kumar",
    students: "14 / 18",
    route: "Morning Route A",
    status: "Live",
  },
  {
    name: "Morning Trip 2",
    time: "6:45–8:40 AM",
    vehicle: "Bus 14B",
    registration: "KA 03 MN 2084",
    driver: "Suresh Babu",
    students: "16 / 20",
    route: "HSR Layout Route",
    status: "Live",
  },
  {
    name: "Afternoon Trip 1",
    time: "1:15–3:15 PM",
    vehicle: "Bus 11C",
    registration: "KA 05 AD 7712",
    driver: "Arun Kumar",
    students: "20 / 22",
    route: "Koramangala Route",
    status: "Upcoming",
  },
] as const;

const alerts = [
  { icon: "◷", title: "Trip delayed", detail: "Morning Trip 1 is delayed by 7 minutes due to traffic.", time: "7:28 AM", tone: "critical" },
  { icon: "△", title: "GPS signal weak", detail: "Bus 14B is experiencing intermittent GPS signal.", time: "7:25 AM", tone: "warning" },
  { icon: "♙", title: "Guest pickup request", detail: "Sophia Williams — approved by parent.", time: "7:20 AM", tone: "info" },
] as const;

const activity = [
  { icon: "✓", title: "Liam Johnson boarded Bus 12A", detail: "Morning Route A", time: "7:18 AM", tone: "green" },
  { icon: "♙", title: "Noah Brown marked absent", detail: "Morning Route B", time: "7:10 AM", tone: "orange" },
  { icon: "♙", title: "Guest pickup approved", detail: "By Sarah Johnson", time: "7:08 AM", tone: "violet" },
  { icon: "▰", title: "Bus 12A reached Central School", detail: "Morning Route A", time: "7:05 AM", tone: "green" },
  { icon: "i", title: "Absence request cancelled", detail: "Afternoon Trip 1", time: "7:02 AM", tone: "blue" },
] as const;

export function DashboardHeader() {
  return (
    <header className="dash-header">
      <div>
        <h1>Good morning, Sarah! <span aria-hidden="true">👋</span></h1>
        <p>Here&apos;s what&apos;s happening with Aegis Academy today.</p>
      </div>
      <div className="dash-date" aria-label="Current dashboard time">
        <span>Wednesday, 22 May 2024</span>
        <strong>7:32 AM</strong>
      </div>
    </header>
  );
}

export function StatGrid() {
  return (
    <section className="dash-stats" aria-label="Today at a glance">
      {stats.map((stat) => (
        <article className={`dash-stat dash-stat--${stat.tone}`} key={stat.label}>
          <span className="dash-stat__icon" aria-hidden="true">{stat.icon}</span>
          <div>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <small>{stat.note}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

function SectionHeading({ title, eyebrow, action, id }: { title: string; eyebrow?: string; action?: ReactNode; id?: string }) {
  return (
    <header className="dash-section-heading">
      <div>{eyebrow && <p>{eyebrow}</p>}<h2 id={id}>{title}</h2></div>
      {action}
    </header>
  );
}

export function LiveMap() {
  return (
    <section className="dash-card dash-map-card" aria-labelledby="live-map-title">
      <SectionHeading
        title="Live map"
        eyebrow="Live tracking"
        id="live-map-title"
        action={<span className="dash-live-pill"><i aria-hidden="true" />Live</span>}
      />
      <div className="dash-map">
        <div className="dash-road dash-road--one" aria-hidden="true" />
        <div className="dash-road dash-road--two" aria-hidden="true" />
        <div className="dash-road dash-road--three" aria-hidden="true" />
        <div className="dash-route" aria-hidden="true"><i /><i /><i /><i /></div>
        <span className="dash-map-label dash-map-label--one">Koramangala</span>
        <span className="dash-map-label dash-map-label--two">HSR Layout</span>
        <span className="dash-map-label dash-map-label--three">Aegis Academy</span>
        <span className="dash-map-marker dash-map-marker--one" aria-label="Bus 12A location">12A</span>
        <span className="dash-map-marker dash-map-marker--two" aria-label="Bus 14B location">14B</span>
        <span className="dash-school-marker" aria-label="Aegis Academy destination">A</span>

        <article className="dash-vehicle-popover">
          <header><div><small>TRACKING</small><h3>Bus 12A</h3></div><span><i aria-hidden="true" /> Live</span></header>
          <dl>
            <div><dt>Driver</dt><dd>Ramesh Kumar</dd></div>
            <div><dt>Next stop</dt><dd>3rd Main, Koramangala</dd></div>
            <div><dt>ETA</dt><dd className="dash-eta">12 min</dd></div>
          </dl>
          <button className="dash-disabled-action" type="button" disabled title="Full map is not available in this build">View full map · Coming soon</button>
        </article>
        <div className="dash-map-legend"><span><i className="route-a" /> Route A</span><span><i className="route-b" /> Route B</span></div>
      </div>
    </section>
  );
}

export function TodaysTrips() {
  return (
    <section className="dash-card dash-trips" aria-labelledby="todays-trips-title">
      <SectionHeading id="todays-trips-title" title="Today&apos;s trips" action={<Link href="/trips/new">Create trip <span aria-hidden="true">→</span></Link>} />
      <div className="dash-trip-list">
        {trips.map((trip) => (
          <article className="dash-trip" key={trip.name}>
            <div className="dash-trip__title">
              <div><h3>{trip.name}</h3><p>{trip.time}</p></div>
              <span className={trip.status === "Live" ? "dash-live-pill" : "dash-upcoming-pill"}><i aria-hidden="true" />{trip.status}</span>
            </div>
            <div className="dash-trip__body">
              <dl className="dash-trip__details">
                <div><dt><span aria-hidden="true">●</span> {trip.vehicle}</dt><dd>{trip.driver}</dd></div>
                <div><dt><span aria-hidden="true">●</span> {trip.route}</dt><dd>Scheduled route</dd></div>
                <div><dt><span aria-hidden="true">♙</span> {trip.students} students</dt><dd>Attendance</dd></div>
              </dl>
              <div className="dash-bus-art" role="img" aria-label={`${trip.vehicle} illustration`}><i /><i /><span /><b /></div>
            </div>
            <div className="dash-trip__actions">
              <button type="button" disabled title="Trip details are not available in this build">View trip</button>
              <button type="button" disabled title="Driver replacement is not available in this build">{trip.status === "Live" ? "Replace driver" : "Edit trip"}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AlertsPanel() {
  return (
    <section className="dash-card dash-side-card" aria-labelledby="alerts-title">
      <SectionHeading id="alerts-title" title="Important alerts" eyebrow="3 require attention" action={<Link href="/alerts">View all</Link>} />
      <div className="dash-feed">
        {alerts.map((alert) => (
          <article key={alert.title}>
            <span className={`dash-feed__icon dash-feed__icon--${alert.tone}`} aria-hidden="true">{alert.icon}</span>
            <div><h3>{alert.title}</h3><p>{alert.detail}</p></div>
            <time>{alert.time}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RecentActivity() {
  return (
    <section className="dash-card dash-side-card" aria-labelledby="activity-title">
      <SectionHeading id="activity-title" title="Recent activity" action={<span className="dash-muted-action">Live updates</span>} />
      <div className="dash-feed dash-feed--activity">
        {activity.map((item) => (
          <article key={item.title}>
            <span className={`dash-feed__icon dash-feed__icon--${item.tone}`} aria-hidden="true">{item.icon}</span>
            <div><h3>{item.title}</h3><p>{item.detail}</p></div>
            <time>{item.time}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FleetOverview() {
  return (
    <section className="dash-card dash-side-card dash-fleet" aria-labelledby="fleet-title">
      <SectionHeading id="fleet-title" title="Fleet overview" action={<span className="dash-muted-action">Today</span>} />
      <div className="dash-fleet__body">
        <div className="dash-fleet__ring" role="img" aria-label="12 vehicles on route, 5 idle, 2 in maintenance, 1 offline"><strong>12</strong><span>total vehicles</span></div>
        <ul>
          <li><span><i className="dash-fleet--route" /> On route</span><strong>12</strong></li>
          <li><span><i className="dash-fleet--idle" /> Idle</span><strong>5</strong></li>
          <li><span><i className="dash-fleet--service" /> Maintenance</span><strong>2</strong></li>
          <li><span><i className="dash-fleet--offline" /> Offline</span><strong>1</strong></li>
        </ul>
      </div>
    </section>
  );
}
