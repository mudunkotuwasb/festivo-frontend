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
  Avatar,
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
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock,
  FiUsers,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiCheckCircle,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, Event, Booking } from '@/lib/api';

// Types are now imported from @/lib/api

export default function CustomerEvents() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    guestCount: 0,
    eventType: '',
    totalBudget: 0
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const customerId = 1; // This should come from authentication context

        // Load bookings to create events from them
        const bookingsResponse = await apiService.getBookingsByCustomer(customerId);
        const bookings = bookingsResponse.success ? bookingsResponse.bookings || [] : [];

        // Group bookings by event (for now, we'll create events from bookings)
        // In a real implementation, you'd have a separate events API
        const eventsMap = new Map<string, Event>();
        
        bookings.forEach(booking => {
          const eventKey = booking.serviceDate; // Group by service date for now
          
          if (!eventsMap.has(eventKey)) {
            eventsMap.set(eventKey, {
              id: Date.now() + Math.random(), // Generate unique ID
              name: `${booking.service.name} Event`,
              description: `Event for ${booking.service.name}`,
              eventDate: booking.serviceDate,
              eventTime: booking.timeSlot?.startTime || '09:00',
              location: 'Event Location', // This should come from booking or event data
              guestCount: 1, // Default value
              eventType: 'GENERAL',
              status: booking.status,
              totalBudget: booking.totalAmount,
              spentAmount: booking.advancePayment,
              customer: booking.customer,
              bookings: [booking],
              createdAt: new Date().toISOString()
            });
          } else {
            const existingEvent = eventsMap.get(eventKey)!;
            existingEvent.bookings.push(booking);
            existingEvent.totalBudget += booking.totalAmount;
            existingEvent.spentAmount += booking.advancePayment;
          }
        });

        const eventsList = Array.from(eventsMap.values());
        setEvents(eventsList);

      } catch (error) {
        console.error('Failed to load events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setFormData({
      name: '',
      description: '',
      eventDate: '',
      eventTime: '',
      location: '',
      guestCount: 0,
      eventType: '',
      totalBudget: 0
    });
    onOpen();
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      location: event.location,
      guestCount: event.guestCount,
      eventType: event.eventType,
      totalBudget: event.totalBudget
    });
    onOpen();
  };

  const handleSubmitEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...formData }
          : event
      ));
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now(),
        ...formData,
        status: 'PLANNING',
        spentAmount: 0,
        bookings: [],
        createdAt: new Date().toISOString().split('T')[0]
      };
      setEvents([newEvent, ...events]);
    }
    onClose();
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'yellow';
      case 'CONFIRMED': return 'green';
      case 'IN_PROGRESS': return 'blue';
      case 'COMPLETED': return 'gray';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'WEDDING': 'pink',
      'BIRTHDAY': 'purple',
      'CORPORATE': 'blue',
      'PARTY': 'orange',
      'ANNIVERSARY': 'red'
    };
    return colors[type] || 'gray';
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'yellow';
      case 'CONFIRMED': return 'green';
      case 'COMPLETED': return 'blue';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading events...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>My Events</Heading>
            <Text color={textColor}>Manage your events and bookings</Text>
          </Box>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="teal"
            onClick={handleCreateEvent}
          >
            Create Event
          </Button>
        </Flex>

        {/* Events Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {events.map((event) => (
            <Card key={event.id} bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="start">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="semibold" fontSize="lg">{event.name}</Text>
                    <HStack>
                      <Badge colorScheme={getEventTypeColor(event.eventType)}>
                        {event.eventType}
                      </Badge>
                      <Badge colorScheme={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </HStack>
                  </VStack>
                  <HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Icon as={FiEdit} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Icon as={FiTrash2} />
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
              
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text color={textColor} fontSize="sm">{event.description}</Text>
                  
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text fontSize="sm">{new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiMapPin} />
                      <Text fontSize="sm">{event.location}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiUsers} />
                      <Text fontSize="sm">{event.guestCount} guests</Text>
                    </HStack>
                  </VStack>
                  
                  <Divider />
                  
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Budget</Text>
                      <Text fontSize="sm" fontWeight="semibold">${event.totalBudget}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Spent</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="green.500">${event.spentAmount}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Remaining</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="blue.500">
                        ${event.totalBudget - event.spentAmount}
                      </Text>
                    </HStack>
                  </VStack>
                  
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => router.push(`/customer/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Create/Edit Event Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter event name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event"
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Event Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Event Time</FormLabel>
                    <Input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    />
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter event location"
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Guest Count</FormLabel>
                    <NumberInput
                      value={formData.guestCount}
                      onChange={(_, value) => setFormData({ ...formData, guestCount: value || 0 })}
                      min={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      placeholder="Select event type"
                    >
                      <option value="WEDDING">Wedding</option>
                      <option value="BIRTHDAY">Birthday</option>
                      <option value="CORPORATE">Corporate</option>
                      <option value="PARTY">Party</option>
                      <option value="ANNIVERSARY">Anniversary</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Total Budget</FormLabel>
                  <NumberInput
                    value={formData.totalBudget}
                    onChange={(_, value) => setFormData({ ...formData, totalBudget: value || 0 })}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <HStack spacing={4}>
                  <Button colorScheme="teal" onClick={handleSubmitEvent}>
                    {selectedEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}