"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Star, 
  Car, 
  Zap, 
  Accessibility,
  Building,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ParkingSpot, Floor, Slot } from '@/lib/data';
import { getParkingSpots, saveParkingSpots } from '@/lib/storage';

export default function AdminParkingManagement() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    distance: '',
    rating: 4.5,
    pricePerHour: 5000,
    types: [] as ('regular' | 'accessible' | 'ev')[],
    coordinates: { lat: -6.2088, lng: 106.8456 },
    floors: 3,
    slotsPerFloor: 30,
  });
  const { toast } = useToast();

  useEffect(() => {
    setSpots(getParkingSpots());
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      distance: '',
      rating: 4.5,
      pricePerHour: 5000,
      types: [],
      coordinates: { lat: -6.2088, lng: 106.8456 },
      floors: 3,
      slotsPerFloor: 30,
    });
  };

  const generateSlots = (floors: number, slotsPerFloor: number): Floor[] => {
    const floorLetters = ['A', 'B', 'C', 'D', 'E'];
    
    return Array.from({ length: floors }, (_, floorIndex) => ({
      id: `floor-${Date.now()}-${floorIndex + 1}`,
      number: floorIndex + 1,
      slots: Array.from({ length: slotsPerFloor }, (_, slotIndex) => ({
        id: `slot-${Date.now()}-${floorIndex + 1}-${slotIndex + 1}`,
        number: `${floorLetters[floorIndex] || 'F'}${slotIndex + 1}`,
        status: 'empty' as const,
        type: slotIndex % 10 === 0 ? 'ev' : slotIndex % 15 === 0 ? 'accessible' : 'regular' as const,
        floor: floorIndex + 1,
      })),
    }));
  };

  const handleTypeToggle = (type: 'regular' | 'accessible' | 'ev') => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.address || !formData.distance || formData.types.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const floors = generateSlots(formData.floors, formData.slotsPerFloor);
    const totalSlots = floors.reduce((sum, floor) => sum + floor.slots.length, 0);
    const availableSlots = floors.reduce((sum, floor) => 
      sum + floor.slots.filter(slot => slot.status === 'empty').length, 0
    );

    const newSpot: ParkingSpot = {
      id: `spot-${Date.now()}`,
      name: formData.name,
      address: formData.address,
      distance: formData.distance,
      rating: formData.rating,
      availableSlots,
      totalSlots,
      pricePerHour: formData.pricePerHour,
      types: formData.types,
      coordinates: formData.coordinates,
      floors,
    };

    const updatedSpots = [...spots, newSpot];
    setSpots(updatedSpots);
    saveParkingSpots(updatedSpots);
    
    toast({
      title: "Success",
      description: "Parking spot added successfully",
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = (spot: ParkingSpot) => {
    setEditingSpot(spot);
    setFormData({
      name: spot.name,
      address: spot.address,
      distance: spot.distance,
      rating: spot.rating,
      pricePerHour: spot.pricePerHour,
      types: spot.types,
      coordinates: spot.coordinates,
      floors: spot.floors.length,
      slotsPerFloor: spot.floors[0]?.slots.length || 30,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!editingSpot || !formData.name || !formData.address || !formData.distance || formData.types.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedSpot: ParkingSpot = {
      ...editingSpot,
      name: formData.name,
      address: formData.address,
      distance: formData.distance,
      rating: formData.rating,
      pricePerHour: formData.pricePerHour,
      types: formData.types,
      coordinates: formData.coordinates,
    };

    const updatedSpots = spots.map(spot => 
      spot.id === editingSpot.id ? updatedSpot : spot
    );
    
    setSpots(updatedSpots);
    saveParkingSpots(updatedSpots);
    
    toast({
      title: "Success",
      description: "Parking spot updated successfully",
    });

    setIsEditModalOpen(false);
    setEditingSpot(null);
    resetForm();
  };

  const handleDelete = (spotId: string) => {
    const updatedSpots = spots.filter(spot => spot.id !== spotId);
    setSpots(updatedSpots);
    saveParkingSpots(updatedSpots);
    
    toast({
      title: "Success",
      description: "Parking spot deleted successfully",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ev':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'accessible':
        return <Accessibility className="h-4 w-4 text-purple-600" />;
      default:
        return <Car className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ev':
        return 'EV Charging';
      case 'accessible':
        return 'Accessible';
      default:
        return 'Regular';
    }
  };

  const FormContent = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Parking Spot Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Central Mall Parking"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance">Distance *</Label>
          <Input
            id="distance"
            value={formData.distance}
            onChange={(e) => setFormData({...formData, distance: e.target.value})}
            placeholder="e.g., 0.5 km"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="e.g., Jl. Sudirman No. 123, Jakarta"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerHour">Price per Hour (Rp)</Label>
          <Input
            id="pricePerHour"
            type="number"
            min="1000"
            step="500"
            value={formData.pricePerHour}
            onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})}
          />
        </div>
      </div>

      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floors">Number of Floors</Label>
            <Input
              id="floors"
              type="number"
              min="1"
              max="10"
              value={formData.floors}
              onChange={(e) => setFormData({...formData, floors: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slotsPerFloor">Slots per Floor</Label>
            <Input
              id="slotsPerFloor"
              type="number"
              min="10"
              max="100"
              value={formData.slotsPerFloor}
              onChange={(e) => setFormData({...formData, slotsPerFloor: parseInt(e.target.value)})}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Slot Types *</Label>
        <div className="flex flex-wrap gap-2">
          {(['regular', 'accessible', 'ev'] as const).map((type) => (
            <Button
              key={type}
              type="button"
              variant={formData.types.includes(type) ? "default" : "outline"}
              onClick={() => handleTypeToggle(type)}
              className="flex items-center gap-2"
            >
              {getTypeIcon(type)}
              {getTypeLabel(type)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
              setEditingSpot(null);
            } else {
              setIsAddModalOpen(false);
            }
            resetForm();
          }}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={isEdit ? handleUpdate : handleAdd}
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? 'Update' : 'Add'} Parking Spot
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-6 w-6" />
            Parking Management
          </h2>
          <p className="text-gray-600">Manage parking locations and slots</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Parking Spot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Parking Spot</DialogTitle>
            </DialogHeader>
            <FormContent />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => (
          <Card key={spot.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
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
              
              <div className="flex items-center gap-2 flex-wrap">
                {spot.types.map((type) => (
                  <div key={type} className="flex items-center gap-1">
                    {getTypeIcon(type)}
                    <span className="text-xs text-gray-600">{getTypeLabel(type)}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-lg font-semibold text-green-600">
                Rp {spot.pricePerHour.toLocaleString()} / hour
              </div>

              <Separator />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleEdit(spot)}
                  className="flex-1 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDelete(spot.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {spots.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No parking spots yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first parking location
          </p>
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Parking Spot</DialogTitle>
          </DialogHeader>
          <FormContent isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}