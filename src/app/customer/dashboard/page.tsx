'use client';

import {
  Box,
  Card,
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
import { useRouter } from 'next/navigation';
import VendorTypeList from '../components/VendorTypeList';
import EventChecklist from '../components/EventChecklist';

export default function CustomerDashboard() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.700');

  const upcomingEvents = [
    {
      id: 1,
      name: 'Wedding Ceremony',
      date: '2024-03-15',
      location: 'Crystal Hall',
      status: 'Confirmed'
    },
    {
      id: 2,
      name: 'Birthday Party',
      date: '2024-03-20',
      location: 'Garden Resort',
      status: 'Pending'
    }
  ];

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={6}>
            Welcome back!
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Upcoming Events</StatLabel>
                  <StatNumber>2</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Bookings</StatLabel>
                  <StatNumber>3</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Messages</StatLabel>
                  <StatNumber>5</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        <Box bg={cardBg} p={4} borderRadius="lg">
          <Heading size="md" mb={4}>Browse Vendors</Heading>
          <VendorTypeList />
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Upcoming Events</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {upcomingEvents.map((event) => (
                  <Box
                    key={event.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => router.push(`/customer/events/${event.id}`)}
                  >
                    <Text fontWeight="bold">{event.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {event.date} - {event.location}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={event.status === 'Confirmed' ? 'green.500' : 'orange.500'}
                    >
                      {event.status}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Event Planning Checklist</Heading>
            </CardHeader>
            <CardBody>
              <EventChecklist />
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Box>
  );
}