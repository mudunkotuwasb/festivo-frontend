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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FiMapPin, 
  FiStar, 
  FiClock,
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiPhone,
  FiMail,
  FiGlobe,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Vendor {
  id: number;
  name: string;
  businessName: string;
  vendorType: string;
  city: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  rating: number;
  totalReviews: number;
  description: string;
  isVerified: boolean;
  services: Service[];
  timeSlots: TimeSlot[];
  reviews: Review[];
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function VendorDetail() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id;
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockVendor: Vendor = {
      id: parseInt(vendorId as string),
      name: 'John Smith',
      businessName: 'Elegant Catering',
      vendorType: 'CATERING',
      city: 'Colombo',
      address: '123 Main Street, Colombo 03',
      phoneNumber: '+94 77 123 4567',
      email: 'john@elegantcatering.com',
      website: 'www.elegantcatering.com',
      rating: 4.8,
      totalReviews: 124,
      description: 'Professional catering services for all occasions. We specialize in wedding catering, corporate events, and private parties. Our team of experienced chefs creates delicious menus tailored to your preferences.',
      isVerified: true,
      services: [
        { id: 1, name: 'Wedding Catering', price: 1200, duration: 480, description: 'Full wedding catering service with appetizers, main course, and desserts' },
        { id: 2, name: 'Corporate Events', price: 800, duration: 240, description: 'Business event catering with professional service' },
        { id: 3, name: 'Private Parties', price: 600, duration: 180, description: 'Intimate party catering for small gatherings' }
      ],
      timeSlots: [
        { id: 1, date: '2024-02-15', startTime: '09:00', endTime: '12:00', status: 'AVAILABLE' },
        { id: 2, date: '2024-02-15', startTime: '14:00', endTime: '17:00', status: 'AVAILABLE' },
        { id: 3, date: '2024-02-16', startTime: '10:00', endTime: '13:00', status: 'BOOKED' },
        { id: 4, date: '2024-02-16', startTime: '15:00', endTime: '18:00', status: 'AVAILABLE' }
      ],
      reviews: [
        { id: 1, customerName: 'Sarah Johnson', rating: 5, comment: 'Excellent service! The food was delicious and the staff was very professional.', date: '2024-01-15' },
        { id: 2, customerName: 'Mike Wilson', rating: 4, comment: 'Great catering service for our corporate event. Highly recommended!', date: '2024-01-10' },
        { id: 3, customerName: 'Lisa Brown', rating: 5, comment: 'Perfect for our wedding. Everything was beautifully presented and tasted amazing.', date: '2024-01-05' }
      ]
    };
    
    setVendor(mockVendor);
    setLoading(false);
  }, [vendorId]);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    onOpen();
  };

  const handleBookingSubmit = () => {
    // Handle booking submission
    console.log('Booking submitted:', {
      vendor,
      service: selectedService,
      timeSlot: selectedTimeSlot,
      date: bookingDate,
      specialRequests
    });
    onClose();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        as={FiStar}
        color={i < Math.floor(rating) ? 'yellow.400' : 'gray.300'}
        boxSize={4}
      />
    ));
  };

  const getVendorTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'CATERING': 'orange',
      'PHOTOGRAPHY': 'purple',
      'VENUE': 'green',
      'ENTERTAINMENT': 'pink',
      'DECORATION': 'blue'
    };
    return colors[type] || 'gray';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'green';
      case 'BOOKED': return 'red';
      case 'BLOCKED': return 'gray';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading vendor details...</Text>
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          Vendor not found.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={2}>
            <HStack>
              <Heading size="lg">{vendor.businessName}</Heading>
              {vendor.isVerified && (
                <Badge colorScheme="green" size="lg">
                  <Icon as={FiCheckCircle} mr={1} />
                  Verified
                </Badge>
              )}
            </HStack>
            <Badge colorScheme={getVendorTypeColor(vendor.vendorType)} size="lg">
              {vendor.vendorType}
            </Badge>
            <HStack>
              {renderStars(vendor.rating)}
              <Text>{vendor.rating} ({vendor.totalReviews} reviews)</Text>
            </HStack>
          </VStack>
          <Button
            leftIcon={<Icon as={FiMessageSquare} />}
            colorScheme="teal"
            onClick={() => router.push(`/customer/messages?vendor=${vendor.id}`)}
          >
            Message Vendor
          </Button>
        </Flex>

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <GridItem>
            <Tabs>
              <TabList>
                <Tab>About</Tab>
                <Tab>Services</Tab>
                <Tab>Availability</Tab>
                <Tab>Reviews</Tab>
              </TabList>

              <TabPanels>
                {/* About Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Card bg={bgColor} borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="md">Description</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>{vendor.description}</Text>
                      </CardBody>
                    </Card>

                    <Card bg={bgColor} borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="md">Contact Information</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack>
                            <Icon as={FiMapPin} />
                            <Text>{vendor.address}, {vendor.city}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiPhone} />
                            <Text>{vendor.phoneNumber}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiMail} />
                            <Text>{vendor.email}</Text>
                          </HStack>
                          {vendor.website && (
                            <HStack>
                              <Icon as={FiGlobe} />
                              <Text>{vendor.website}</Text>
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Services Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {vendor.services.map((service) => (
                      <Card key={service.id} bg={bgColor} borderColor={borderColor}>
                        <CardBody>
                          <Flex justify="space-between" align="start">
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="semibold" fontSize="lg">{service.name}</Text>
                              <Text color={textColor}>{service.description}</Text>
                              <HStack>
                                <Icon as={FiClock} />
                                <Text fontSize="sm">{service.duration} minutes</Text>
                              </HStack>
                            </VStack>
                            <VStack align="end" spacing={2}>
                              <Text fontSize="xl" fontWeight="bold" color="green.500">
                                ${service.price}
                              </Text>
                              <Button
                                colorScheme="teal"
                                size="sm"
                                onClick={() => handleBookService(service)}
                              >
                                Book Now
                              </Button>
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Availability Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="semibold">Available Time Slots</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {vendor.timeSlots
                        .filter(slot => slot.status === 'AVAILABLE')
                        .map((slot) => (
                        <Card key={slot.id} bg={bgColor} borderColor={borderColor}>
                          <CardBody>
                            <VStack spacing={2}>
                              <Text fontWeight="semibold">{slot.date}</Text>
                              <HStack>
                                <Icon as={FiClock} />
                                <Text>{slot.startTime} - {slot.endTime}</Text>
                              </HStack>
                              <Badge colorScheme={getStatusColor(slot.status)}>
                                {slot.status}
                              </Badge>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                {/* Reviews Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {vendor.reviews.map((review) => (
                      <Card key={review.id} bg={bgColor} borderColor={borderColor}>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <Flex justify="space-between" align="start">
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold">{review.customerName}</Text>
                                <HStack>
                                  {renderStars(review.rating)}
                                </HStack>
                              </VStack>
                              <Text fontSize="sm" color={textColor}>{review.date}</Text>
                            </Flex>
                            <Text>{review.comment}</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              <Card bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Quick Actions</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    <Button
                      leftIcon={<Icon as={FiMessageSquare} />}
                      colorScheme="teal"
                      variant="outline"
                      w="full"
                      onClick={() => router.push(`/customer/messages?vendor=${vendor.id}`)}
                    >
                      Send Message
                    </Button>
                    <Button
                      leftIcon={<Icon as={FiCalendar} />}
                      colorScheme="blue"
                      variant="outline"
                      w="full"
                      onClick={() => router.push(`/customer/events?vendor=${vendor.id}`)}
                    >
                      Create Event
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Vendor Stats</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Text>Rating</Text>
                      <Text fontWeight="semibold">{vendor.rating}/5</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text>Reviews</Text>
                      <Text fontWeight="semibold">{vendor.totalReviews}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text>Services</Text>
                      <Text fontWeight="semibold">{vendor.services.length}</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>

        {/* Booking Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Book Service</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedService && (
                <VStack spacing={4} align="stretch">
                  <Box p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                    <Text fontWeight="semibold">{selectedService.name}</Text>
                    <Text color={textColor}>{selectedService.description}</Text>
                    <Text color="green.500" fontWeight="semibold">${selectedService.price}</Text>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Select Time Slot</FormLabel>
                    <SimpleGrid columns={2} spacing={2}>
                      {vendor.timeSlots
                        .filter(slot => slot.status === 'AVAILABLE')
                        .map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedTimeSlot?.id === slot.id ? 'solid' : 'outline'}
                          colorScheme={selectedTimeSlot?.id === slot.id ? 'teal' : 'gray'}
                          onClick={() => setSelectedTimeSlot(slot)}
                        >
                          {slot.date} {slot.startTime}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Special Requests</FormLabel>
                    <Textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements or notes..."
                    />
                  </FormControl>
                  
                  <HStack spacing={4}>
                    <Button colorScheme="teal" onClick={handleBookingSubmit}>
                      Book Now
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