"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Search, 
  History, 
  Settings,
  TrendingUp,
  ParkingCircle,
  DollarSign,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, logout } from '@/lib/auth';
import { getDashboardStats } from '@/lib/storage';
import BottomNavigation from '@/components/BottomNavigation';
import AdminParkingManagement from '@/components/AdminParkingManagement';

export default function DashboardPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'management'>('overview');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const dashboardStats = getDashboardStats(user.id);
    setStats(dashboardStats);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    router.push('/');
  };

  if (!user || !stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome, {user.name}
                </h1>
                <p className="text-sm text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user.role === 'parking_owner' && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={activeTab === 'overview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === 'management' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('management')}
                  >
                    Management
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableSlots}</p>
                  <p className="text-xs text-gray-500">of {stats.totalSlots} total</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ParkingCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayBookings}</p>
                  <p className="text-xs text-gray-500">active today</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">
                    Rp {stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">from completed bookings</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used features at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => router.push('/booking')}
              >
                <Search className="h-6 w-6" />
                <span>Book Parking Spot</span>
              </Button>
              
              {user.role === 'driver' && (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => router.push('/history')}
                >
                  <History className="h-6 w-6" />
                  <span>View Booking History</span>
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => router.push('/profile')}
              >
                <Settings className="h-6 w-6" />
                <span>Manage Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest booking activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{booking.parkingSpotName}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.location}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {booking.date} at {booking.time}
                        </span>
                        <span className="text-xs text-gray-500">
                          Slot {booking.slotNumber}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={booking.status === 'active' ? 'default' : 
                                booking.status === 'completed' ? 'secondary' : 'destructive'}
                      >
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Rp {booking.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Start by booking your first parking spot!</p>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        ) : (
          <AdminParkingManagement />
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}