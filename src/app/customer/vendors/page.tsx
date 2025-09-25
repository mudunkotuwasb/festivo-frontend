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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Avatar,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiMapPin, 
  FiStar, 
  FiClock,
  FiDollarSign,
  FiUsers,
  FiFilter,
  FiCalendar,
  FiMessageSquare,
  FiEye
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, Vendor, Service, TimeSlot } from '@/lib/api';

// Types are now imported from @/lib/api

export default function VendorSearch() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVendorType, setSelectedVendorType] = useState('');
  const [minRating, setMinRating] = useState(0);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Load vendors from API
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVendors({
          page: 0,
          size: 50
        });
        
        if (response.success && response.data) {
          setVendors(response.data.vendors);
          setFilteredVendors(response.data.vendors);
        } else {
          setVendors([]);
          setFilteredVendors([]);
        }
      } catch (error) {
        console.error('Failed to load vendors:', error);
        setVendors([]);
        setFilteredVendors([]);
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  useEffect(() => {
    const filterVendors = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVendors({
          city: selectedCity || undefined,
          vendorType: selectedVendorType || undefined,
          minRating: minRating > 0 ? minRating : undefined,
          page: 0,
          size: 50
        });
        
        if (response.success && response.vendors) {
          let filtered = response.vendors;
          
          // Apply client-side search filter
          if (searchTerm) {
            filtered = filtered.filter(vendor => 
              vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          setFilteredVendors(filtered);
        }
      } catch (error) {
        console.error('Failed to filter vendors:', error);
        // Fallback to client-side filtering
        let filtered = vendors;

        if (searchTerm) {
          filtered = filtered.filter(vendor => 
            vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (selectedCity) {
          filtered = filtered.filter(vendor => vendor.city === selectedCity);
        }

        if (selectedVendorType) {
          filtered = filtered.filter(vendor => vendor.vendorType === selectedVendorType);
        }

        if (minRating > 0) {
          filtered = filtered.filter(vendor => vendor.rating >= minRating);
        }

        setFilteredVendors(filtered);
      } finally {
        setLoading(false);
      }
    };

    filterVendors();
  }, [searchTerm, selectedCity, selectedVendorType, minRating]);

  const handleBookService = (vendor: Vendor, service: Service) => {
    setSelectedVendor(vendor);
    setSelectedService(service);
    onOpen();
  };

  const handleBookingSubmit = async () => {
    if (!selectedVendor || !selectedService) return;
    
    try {
      const bookingData = {
        customerId: 1, // This should come from authentication context
        vendorId: selectedVendor.id,
        serviceDate: bookingDate,
        totalAmount: selectedService.price,
        advancePayment: selectedService.price * 0.3, // 30% advance payment
        specialRequests: specialRequests,
        service: selectedService,
        event: null // This would be set if creating from an event
      };
      
      const response = await apiService.createBooking(bookingData);
      
      if (response.success) {
        console.log('Booking created successfully:', response.data);
        // Show success message
        onClose();
        // Redirect to bookings page or show success notification
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      // Show error message
    }
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

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading vendors...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Find Vendors</Heading>
          <Text color={textColor}>Discover the best vendors for your events</Text>
        </Box>

        {/* Search and Filters */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search vendors or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
                <Select
                  placeholder="All Cities"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Jaffna">Jaffna</option>
                </Select>
                
                <Select
                  placeholder="All Types"
                  value={selectedVendorType}
                  onChange={(e) => setSelectedVendorType(e.target.value)}
                >
                  <option value="CATERING">Catering</option>
                  <option value="PHOTOGRAPHY">Photography</option>
                  <option value="VENUE">Venue</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="DECORATION">Decoration</option>
                </Select>
                
                <NumberInput
                  value={minRating}
                  onChange={(_, value) => setMinRating(value || 0)}
                  min={0}
                  max={5}
                  step={0.1}
                >
                  <NumberInputField placeholder="Min Rating" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                
                <Button
                  leftIcon={<Icon as={FiFilter} />}
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                    setSelectedVendorType('');
                    setMinRating(0);
                  }}
                >
                  Clear Filters
                </Button>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Results */}
        {filteredVendors.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            No vendors found matching your criteria.
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <Text fontWeight="semibold" fontSize="lg">{vendor.businessName}</Text>
                        {vendor.isVerified && (
                          <Badge colorScheme="green" size="sm">Verified</Badge>
                        )}
                      </HStack>
                      <Badge colorScheme={getVendorTypeColor(vendor.vendorType)}>
                        {vendor.vendorType}
                      </Badge>
                    </VStack>
                    <Avatar name={vendor.name} size="sm" />
                  </Flex>
                </CardHeader>
                
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Text color={textColor} fontSize="sm">{vendor.description}</Text>
                    
                    <HStack>
                      <Icon as={FiMapPin} />
                      <Text fontSize="sm">{vendor.city}</Text>
                    </HStack>
                    
                    <HStack>
                      <HStack>
                        {renderStars(vendor.rating)}
                      </HStack>
                      <Text fontSize="sm">{vendor.rating} ({vendor.totalReviews} reviews)</Text>
                    </HStack>
                    
                    <Divider />
                    
                    <VStack align="stretch" spacing={2}>
                      <Text fontWeight="semibold" fontSize="sm">Services:</Text>
                      {vendor.services.slice(0, 2).map((service) => (
                        <Box key={service.id} p={2} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                          <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" fontWeight="medium">{service.name}</Text>
                              <Text fontSize="xs" color={textColor}>{service.description}</Text>
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                ${service.price}
                              </Text>
                              <Text fontSize="xs" color={textColor}>
                                {service.duration} min
                              </Text>
                            </VStack>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                    
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => router.push(`/customer/vendors/${vendor.id}`)}
                    >
                      View Details
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Booking Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Book Service</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedVendor && selectedService && (
                <VStack spacing={4} align="stretch">
                  <Box p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                    <Text fontWeight="semibold">{selectedVendor.businessName}</Text>
                    <Text color={textColor}>{selectedService.name}</Text>
                    <Text color="green.500" fontWeight="semibold">${selectedService.price}</Text>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Booking Date</FormLabel>
                    <Input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
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