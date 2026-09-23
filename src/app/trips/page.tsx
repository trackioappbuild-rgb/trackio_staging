import { AdminShell } from "@/components/admin-shell";
import { TripOperations } from "@/components/trips/trip-operations";
import { trips } from "@/components/trips/trip-data";

export default function TripsPage() {
  return (
    <AdminShell active="Trips">
      <TripOperations trips={trips} />
    </AdminShell>
  );
}
