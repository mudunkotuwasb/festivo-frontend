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
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiDollarSign,
  FiClock,
  FiPackage,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
  totalEarnings: number;
}

export default function VendorServices() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 60,
    isActive: true
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockServices: Service[] = [
      {
        id: 1,
        name: 'Wedding Photography',
        description: 'Full day wedding photography service with professional equipment and editing',
        price: 1500,
        durationMinutes: 480,
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        bookingCount: 12,
        totalEarnings: 18000
      },
      {
        id: 2,
        name: 'Event Photography',
        description: 'Professional event photography for corporate events, parties, and celebrations',
        price: 800,
        durationMinutes: 240,
        isActive: true,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        bookingCount: 8,
        totalEarnings: 6400
      },
      {
        id: 3,
        name: 'Portrait Session',
        description: 'Individual or family portrait photography session with professional lighting',
        price: 400,
        durationMinutes: 120,
        isActive: true,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-15',
        bookingCount: 15,
        totalEarnings: 6000
      },
      {
        id: 4,
        name: 'Product Photography',
        description: 'Professional product photography for e-commerce and marketing',
        price: 300,
        durationMinutes: 90,
        isActive: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
        bookingCount: 3,
        totalEarnings: 900
      }
    ];
    
    setServices(mockServices);
    setLoading(false);
  }, []);

  const handleCreateService = () => {
    setSelectedService(null);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      price: 0,
      durationMinutes: 60,
      isActive: true
    });
    onOpen();
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditing(true);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      isActive: service.isActive
    });
    onOpen();
  };

  const handleSaveService = () => {
    if (isEditing && selectedService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === selectedService.id 
          ? { ...service, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : service
      ));
    } else {
      // Create new service
      const newService: Service = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        bookingCount: 0,
        totalEarnings: 0
      };
      setServices([newService, ...services]);
    }
    onClose();
  };

  const handleDeleteService = (serviceId: number) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  const handleToggleServiceStatus = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : service
    ));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getTotalStats = () => {
    const activeServices = services.filter(s => s.isActive).length;
    const totalBookings = services.reduce((sum, s) => sum + s.bookingCount, 0);
    const totalEarnings = services.reduce((sum, s) => sum + s.totalEarnings, 0);
    const averagePrice = services.length > 0 ? services.reduce((sum, s) => sum + s.price, 0) / services.length : 0;
    
    return { activeServices, totalBookings, totalEarnings, averagePrice };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading services...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>My Services</Heading>
            <Text color={textColor}>Manage your service offerings and pricing</Text>
          </Box>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="teal"
            onClick={handleCreateService}
          >
            Add Service
          </Button>
        </Flex>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={2}>
                <Icon as={FiPackage} boxSize={8} color="teal.500" />
                <Text fontSize="2xl" fontWeight="bold">{stats.activeServices}</Text>
                <Text fontSize="sm" color={textColor}>Active Services</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={2}>
                <Icon as={FiClock} boxSize={8} color="blue.500" />
                <Text fontSize="2xl" fontWeight="bold">{stats.totalBookings}</Text>
                <Text fontSize="sm" color={textColor}>Total Bookings</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={2}>
                <Icon as={FiDollarSign} boxSize={8} color="green.500" />
                <Text fontSize="2xl" fontWeight="bold">${stats.totalEarnings}</Text>
                <Text fontSize="sm" color={textColor}>Total Earnings</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={2}>
                <Icon as={FiDollarSign} boxSize={8} color="purple.500" />
                <Text fontSize="2xl" fontWeight="bold">${stats.averagePrice.toFixed(0)}</Text>
                <Text fontSize="sm" color={textColor}>Average Price</Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Services List */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {services.map((service) => (
            <Card key={service.id} bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="start">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="semibold" fontSize="lg">{service.name}</Text>
                    <Badge colorScheme={service.isActive ? 'green' : 'gray'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </VStack>
                  <HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleServiceStatus(service.id)}
                    >
                      <Icon as={service.isActive ? FiEye : FiEyeOff} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditService(service)}
                    >
                      <Icon as={FiEdit} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Icon as={FiTrash2} />
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
              
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text color={textColor} fontSize="sm">{service.description}</Text>
                  
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Price</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="green.500">
                        ${service.price}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Duration</Text>
                      <Text fontSize="sm">{formatDuration(service.durationMinutes)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Bookings</Text>
                      <Text fontSize="sm" fontWeight="semibold">{service.bookingCount}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Earnings</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="blue.500">
                        ${service.totalEarnings}
                      </Text>
                    </HStack>
                  </VStack>
                  
                  <Divider />
                  
                  <Text fontSize="xs" color={textColor}>
                    Last updated: {service.updatedAt}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Create/Edit Service Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? 'Edit Service' : 'Create New Service'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Service Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your service"
                    rows={4}
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Price ($)</FormLabel>
                    <NumberInput
                      value={formData.price}
                      onChange={(_, value) => setFormData({ ...formData, price: value || 0 })}
                      min={0}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <NumberInput
                      value={formData.durationMinutes}
                      onChange={(_, value) => setFormData({ ...formData, durationMinutes: value || 60 })}
                      min={15}
                      step={15}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Active Service</FormLabel>
                  <Switch
                    isChecked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                </FormControl>
                
                <HStack spacing={4}>
                  <Button
                    leftIcon={<Icon as={FiSave} />}
                    colorScheme="teal"
                    onClick={handleSaveService}
                  >
                    {isEditing ? 'Update Service' : 'Create Service'}
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiX} />}
                    variant="outline"
                    onClick={onClose}
                  >
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