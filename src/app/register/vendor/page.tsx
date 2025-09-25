'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  HStack,
  Icon,
  Heading,
  SimpleGrid,
  Divider,
  InputGroup,
  InputLeftElement,
  Select,
  Textarea
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiHome, 
  FiBriefcase,
  FiFileText,
  FiGlobe
} from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const vendorTypes = [
  'CATERING',
  'PHOTOGRAPHY',
  'ENTERTAINMENT',
  'VENUE',
  'DECORATION',
  'FLORIST',
  'MUSIC',
  'TRANSPORTATION',
  'SECURITY',
  'SALON',
  'SPA',
  'FITNESS',
  'EDUCATION',
  'TECHNOLOGY',
  'OTHER'
];

export default function VendorRegister() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    businessRegistrationNumber: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    website: '',
    vendorType: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual registration API call
      console.log('Vendor registration:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to vendor dashboard
      router.push('/vendor/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Box maxW="4xl" mx="auto" px={6}>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2} color="blue.500">Create Vendor Account</Heading>
            <Text color={textColor} fontSize="lg">Join Festivo as a vendor to offer your services</Text>
          </Box>

          {/* Registration Form */}
          <Card w="full" bg={bgColor} borderColor={borderColor} boxShadow="lg">
            <CardHeader>
              <HStack>
                <Icon as={FiBriefcase} color="blue.500" boxSize={6} />
                <Heading size="md">Vendor Information</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {error && (
                    <Alert status="error">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  {/* Contact Information */}
                  <Box w="full">
                    <Text fontWeight="semibold" mb={4} color="blue.600">Contact Information</Text>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Contact Person Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiUser} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiMail} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiPhone} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        </InputGroup>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Business Information */}
                  <Box w="full">
                    <Text fontWeight="semibold" mb={4} color="blue.600">Business Information</Text>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Business Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiBriefcase} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Enter your business name"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Business Registration Number</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiFileText} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="businessRegistrationNumber"
                            value={formData.businessRegistrationNumber}
                            onChange={handleInputChange}
                            placeholder="Enter business registration number"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Vendor Type</FormLabel>
                        <Select
                          name="vendorType"
                          value={formData.vendorType}
                          onChange={handleInputChange}
                          placeholder="Select your service type"
                        >
                          {vendorTypes.map((type) => (
                            <option key={type} value={type}>
                              {type.replace('_', ' ')}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Business Description</FormLabel>
                        <Textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your business and services"
                          rows={4}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Website (Optional)</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiGlobe} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Enter your website URL"
                          />
                        </InputGroup>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Address Information */}
                  <Box w="full">
                    <Text fontWeight="semibold" mb={4} color="blue.600">Business Address</Text>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Address</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiHome} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your business address"
                          />
                        </InputGroup>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>City</FormLabel>
                          <InputGroup>
                            <InputLeftElement>
                              <Icon as={FiMapPin} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Enter your city"
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Postal Code</FormLabel>
                          <Input
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="Enter postal code"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    isLoading={loading}
                    loadingText="Creating Account..."
                  >
                    Create Vendor Account
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Benefits */}
          <Card w="full" bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md" color="blue.600">What you get as a vendor:</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Showcase your services to customers</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Manage bookings and schedule</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Receive payments securely</Text>
                  </HStack>
                </VStack>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Build reputation with reviews</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Real-time customer communication</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Analytics and business insights</Text>
                  </HStack>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Verification Notice */}
          <Alert status="info">
            <AlertIcon />
            Your business will be verified within 2-3 business days. You'll receive an email notification once verification is complete.
          </Alert>

          {/* Back to Registration Type Selection */}
          <Button
            variant="link"
            leftIcon={<FiArrowLeft />}
            onClick={() => router.push('/register')}
            color={textColor}
          >
            Back to Registration Options
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}