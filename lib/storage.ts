import { Booking, ParkingSpot, demoParkingSpots, initialBookings } from './data';

export const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return initialBookings;
  const bookings = localStorage.getItem('bookings');
  return bookings ? JSON.parse(bookings) : initialBookings;
};

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  
  // Update slot status
  const spots = getParkingSpots();
  const spot = spots.find(s => s.id === booking.parkingSpotId);
  if (spot) {
    spot.floors.forEach(floor => {
      const slot = floor.slots.find(s => s.id === booking.slotId);
      if (slot) {
        slot.status = 'booked';
      }
    });
    spot.availableSlots--;
    saveParkingSpots(spots);
  }
};

export const updateBooking = (bookingId: string, updates: Partial<Booking>): void => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // If booking is completed, free up the slot
    if (updates.status === 'completed') {
      const booking = bookings[index];
      const spots = getParkingSpots();
      const spot = spots.find(s => s.id === booking.parkingSpotId);
      if (spot) {
        spot.floors.forEach(floor => {
          const slot = floor.slots.find(s => s.id === booking.slotId);
          if (slot) {
            slot.status = 'empty';
          }
        });
        spot.availableSlots++;
        saveParkingSpots(spots);
      }
    }
  }
};

export const getParkingSpots = (): ParkingSpot[] => {
  if (typeof window === 'undefined') return demoParkingSpots;
  const spots = localStorage.getItem('parkingSpots');
  return spots ? JSON.parse(spots) : demoParkingSpots;
};

export const saveParkingSpots = (spots: ParkingSpot[]): void => {
  localStorage.setItem('parkingSpots', JSON.stringify(spots));
};

export const updateSlotStatus = (spotId: string, slotId: string, status: 'empty' | 'occupied' | 'booked'): void => {
  const spots = getParkingSpots();
  const spot = spots.find(s => s.id === spotId);
  if (spot) {
    spot.floors.forEach(floor => {
      const slot = floor.slots.find(s => s.id === slotId);
      if (slot) {
        const oldStatus = slot.status;
        slot.status = status;
        
        // Update available slots count
        if (oldStatus === 'empty' && status !== 'empty') {
          spot.availableSlots--;
        } else if (oldStatus !== 'empty' && status === 'empty') {
          spot.availableSlots++;
        }
      }
    });
    saveParkingSpots(spots);
  }
};

export const getDashboardStats = (userId: string) => {
  const bookings = getBookings().filter(b => b.userId === userId);
  const spots = getParkingSpots();
  
  const totalSlots = spots.reduce((sum, spot) => sum + spot.totalSlots, 0);
  const availableSlots = spots.reduce((sum, spot) => sum + spot.availableSlots, 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);
  
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalCost, 0);
  
  return {
    availableSlots,
    totalSlots,
    todayBookings: todayBookings.length,
    totalRevenue,
    recentBookings: bookings.slice(-3).reverse(),
  };
};