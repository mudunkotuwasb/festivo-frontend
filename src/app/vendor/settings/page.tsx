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
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit, 
  FiSave, 
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiSettings,
  FiShield,
  FiBell,
  FiCreditCard,
  FiGlobe
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface Vendor {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessRegistrationNumber: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  website: string;
  vendorType: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

interface BusinessStats {
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  responseTime: number;
  completionRate: number;
}

export default function VendorSettings() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Vendor>>({});
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockVendor: Vendor = {
      id: 1,
      name: 'John Smith',
      email: 'john@photostudiopro.com',
      phoneNumber: '+94 77 123 4567',
      businessName: 'Photo Studio Pro',
      businessRegistrationNumber: 'BR123456789',
      address: '123 Photography Lane, Colombo 03',
      city: 'Colombo',
      postalCode: '00300',
      description: 'Professional photography and videography services for all occasions',
      website: 'www.photostudiopro.com',
      vendorType: 'PHOTOGRAPHY',
      isVerified: true,
      rating: 4.8,
      totalReviews: 89,
      createdAt: '2023-06-15'
    };
    
    const mockStats: BusinessStats = {
      totalBookings: 156,
      totalEarnings: 125000,
      averageRating: 4.8,
      responseTime: 2.3,
      completionRate: 95
    };
    
    setVendor(mockVendor);
    setBusinessStats(mockStats);
    setLoading(false);
  }, []);

  const handleEditProfile = () => {
    setEditData(vendor || {});
    setIsEditing(true);
    onOpen();
  };

  const handleSaveProfile = () => {
    if (vendor) {
      setVendor({ ...vendor, ...editData });
      setIsEditing(false);
      onClose();
    }
  };

  const handleCancelEdit = () => {
    setEditData({});
    setIsEditing(false);
    onClose();
  };

  const handleInputChange = (field: keyof Vendor, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading settings...</Text>
      </Box>
    );
  }

  if (!vendor || !businessStats) {
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
            <Heading size="lg" mb={2}>Account Settings</Heading>
            <Text color={textColor}>Manage your business profile and preferences</Text>
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
                    <Avatar size="xl" name={vendor.name} />
                    <VStack spacing={1}>
                      <Text fontSize="xl" fontWeight="semibold">{vendor.businessName}</Text>
                      <Text color={textColor}>{vendor.name}</Text>
                      <HStack>
                        <Badge colorScheme={vendor.isVerified ? 'green' : 'yellow'} size="sm">
                          <Icon as={vendor.isVerified ? FiCheckCircle : FiAlertCircle} mr={1} />
                          {vendor.isVerified ? 'Verified' : 'Pending Verification'}
                        </Badge>
                        <Badge colorScheme="blue" size="sm">
                          {vendor.vendorType}
                        </Badge>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Business Performance</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Stat>
                      <StatLabel>Total Bookings</StatLabel>
                      <StatNumber color="teal.500">{businessStats.totalBookings}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiCheckCircle} mr={1} />
                        All time
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Total Earnings</StatLabel>
                      <StatNumber color="green.500">${businessStats.totalEarnings.toLocaleString()}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiCreditCard} mr={1} />
                        Lifetime
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Average Rating</StatLabel>
                      <StatNumber color="yellow.500">{businessStats.averageRating}</StatNumber>
                      <StatHelpText>
                        <Icon as={FiCheckCircle} mr={1} />
                        From {vendor.totalReviews} reviews
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Response Time</StatLabel>
                      <StatNumber color="blue.500">{businessStats.responseTime}h</StatNumber>
                      <StatHelpText>
                        <Icon as={FiBell} mr={1} />
                        Average
                      </StatHelpText>
                    </Stat>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Settings Tabs */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor}>
              <CardBody>
                <Tabs>
                  <TabList>
                    <Tab>Business Info</Tab>
                    <Tab>Contact Details</Tab>
                    <Tab>Preferences</Tab>
                    <Tab>Security</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Business Info Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Business Name</FormLabel>
                          <Input value={vendor.businessName} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Business Registration Number</FormLabel>
                          <Input value={vendor.businessRegistrationNumber} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Vendor Type</FormLabel>
                          <Input value={vendor.vendorType} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea value={vendor.description} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Website</FormLabel>
                          <Input value={vendor.website} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Verification Status</FormLabel>
                          <Input value={vendor.isVerified ? 'Verified' : 'Pending'} isReadOnly />
                        </FormControl>
                      </VStack>
                    </TabPanel>

                    {/* Contact Details Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Contact Person</FormLabel>
                          <Input value={vendor.name} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Email Address</FormLabel>
                          <Input value={vendor.email} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Phone Number</FormLabel>
                          <Input value={vendor.phoneNumber} isReadOnly />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Address</FormLabel>
                          <Textarea value={vendor.address} isReadOnly />
                        </FormControl>
                        
                        <SimpleGrid columns={2} spacing={4}>
                          <FormControl>
                            <FormLabel>City</FormLabel>
                            <Input value={vendor.city} isReadOnly />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Postal Code</FormLabel>
                            <Input value={vendor.postalCode} isReadOnly />
                          </FormControl>
                        </SimpleGrid>
                      </VStack>
                    </TabPanel>

                    {/* Preferences Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Alert status="info">
                          <AlertIcon />
                          Notification preferences and business settings will be available here.
                        </Alert>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Email Notifications</FormLabel>
                          <Switch defaultChecked />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">SMS Notifications</FormLabel>
                          <Switch defaultChecked />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Push Notifications</FormLabel>
                          <Switch defaultChecked />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Auto-accept Bookings</FormLabel>
                          <Switch />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Show in Search Results</FormLabel>
                          <Switch defaultChecked />
                        </FormControl>
                      </VStack>
                    </TabPanel>

                    {/* Security Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Alert status="warning">
                          <AlertIcon />
                          Security settings and password management will be available here.
                        </Alert>
                        
                        <FormControl>
                          <FormLabel>Current Password</FormLabel>
                          <Input type="password" placeholder="Enter current password" />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>New Password</FormLabel>
                          <Input type="password" placeholder="Enter new password" />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Confirm New Password</FormLabel>
                          <Input type="password" placeholder="Confirm new password" />
                        </FormControl>
                        
                        <Button colorScheme="red" variant="outline">
                          Change Password
                        </Button>
                        
                        <Divider />
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Two-Factor Authentication</FormLabel>
                          <Switch />
                        </FormControl>
                        
                        <Button colorScheme="blue" variant="outline">
                          Enable 2FA
                        </Button>
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
            <ModalHeader>Edit Business Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Contact Person Name</FormLabel>
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Business Name</FormLabel>
                  <Input
                    value={editData.businessName || ''}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter business name"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={editData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    value={editData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter business address"
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={editData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
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
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your business"
                    rows={4}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input
                    value={editData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="Enter website URL"
                  />
                </FormControl>
                
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


