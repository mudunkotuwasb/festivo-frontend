'use client';

import {
  Box,
  Container,
  VStack,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Grid,
  useColorModeValue,
  Progress,
  Flex,
  Button,
  Divider,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMessageSquare, FiDollarSign } from 'react-icons/fi';
import Chat from '@/app/components/Chat';

interface EventDetails {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  vendorName: string;
  vendorType: string;
  totalAmount: number;
  paidAmount: number;
  description: string;
  location: string;
  vendorId: string;
  customerId: string;
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const [showChat, setShowChat] = useState(false);

  // Mock data - replace with API call
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    id: params.id,
    title: 'Wedding Ceremony',
    date: '2024-03-15',
    status: 'upcoming',
    vendorName: 'Crystal Events',
    vendorType: 'Venue',
    totalAmount: 2500,
    paidAmount: 750,
    description: 'Luxury wedding venue with full service package',
    location: '123 Event Street, City',
    vendorId: 'v1',
    customerId: 'c1'
  });

  const handlePayment = async () => {
    try {
      // TODO: Implement payment gateway integration
      toast({
        title: 'Payment Successful',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Payment Failed',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Card bg={bgColor}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="lg">{eventDetails.title}</Heading>
                <Badge
                  colorScheme={
                    eventDetails.status === 'completed' ? 'green' :
                    eventDetails.status === 'ongoing' ? 'blue' : 'yellow'
                  }
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {eventDetails.status}
                </Badge>
              </Flex>
              
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <Box>
                  <Text fontWeight="bold">Event Details</Text>
                  <Divider my={2} />
                  <VStack align="stretch" spacing={2}>
                    <Text>Date: {new Date(eventDetails.date).toLocaleDateString()}</Text>
                    <Text>Location: {eventDetails.location}</Text>
                    <Text>Description: {eventDetails.description}</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontWeight="bold">Vendor Information</Text>
                  <Divider my={2} />
                  <VStack align="stretch" spacing={2}>
                    <Text>Vendor: {eventDetails.vendorName}</Text>
                    <Text>Service Type: {eventDetails.vendorType}</Text>
                  </VStack>
                </Box>
              </Grid>

              <Box>
                <Text fontWeight="bold">Payment Status</Text>
                <Divider my={2} />
                <VStack align="stretch" spacing={3}>
                  <Progress
                    value={(eventDetails.paidAmount / eventDetails.totalAmount) * 100}
                    colorScheme="teal"
                    size="sm"
                  />
                  <Flex justify="space-between">
                    <Text>Total Amount: ${eventDetails.totalAmount}</Text>
                    <Text>Paid: ${eventDetails.paidAmount}</Text>
                  </Flex>
                  {eventDetails.paidAmount < eventDetails.totalAmount && (
                    <Button
                      leftIcon={<FiDollarSign />}
                      colorScheme="teal"
                      onClick={handlePayment}
                    >
                      Make Payment
                    </Button>
                  )}
                </VStack>
              </Box>

              <Box>
                <Button
                  leftIcon={<FiMessageSquare />}
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => setShowChat(!showChat)}
                >
                  {showChat ? 'Hide Chat' : 'Show Chat'}
                </Button>
                {showChat && (
                  <Box mt={4}>
                    <Chat
                      vendorId={eventDetails.vendorId}
                      customerId={eventDetails.customerId}
                      bookingId={eventDetails.id}
                    />
                  </Box>
                )}
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}