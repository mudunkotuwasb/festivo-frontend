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
  Select,
  Switch,
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
  FiPlus, 
  FiCalendar, 
  FiClock, 
  FiEdit, 
  FiTrash2,
  FiSave,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUser,
  FiPackage
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  isRecurring: boolean;
  recurringPattern: string;
  bookingId?: number;
  customerName?: string;
  serviceName?: string;
  createdAt: string;
}

interface ScheduleStats {
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  thisWeekSlots: number;
  nextWeekSlots: number;
}

export default function VendorSchedule() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    status: 'AVAILABLE',
    isRecurring: false,
    recurringPattern: 'NONE'
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTimeSlots: TimeSlot[] = [
      {
        id: 1,
        date: '2024-02-15',
        startTime: '09:00',
        endTime: '12:00',
        status: 'BOOKED',
        isRecurring: false,
        recurringPattern: 'NONE',
        bookingId: 1,
        customerName: 'Sarah Johnson',
        serviceName: 'Wedding Photography',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        date: '2024-02-15',
        startTime: '14:00',
        endTime: '17:00',
        status: 'AVAILABLE',
        isRecurring: false,
        recurringPattern: 'NONE',
        createdAt: '2024-01-15'
      },
      {
        id: 3,
        date: '2024-02-16',
        startTime: '10:00',
        endTime: '13:00',
        status: 'BOOKED',
        isRecurring: false,
        recurringPattern: 'NONE',
        bookingId: 2,
        customerName: 'Mike Wilson',
        serviceName: 'Event Photography',
        createdAt: '2024-01-16'
      },
      {
        id: 4,
        date: '2024-02-16',
        startTime: '15:00',
        endTime: '18:00',
        status: 'AVAILABLE',
        isRecurring: false,
        recurringPattern: 'NONE',
        createdAt: '2024-01-16'
      },
      {
        id: 5,
        date: '2024-02-17',
        startTime: '09:00',
        endTime: '12:00',
        status: 'BLOCKED',
        isRecurring: false,
        recurringPattern: 'NONE',
        createdAt: '2024-01-17'
      },
      {
        id: 6,
        date: '2024-02-18',
        startTime: '11:00',
        endTime: '13:00',
        status: 'BOOKED',
        isRecurring: false,
        recurringPattern: 'NONE',
        bookingId: 3,
        customerName: 'Lisa Brown',
        serviceName: 'Portrait Session',
        createdAt: '2024-01-18'
      }
    ];
    
    setTimeSlots(mockTimeSlots);
    setLoading(false);
  }, []);

  const handleCreateSlot = () => {
    setSelectedSlot(null);
    setIsEditing(false);
    setFormData({
      date: selectedDate,
      startTime: '',
      endTime: '',
      status: 'AVAILABLE',
      isRecurring: false,
      recurringPattern: 'NONE'
    });
    onOpen();
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsEditing(true);
    setFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: slot.status,
      isRecurring: slot.isRecurring,
      recurringPattern: slot.recurringPattern
    });
    onOpen();
  };

  const handleSaveSlot = () => {
    if (isEditing && selectedSlot) {
      // Update existing slot
      setTimeSlots(timeSlots.map(slot => 
        slot.id === selectedSlot.id 
          ? { ...slot, ...formData }
          : slot
      ));
    } else {
      // Create new slot
      const newSlot: TimeSlot = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTimeSlots([newSlot, ...timeSlots]);
    }
    onClose();
  };

  const handleDeleteSlot = (slotId: number) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'green';
      case 'BOOKED': return 'blue';
      case 'BLOCKED': return 'red';
      case 'MAINTENANCE': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return FiCheckCircle;
      case 'BOOKED': return FiUser;
      case 'BLOCKED': return FiXCircle;
      case 'MAINTENANCE': return FiAlertCircle;
      default: return FiClock;
    }
  };

  const getScheduleStats = (): ScheduleStats => {
    const totalSlots = timeSlots.length;
    const availableSlots = timeSlots.filter(slot => slot.status === 'AVAILABLE').length;
    const bookedSlots = timeSlots.filter(slot => slot.status === 'BOOKED').length;
    const blockedSlots = timeSlots.filter(slot => slot.status === 'BLOCKED').length;
    
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekAfter = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    const thisWeekSlots = timeSlots.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= today && slotDate < nextWeek;
    }).length;
    
    const nextWeekSlots = timeSlots.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= nextWeek && slotDate < weekAfter;
    }).length;

    return {
      totalSlots,
      availableSlots,
      bookedSlots,
      blockedSlots,
      thisWeekSlots,
      nextWeekSlots
    };
  };

  const stats = getScheduleStats();

  const filteredSlots = timeSlots.filter(slot => slot.date === selectedDate);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading schedule...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>Schedule Management</Heading>
            <Text color={textColor}>Manage your availability and time slots</Text>
          </Box>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="teal"
            onClick={handleCreateSlot}
          >
            Add Time Slot
          </Button>
        </Flex>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} spacing={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Slots</StatLabel>
                <StatNumber color="teal.500">{stats.totalSlots}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Available</StatLabel>
                <StatNumber color="green.500">{stats.availableSlots}</StatNumber>
                <StatHelpText>Open for booking</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Booked</StatLabel>
                <StatNumber color="blue.500">{stats.bookedSlots}</StatNumber>
                <StatHelpText>Reserved</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Blocked</StatLabel>
                <StatNumber color="red.500">{stats.blockedSlots}</StatNumber>
                <StatHelpText>Unavailable</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>This Week</StatLabel>
                <StatNumber color="purple.500">{stats.thisWeekSlots}</StatNumber>
                <StatHelpText>Next 7 days</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Next Week</StatLabel>
                <StatNumber color="orange.500">{stats.nextWeekSlots}</StatNumber>
                <StatHelpText>Following week</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Date Selector */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Text fontWeight="semibold">View Schedule for:</Text>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                w="200px"
              />
            </Flex>
          </CardBody>
        </Card>

        {/* Schedule View */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Schedule for {new Date(selectedDate).toLocaleDateString()}</Heading>
          </CardHeader>
          <CardBody>
            {filteredSlots.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No time slots scheduled for this date.
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {filteredSlots.map((slot) => (
                  <Card key={slot.id} bg={bgColor} borderColor={borderColor}>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Icon as={getStatusIcon(slot.status)} color={`${getStatusColor(slot.status)}.500`} />
                              <Text fontWeight="semibold">{slot.startTime} - {slot.endTime}</Text>
                            </HStack>
                            <Badge colorScheme={getStatusColor(slot.status)}>
                              {slot.status}
                            </Badge>
                          </VStack>
                          <HStack>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditSlot(slot)}
                            >
                              <Icon as={FiEdit} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteSlot(slot.id)}
                            >
                              <Icon as={FiTrash2} />
                            </Button>
                          </HStack>
                        </Flex>
                        
                        {slot.status === 'BOOKED' && slot.customerName && (
                          <Box p={3} bg="blue.50" borderRadius="md">
                            <VStack align="stretch" spacing={1}>
                              <Text fontSize="sm" fontWeight="semibold">Booked by:</Text>
                              <Text fontSize="sm">{slot.customerName}</Text>
                              <Text fontSize="sm" color={textColor}>{slot.serviceName}</Text>
                            </VStack>
                          </Box>
                        )}
                        
                        {slot.isRecurring && (
                          <Badge colorScheme="purple" size="sm">
                            Recurring: {slot.recurringPattern}
                          </Badge>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </CardBody>
        </Card>

        {/* Create/Edit Time Slot Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? 'Edit Time Slot' : 'Create New Time Slot'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Start Time</FormLabel>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>End Time</FormLabel>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </Select>
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Recurring Slot</FormLabel>
                  <Switch
                    isChecked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                </FormControl>
                
                {formData.isRecurring && (
                  <FormControl>
                    <FormLabel>Recurring Pattern</FormLabel>
                    <Select
                      value={formData.recurringPattern}
                      onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value })}
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </Select>
                  </FormControl>
                )}
                
                <HStack spacing={4}>
                  <Button
                    leftIcon={<Icon as={FiSave} />}
                    colorScheme="teal"
                    onClick={handleSaveSlot}
                  >
                    {isEditing ? 'Update Slot' : 'Create Slot'}
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


