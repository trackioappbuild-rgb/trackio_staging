"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { Trip, TripStatus } from "./trip-data";
import { statusOrder } from "./trip-data";
import styles from "./trips.module.css";

type Period = "All" | "Morning" | "Afternoon" | "Evening";
type DetailTab = "Overview" | "Stops" | "Students" | "Activity" | "Alerts";

const pageSize = 4;
const detailTabs: DetailTab[] = ["Overview", "Stops", "Students", "Activity", "Alerts"];

const formatDate = (value: string) => new Intl.DateTimeFormat("en-IN", {
  weekday: "short", day: "numeric", month: "short", year: "numeric",
}).format(new Date(`${value}T12:00:00`));

function getPeriod(time: string): Exclude<Period, "All"> {
  const hour = Number(time.slice(0, 2));
  return hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
}

function getOperationalData(trip: Trip) {
  const isActive = trip.status === "Live" || trip.status === "Delayed";
  const pickedUp = trip.status === "Completed" ? trip.students : isActive ? Math.max(0, trip.students - 4) : 0;
  const waiting = isActive ? 2 : 0;
  const absent = isActive || trip.status === "Completed" ? Math.max(0, trip.capacity - trip.students) : 0;
  const progress = trip.status === "Completed" ? 100 : trip.status === "Live" ? 58 : trip.status === "Delayed" ? 42 : 0;
  const hash = Number(trip.id.slice(-2));
  return {
    pickedUp, waiting, absent, notBoarded: Math.max(0, trip.students - pickedUp - waiting), progress,
    distance: `${14 + (hash % 9)}.${hash % 7} km`, duration: `${Math.floor((Number(trip.endTime.slice(0, 2)) * 60 + Number(trip.endTime.slice(3)) - Number(trip.startTime.slice(0, 2)) * 60 - Number(trip.startTime.slice(3))) / 60)}h ${(Number(trip.endTime.slice(0, 2)) * 60 + Number(trip.endTime.slice(3)) - Number(trip.startTime.slice(0, 2)) * 60 - Number(trip.startTime.slice(3))) % 60}m`,
    speed: isActive ? 34 + (hash % 12) : 0, fuel: 68 + (hash % 25),
  };
}

function StatusPill({ status }: { status: TripStatus }) {
  return <span className={`${styles.status} ${styles[`status${status}`]}`}><i aria-hidden="true" />{status}</span>;
}

export function TripOperations({ trips }: { trips: Trip[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | TripStatus>("All");
  const [period, setPeriod] = useState<Period>("All");
  const [driver, setDriver] = useState("All");
  const [vehicle, setVehicle] = useState("All");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(trips[0]?.id ?? "");
  const [detailTab, setDetailTab] = useState<DetailTab>("Overview");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return trips.filter((trip) => {
      const searchMatch = !needle || [trip.name, trip.id, trip.vehicle, trip.registration, trip.driver, trip.route]
        .some((value) => value.toLowerCase().includes(needle));
      return searchMatch
        && (status === "All" || trip.status === status)
        && (period === "All" || getPeriod(trip.startTime) === period)
        && (driver === "All" || trip.driver === driver)
        && (vehicle === "All" || trip.vehicle === vehicle)
        && (!date || trip.date === date);
    });
  }, [date, driver, period, query, status, trips, vehicle]);

  const selectedTrip = trips.find((trip) => trip.id === selectedId) ?? trips[0];
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleTrips = filtered.slice((page - 1) * pageSize, page * pageSize);
  const completed = trips.filter((trip) => trip.status === "Completed").length;
  const active = trips.filter((trip) => trip.status === "Live" || trip.status === "Delayed").length;
  const delayed = trips.filter((trip) => trip.status === "Delayed").length;
  const drivers = [...new Set(trips.map((trip) => trip.driver))];
  const vehicles = [...new Set(trips.map((trip) => trip.vehicle))];
  const hasFilters = query || status !== "All" || period !== "All" || driver !== "All" || vehicle !== "All" || date;

  function updateFilters(update: () => void) {
    startTransition(() => { update(); setPage(1); });
  }

  function clearFilters() {
    updateFilters(() => { setQuery(""); setStatus("All"); setPeriod("All"); setDriver("All"); setVehicle("All"); setDate(""); });
  }

  function openTrip(trip: Trip) {
    setSelectedId(trip.id);
    setDetailTab("Overview");
    setInspectorOpen(true);
    setMenuId(null);
  }

  return (
    <main className={styles.page}>
      <div className={styles.operationsLayout}>
        <div className={styles.operationsMain}>
          <header className={styles.pageHeader}>
            <div><h1>Trips</h1><p>Monitor and manage school transportation in real time.</p></div>
            <div className={styles.headerActions}>
              <label className={styles.dateControl}><span className="sr-only">Schedule date</span><i aria-hidden="true">▣</i><input type="date" value={date} onChange={(event) => updateFilters(() => setDate(event.target.value))} /></label>
              <Link className={styles.primaryButton} href="/trips/new"><span aria-hidden="true">＋</span> Create Trip</Link>
            </div>
          </header>

          <nav className={styles.periodTabs} aria-label="Filter trips by time of day">
            {(["All", "Morning", "Afternoon", "Evening"] as Period[]).map((item) => <button type="button" key={item} aria-pressed={period === item} onClick={() => updateFilters(() => setPeriod(item))}>{item}{item === "Morning" ? " ☀" : item === "Afternoon" ? " ◉" : item === "Evening" ? " ◐" : ""}</button>)}
          </nav>

          <section className={styles.summary} aria-label="Trip operational summary">
            <button className={`${styles.statCard} ${styles.toneLive}`} type="button" onClick={() => updateFilters(() => setStatus("Live"))}><span className={styles.statIcon}>▰</span><span><small>Active trips</small><strong>{active}</strong><em>↑ 3 from yesterday</em></span></button>
            <button className={`${styles.statCard} ${styles.toneCompleted}`} type="button" onClick={() => updateFilters(() => setStatus("Completed"))}><span className={styles.statIcon}>✓</span><span><small>Completed</small><strong>{completed}</strong><em>↑ 5 from yesterday</em></span></button>
            <button className={`${styles.statCard} ${styles.toneDelayed}`} type="button" onClick={() => updateFilters(() => setStatus("Delayed"))}><span className={styles.statIcon}>◷</span><span><small>Delayed</small><strong>{delayed}</strong><em>↓ 1 from yesterday</em></span></button>
            <article className={`${styles.statCard} ${styles.tonePerformance}`}><span className={styles.statIcon}>↗</span><span><small>On-time performance</small><strong>98%</strong><em>↑ 4% from yesterday</em></span></article>
          </section>

          <section className={styles.filters} aria-label="Trip filters">
            <label className={styles.searchField}><span className="sr-only">Search trips</span><i aria-hidden="true">⌕</i><input value={query} onChange={(event) => updateFilters(() => setQuery(event.target.value))} placeholder="Search trips, drivers, vehicles or routes" /></label>
            <label><span>Status</span><select value={status} onChange={(event) => updateFilters(() => setStatus(event.target.value as "All" | TripStatus))}><option>All</option>{statusOrder.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Driver</span><select value={driver} onChange={(event) => updateFilters(() => setDriver(event.target.value))}><option>All</option>{drivers.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Vehicle</span><select value={vehicle} onChange={(event) => updateFilters(() => setVehicle(event.target.value))}><option>All</option>{vehicles.map((item) => <option key={item}>{item}</option>)}</select></label>
            {hasFilters && <button className={styles.clearButton} type="button" onClick={clearFilters}>Reset</button>}
          </section>

          {isPending ? (
            <div className={styles.state} role="status"><span className={styles.spinner} /><h2>Updating trips…</h2><p>Applying operational filters.</p></div>
          ) : visibleTrips.length === 0 ? (
            <div className={styles.state}><span className={styles.stateIcon}>⌕</span><h2>No matching trips</h2><p>Try another search, status, date, or assignment.</p><button type="button" onClick={clearFilters}>Reset filters</button></div>
          ) : (
            <section className={styles.tripList} aria-label="Scheduled trips">
              {visibleTrips.map((trip) => <TripCard key={trip.id} trip={trip} selected={trip.id === selectedId} menuOpen={menuId === trip.id} onOpen={() => openTrip(trip)} onMenu={() => setMenuId(menuId === trip.id ? null : trip.id)} />)}
            </section>
          )}

          {!isPending && filtered.length > 0 && <footer className={styles.pagination}><p>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} trips</p><div><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>←</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={page === number ? styles.currentPage : ""} aria-current={page === number ? "page" : undefined} onClick={() => setPage(number)}>{number}</button>)}<button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>→</button></div></footer>}
          <p className={styles.mockNotice}>Demo operations data · Live telemetry and trip changes are not connected to a backend.</p>
        </div>

        {selectedTrip && <TripInspector trip={selectedTrip} tab={detailTab} open={inspectorOpen} onTab={setDetailTab} onClose={() => setInspectorOpen(false)} />}
      </div>
    </main>
  );
}

function TripCard({ trip, selected, menuOpen, onOpen, onMenu }: { trip: Trip; selected: boolean; menuOpen: boolean; onOpen: () => void; onMenu: () => void }) {
  const data = getOperationalData(trip);
  const reached = Math.round((data.progress / 100) * trip.stops);
  return <article className={`${styles.tripCard} ${selected ? styles.selectedTrip : ""}`}>
    <div className={styles.tripTop}>
      <div className={styles.tripTitle}><span className={styles.vehicleIcon}>▰</span><div><h2>{trip.name}</h2><span>{getPeriod(trip.startTime)} route</span></div></div>
      <dl className={styles.tripMeta}><div><dt>Driver</dt><dd>{trip.driver}</dd></div><div><dt>Vehicle</dt><dd>{trip.vehicle}<small>{trip.registration}</small></dd></div><div><dt>Departure</dt><dd>{trip.startTime}<small>{trip.origin}</small></dd></div><div><dt>Est. completion</dt><dd>{trip.endTime}<small>{trip.destination}</small></dd></div><div><dt>Status</dt><dd><StatusPill status={trip.status} /><small>{trip.status === "Delayed" ? "12 min behind" : trip.status === "Live" ? "En route" : formatDate(trip.date)}</small></dd></div></dl>
      <div className={styles.cardActions}><button type="button" className={styles.openButton} onClick={onOpen}>▰ Open Trip</button><button type="button" disabled title="Live map integration is coming soon">⌾ Live Map · Soon</button><div className={styles.moreWrap}><button type="button" aria-expanded={menuOpen} onClick={onMenu}>⋮ More</button>{menuOpen && <div className={styles.moreMenu}><button disabled>Edit trip · Coming soon</button><button disabled>Duplicate · Coming soon</button><button disabled>Cancel trip · Coming soon</button></div>}</div></div>
    </div>
    <div className={styles.stopProgress} aria-label={`${data.progress}% of route complete`}>
      {Array.from({ length: Math.min(trip.stops, 6) }, (_, index) => <div className={index < reached ? styles.reached : index === reached ? styles.currentStop : ""} key={index}><i /><span>{index === 0 ? "School" : index === Math.min(trip.stops, 6) - 1 ? "Destination" : `Stop ${index}`}</span><small>{index === 0 ? trip.startTime : index === Math.min(trip.stops, 6) - 1 ? trip.endTime : `+${index * 12} min`}</small></div>)}
    </div>
    <div className={styles.attendance}><div><span>♙</span><strong>{data.pickedUp}</strong><small>Picked up</small></div><div><span>◷</span><strong>{data.waiting}</strong><small>Waiting</small></div><div><span>×</span><strong>{data.absent}</strong><small>Absent</small></div><div><span>○</span><strong>{data.notBoarded}</strong><small>Not boarded</small></div><div><strong>{trip.capacity}</strong><small>Total students</small></div><div className={styles.progressRing} style={{ "--progress": `${Math.round((trip.students / trip.capacity) * 100)}%` } as React.CSSProperties}><strong>{Math.round((trip.students / trip.capacity) * 100)}%</strong></div></div>
  </article>;
}

function TripInspector({ trip, tab, open, onTab, onClose }: { trip: Trip; tab: DetailTab; open: boolean; onTab: (tab: DetailTab) => void; onClose: () => void }) {
  const data = getOperationalData(trip);
  return <aside className={`${styles.inspector} ${open ? styles.inspectorOpen : ""}`} aria-label={`${trip.name} details`}>
    <header><div><span className={styles.inspectorIcon}>▰</span><div><h2>{trip.name}</h2><p>{getPeriod(trip.startTime)} route</p></div></div><StatusPill status={trip.status} /><button className={styles.closeInspector} type="button" onClick={onClose} aria-label="Close trip details">×</button></header>
    <nav aria-label="Trip detail sections">{detailTabs.map((item) => <button key={item} type="button" aria-pressed={tab === item} onClick={() => onTab(item)}>{item}{item === "Students" ? ` ${trip.capacity}` : item === "Alerts" && trip.status === "Delayed" ? " 1" : ""}</button>)}</nav>
    <div className={styles.inspectorBody}>
      {tab === "Overview" && <Overview trip={trip} data={data} />}
      {tab === "Stops" && <InspectorList title="Route stops" items={Array.from({ length: trip.stops }, (_, index) => ({ title: index === 0 ? trip.origin : index === trip.stops - 1 ? trip.destination : `Scheduled stop ${index}`, detail: index <= Math.round(trip.stops * data.progress / 100) ? "Completed or current" : "Upcoming" }))} />}
      {tab === "Students" && <InspectorList title="Student manifest" items={[{ title: `${data.pickedUp} picked up`, detail: "Attendance confirmed" }, { title: `${data.waiting} waiting`, detail: "Expected at upcoming stops" }, { title: `${data.absent} absent`, detail: "Marked by guardian or school" }, { title: `${data.notBoarded} not boarded`, detail: "Requires attendance review" }]} />}
      {tab === "Activity" && <InspectorList title="Recent activity" items={[{ title: "GPS position updated", detail: "1 minute ago" }, { title: `${trip.driver} checked in`, detail: "Before departure" }, { title: "Passenger manifest loaded", detail: `${trip.students} assigned students` }]} />}
      {tab === "Alerts" && <InspectorList title="Trip alerts" items={trip.status === "Delayed" ? [{ title: "Trip is running 12 minutes late", detail: "Moderate traffic reported near the current stop" }] : [{ title: "No active alerts", detail: "This trip has no operational issues" }]} />}
    </div>
  </aside>;
}

function Overview({ trip, data }: { trip: Trip; data: ReturnType<typeof getOperationalData> }) {
  return <>
    <section className={styles.overviewCard}><div className={styles.assignment}><div><span>Driver</span><strong>{trip.driver}</strong></div><div><span>Vehicle</span><strong>{trip.vehicle}</strong><small>{trip.registration}</small></div></div><dl className={styles.detailGrid}><div><dt>Departure</dt><dd>{trip.startTime}<small>{trip.origin}</small></dd></div><div><dt>Est. completion</dt><dd>{trip.endTime}<small>{trip.destination}</small></dd></div><div><dt>Distance</dt><dd>{data.distance}</dd></div><div><dt>Est. duration</dt><dd>{data.duration}</dd></div><div><dt>Traffic</dt><dd className={styles.warning}>Moderate</dd></div><div><dt>GPS signal</dt><dd className={styles.good}>Strong</dd></div></dl></section>
    <section className={styles.sideSection}><h3>Student summary</h3><div className={styles.studentSummary}><div className={styles.donut}><strong>{trip.capacity}</strong><span>Total students</span></div><ul><li><i className={styles.greenDot} />Picked up <strong>{data.pickedUp}</strong></li><li><i className={styles.yellowDot} />Waiting <strong>{data.waiting}</strong></li><li><i className={styles.redDot} />Absent <strong>{data.absent}</strong></li><li><i className={styles.grayDot} />Not boarded <strong>{data.notBoarded}</strong></li></ul></div></section>
    <section className={styles.sideSection}><h3>Live status <small>Updated 1 min ago</small></h3><div className={styles.liveStats}><div><strong>{data.speed}</strong><span>Speed (km/h)</span></div><div><strong className={styles.good}>Good</strong><span>GPS signal</span></div><div><strong>{data.fuel}%</strong><span>Fuel level</span></div></div></section>
    <section className={styles.sideSection}><h3>Quick actions</h3><div className={styles.quickActions}>{["View Live Map", "Send Message", "Report Delay", "Cancel Trip"].map((item) => <button type="button" disabled title={`${item} is coming soon`} key={item}>{item}<small>Coming soon</small></button>)}</div></section>
  </>;
}

function InspectorList({ title, items }: { title: string; items: { title: string; detail: string }[] }) {
  return <section className={styles.sideSection}><h3>{title}</h3><div className={styles.inspectorList}>{items.map((item, index) => <article key={`${item.title}-${index}`}><span>{index + 1}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div></section>;
}
