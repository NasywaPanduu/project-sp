"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Car, CreditCard, Smartphone, X } from 'lucide-react';
import { ParkingSpot } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { saveBooking } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import SlotsModal from './SlotsModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkingSpot: ParkingSpot | null;
}

export default function BookingModal({ isOpen, onClose, parkingSpot }: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; number: string } | null>(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [duration, setDuration] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const { toast } = useToast();

  const currentUser = getCurrentUser();

  const calculateTotal = () => {
    if (!parkingSpot || !duration) return 0;
    const hours = parseInt(duration);
    return hours * parkingSpot.pricePerHour;
  };

  const handleSlotSelect = (slot: { id: string; number: string }) => {
    setSelectedSlot(slot);
    setShowSlotsModal(false);
    toast({
      title: "Slot Selected",
      description: `You selected slot ${slot.number}`,
    });
  };

  const handleBooking = () => {
    if (!parkingSpot || !selectedSlot || !licensePlate || !duration || !paymentMethod || !currentUser) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const booking = {
      id: `booking-${Date.now()}`,
      userId: currentUser.id,
      parkingSpotId: parkingSpot.id,
      parkingSpotName: parkingSpot.name,
      location: parkingSpot.address,
      slotId: selectedSlot.id,
      slotNumber: selectedSlot.number,
      licensePlate,
      duration: `${duration} hours`,
      paymentMethod,
      totalCost: calculateTotal(),
      status: 'active' as const,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);
    
    toast({
      title: "Booking Confirmed",
      description: `Successfully booked slot ${selectedSlot.number} at ${parkingSpot.name}`,
    });

    onClose();
  };

  if (!parkingSpot) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Book Parking Spot
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Parking Spot Details */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{parkingSpot.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {parkingSpot.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{parkingSpot.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{parkingSpot.distance}</Badge>
                    <span className="text-sm text-gray-600">
                      {parkingSpot.availableSlots} / {parkingSpot.totalSlots} slots available
                    </span>
                  </div>
                  
                  <div className="text-lg font-semibold text-green-600">
                    Rp {parkingSpot.pricePerHour.toLocaleString()} / hour
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Select Parking Slot */}
            <div className="space-y-2">
              <Label htmlFor="slot">Select Parking Slot</Label>
              <div className="flex gap-2">
                <Input
                  id="slot"
                  placeholder="Select a slot"
                  value={selectedSlot ? `Slot ${selectedSlot.number}` : ''}
                  readOnly
                />
                <Button
                  variant="outline"
                  onClick={() => setShowSlotsModal(true)}
                  className="whitespace-nowrap"
                >
                  Select Slot
                </Button>
              </div>
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                placeholder="Enter license plate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visa" id="visa" />
                  <Label htmlFor="visa" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Visa ****1234
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gopay" id="gopay" />
                  <Label htmlFor="gopay" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    GoPay
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Total Cost */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-xl font-bold text-green-600">
                  Rp {calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleBooking} className="flex-1">
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SlotsModal
        isOpen={showSlotsModal}
        onClose={() => setShowSlotsModal(false)}
        parkingSpot={parkingSpot}
        onSlotSelect={handleSlotSelect}
      />
    </>
  );
}