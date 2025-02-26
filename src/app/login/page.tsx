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

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Integrate with authentication service
      // For now, simulate successful login
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Redirect based on user type (this should come from auth service)
      const userType = 'customer'; // or 'vendor'
      router.push(`/${userType}/dashboard`);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="container.sm">
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" size="xl">
            Login to Festivo
          </Heading>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                w="full"
                mt={6}
              >
                Login
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