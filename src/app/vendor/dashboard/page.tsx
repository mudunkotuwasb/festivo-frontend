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
  Divider,
  Progress,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiDollarSign, 
  FiMessageSquare, 
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPackage,
  FiSettings
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiService, Booking, Service, TimeSlot } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function VendorDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
    activeServices: 0,
    availableTimeSlots: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<Booking[]>([]);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || user.userType !== 'VENDOR') return;
      
      try {
        setLoading(true);

        // Load bookings
        const bookingsResponse = await apiService.getBookingsByVendor(user.id);
        const bookings = bookingsResponse.success && bookingsResponse.data ? bookingsResponse.data : [];

        // Load services
        const servicesResponse = await apiService.getVendorServices(user.id);
        const services = servicesResponse.success && servicesResponse.data ? servicesResponse.data : [];

        // Load time slots
        const timeSlotsResponse = await apiService.getVendorTimeSlots(user.id);
        const timeSlots = timeSlotsResponse.success && timeSlotsResponse.data ? timeSlotsResponse.data : [];

        // Load reviews for rating calculation
        const reviewsResponse = await apiService.getReviewsByVendor(user.id);
        const reviews = reviewsResponse.success && reviewsResponse.data ? reviewsResponse.data : [];

        // Calculate stats
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
        const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
        const totalEarnings = bookings
          .filter(b => b.status === 'COMPLETED')
          .reduce((sum, booking) => sum + booking.totalAmount, 0);

        const averageRating = reviews.length > 0 ? 
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

        // Get recent bookings (last 5)
        const recentBookingsData = bookings.slice(0, 5);

        // Get upcoming schedule (next 5 bookings)
        const upcomingScheduleData = bookings
          .filter(b => new Date(b.serviceDate) >= new Date())
          .slice(0, 5);

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalEarnings,
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
          activeServices: services.length,
          availableTimeSlots: timeSlots.filter(ts => ts.status === 'AVAILABLE').length
        });
        setRecentBookings(recentBookingsData);
        setUpcomingSchedule(upcomingScheduleData);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set default values on error
        setStats({
          totalBookings: 0,
          pendingBookings: 0,
          completedBookings: 0,
          totalEarnings: 0,
          averageRating: 0,
          totalReviews: 0,
          activeServices: 0,
          availableTimeSlots: 0
        });
        setRecentBookings([]);
        setUpcomingSchedule([]);
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
      case 'CANCELLED': return 'red';
      case 'IN_PROGRESS': return 'purple';
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
          <Heading size="lg" mb={2}>Vendor Dashboard</Heading>
          <Text color={textColor}>Manage your business and bookings</Text>
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
                  +3 this week
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Pending Bookings</StatLabel>
                <StatNumber color="yellow.500">{stats.pendingBookings}</StatNumber>
                <StatHelpText>
                  <Icon as={FiClock} mr={1} />
                  Need attention
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Earnings</StatLabel>
                <StatNumber color="green.500">${stats.totalEarnings}</StatNumber>
                <StatHelpText>
                  <Icon as={FiDollarSign} mr={1} />
                  This month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Average Rating</StatLabel>
                <StatNumber color="yellow.500">{stats.averageRating}</StatNumber>
                <StatHelpText>
                  <Icon as={FiStar} mr={1} />
                  From {stats.totalReviews} reviews
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
                    onClick={() => router.push('/vendor/bookings')}
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
                            <Text fontWeight="semibold">{booking.customer.name}</Text>
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

          {/* Upcoming Schedule */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">Upcoming Schedule</Heading>
                  <Button 
                    size="sm" 
                    colorScheme="teal" 
                    variant="outline"
                    onClick={() => router.push('/vendor/schedule')}
                  >
                    Manage
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {upcomingSchedule.length > 0 ? (
                    upcomingSchedule.map((booking) => (
                      <Box key={booking.id} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                        <VStack align="stretch" spacing={2}>
                          <Text fontWeight="semibold">{booking.customer.name}</Text>
                          <Text fontSize="sm" color={textColor}>{booking.service.name}</Text>
                          <HStack>
                            <Icon as={FiCalendar} />
                            <Text fontSize="sm">{new Date(booking.serviceDate).toLocaleDateString()}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiClock} />
                            <Text fontSize="sm">{booking.timeSlot ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}` : 'Time TBD'}</Text>
                          </HStack>
                          <Text fontSize="sm" color={textColor}>{booking.specialRequests || 'No special requests'}</Text>
                        </VStack>
                      </Box>
                    ))
                  ) : (
                    <Text color={textColor} textAlign="center" py={4}>
                      No upcoming schedule found
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Business Overview */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Business Performance</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm">Booking Completion Rate</Text>
                    <Text fontSize="sm" fontWeight="semibold">85%</Text>
                  </Flex>
                  <Progress value={85} colorScheme="green" size="sm" />
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm">Customer Satisfaction</Text>
                    <Text fontSize="sm" fontWeight="semibold">92%</Text>
                  </Flex>
                  <Progress value={92} colorScheme="blue" size="sm" />
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm">Response Time</Text>
                    <Text fontSize="sm" fontWeight="semibold">2.3 hrs</Text>
                  </Flex>
                  <Progress value={76} colorScheme="purple" size="sm" />
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                <Button
                  leftIcon={<Icon as={FiPackage} />}
                  colorScheme="teal"
                  variant="outline"
                  w="full"
                  onClick={() => router.push('/vendor/services')}
                >
                  Manage Services
                </Button>
                <Button
                  leftIcon={<Icon as={FiCalendar} />}
                  colorScheme="blue"
                  variant="outline"
                  w="full"
                  onClick={() => router.push('/vendor/schedule')}
                >
                  Update Schedule
                </Button>
                <Button
                  leftIcon={<Icon as={FiMessageSquare} />}
                  colorScheme="purple"
                  variant="outline"
                  w="full"
                  onClick={() => router.push('/vendor/messages')}
                >
                  View Messages
                </Button>
                <Button
                  leftIcon={<Icon as={FiSettings} />}
                  colorScheme="gray"
                  variant="outline"
                  w="full"
                  onClick={() => router.push('/vendor/settings')}
                >
                  Account Settings
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Alerts and Notifications */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Alerts & Notifications</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Alert status="info">
                <AlertIcon />
                You have 3 pending booking requests that need your attention.
              </Alert>
              <Alert status="warning">
                <AlertIcon />
                Your profile verification is still pending. Complete it to get more bookings.
              </Alert>
              <Alert status="success">
                <AlertIcon />
                Great job! You've received 5 new reviews this week.
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}