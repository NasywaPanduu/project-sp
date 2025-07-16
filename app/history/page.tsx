"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard,
  Car,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { getBookings, updateBooking } from '@/lib/storage';
import BottomNavigation from '@/components/BottomNavigation';

export default function HistoryPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const userBookings = getBookings().filter(booking => booking.userId === user.id);
    setBookings(userBookings.reverse()); // Show latest first
  }, [user, router]);

  const handleCompleteBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'completed' });
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'completed' }
        : booking
    ));
    
    toast({
      title: "Booking Completed",
      description: "Your parking session has been completed successfully",
    });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <History className="h-6 w-6" />
              Booking History
            </h1>
            <p className="text-gray-600">View and manage your parking bookings</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {booking.parkingSpotName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                        <MapPin className="h-4 w-4" />
                        {booking.location}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getBadgeVariant(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{booking.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Slot</p>
                      <p className="font-medium">{booking.slotNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">License Plate</p>
                      <p className="font-medium">{booking.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className="font-medium">{booking.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-green-600">
                      Rp {booking.totalCost.toLocaleString()}
                    </div>
                    
                    {booking.status === 'active' && (
                      <Button 
                        onClick={() => handleCompleteBooking(booking.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No booking history yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by booking your first parking spot to see your history here
            </p>
            <Button 
              onClick={() => router.push('/booking')}
              className="flex items-center gap-2"
            >
              <Car className="h-4 w-4" />
              Book Your First Parking Spot
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}