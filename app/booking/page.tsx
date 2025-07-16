"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Car, 
  Zap, 
  Accessibility,
  Eye,
  Navigation
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getParkingSpots } from '@/lib/storage';
import BottomNavigation from '@/components/BottomNavigation';
import BookingModal from '@/components/BookingModal';
import SlotsModal from '@/components/SlotsModal';

export default function BookingPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [spots, setSpots] = useState(getParkingSpots());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [filters, setFilters] = useState({
    distance: '',
    priceRange: '',
    slotType: ''
  });
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, router]);

  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDistance = !filters.distance || 
                           parseFloat(spot.distance) <= parseFloat(filters.distance);
    
    const matchesPrice = !filters.priceRange || 
                        (filters.priceRange === 'low' && spot.pricePerHour <= 5000) ||
                        (filters.priceRange === 'medium' && spot.pricePerHour > 5000 && spot.pricePerHour <= 8000) ||
                        (filters.priceRange === 'high' && spot.pricePerHour > 8000);
    
    const matchesSlotType = !filters.slotType || spot.types.includes(filters.slotType as any);
    
    return matchesSearch && matchesDistance && matchesPrice && matchesSlotType;
  });

  const handleBook = (spot: any) => {
    setSelectedSpot(spot);
    setShowBookingModal(true);
  };

  const handleViewSlots = (spot: any) => {
    setSelectedSpot(spot);
    setShowSlotsModal(true);
  };

  const getSlotTypeIcon = (type: string) => {
    switch (type) {
      case 'ev':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'accessible':
        return <Accessibility className="h-4 w-4 text-purple-600" />;
      default:
        return <Car className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSlotTypeLabel = (type: string) => {
    switch (type) {
      case 'ev':
        return 'EV Charging';
      case 'accessible':
        return 'Accessible';
      default:
        return 'Regular';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">Book Parking Spot</h1>
            <p className="text-gray-600">Find and book the perfect parking spot</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search parking spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Options</SheetTitle>
                <SheetDescription>
                  Customize your search to find the perfect parking spot
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distance</label>
                  <Select value={filters.distance} onValueChange={(value) => setFilters({...filters, distance: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">Within 0.5 km</SelectItem>
                      <SelectItem value="1">Within 1 km</SelectItem>
                      <SelectItem value="2">Within 2 km</SelectItem>
                      <SelectItem value="5">Within 5 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (≤ Rp 5,000/hr)</SelectItem>
                      <SelectItem value="medium">Medium (Rp 5,000 - 8,000/hr)</SelectItem>
                      <SelectItem value="high">High (> Rp 8,000/hr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Slot Type</label>
                  <Select value={filters.slotType} onValueChange={(value) => setFilters({...filters, slotType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select slot type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="ev">EV Charging</SelectItem>
                      <SelectItem value="accessible">Accessible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setFilters({ distance: '', priceRange: '', slotType: '' })}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Interactive Map Placeholder */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative">
              <div className="text-center">
                <Navigation className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive Map</p>
                <p className="text-sm text-gray-400">Parking spots will be displayed here</p>
              </div>
              
              {/* Map pins simulation */}
              <div className="absolute top-4 left-4 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-16 right-8 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute bottom-8 left-16 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Full</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Parking Spots */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Nearby Parking Spots</h2>
          
          {filteredSpots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpots.map((spot) => (
                <Card key={spot.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{spot.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {spot.address}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{spot.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{spot.distance}</Badge>
                      <span className="text-sm text-gray-600">
                        {spot.availableSlots} / {spot.totalSlots} available
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {spot.types.map((type) => (
                        <div key={type} className="flex items-center gap-1">
                          {getSlotTypeIcon(type)}
                          <span className="text-xs text-gray-600">{getSlotTypeLabel(type)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-green-600">
                        Rp {spot.pricePerHour.toLocaleString()} / hour
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleBook(spot)}
                        disabled={spot.availableSlots === 0}
                        className="flex-1"
                      >
                        {spot.availableSlots === 0 ? 'Full' : 'Book'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewSlots(spot)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Slots
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No parking spots found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedSpot(null);
        }}
        parkingSpot={selectedSpot}
      />

      <SlotsModal
        isOpen={showSlotsModal}
        onClose={() => {
          setShowSlotsModal(false);
          setSelectedSpot(null);
        }}
        parkingSpot={selectedSpot}
      />
    </div>
  );
}