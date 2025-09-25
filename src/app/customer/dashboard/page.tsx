'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Avatar,
  Divider
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiDollarSign, 
  FiMessageSquare, 
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiService, Booking, Event } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    totalSpent: 0,
    averageRating: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || user.userType !== 'CUSTOMER') return;
      
      try {
        setLoading(true);

        // Load bookings
        const bookingsResponse = await apiService.getBookingsByCustomer(user.id);
        const bookings = bookingsResponse.success && bookingsResponse.data ? bookingsResponse.data : [];

        // Calculate stats
        const totalBookings = bookings.length;
        const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const averageRating = bookings.length > 0 ? 
          bookings.reduce((sum, booking) => sum + (booking.vendor.rating || 0), 0) / bookings.length : 0;

        // Get recent bookings (last 5)
        const recentBookingsData = bookings.slice(0, 5);

        // For now, we'll use bookings as events since events API is not implemented yet
        const upcomingEventsData = bookings
          .filter(booking => new Date(booking.serviceDate) > new Date())
          .slice(0, 3)
          .map(booking => ({
            id: booking.id,
            name: `${booking.service.name} - ${booking.vendor.businessName}`,
            description: booking.specialRequests || '',
            eventDate: booking.serviceDate,
            eventTime: new Date(booking.serviceDate).toLocaleTimeString(),
            location: booking.vendor.address || '',
            guestCount: 0,
            eventType: booking.service.name,
            status: booking.status,
            totalBudget: booking.totalAmount,
            spentAmount: booking.advancePayment,
            customer: booking.customer,
            bookings: [booking],
            createdAt: booking.bookingDate
          }));

        setStats({
          totalBookings,
          upcomingEvents: upcomingEventsData.length,
          totalSpent,
          averageRating: Math.round(averageRating * 10) / 10
        });
        setRecentBookings(recentBookingsData);
        setUpcomingEvents(upcomingEventsData);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set default values on error
        setStats({
          totalBookings: 0,
          upcomingEvents: 0,
          totalSpent: 0,
          averageRating: 0
        });
        setRecentBookings([]);
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'green';
      case 'PENDING': return 'yellow';
      case 'COMPLETED': return 'blue';
      case 'IN_PROGRESS': return 'purple';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Welcome back!</Heading>
          <Text color={textColor}>Here's what's happening with your events today.</Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Bookings</StatLabel>
                <StatNumber color="teal.500">{stats.totalBookings}</StatNumber>
                <StatHelpText>
                  <Icon as={FiTrendingUp} mr={1} />
                  +2 from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Upcoming Events</StatLabel>
                <StatNumber color="blue.500">{stats.upcomingEvents}</StatNumber>
                <StatHelpText>
                  <Icon as={FiCalendar} mr={1} />
                  Next: Feb 15
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Spent</StatLabel>
                <StatNumber color="green.500">${stats.totalSpent}</StatNumber>
                <StatHelpText>
                  <Icon as={FiDollarSign} mr={1} />
                  This year
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Avg Rating</StatLabel>
                <StatNumber color="yellow.500">{stats.averageRating}</StatNumber>
                <StatHelpText>
                  <Icon as={FiStar} mr={1} />
                  From vendors
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Recent Bookings */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Recent Bookings</Heading>
                  <Button 
                    size="sm" 
                    colorScheme="teal" 
                    variant="outline"
                    onClick={() => router.push('/customer/events')}
                  >
                    View All
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <Box key={booking.id} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="semibold">{booking.vendor.businessName}</Text>
                            <Text color={textColor} fontSize="sm">{booking.service.name}</Text>
                            <HStack>
                              <Icon as={FiCalendar} />
                              <Text fontSize="sm">{new Date(booking.serviceDate).toLocaleDateString()}</Text>
                            </HStack>
                          </VStack>
                          <VStack align="end" spacing={2}>
                            <Badge colorScheme={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Text fontWeight="semibold" color="green.500">
                              ${booking.totalAmount}
                            </Text>
                          </VStack>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Text color={textColor} textAlign="center" py={4}>
                      No recent bookings found
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Upcoming Events */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Upcoming Events</Heading>
                  <Button 
                    size="sm" 
                    colorScheme="teal" 
                    variant="outline"
                    onClick={() => router.push('/customer/events')}
                  >
                    View All
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <Box key={event.id} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                        <VStack align="stretch" spacing={2}>
                          <Text fontWeight="semibold">{event.name}</Text>
                          <HStack>
                            <Icon as={FiCalendar} />
                            <Text fontSize="sm">{new Date(event.eventDate).toLocaleDateString()}</Text>
                            <Icon as={FiClock} />
                            <Text fontSize="sm">{event.eventTime}</Text>
                          </HStack>
                          <Text fontSize="sm" color={textColor}>{event.location}</Text>
                          <Badge colorScheme={getStatusColor(event.status)} alignSelf="start">
                            {event.status}
                          </Badge>
                        </VStack>
                      </Box>
                    ))
                  ) : (
                    <Text color={textColor} textAlign="center" py={4}>
                      No upcoming events found
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Quick Actions */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Button
                leftIcon={<Icon as={FiUsers} />}
                colorScheme="teal"
                variant="outline"
                onClick={() => router.push('/customer/vendors')}
              >
                Find Vendors
              </Button>
              <Button
                leftIcon={<Icon as={FiCalendar} />}
                colorScheme="blue"
                variant="outline"
                onClick={() => router.push('/customer/events')}
              >
                Create Event
              </Button>
              <Button
                leftIcon={<Icon as={FiMessageSquare} />}
                colorScheme="purple"
                variant="outline"
                onClick={() => router.push('/customer/messages')}
              >
                View Messages
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}