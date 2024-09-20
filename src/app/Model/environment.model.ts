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
    clockIn: string; 
    clockOut: string; 
    purpose: string;
  }
  