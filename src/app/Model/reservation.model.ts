export interface Reservation {
  environmentId: number;
  reservationId: number;
  clockIn: string;
  clockOut: string;
  purpose: string;
  status: number;
}
