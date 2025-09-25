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
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit, 
  FiSave, 
  FiX,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiCheckCircle
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
  isActive: boolean;
}

interface ProfileStats {
  totalEvents: number;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  favoriteVendorType: string;
  memberSince: string;
}

export default function CustomerProfile() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Customer>>({});
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCustomer: Customer = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phoneNumber: '+94 77 123 4567',
      address: '123 Main Street, Colombo 03',
      city: 'Colombo',
      postalCode: '00300',
      createdAt: '2023-06-15',
      isActive: true
    };
    
    const mockStats: ProfileStats = {
      totalEvents: 8,
      totalBookings: 15,
      totalSpent: 12500,
      averageRating: 4.7,
      favoriteVendorType: 'Catering',
      memberSince: 'June 2023'
    };
    
    setCustomer(mockCustomer);
    setProfileStats(mockStats);
    setLoading(false);
  }, []);

  const handleEditProfile = () => {
    setEditData(customer || {});
    setIsEditing(true);
    onOpen();
  };

  const handleSaveProfile = () => {
    if (customer) {
      setCustomer({ ...customer, ...editData });
      setIsEditing(false);
      onClose();
    }
  };

  const handleCancelEdit = () => {
    setEditData({});
    setIsEditing(false);
    onClose();
  };

  const handleInputChange = (field: keyof Customer, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  if (!customer || !profileStats) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          Profile not found.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>My Profile</Heading>
            <Text color={textColor}>Manage your account information</Text>
          </Box>
          <Button
            leftIcon={<Icon as={FiEdit} />}
            colorScheme="teal"
            variant="outline"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={6}>
          {/* Profile Overview */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              <Card bg={bgColor} borderColor={borderColor}>
                <CardBody textAlign="center">
                  <VStack spacing={4}>
                    <Avatar size="xl" name={customer.name} />
                    <VStack spacing={1}>
                      <Text fontSize="xl" fontWeight="semibold">{customer.name}</Text>
                      <Text color={textColor}>{customer.email}</Text>
                      <Badge colorScheme="green" size="sm">
                        <Icon as={FiCheckCircle} mr={1} />
                        Active Member
                      </Badge>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Profile Stats</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Stat>
                      <StatLabel>Total Events</StatLabel>
                      <StatNumber color="teal.500">{profileStats.totalEvents}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiCalendar} mr={1} />
                        Events created
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Total Bookings</StatLabel>
                      <StatNumber color="blue.500">{profileStats.totalBookings}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiCheckCircle} mr={1} />
                        Services booked
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Total Spent</StatLabel>
                      <StatNumber color="green.500">${profileStats.totalSpent}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiDollarSign} mr={1} />
                        Lifetime spending
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Average Rating</StatLabel>
                      <StatNumber color="yellow.500">{profileStats.averageRating}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiStar} mr={1} />
                        From vendors
                      </StatHelpText>
                    </Stat>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Profile Details */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Personal Information</Heading>
              </CardHeader>
              <CardBody>
                <Tabs>
                  <TabList>
                    <Tab>Basic Info</Tab>
                    <Tab>Contact Details</Tab>
                    <Tab>Account Settings</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Basic Info Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Input value={customer.name} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Email Address</FormLabel>
                          <Input value={customer.email} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Member Since</FormLabel>
                          <Input value={profileStats.memberSince} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Account Status</FormLabel>
                          <Input value={customer.isActive ? 'Active' : 'Inactive'} isReadOnly />
                        </FormControl>
                      </VStack>
                    </TabPanel>

                    {/* Contact Details Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Phone Number</FormLabel>
                          <Input value={customer.phoneNumber} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Address</FormLabel>
                          <Textarea value={customer.address} isReadOnly />
                        </FormControl>
                        
                        <SimpleGrid columns={2} spacing={4}>
                          <FormControl>
                            <FormLabel>City</FormLabel>
                            <Input value={customer.city} isReadOnly />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Postal Code</FormLabel>
                            <Input value={customer.postalCode} isReadOnly />
                          </FormControl>
                        </SimpleGrid>
                      </VStack>
                    </TabPanel>

                    {/* Account Settings Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Alert status="info">
                          <AlertIcon />
                          Account settings and preferences will be available here.
                        </Alert>
                        
                        <FormControl>
                          <FormLabel>Favorite Vendor Type</FormLabel>
                          <Input value={profileStats.favoriteVendorType} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Notification Preferences</FormLabel>
                          <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                              <Text>Email Notifications</Text>
                              <Badge colorScheme="green">Enabled</Badge>
                            </HStack>
                            <HStack justify="space-between">
                              <Text>SMS Notifications</Text>
                              <Badge colorScheme="green">Enabled</Badge>
                            </HStack>
                            <HStack justify="space-between">
                              <Text>Push Notifications</Text>
                              <Badge colorScheme="green">Enabled</Badge>
                            </HStack>
                          </VStack>
                        </FormControl>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={handleCancelEdit} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={editData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    value={editData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={editData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Postal Code</FormLabel>
                    <Input
                      value={editData.postalCode || ''}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </FormControl>
                </SimpleGrid>
                
                <HStack spacing={4}>
                  <Button
                    leftIcon={<Icon as={FiSave} />}
                    colorScheme="teal"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiX} />}
                    variant="outline"
                    onClick={handleCancelEdit}
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