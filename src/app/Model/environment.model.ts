export interface Environment {
  environmentId: number;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface EnvironmentReservationDto {
  clientId: number;
  environmentId: number;
  reservationDate: string; 
  clockIn: Date;  
  clockOut: Date; 
  purpose: string;
  reservationStatus: boolean;  
  status: number;  
}