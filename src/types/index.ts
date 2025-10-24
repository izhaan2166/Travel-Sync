export interface TravelItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity';
  title: string;
  startDate: string;
  endDate?: string;
  location: string;
  status: 'confirmed' | 'pending' | 'delayed' | 'cancelled';
  cost: number;
  notes?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  items: TravelItem[];
  totalBudget: number;
  startDate: string;
  endDate: string;
}