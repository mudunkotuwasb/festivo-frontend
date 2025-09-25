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
  InputLeftElement
} from '@chakra-ui/react';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiHome } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerRegister() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      console.log('Customer registration:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to customer dashboard
      router.push('/customer/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Box maxW="2xl" mx="auto" px={6}>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2} color="teal.500">Create Customer Account</Heading>
            <Text color={textColor} fontSize="lg">Join Festivo as a customer to plan your events</Text>
          </Box>

          {/* Registration Form */}
          <Card w="full" bg={bgColor} borderColor={borderColor} boxShadow="lg">
            <CardHeader>
              <HStack>
                <Icon as={FiUser} color="teal.500" boxSize={6} />
                <Heading size="md">Customer Information</Heading>
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

                  {/* Basic Information */}
                  <Box w="full">
                    <Text fontWeight="semibold" mb={4} color="teal.600">Basic Information</Text>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
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

                  {/* Address Information */}
                  <Box w="full">
                    <Text fontWeight="semibold" mb={4} color="teal.600">Address Information (Optional)</Text>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Address</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiHome} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                          />
                        </InputGroup>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        <FormControl>
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
                    colorScheme="teal"
                    size="lg"
                    w="full"
                    isLoading={loading}
                    loadingText="Creating Account..."
                  >
                    Create Customer Account
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Benefits */}
          <Card w="full" bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md" color="teal.600">What you get as a customer:</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Access to verified vendors</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Easy event planning tools</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Secure payment processing</Text>
                  </HStack>
                </VStack>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Real-time messaging</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Booking management</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUser} color="green.500" />
                    <Text fontSize="sm">Review and rating system</Text>
                  </HStack>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

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