export interface Location {
  city: string;
  details: string;
}

export interface status {
  _id: number;
  status: string;
}

export interface HelpRequest {
  description: string;
  phone: string;
  numberOfPeopleStranded: number;
  location: Location;
  priority: string;
  status: string;
  volunteerId: string;
}