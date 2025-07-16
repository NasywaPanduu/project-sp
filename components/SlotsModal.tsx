"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, RefreshCw, Zap, Accessibility, Car } from 'lucide-react';
import { ParkingSpot, Slot } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { getParkingSpots, updateSlotStatus } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface SlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkingSpot: ParkingSpot | null;
  onSlotSelect?: (slot: { id: string; number: string }) => void;
}

export default function SlotsModal({ isOpen, onClose, parkingSpot, onSlotSelect }: SlotsModalProps) {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [spots, setSpots] = useState(getParkingSpots());
  const { toast } = useToast();

  const currentSpot = spots.find(s => s.id === parkingSpot?.id);
  const currentFloor = currentSpot?.floors.find(f => f.number === selectedFloor);

  const getSlotIcon = (type: string) => {
    switch (type) {
      case 'ev':
        return <Zap className="h-3 w-3" />;
      case 'accessible':
        return <Accessibility className="h-3 w-3" />;
      default:
        return <Car className="h-3 w-3" />;
    }
  };

  const getSlotColor = (status: string, type: string) => {
    if (status === 'occupied') return 'bg-red-500 text-white';
    if (status === 'booked') return 'bg-orange-500 text-white';
    
    switch (type) {
      case 'ev':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'accessible':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      default:
        return 'bg-green-500 text-white hover:bg-green-600';
    }
  };

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'occupied' || slot.status === 'booked') return;
    
    setSelectedSlot(slot.id);
    if (onSlotSelect) {
      onSlotSelect({ id: slot.id, number: slot.number });
    }
  };

  const handleRefreshStatus = () => {
    // Simulate random status changes
    const updatedSpots = spots.map(spot => {
      if (spot.id === parkingSpot?.id) {
        const updatedFloors = spot.floors.map(floor => ({
          ...floor,
          slots: floor.slots.map(slot => {
            if (slot.status === 'occupied' && Math.random() > 0.7) {
              return { ...slot, status: 'empty' as const };
            }
            if (slot.status === 'empty' && Math.random() > 0.9) {
              return { ...slot, status: 'occupied' as const };
            }
            return slot;
          })
        }));
        
        const totalAvailable = updatedFloors.reduce((sum, floor) => 
          sum + floor.slots.filter(slot => slot.status === 'empty').length, 0
        );
        
        return {
          ...spot,
          floors: updatedFloors,
          availableSlots: totalAvailable,
        };
      }
      return spot;
    });
    
    setSpots(updatedSpots);
    toast({
      title: "Status Updated",
      description: "Parking slot status has been refreshed",
    });
  };

  const getFloorStats = (floor: any) => {
    const regular = floor.slots.filter((s: Slot) => s.type === 'regular' && s.status === 'empty').length;
    const ev = floor.slots.filter((s: Slot) => s.type === 'ev' && s.status === 'empty').length;
    const accessible = floor.slots.filter((s: Slot) => s.type === 'accessible' && s.status === 'empty').length;
    
    return { regular, ev, accessible };
  };

  const getRecentActivity = () => {
    const activities = [
      "Slot A15 just became available",
      "Slot B8 was just booked",
      "Slot C3 is now occupied",
      "Slot A22 became available",
      "Slot B12 was just reserved",
    ];
    
    return activities.slice(0, 3);
  };

  if (!currentSpot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {currentSpot.name}
          </DialogTitle>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {currentSpot.address}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Floor Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Select Floor</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStatus}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </div>
            <div className="flex gap-2">
              {currentSpot.floors.map((floor) => (
                <Button
                  key={floor.id}
                  variant={selectedFloor === floor.number ? "default" : "outline"}
                  onClick={() => setSelectedFloor(floor.number)}
                  className="flex-1"
                >
                  Floor {floor.number}
                </Button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">EV Charging</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Accessible</span>
            </div>
          </div>

          {/* Slots Grid */}
          {currentFloor && (
            <div className="space-y-4">
              <h3 className="font-medium">Floor {selectedFloor} Slots</h3>
              <div className="grid grid-cols-6 gap-2">
                {currentFloor.slots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant="outline"
                    className={cn(
                      "h-12 p-2 flex flex-col items-center justify-center relative",
                      getSlotColor(slot.status, slot.type),
                      slot.status === 'occupied' || slot.status === 'booked' 
                        ? "opacity-50 cursor-not-allowed" 
                        : "cursor-pointer",
                      selectedSlot === slot.id && "ring-2 ring-offset-2 ring-blue-500"
                    )}
                    onClick={() => handleSlotClick(slot)}
                    disabled={slot.status === 'occupied' || slot.status === 'booked'}
                  >
                    <div className="text-xs font-medium">{slot.number}</div>
                    {getSlotIcon(slot.type)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Floor Stats */}
          {currentFloor && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Available Slots - Floor {selectedFloor}</h4>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    <span>Regular: {getFloorStats(currentFloor).regular}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>EV: {getFloorStats(currentFloor).ev}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Accessibility className="h-4 w-4" />
                    <span>Accessible: {getFloorStats(currentFloor).accessible}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <div className="space-y-1">
                {getRecentActivity().map((activity, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    • {activity}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}