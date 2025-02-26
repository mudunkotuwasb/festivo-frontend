'use client';

import {
  Box,
  Button,
  Card,
  Flex,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPackage, FiCalendar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.700');

  const upcomingBookings = [
    {
      id: 1,
      eventName: 'Wedding Ceremony',
      customerName: 'John Doe',
      date: '2024-03-15',
      status: 'Confirmed',
      amount: 2500
    },
    {
      id: 2,
      eventName: 'Birthday Party',
      customerName: 'Jane Smith',
      date: '2024-03-20',
      status: 'Pending',
      amount: 1500
    }
  ];

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={6}>
            Welcome back!
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Bookings</StatLabel>
                  <StatNumber>24</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>This Month's Revenue</StatLabel>
                  <StatNumber>$4,500</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Services</StatLabel>
                  <StatNumber>5</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Upcoming Bookings</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {upcomingBookings.map((booking) => (
                  <Box
                    key={booking.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => router.push(`/vendor/bookings/${booking.id}`)}
                  >
                    <Text fontWeight="bold">{booking.eventName}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {booking.customerName} - {booking.date}
                    </Text>
                    <Flex justify="space-between" align="center" mt={2}>
                      <Text
                        fontSize="sm"
                        color={booking.status === 'Confirmed' ? 'green.500' : 'orange.500'}
                      >
                        {booking.status}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        ${booking.amount}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Button
                  leftIcon={<FiPackage />}
                  colorScheme="teal"
                  onClick={() => router.push('/vendor/services/new')}
                >
                  Add New Service
                </Button>
                <Button
                  leftIcon={<FiCalendar />}
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => router.push('/vendor/bookings')}
                >
                  View All Bookings
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Box>
  );
}