export interface Reservation {
  clientId: string;
  reservationId: number;
  environmentId: number;
  reservationDate: string;
  clockIn: Date;
  clockOut: Date;
  purpose: string;
  reservationStatus: boolean;
  status: number;
}