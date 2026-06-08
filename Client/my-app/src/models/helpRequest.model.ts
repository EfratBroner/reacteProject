export interface Location {
  city: string;
  details: string;
}

export interface Priority {
  _id: number;
  namePriority: string;
}

export interface HelpRequest {
  description: string;
  phone: string;
  numberOfPeopleStranded: number;
  location: Location;
  priority: Priority;
}