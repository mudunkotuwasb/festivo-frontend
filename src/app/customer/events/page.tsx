'use client';

import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Grid,
  useColorModeValue,
  Button,
  Progress,
  Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  vendorName: string;
  vendorType: string;
  totalAmount: number;
  paidAmount: number;
}

export default function EventsPage() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.700');
  const [events, setEvents] = useState<Event[]>([
    // Mock data - replace with API call
    {
      id: '1',
      title: 'Wedding Ceremony',
      date: '2024-03-15',
      status: 'upcoming',
      vendorName: 'Crystal Events',
      vendorType: 'Venue',
      totalAmount: 2500,
      paidAmount: 750
    },
    {
      id: '2',
      title: 'Birthday Party',
      date: '2024-02-01',
      status: 'completed',
      vendorName: 'Party Planners',
      vendorType: 'Entertainment',
      totalAmount: 1000,
      paidAmount: 1000
    },
    {
      id: '3',
      title: 'Corporate Event',
      date: '2024-02-20',
      status: 'ongoing',
      vendorName: 'Elite Catering',
      vendorType: 'Catering',
      totalAmount: 3000,
      paidAmount: 1500
    }
  ]);

  const filterEvents = (status: 'upcoming' | 'ongoing' | 'completed') => {
    return events.filter(event => event.status === status);
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/customer/events/${eventId}`);
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card
      bg={bgColor}
      cursor="pointer"
      onClick={() => handleEventClick(event.id)}
      _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="center">
            <Heading size="md">{event.title}</Heading>
            <Badge
              colorScheme={
                event.status === 'completed' ? 'green' :
                event.status === 'ongoing' ? 'blue' : 'yellow'
              }
            >
              {event.status}
            </Badge>
          </Flex>
          <Text>Date: {new Date(event.date).toLocaleDateString()}</Text>
          <Text>Vendor: {event.vendorName}</Text>
          <Text>Service Type: {event.vendorType}</Text>
          <Box>
            <Text>Payment Progress</Text>
            <Progress
              value={(event.paidAmount / event.totalAmount) * 100}
              colorScheme="teal"
              size="sm"
              mt={2}
            />
            <Text mt={2} fontSize="sm">
              ${event.paidAmount} paid of ${event.totalAmount}
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">My Events</Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab>Upcoming Events</Tab>
            <Tab>Ongoing Events</Tab>
            <Tab>Past Events</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                {filterEvents('upcoming').map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                {filterEvents('ongoing').map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                {filterEvents('completed').map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}