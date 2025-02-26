'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerRegistration() {
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Integrate with Keycloak registration
      toast({
        title: 'Registration successful',
        description: 'Welcome to Festivo!',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      router.push('/customer/dashboard');
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
            Customer Registration
          </Heading>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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