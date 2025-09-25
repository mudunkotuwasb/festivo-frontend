'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Card,
  CardBody,
  Image,
  Badge,
  Divider
} from '@chakra-ui/react';
import { 
  FiArrowRight, 
  FiStar, 
  FiShield, 
  FiClock, 
  FiUsers, 
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const features = [
    {
      icon: FiUsers,
      title: 'Find Verified Vendors',
      description: 'Connect with trusted and verified service providers in your area'
    },
    {
      icon: FiCalendar,
      title: 'Easy Booking System',
      description: 'Book services with just a few clicks and manage your events seamlessly'
    },
    {
      icon: FiDollarSign,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options'
    },
    {
      icon: FiMessageSquare,
      title: 'Real-time Communication',
      description: 'Chat directly with vendors to discuss your event requirements'
    },
    {
      icon: FiStar,
      title: 'Reviews & Ratings',
      description: 'Read reviews and rate vendors to help others make informed decisions'
    },
    {
      icon: FiShield,
      title: 'Trusted Platform',
      description: 'All vendors are verified and the platform is secure and reliable'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Vendors' },
    { number: '5000+', label: 'Happy Customers' },
    { number: '10000+', label: 'Events Planned' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={useColorModeValue('teal.50', 'gray.800')} py={20}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <VStack align="start" spacing={6}>
                <Badge colorScheme="teal" size="lg" px={4} py={2}>
                  Event Planning Made Simple
                </Badge>
                
                <Heading size="2xl" lineHeight="shorter">
                  Plan Your Perfect Event with{' '}
                  <Text as="span" color="teal.500">
                    Festivo
                  </Text>
                </Heading>
                
                <Text fontSize="xl" color={textColor} lineHeight="tall">
                  Connect with verified vendors, manage bookings, and create unforgettable events 
                  all in one platform. Whether you're planning a wedding, corporate event, or 
                  birthday party, we've got you covered.
                </Text>
                
                <HStack spacing={4}>
                  <Button
                    colorScheme="teal"
                    size="lg"
                    rightIcon={<Icon as={FiArrowRight} />}
                    onClick={() => router.push('/register')}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/login')}
                  >
                    Sign In
                  </Button>
                </HStack>
              </VStack>
            </GridItem>
            
            <GridItem>
              <Box
                bg="white"
                borderRadius="xl"
                p={8}
                boxShadow="xl"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={6}>
                  <Heading size="lg" color="teal.600">How It Works</Heading>
                  
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <Box
                        bg="teal.100"
                        color="teal.600"
                        borderRadius="full"
                        p={3}
                        minW="50px"
                        textAlign="center"
                        fontWeight="bold"
                      >
                        1
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Create Your Account</Text>
                        <Text fontSize="sm" color={textColor}>
                          Sign up as a customer or vendor
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={4}>
                      <Box
                        bg="teal.100"
                        color="teal.600"
                        borderRadius="full"
                        p={3}
                        minW="50px"
                        textAlign="center"
                        fontWeight="bold"
                      >
                        2
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Find & Book Services</Text>
                        <Text fontSize="sm" color={textColor}>
                          Browse vendors and book your services
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={4}>
                      <Box
                        bg="teal.100"
                        color="teal.600"
                        borderRadius="full"
                        p={3}
                        minW="50px"
                        textAlign="center"
                        fontWeight="bold"
                      >
                        3
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Enjoy Your Event</Text>
                        <Text fontSize="sm" color={textColor}>
                          Relax and enjoy your perfectly planned event
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <Box key={index} textAlign="center">
                <Text fontSize="3xl" fontWeight="bold" color="teal.500">
                  {stat.number}
                </Text>
                <Text color={textColor}>{stat.label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            <Box textAlign="center">
              <Heading size="xl" mb={4}>
                Why Choose Festivo?
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="2xl">
                We provide everything you need to plan and execute successful events
              </Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <Card key={index} bg={bgColor} borderColor={borderColor} _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }} transition="all 0.3s">
                  <CardBody textAlign="center">
                    <VStack spacing={4}>
                      <Box
                        bg="teal.100"
                        color="teal.600"
                        borderRadius="full"
                        p={4}
                      >
                        <Icon as={feature.icon} boxSize={8} />
                      </Box>
                      <VStack spacing={2}>
                        <Heading size="md">{feature.title}</Heading>
                        <Text color={textColor} fontSize="sm">
                          {feature.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="teal.600" color="white">
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="xl">
              Ready to Plan Your Next Event?
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Join thousands of satisfied customers who have successfully planned their events with Festivo
            </Text>
            <HStack spacing={4}>
              <Button
                colorScheme="white"
                color="teal.600"
                size="lg"
                rightIcon={<Icon as={FiArrowRight} />}
                onClick={() => router.push('/register')}
              >
                Get Started Now
              </Button>
              <Button
                variant="outline"
                colorScheme="white"
                size="lg"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={12} bg={useColorModeValue('gray.100', 'gray.800')}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={8}>
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading size="lg" color="teal.500">Festivo</Heading>
                <Text color={textColor}>
                  Your trusted partner for event planning. Connect with verified vendors 
                  and create unforgettable experiences.
                </Text>
              </VStack>
            </GridItem>
            
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading size="md">Quick Links</Heading>
                <VStack align="start" spacing={2}>
                  <Button variant="link" color={textColor} onClick={() => router.push('/register')}>
                    Register
                  </Button>
                  <Button variant="link" color={textColor} onClick={() => router.push('/login')}>
                    Sign In
                  </Button>
                </VStack>
              </VStack>
            </GridItem>
            
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading size="md">Contact</Heading>
                <VStack align="start" spacing={2}>
                  <Text color={textColor}>Email: support@festivo.com</Text>
                  <Text color={textColor}>Phone: +94 77 123 4567</Text>
                </VStack>
              </VStack>
            </GridItem>
          </Grid>
          
          <Divider my={8} />
          
          <Text textAlign="center" color={textColor}>
            © 2024 Festivo. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}