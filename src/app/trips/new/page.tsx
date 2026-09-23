import { AdminShell } from "@/components/admin-shell";
import { CreateTripForm } from "@/components/trips/create-trip-form";

export default function NewTripPage() {
  return (
    <AdminShell active="Trips">
      <CreateTripForm />
    </AdminShell>
  );
}
