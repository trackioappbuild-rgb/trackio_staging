import { AdminShell } from "@/components/admin-shell";
import {
  AlertsPanel,
  DashboardHeader,
  FleetOverview,
  LiveMap,
  RecentActivity,
  StatGrid,
  TodaysTrips,
} from "@/components/dashboard/dashboard-sections";
import "./dashboard.css";

export default function Home() {
  return (
    <AdminShell active="Dashboard">
      <main className="dash-page">
        <div className="dash-layout">
          <div className="dash-primary">
            <DashboardHeader />
            <StatGrid />
            <LiveMap />
            <TodaysTrips />
          </div>

          <aside className="dash-sidebar" aria-label="Dashboard updates">
            <AlertsPanel />
            <RecentActivity />
            <FleetOverview />
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}
