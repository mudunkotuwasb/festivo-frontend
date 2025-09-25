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
  Divider,
  InputGroup,
  InputLeftElement,
  Link
} from '@chakra-ui/react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Redirect based on user type
        if (formData.email.includes('admin')) {
          router.push('/admin/dashboard');
        } else if (formData.email.includes('vendor') || formData.email.includes('business')) {
          router.push('/vendor/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Box maxW="md" mx="auto" px={6}>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2} color="teal.500">Welcome Back</Heading>
            <Text color={textColor} fontSize="lg">Sign in to your Festivo account</Text>
          </Box>

          {/* Login Form */}
          <Card w="full" bg={bgColor} borderColor={borderColor} boxShadow="lg">
            <CardHeader>
              <Heading size="md" textAlign="center">Sign In</Heading>
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
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FiLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        position="absolute"
                        right="0"
                        top="0"
                        height="100%"
                        zIndex={1}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputGroup>
                  </FormControl>

                  <Flex justify="space-between" w="full">
                    <Link color="teal.500" fontSize="sm">
                      Forgot password?
                    </Link>
                  </Flex>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Signing In..."
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Demo Credentials */}
          <Card w="full" bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <Heading size="sm" color="gray.600">Demo Credentials</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={2} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="semibold">Customer Account:</Text>
                  <Text fontSize="sm" color={textColor}>Email: customer@festivo.com</Text>
                  <Text fontSize="sm" color={textColor}>Password: password123</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="semibold">Vendor Account:</Text>
                  <Text fontSize="sm" color={textColor}>Email: vendor@festivo.com</Text>
                  <Text fontSize="sm" color={textColor}>Password: password123</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Register Link */}
          <Box textAlign="center">
            <Text color={textColor}>
              Don't have an account?{' '}
              <Link color="teal.500" onClick={() => router.push('/register')}>
                Sign up here
              </Link>
            </Text>
          </Box>
          
          {/* Demo Credentials */}
          <Box mt={6} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
            <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
              Demo Credentials:
            </Text>
            <Text fontSize="xs" color={textColor} mb={1}>
              Admin: admin@festivo.com
            </Text>
            <Text fontSize="xs" color={textColor} mb={1}>
              Vendor: vendor@festivo.com
            </Text>
            <Text fontSize="xs" color={textColor}>
              Customer: customer@festivo.com
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}