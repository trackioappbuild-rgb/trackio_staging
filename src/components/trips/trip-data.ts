export type TripStatus = "Live" | "Upcoming" | "Completed" | "Delayed" | "Cancelled";

export type Trip = {
  id: string;
  name: string;
  vehicle: string;
  registration: string;
  driver: string;
  route: string;
  origin: string;
  destination: string;
  date: string;
  startTime: string;
  endTime: string;
  students: number;
  capacity: number;
  stops: number;
  status: TripStatus;
  note: string;
};

export const trips: Trip[] = [
  { id: "TR-1042", name: "Koramangala Morning Run", vehicle: "Bus 12A", registration: "KA 01 FC 4321", driver: "Ramesh Kumar", route: "Koramangala · Route A", origin: "Sony World Junction", destination: "Aegis Academy", date: "2026-09-22", startTime: "06:30", endTime: "08:15", students: 38, capacity: 42, stops: 7, status: "Live", note: "Vehicle passed Stop 5 and is tracking 3 minutes ahead of schedule." },
  { id: "TR-1043", name: "HSR Morning Pickup", vehicle: "Bus 14B", registration: "KA 03 MN 2084", driver: "Suresh Babu", route: "HSR Layout · Route B", origin: "Agara Lake", destination: "Aegis Academy", date: "2026-09-22", startTime: "06:45", endTime: "08:25", students: 35, capacity: 40, stops: 6, status: "Delayed", note: "Traffic near Silk Board is adding approximately 12 minutes." },
  { id: "TR-1044", name: "Indiranagar Morning Run", vehicle: "Mini 08", registration: "KA 05 AD 7712", driver: "Anita Devi", route: "Indiranagar · Route C", origin: "HAL 2nd Stage", destination: "Aegis Academy", date: "2026-09-22", startTime: "07:00", endTime: "08:30", students: 24, capacity: 28, stops: 5, status: "Completed", note: "All assigned students arrived. Attendance was reconciled at 08:27." },
  { id: "TR-1045", name: "Whitefield Afternoon Drop", vehicle: "Bus 09C", registration: "KA 53 AB 9081", driver: "Joseph Mathew", route: "Whitefield · Route D", origin: "Aegis Academy", destination: "Hope Farm", date: "2026-09-22", startTime: "15:15", endTime: "17:20", students: 40, capacity: 44, stops: 8, status: "Upcoming", note: "Driver check-in opens 30 minutes before departure." },
  { id: "TR-1046", name: "Electronic City Drop", vehicle: "Bus 07A", registration: "KA 51 C 6140", driver: "Manoj Singh", route: "Electronic City · Route E", origin: "Aegis Academy", destination: "Neeladri Road", date: "2026-09-22", startTime: "15:30", endTime: "17:35", students: 41, capacity: 45, stops: 9, status: "Upcoming", note: "Two guest drop-off approvals are included in the manifest." },
  { id: "TR-1047", name: "JP Nagar Activity Shuttle", vehicle: "Mini 04", registration: "KA 04 MQ 1187", driver: "Priya Nair", route: "JP Nagar · Shuttle", origin: "Aegis Academy", destination: "JP Nagar 6th Phase", date: "2026-09-22", startTime: "16:45", endTime: "17:35", students: 16, capacity: 20, stops: 3, status: "Cancelled", note: "Cancelled after the activity session was postponed. Families were notified." },
  { id: "TR-1048", name: "Hebbal Morning Run", vehicle: "Bus 16D", registration: "KA 04 JS 3302", driver: "Vikram Rao", route: "Hebbal · Route F", origin: "Manyata Tech Park", destination: "Aegis Academy", date: "2026-09-23", startTime: "06:20", endTime: "08:20", students: 37, capacity: 42, stops: 8, status: "Upcoming", note: "Standard weekday schedule with GPS and attendance checks enabled." },
  { id: "TR-1049", name: "Bellandur Evening Drop", vehicle: "Bus 11C", registration: "KA 03 HT 7498", driver: "Arun Kumar", route: "Bellandur · Route G", origin: "Aegis Academy", destination: "Green Glen Layout", date: "2026-09-21", startTime: "15:20", endTime: "17:10", students: 33, capacity: 38, stops: 7, status: "Completed", note: "Completed on time with all student hand-offs confirmed." },
  { id: "TR-1050", name: "Yelahanka Morning Run", vehicle: "Bus 18A", registration: "KA 50 D 5229", driver: "Farooq Ahmed", route: "Yelahanka · Route H", origin: "NES Circle", destination: "Aegis Academy", date: "2026-09-24", startTime: "06:10", endTime: "08:20", students: 39, capacity: 45, stops: 9, status: "Upcoming", note: "New pickup order will be used for the first time on this service." },
  { id: "TR-1051", name: "Jayanagar Sports Shuttle", vehicle: "Mini 02", registration: "KA 02 KL 4031", driver: "Deepa Shetty", route: "Jayanagar · Shuttle", origin: "Aegis Academy", destination: "City Sports Centre", date: "2026-09-25", startTime: "14:30", endTime: "15:15", students: 18, capacity: 20, stops: 2, status: "Upcoming", note: "Return shuttle is scheduled separately for 17:45." },
];

export const statusOrder: TripStatus[] = ["Live", "Upcoming", "Completed", "Delayed", "Cancelled"];
