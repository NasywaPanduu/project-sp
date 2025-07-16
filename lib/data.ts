export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'parking_owner';
  avatar?: string;
  licensePlate?: string;
  vehicleType?: string;
}

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  types: ('regular' | 'accessible' | 'ev')[];
  coordinates: { lat: number; lng: number };
  floors: Floor[];
}

export interface Floor {
  id: string;
  number: number;
  slots: Slot[];
}

export interface Slot {
  id: string;
  number: string;
  status: 'empty' | 'occupied' | 'booked';
  type: 'regular' | 'accessible' | 'ev';
  floor: number;
}

export interface Booking {
  id: string;
  userId: string;
  parkingSpotId: string;
  parkingSpotName: string;
  location: string;
  slotId: string;
  slotNumber: string;
  licensePlate: string;
  duration: string;
  paymentMethod: string;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
  date: string;
  time: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet';
  name: string;
  lastFour: string;
  isDefault: boolean;
}

// Demo accounts
export const demoAccounts: User[] = [
  {
    id: 'demo-admin',
    name: 'Admin Demo',
    email: 'admin@demo.com',
    role: 'parking_owner',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
  {
    id: 'demo-user',
    name: 'User Demo',
    email: 'user@demo.com',
    role: 'driver',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    licensePlate: 'B1234XYZ',
    vehicleType: 'sedan',
  },
];

// Demo parking spots
export const demoParkingSpots: ParkingSpot[] = [
  {
    id: 'spot-1',
    name: 'Central Mall Parking',
    address: 'Jl. Sudirman No. 123, Jakarta',
    distance: '0.5 km',
    rating: 4.8,
    availableSlots: 45,
    totalSlots: 100,
    pricePerHour: 5000,
    types: ['regular', 'accessible', 'ev'],
    coordinates: { lat: -6.2088, lng: 106.8456 },
    floors: [
      {
        id: 'floor-1-1',
        number: 1,
        slots: Array.from({ length: 30 }, (_, i) => ({
          id: `slot-1-1-${i + 1}`,
          number: `A${i + 1}`,
          status: Math.random() > 0.6 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 10 === 0 ? 'ev' : i % 15 === 0 ? 'accessible' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 1,
        })),
      },
      {
        id: 'floor-1-2',
        number: 2,
        slots: Array.from({ length: 35 }, (_, i) => ({
          id: `slot-1-2-${i + 1}`,
          number: `B${i + 1}`,
          status: Math.random() > 0.7 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 12 === 0 ? 'ev' : i % 18 === 0 ? 'accessible' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 2,
        })),
      },
      {
        id: 'floor-1-3',
        number: 3,
        slots: Array.from({ length: 35 }, (_, i) => ({
          id: `slot-1-3-${i + 1}`,
          number: `C${i + 1}`,
          status: Math.random() > 0.8 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 8 === 0 ? 'ev' : i % 20 === 0 ? 'accessible' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 3,
        })),
      },
    ],
  },
  {
    id: 'spot-2',
    name: 'Office Tower Parking',
    address: 'Jl. Thamrin No. 456, Jakarta',
    distance: '1.2 km',
    rating: 4.5,
    availableSlots: 28,
    totalSlots: 80,
    pricePerHour: 7000,
    types: ['regular', 'ev'],
    coordinates: { lat: -6.1944, lng: 106.8229 },
    floors: [
      {
        id: 'floor-2-1',
        number: 1,
        slots: Array.from({ length: 25 }, (_, i) => ({
          id: `slot-2-1-${i + 1}`,
          number: `P${i + 1}`,
          status: Math.random() > 0.65 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 8 === 0 ? 'ev' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 1,
        })),
      },
      {
        id: 'floor-2-2',
        number: 2,
        slots: Array.from({ length: 30 }, (_, i) => ({
          id: `slot-2-2-${i + 1}`,
          number: `Q${i + 1}`,
          status: Math.random() > 0.7 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 10 === 0 ? 'ev' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 2,
        })),
      },
      {
        id: 'floor-2-3',
        number: 3,
        slots: Array.from({ length: 25 }, (_, i) => ({
          id: `slot-2-3-${i + 1}`,
          number: `R${i + 1}`,
          status: Math.random() > 0.75 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 12 === 0 ? 'ev' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 3,
        })),
      },
    ],
  },
  {
    id: 'spot-3',
    name: 'Grand Hotel Parking',
    address: 'Jl. Rasuna Said No. 789, Jakarta',
    distance: '2.0 km',
    rating: 4.7,
    availableSlots: 15,
    totalSlots: 60,
    pricePerHour: 10000,
    types: ['regular', 'accessible', 'ev'],
    coordinates: { lat: -6.2231, lng: 106.8317 },
    floors: [
      {
        id: 'floor-3-1',
        number: 1,
        slots: Array.from({ length: 20 }, (_, i) => ({
          id: `slot-3-1-${i + 1}`,
          number: `H${i + 1}`,
          status: Math.random() > 0.5 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 6 === 0 ? 'ev' : i % 10 === 0 ? 'accessible' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 1,
        })),
      },
      {
        id: 'floor-3-2',
        number: 2,
        slots: Array.from({ length: 20 }, (_, i) => ({
          id: `slot-3-2-${i + 1}`,
          number: `I${i + 1}`,
          status: Math.random() > 0.6 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 8 === 0 ? 'ev' : i % 12 === 0 ? 'accessible' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 2,
        })),
      },
      {
        id: 'floor-3-3',
        number: 3,
        slots: Array.from({ length: 20 }, (_, i) => ({
          id: `slot-3-3-${i + 1}`,
          number: `J${i + 1}`,
          status: Math.random() > 0.7 ? 'occupied' : 'empty' as 'empty' | 'occupied' | 'booked',
          type: i % 10 === 0 ? 'ev' : i % 15 === 0 ? 'accessible' : 'regular' as 'regular' | 'accessible' | 'ev',
          floor: 3,
        })),
      },
    ],
  },
];

export const demoPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'credit_card',
    name: 'Visa ****1234',
    lastFour: '1234',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'digital_wallet',
    name: 'GoPay',
    lastFour: '5678',
    isDefault: false,
  },
];

// Initial demo bookings
export const initialBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'demo-user',
    parkingSpotId: 'spot-1',
    parkingSpotName: 'Central Mall Parking',
    location: 'Jl. Sudirman No. 123, Jakarta',
    slotId: 'slot-1-1-1',
    slotNumber: 'A1',
    licensePlate: 'B1234XYZ',
    duration: '2 hours',
    paymentMethod: 'Visa ****1234',
    totalCost: 10000,
    status: 'completed',
    date: '2024-01-20',
    time: '09:00',
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'booking-2',
    userId: 'demo-user',
    parkingSpotId: 'spot-2',
    parkingSpotName: 'Office Tower Parking',
    location: 'Jl. Thamrin No. 456, Jakarta',
    slotId: 'slot-2-1-5',
    slotNumber: 'P5',
    licensePlate: 'B1234XYZ',
    duration: '4 hours',
    paymentMethod: 'GoPay',
    totalCost: 28000,
    status: 'active',
    date: '2024-01-21',
    time: '08:30',
    createdAt: '2024-01-21T08:30:00Z',
  },
];