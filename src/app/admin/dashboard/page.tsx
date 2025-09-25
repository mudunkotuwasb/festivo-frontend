'use client';

import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiTrendingUp,
  FiUserCheck,
  FiUserX,
  FiMessageSquare,
  FiStar
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { apiService, User, Booking, Vendor, Customer } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalVendors: number;
  activeUsers: number;
  inactiveUsers: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalMessages: number;
}

interface RecentActivity {
  id: number;
  type: 'user_registration' | 'booking_created' | 'booking_completed' | 'message_sent';
  description: string;
  timestamp: string;
  userType: 'CUSTOMER' | 'VENDOR';
  userName: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard statistics
      const statsResponse = await apiService.getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Load recent users
      const usersResponse = await apiService.getAllUsers({ 
        page: 0, 
        size: 10, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
      if (usersResponse.success && usersResponse.data) {
        setRecentUsers(usersResponse.data.users);
      }

      // Load recent bookings
      const bookingsResponse = await apiService.getAllBookings({ 
        page: 0, 
        size: 5, 
        sortBy: 'bookingDate', 
        sortOrder: 'desc' 
      });
      if (bookingsResponse.success && bookingsResponse.data) {
        setRecentBookings(bookingsResponse.data.bookings);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="red.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6} color="red.600">
        Admin Dashboard
      </Heading>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber color="blue.500">{stats?.totalUsers.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Bookings</StatLabel>
                <StatNumber color="green.500">{stats?.totalBookings.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +8% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Revenue</StatLabel>
                <StatNumber color="purple.500">${stats?.totalRevenue.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +15% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Average Rating</StatLabel>
                <StatNumber color="orange.500">{stats?.averageRating}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  +0.2 from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* User Breakdown */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">User Breakdown</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUsers} color="blue.500" />
                    <Text>Total Customers</Text>
                  </HStack>
                  <Badge colorScheme="blue" fontSize="sm">
                    {stats?.totalCustomers}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUserCheck} color="green.500" />
                    <Text>Total Vendors</Text>
                  </HStack>
                  <Badge colorScheme="green" fontSize="sm">
                    {stats?.totalVendors}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUserCheck} color="green.500" />
                    <Text>Active Users</Text>
                  </HStack>
                  <Badge colorScheme="green" fontSize="sm">
                    {stats?.activeUsers}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUserX} color="red.500" />
                    <Text>Inactive Users</Text>
                  </HStack>
                  <Badge colorScheme="red" fontSize="sm">
                    {stats?.inactiveUsers}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Booking Status</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiCalendar} color="blue.500" />
                    <Text>Total Bookings</Text>
                  </HStack>
                  <Badge colorScheme="blue" fontSize="sm">
                    {stats?.totalBookings}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiCalendar} color="orange.500" />
                    <Text>Pending</Text>
                  </HStack>
                  <Badge colorScheme="orange" fontSize="sm">
                    {stats?.pendingBookings}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiCalendar} color="green.500" />
                    <Text>Completed</Text>
                  </HStack>
                  <Badge colorScheme="green" fontSize="sm">
                    {stats?.completedBookings}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiDollarSign} color="purple.500" />
                    <Text>Monthly Revenue</Text>
                  </HStack>
                  <Badge colorScheme="purple" fontSize="sm">
                    ${stats?.monthlyRevenue.toLocaleString()}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Recent Users */}
      <Card bg={cardBg} borderColor={borderColor} mb={6}>
        <CardHeader>
          <Heading size="md">Recent User Registrations</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Registered</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge colorScheme={user.userType === 'CUSTOMER' ? 'blue' : 'green'}>
                      {user.userType}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
}
