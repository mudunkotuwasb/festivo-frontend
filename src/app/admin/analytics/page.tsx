'use client';

import {
  Box,
  Grid,
  GridItem,
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
  AlertIcon,
  Select,
  Button
} from '@chakra-ui/react';
import { 
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiBarChart3
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { apiService, Vendor, Customer } from '@/lib/api';

interface AnalyticsData {
  userRegistrations: Array<{ date: string; count: number }>;
  bookings: Array<{ date: string; count: number; revenue: number }>;
  revenue: Array<{ date: string; amount: number }>;
  topVendors: Array<{ vendor: Vendor; bookings: number; revenue: number }>;
  topCustomers: Array<{ customer: Customer; bookings: number; spent: number }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30');

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected time range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));
      
      const response = await apiService.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy: timeRange === '7' ? 'day' : timeRange === '30' ? 'day' : 'week'
      });
      
      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        setError(response.message || 'Failed to load analytics data');
      }
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics loading error:', err);
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
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="red.600">
          Analytics Dashboard
        </Heading>
        <HStack>
          <Text fontSize="sm">Time Range:</Text>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            maxW="150px"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </Select>
        </HStack>
      </HStack>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Total Revenue</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    ${analytics?.revenue.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </Text>
                </VStack>
                <Icon as={FiDollarSign} boxSize={8} color="green.500" />
              </HStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Total Bookings</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {analytics?.bookings.reduce((sum, item) => sum + item.count, 0)}
                  </Text>
                </VStack>
                <Icon as={FiCalendar} boxSize={8} color="blue.500" />
              </HStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">New Users</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    {analytics?.userRegistrations.reduce((sum, item) => sum + item.count, 0)}
                  </Text>
                </VStack>
                <Icon as={FiUsers} boxSize={8} color="purple.500" />
              </HStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Avg Rating</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    4.7
                  </Text>
                </VStack>
                <Icon as={FiStar} boxSize={8} color="orange.500" />
              </HStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Top Vendors and Customers */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Top Vendors</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Vendor</Th>
                    <Th>Bookings</Th>
                    <Th>Revenue</Th>
                    <Th>Rating</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {analytics?.topVendors.map((item, index) => (
                    <Tr key={item.vendor.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{item.vendor.businessName}</Text>
                          <Text fontSize="sm" color="gray.500">{item.vendor.vendorType}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue">{item.bookings}</Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="medium">${item.revenue.toLocaleString()}</Text>
                      </Td>
                      <Td>
                        <HStack>
                          <Icon as={FiStar} color="orange.400" />
                          <Text>{item.vendor.rating}</Text>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Top Customers</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Customer</Th>
                    <Th>Bookings</Th>
                    <Th>Spent</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {analytics?.topCustomers.map((item, index) => (
                    <Tr key={item.customer.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{item.customer.name}</Text>
                          <Text fontSize="sm" color="gray.500">{item.customer.email}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme="green">{item.bookings}</Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="medium">${item.spent.toLocaleString()}</Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={item.customer.isActive ? 'green' : 'red'}>
                          {item.customer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Recent Activity */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Recent Activity Summary</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <Box>
              <Text fontWeight="bold" mb={2}>User Registrations</Text>
              <VStack align="stretch" spacing={2}>
                {analytics?.userRegistrations.slice(-5).map((item, index) => (
                  <HStack key={index} justify="space-between">
                    <Text fontSize="sm">{new Date(item.date).toLocaleDateString()}</Text>
                    <Badge colorScheme="purple">{item.count} users</Badge>
                  </HStack>
                ))}
              </VStack>
            </Box>
            
            <Box>
              <Text fontWeight="bold" mb={2}>Bookings</Text>
              <VStack align="stretch" spacing={2}>
                {analytics?.bookings.slice(-5).map((item, index) => (
                  <HStack key={index} justify="space-between">
                    <Text fontSize="sm">{new Date(item.date).toLocaleDateString()}</Text>
                    <Badge colorScheme="blue">{item.count} bookings</Badge>
                  </HStack>
                ))}
              </VStack>
            </Box>
            
            <Box>
              <Text fontWeight="bold" mb={2}>Revenue</Text>
              <VStack align="stretch" spacing={2}>
                {analytics?.revenue.slice(-5).map((item, index) => (
                  <HStack key={index} justify="space-between">
                    <Text fontSize="sm">{new Date(item.date).toLocaleDateString()}</Text>
                    <Text fontSize="sm" fontWeight="medium">${item.amount.toLocaleString()}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
}
