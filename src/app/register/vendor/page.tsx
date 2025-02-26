'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const vendorTypes = [
  'Venue',
  'Catering',
  'Photography',
  'Entertainment',
  'Decoration',
  'Transportation',
  'Beauty & Salon'
];

export default function VendorRegistration() {
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    mobileNumber: '',
    address: '',
    businessRegistrationNumber: '',
    vendorType: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Integrate with Keycloak registration
      toast({
        title: 'Registration successful',
        description: 'Welcome to Festivo! Please wait while we verify your business details.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      router.push('/vendor/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="container.sm">
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" size="xl">
            Vendor Registration
          </Heading>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Business Name</FormLabel>
                <Input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mobile Number</FormLabel>
                <Input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Business Address</FormLabel>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Business Registration Number</FormLabel>
                <Input
                  type="text"
                  value={formData.businessRegistrationNumber}
                  onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Vendor Type</FormLabel>
                <Select
                  placeholder="Select vendor type"
                  value={formData.vendorType}
                  onChange={(e) => setFormData({ ...formData, vendorType: e.target.value })}
                >
                  {vendorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                w="full"
                mt={6}
              >
                Register
              </Button>
              <Button
                variant="ghost"
                w="full"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}