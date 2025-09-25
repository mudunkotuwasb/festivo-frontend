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
  Text,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiX,
  FiAlertCircle,
  FiMessageSquare,
  FiEdit,
  FiEye
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceDate: string;
  serviceTime: string;
  totalAmount: number;
  advancePayment: number;
  remainingAmount: number;
  status: string;
  paymentStatus: string;
  specialRequests: string;
  createdAt: string;
  bookingDate: string;
}

export default function VendorBookings() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    reason: ''
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBookings: Booking[] = [
      {
        id: 1,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@email.com',
        customerPhone: '+94 77 123 4567',
        serviceName: 'Wedding Photography',
        serviceDate: '2024-02-15',
        serviceTime: '09:00 AM - 05:00 PM',
        totalAmount: 1500,
        advancePayment: 500,
        remainingAmount: 1000,
        status: 'CONFIRMED',
        paymentStatus: 'PARTIAL',
        specialRequests: 'Please focus on candid moments and family photos',
        createdAt: '2024-01-15',
        bookingDate: '2024-01-15'
      },
      {
        id: 2,
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@email.com',
        customerPhone: '+94 77 234 5678',
        serviceName: 'Event Photography',
        serviceDate: '2024-02-20',
        serviceTime: '02:00 PM - 06:00 PM',
        totalAmount: 800,
        advancePayment: 0,
        remainingAmount: 800,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: 'Corporate event with 50 attendees',
        createdAt: '2024-01-20',
        bookingDate: '2024-01-20'
      },
      {
        id: 3,
        customerName: 'Lisa Brown',
        customerEmail: 'lisa.brown@email.com',
        customerPhone: '+94 77 345 6789',
        serviceName: 'Portrait Session',
        serviceDate: '2024-02-18',
        serviceTime: '11:00 AM - 01:00 PM',
        totalAmount: 400,
        advancePayment: 400,
        remainingAmount: 0,
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        specialRequests: 'Family portrait session with 4 people',
        createdAt: '2024-01-18',
        bookingDate: '2024-01-18'
      },
      {
        id: 4,
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+94 77 456 7890',
        serviceName: 'Wedding Photography',
        serviceDate: '2024-02-25',
        serviceTime: '08:00 AM - 06:00 PM',
        totalAmount: 1500,
        advancePayment: 750,
        remainingAmount: 750,
        status: 'CONFIRMED',
        paymentStatus: 'PARTIAL',
        specialRequests: 'Outdoor wedding ceremony and indoor reception',
        createdAt: '2024-01-25',
        bookingDate: '2024-01-25'
      },
      {
        id: 5,
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@email.com',
        customerPhone: '+94 77 567 8901',
        serviceName: 'Event Photography',
        serviceDate: '2024-02-10',
        serviceTime: '10:00 AM - 02:00 PM',
        totalAmount: 600,
        advancePayment: 0,
        remainingAmount: 600,
        status: 'CANCELLED',
        paymentStatus: 'PENDING',
        specialRequests: 'Birthday party photography',
        createdAt: '2024-01-10',
        bookingDate: '2024-01-10'
      }
    ];
    
    setBookings(mockBookings);
    setLoading(false);
  }, []);

  const handleStatusUpdate = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusUpdate({
      status: booking.status,
      reason: ''
    });
    onOpen();
  };

  const handleSaveStatusUpdate = () => {
    if (selectedBooking) {
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: statusUpdate.status }
          : booking
      ));
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'yellow';
      case 'CONFIRMED': return 'green';
      case 'IN_PROGRESS': return 'blue';
      case 'COMPLETED': return 'gray';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'yellow';
      case 'PARTIAL': return 'orange';
      case 'COMPLETED': return 'green';
      case 'REFUNDED': return 'blue';
      default: return 'gray';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'ALL' || booking.status === statusFilter
  );

  const getBookingStats = () => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const totalEarnings = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingEarnings = bookings
      .filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING')
      .reduce((sum, b) => sum + b.remainingAmount, 0);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalEarnings,
      pendingEarnings
    };
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading bookings...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Bookings Management</Heading>
          <Text color={textColor}>Manage your customer bookings and payments</Text>
        </Box>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} spacing={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Bookings</StatLabel>
                <StatNumber color="teal.500">{stats.totalBookings}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Pending</StatLabel>
                <StatNumber color="yellow.500">{stats.pendingBookings}</StatNumber>
                <StatHelpText>Need attention</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Confirmed</StatLabel>
                <StatNumber color="green.500">{stats.confirmedBookings}</StatNumber>
                <StatHelpText>Upcoming</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Completed</StatLabel>
                <StatNumber color="blue.500">{stats.completedBookings}</StatNumber>
                <StatHelpText>Finished</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Earnings</StatLabel>
                <StatNumber color="green.500">${stats.totalEarnings}</StatNumber>
                <StatHelpText>Completed</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Pending Earnings</StatLabel>
                <StatNumber color="orange.500">${stats.pendingEarnings}</StatNumber>
                <StatHelpText>To be received</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Text fontWeight="semibold">Filter by Status:</Text>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w="200px"
              >
                <option value="ALL">All Bookings</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </Flex>
          </CardBody>
        </Card>

        {/* Bookings List */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {filteredBookings.map((booking) => (
            <Card key={booking.id} bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="start">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="semibold" fontSize="lg">{booking.customerName}</Text>
                    <Text color={textColor} fontSize="sm">{booking.serviceName}</Text>
                    <HStack>
                      <Badge colorScheme={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge colorScheme={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </HStack>
                  </VStack>
                  <HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusUpdate(booking)}
                    >
                      <Icon as={FiEdit} />
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
              
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text fontSize="sm">{booking.serviceDate}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiClock} />
                      <Text fontSize="sm">{booking.serviceTime}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiMail} />
                      <Text fontSize="sm">{booking.customerEmail}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiPhone} />
                      <Text fontSize="sm">{booking.customerPhone}</Text>
                    </HStack>
                  </VStack>
                  
                  <Divider />
                  
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Total Amount</Text>
                      <Text fontSize="sm" fontWeight="semibold">${booking.totalAmount}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Advance Paid</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="green.500">
                        ${booking.advancePayment}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Remaining</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="orange.500">
                        ${booking.remainingAmount}
                      </Text>
                    </HStack>
                  </VStack>
                  
                  {booking.specialRequests && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" mb={1}>Special Requests:</Text>
                        <Text fontSize="sm" color={textColor}>{booking.specialRequests}</Text>
                      </Box>
                    </>
                  )}
                  
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      leftIcon={<Icon as={FiMessageSquare} />}
                    >
                      Message
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<Icon as={FiEye} />}
                    >
                      View Details
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Status Update Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Booking Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedBooking && (
                <VStack spacing={4} align="stretch">
                  <Box p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                    <Text fontWeight="semibold">{selectedBooking.customerName}</Text>
                    <Text color={textColor}>{selectedBooking.serviceName}</Text>
                    <Text fontSize="sm">{selectedBooking.serviceDate} at {selectedBooking.serviceTime}</Text>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>New Status</FormLabel>
                    <Select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                  </FormControl>
                  
                  {(statusUpdate.status === 'CANCELLED' || statusUpdate.status === 'COMPLETED') && (
                    <FormControl>
                      <FormLabel>Reason/Notes</FormLabel>
                      <Textarea
                        value={statusUpdate.reason}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, reason: e.target.value })}
                        placeholder="Enter reason or notes..."
                        rows={3}
                      />
                    </FormControl>
                  )}
                  
                  <HStack spacing={4}>
                    <Button colorScheme="teal" onClick={handleSaveStatusUpdate}>
                      Update Status
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}


