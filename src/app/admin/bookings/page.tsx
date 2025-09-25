'use client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Button
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiFilter, 
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiClock
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { apiService, Booking } from '@/lib/api';

interface BookingFilters {
  search: string;
  status: 'ALL' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  sortBy: 'bookingDate' | 'serviceDate' | 'totalAmount';
  sortOrder: 'asc' | 'desc';
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: 'ALL',
    sortBy: 'bookingDate',
    sortOrder: 'desc'
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filters]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getAllBookings({
        page: 0,
        size: 100,
        sortBy: 'bookingDate',
        sortOrder: 'desc'
      });
      
      if (response.success && response.data) {
        setBookings(response.data.bookings);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Bookings loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(booking =>
        booking.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.vendor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'bookingDate':
          aValue = new Date(a.bookingDate);
          bValue = new Date(b.bookingDate);
          break;
        case 'serviceDate':
          aValue = new Date(a.serviceDate);
          bValue = new Date(b.serviceDate);
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'CONFIRMED': return 'blue';
      case 'IN_PROGRESS': return 'purple';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'PARTIAL': return 'yellow';
      case 'COMPLETED': return 'green';
      case 'REFUNDED': return 'red';
      default: return 'gray';
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
        Booking Management
      </Heading>

      {/* Filters */}
      <Card bg={cardBg} borderColor={borderColor} mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search bookings..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </InputGroup>

              <Select
                maxW="200px"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>

              <Select
                maxW="200px"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="bookingDate">Sort by Booking Date</option>
                <option value="serviceDate">Sort by Service Date</option>
                <option value="totalAmount">Sort by Amount</option>
              </Select>

              <Button
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                }))}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </HStack>

            <Text fontSize="sm" color="gray.500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Bookings Table */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Bookings ({filteredBookings.length})</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Customer</Th>
                <Th>Vendor</Th>
                <Th>Service</Th>
                <Th>Service Date</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBookings.map((booking) => (
                <Tr key={booking.id}>
                  <Td>#{booking.id}</Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{booking.customer.name}</Text>
                      <Text fontSize="sm" color="gray.500">{booking.customer.email}</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{booking.vendor.name}</Text>
                      <Text fontSize="sm" color="gray.500">{booking.vendor.email}</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{booking.service.name}</Text>
                      <Text fontSize="sm" color="gray.500">${booking.service.price}</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text>{new Date(booking.serviceDate).toLocaleDateString()}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={FiDollarSign} />
                        <Text fontWeight="medium">${booking.totalAmount}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Paid: ${booking.advancePayment}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getPaymentStatusColor(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
}
