"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./trip-form.module.css";

const students = [
  { id: "aarav", name: "Aarav Mehta", grade: "Grade 6 · Stop 1" },
  { id: "diya", name: "Diya Sharma", grade: "Grade 5 · Stop 2" },
  { id: "ishaan", name: "Ishaan Rao", grade: "Grade 7 · Stop 3" },
  { id: "meera", name: "Meera Nair", grade: "Grade 6 · Stop 4" },
];

const initialValues = {
  name: "", route: "", stops: "", date: "2026-09-23", startTime: "07:00", endTime: "08:15",
  vehicle: "", driver: "", recurrence: "Once", days: "Weekdays", notes: "",
};

export function CreateTripForm() {
  const [values, setValues] = useState(initialValues);
  const [passengers, setPassengers] = useState<string[]>([]);
  const [stage, setStage] = useState<"edit" | "review" | "success">("edit");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function togglePassenger(id: string) {
    setPassengers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setError("");
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (values.endTime <= values.startTime) {
      setError("End time must be later than the start time.");
      document.getElementById("endTime")?.focus();
      return;
    }
    if (!passengers.length) {
      setError("Assign at least one student or passenger before review.");
      document.getElementById("passenger-group")?.focus();
      return;
    }
    setError("");
    setStage("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmTrip() {
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setStage("success");
    }, 700);
  }

  if (stage === "success") {
    return (
      <main className={styles.page}>
        <section className={styles.success} role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          <p className={styles.eyebrow}>Demo confirmation</p>
          <h1>Trip ready for review</h1>
          <p><strong>{values.name}</strong> was created for this browser session. No trip was permanently saved because a trips API is not connected.</p>
          <div><Link className={styles.primary} href="/trips">Return to Trips</Link><button type="button" onClick={() => { setValues(initialValues); setPassengers([]); setStage("edit"); }}>Create another</button></div>
        </section>
      </main>
    );
  }

  if (stage === "review") {
    const vehicleLabel = values.vehicle.split("|")[0];
    const driverLabel = values.driver.split("|")[0];
    return (
      <main className={styles.page}>
        <header className={styles.pageHeader}><div><Link href="/trips">← Back to trips</Link><span className={styles.eyebrow}>Final check</span><h1>Review trip</h1><p>Confirm the operational details before creating this demo trip.</p></div></header>
        <div className={styles.reviewLayout}>
          <section className={styles.reviewCard}>
            <div className={styles.reviewTitle}><div><span className={styles.busIcon}>▰</span><div><h2>{values.name}</h2><p>{values.route}</p></div></div><span>Scheduled</span></div>
            <dl className={styles.reviewGrid}>
              <div><dt>Date</dt><dd>{new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(`${values.date}T12:00:00`))}</dd></div>
              <div><dt>Schedule</dt><dd>{values.startTime} – {values.endTime}</dd></div>
              <div><dt>Vehicle</dt><dd>{vehicleLabel}</dd></div>
              <div><dt>Driver</dt><dd>{driverLabel}</dd></div>
              <div><dt>Passengers</dt><dd>{passengers.length} assigned</dd></div>
              <div><dt>Recurrence</dt><dd>{values.recurrence === "Weekly" ? values.days : values.recurrence}</dd></div>
            </dl>
            <div className={styles.reviewRoute}><span>Route &amp; stops</span><p>{values.stops}</p></div>
            {values.notes && <div className={styles.reviewRoute}><span>Operations note</span><p>{values.notes}</p></div>}
            <div className={styles.demoNote}>This is a front-end demo. Confirmation does not write to a database or notify families.</div>
          </section>
          <aside className={styles.checklist}><h2>Ready to create</h2>{["Trip details complete", "Vehicle and driver assigned", `${passengers.length} passengers assigned`, "Schedule reviewed"].map((item) => <p key={item}><span>✓</span>{item}</p>)}</aside>
        </div>
        <div className={styles.actions}><button type="button" onClick={() => setStage("edit")}>← Edit details</button><Link href="/trips">Cancel</Link><button className={styles.primary} type="button" onClick={confirmTrip} disabled={pending}>{pending ? <><i className={styles.spinner} /> Creating demo trip…</> : "Confirm & create trip"}</button></div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div><Link href="/trips">← Back to trips</Link><span className={styles.eyebrow}>Trip setup</span><h1>Create Trip</h1><p>Build the schedule, assign resources, and review before confirmation.</p></div>
        <span className={styles.draftBadge}>Demo · not saved</span>
      </header>
      <ol className={styles.steps} aria-label="Create trip progress"><li className={styles.current}><span>1</span><strong>Trip details</strong></li><li><span>2</span><strong>Review</strong></li><li><span>3</span><strong>Confirmation</strong></li></ol>

      <form onSubmit={review} noValidate={false}>
        <div className={styles.formLayout}>
          <div className={styles.formColumn}>
            <section className={styles.card} aria-labelledby="basics-title"><div className={styles.cardHeading}><span>01</span><div><h2 id="basics-title">Trip details</h2><p>Name the trip and define its route.</p></div></div><div className={styles.fields}>
              <label className={styles.full}><span>Trip name <b>*</b></span><input name="name" value={values.name} onChange={update} placeholder="e.g. Koramangala Morning Run" required /></label>
              <label><span>Route <b>*</b></span><select name="route" value={values.route} onChange={update} required><option value="">Select a route</option><option>Koramangala · Route A</option><option>HSR Layout · Route B</option><option>Whitefield · Route D</option><option>Electronic City · Route E</option></select></label>
              <label><span>Date <b>*</b></span><input name="date" type="date" value={values.date} min="2026-09-22" onChange={update} required /></label>
              <label className={styles.full}><span>Stops in order <b>*</b></span><textarea name="stops" value={values.stops} onChange={update} placeholder="1. Sony World Junction&#10;2. 80 Feet Road&#10;3. Aegis Academy" required /><small>Enter one stop per line, in pickup or drop-off order.</small></label>
            </div></section>

            <section className={styles.card} aria-labelledby="schedule-title"><div className={styles.cardHeading}><span>02</span><div><h2 id="schedule-title">Schedule &amp; recurrence</h2><p>Set the service window and repeat pattern.</p></div></div><div className={styles.fields}>
              <label><span>Start time <b>*</b></span><input name="startTime" type="time" value={values.startTime} onChange={update} required /></label>
              <label><span>End time <b>*</b></span><input id="endTime" name="endTime" type="time" value={values.endTime} onChange={update} required aria-describedby={error.includes("End time") ? "form-error" : undefined} /></label>
              <label><span>Recurrence <b>*</b></span><select name="recurrence" value={values.recurrence} onChange={update}><option>Once</option><option>Weekly</option></select></label>
              {values.recurrence === "Weekly" && <label><span>Repeat on <b>*</b></span><select name="days" value={values.days} onChange={update}><option>Weekdays</option><option>Monday, Wednesday, Friday</option><option>Tuesday, Thursday</option></select></label>}
            </div></section>

            <section className={styles.card} aria-labelledby="assignment-title"><div className={styles.cardHeading}><span>03</span><div><h2 id="assignment-title">Vehicle &amp; driver</h2><p>Assign available transport resources.</p></div></div><div className={styles.fields}>
              <label><span>Vehicle <b>*</b></span><select name="vehicle" value={values.vehicle} onChange={update} required><option value="">Select a vehicle</option><option>Bus 12A | KA 01 FC 4321 · 42 seats</option><option>Bus 14B | KA 03 MN 2084 · 40 seats</option><option>Mini 08 | KA 05 AD 7712 · 28 seats</option></select></label>
              <label><span>Driver <b>*</b></span><select name="driver" value={values.driver} onChange={update} required><option value="">Select a driver</option><option>Ramesh Kumar | Available</option><option>Suresh Babu | Available</option><option>Anita Devi | Available</option></select></label>
            </div></section>

            <section className={styles.card} aria-labelledby="passengers-title"><div className={styles.cardHeading}><span>04</span><div><h2 id="passengers-title">Students &amp; passengers</h2><p>Select the riders included on this trip.</p></div></div>
              <fieldset id="passenger-group" tabIndex={-1} aria-describedby={error.includes("Assign") ? "form-error" : undefined}><legend className="sr-only">Assign students and passengers</legend><div className={styles.passengerBar}><span>{passengers.length} of {students.length} selected</span><button type="button" onClick={() => setPassengers(passengers.length === students.length ? [] : students.map((student) => student.id))}>{passengers.length === students.length ? "Clear all" : "Select all"}</button></div><div className={styles.passengers}>{students.map((student) => <label key={student.id}><input type="checkbox" checked={passengers.includes(student.id)} onChange={() => togglePassenger(student.id)} /><span>{student.name}<small>{student.grade}</small></span></label>)}</div></fieldset>
            </section>

            <section className={styles.card} aria-labelledby="notes-title"><div className={styles.cardHeading}><span>05</span><div><h2 id="notes-title">Operations note</h2><p>Add optional information for the transport team.</p></div></div><label className={styles.notes}><span>Notes <em>Optional</em></span><textarea name="notes" value={values.notes} onChange={update} placeholder="Access notes, known delays, or special instructions" /></label></section>
          </div>
          <aside className={styles.sidePanel}>
            <section><span className={styles.busIcon}>▰</span><h2>{values.name || "Untitled trip"}</h2><p>{values.route || "Choose a route to begin"}</p><dl><div><dt>Date</dt><dd>{values.date || "Not set"}</dd></div><div><dt>Time</dt><dd>{values.startTime && values.endTime ? `${values.startTime} – ${values.endTime}` : "Not set"}</dd></div><div><dt>Vehicle</dt><dd>{values.vehicle.split("|")[0] || "Not assigned"}</dd></div><div><dt>Driver</dt><dd>{values.driver.split("|")[0] || "Not assigned"}</dd></div><div><dt>Passengers</dt><dd>{passengers.length} selected</dd></div></dl></section>
            <section className={styles.info}><h3>Before you continue</h3><p>You&apos;ll review every detail on the next step. Required fields are marked with an asterisk.</p></section>
          </aside>
        </div>
        {error && <div className={styles.error} id="form-error" role="alert"><strong>Check this form</strong><span>{error}</span></div>}
        <div className={styles.actions}><Link href="/trips">Cancel</Link><button className={styles.primary} type="submit">Review trip →</button></div>
      </form>
    </main>
  );
}
