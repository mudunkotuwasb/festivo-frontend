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
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiBriefcase, 
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiClock
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleCustomerRegister = () => {
    router.push('/register/customer');
  };

  const handleVendorRegister = () => {
    router.push('/register/vendor');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Box maxW="6xl" mx="auto" px={6}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="teal.500">
              Join Festivo
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
              Choose your account type to get started with our event planning platform
            </Text>
          </Box>

          {/* Registration Options */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} maxW="4xl" mx="auto">
            {/* Customer Registration */}
            <GridItem>
              <Card 
                bg={bgColor} 
                borderColor={borderColor}
                _hover={{ 
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  borderColor: 'teal.300'
                }}
                transition="all 0.3s"
                cursor="pointer"
                onClick={handleCustomerRegister}
              >
                <CardHeader textAlign="center">
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      borderRadius="full"
                      bg="teal.100"
                      color="teal.600"
                    >
                      <Icon as={FiUser} boxSize={8} />
                    </Box>
                    <VStack spacing={2}>
                      <Heading size="lg">I'm a Customer</Heading>
                      <Text color={textColor} textAlign="center">
                        Looking for vendors to plan my events
                      </Text>
                    </VStack>
                  </VStack>
                </CardHeader>
                
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Find and book vendors easily</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Manage all your events in one place</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Secure payment processing</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Real-time communication with vendors</Text>
                      </HStack>
                    </VStack>
                    
                    <Divider />
                    
                    <Button
                      colorScheme="teal"
                      size="lg"
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={handleCustomerRegister}
                    >
                      Register as Customer
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* Vendor Registration */}
            <GridItem>
              <Card 
                bg={bgColor} 
                borderColor={borderColor}
                _hover={{ 
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  borderColor: 'blue.300'
                }}
                transition="all 0.3s"
                cursor="pointer"
                onClick={handleVendorRegister}
              >
                <CardHeader textAlign="center">
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      borderRadius="full"
                      bg="blue.100"
                      color="blue.600"
                    >
                      <Icon as={FiBriefcase} boxSize={8} />
                    </Box>
                    <VStack spacing={2}>
                      <Heading size="lg">I'm a Vendor</Heading>
                      <Text color={textColor} textAlign="center">
                        Providing services for events
                      </Text>
                    </VStack>
                  </VStack>
                </CardHeader>
                
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Showcase your services to customers</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Manage bookings and schedule</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Receive payments securely</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">Build your reputation with reviews</Text>
                      </HStack>
                    </VStack>
                    
                    <Divider />
                    
                    <Button
                      colorScheme="blue"
                      size="lg"
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={handleVendorRegister}
                    >
                      Register as Vendor
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Features Section */}
          <Box maxW="4xl" mx="auto" mt={12}>
            <Heading size="lg" textAlign="center" mb={8}>
              Why Choose Festivo?
            </Heading>
            
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
              <Card bg={bgColor} borderColor={borderColor}>
                <CardBody textAlign="center">
                  <VStack spacing={4}>
                    <Icon as={FiShield} boxSize={8} color="green.500" />
                    <VStack spacing={2}>
                      <Heading size="md">Secure & Reliable</Heading>
                      <Text fontSize="sm" color={textColor}>
                        Your data and payments are protected with industry-standard security
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor}>
                <CardBody textAlign="center">
                  <VStack spacing={4}>
                    <Icon as={FiStar} boxSize={8} color="yellow.500" />
                    <VStack spacing={2}>
                      <Heading size="md">Quality Vendors</Heading>
                      <Text fontSize="sm" color={textColor}>
                        All vendors are verified and rated by customers for quality assurance
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor}>
                <CardBody textAlign="center">
                  <VStack spacing={4}>
                    <Icon as={FiClock} boxSize={8} color="blue.500" />
                    <VStack spacing={2}>
                      <Heading size="md">24/7 Support</Heading>
                      <Text fontSize="sm" color={textColor}>
                        Get help whenever you need it with our round-the-clock support team
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </Box>

          {/* Login Link */}
          <Box textAlign="center" mt={8}>
            <Text color={textColor}>
              Already have an account?{' '}
              <Button
                variant="link"
                colorScheme="teal"
                onClick={() => router.push('/login')}
              >
                Sign in here
              </Button>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}


