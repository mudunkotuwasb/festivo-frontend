'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
}

interface VendorDetails {
  id: string;
  businessName: string;
  vendorType: string;
  description: string;
  rating: number;
  timeSlots: TimeSlot[];
}

export default function VendorDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.700');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Mock vendor data - replace with API call
  const vendorData: VendorDetails = {
    id: params.id,
    businessName: 'Crystal Events',
    vendorType: 'Venue',
    description: 'Luxury event venue with modern amenities',
    rating: 4.5,
    timeSlots: [
      {
        id: '1',
        date: '2024-03-15',
        startTime: '10:00',
        endTime: '16:00',
        price: 1500,
        isAvailable: true
      },
      {
        id: '2',
        date: '2024-03-16',
        startTime: '12:00',
        endTime: '18:00',
        price: 1800,
        isAvailable: true
      }
    ]
  };

  const handleBooking = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    onOpen();
  };

  const handlePayment = async () => {
    try {
      // TODO: Implement payment gateway integration
      toast({
        title: 'Booking Confirmed',
        description: 'Advance payment processed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      onClose();
      router.push('/customer/events');
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleChat = () => {
    router.push(`/customer/messages?vendor=${params.id}`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Card bg={bgColor}>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
              <Box>
                <Heading size="lg" mb={4}>{vendorData.businessName}</Heading>
                <Text fontSize="md" color="gray.500" mb={4}>{vendorData.vendorType}</Text>
                <Text mb={4}>{vendorData.description}</Text>
                <Button colorScheme="teal" onClick={handleChat}>
                  Chat with Vendor
                </Button>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>Rating</Text>
                <Text fontSize="2xl" color="teal.500">{vendorData.rating}/5</Text>
              </Box>
            </Grid>
          </CardBody>
        </Card>

        <Card bg={bgColor}>
          <CardBody>
            <Heading size="md" mb={6}>Available Time Slots</Heading>
            <Stack spacing={4}>
              {vendorData.timeSlots.map((slot) => (
                <Box
                  key={slot.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{slot.date}</Text>
                      <Text color="gray.500">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                      <Text color="teal.500" fontWeight="bold">
                        ${slot.price}
                      </Text>
                    </Box>
                    <Button
                      colorScheme="teal"
                      isDisabled={!slot.isAvailable}
                      onClick={() => handleBooking(slot)}
                    >
                      Book Now
                    </Button>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSlot && (
              <VStack spacing={4} align="stretch">
                <Text>Date: {selectedSlot.date}</Text>
                <Text>Time: {selectedSlot.startTime} - {selectedSlot.endTime}</Text>
                <Text fontWeight="bold">Total Amount: ${selectedSlot.price}</Text>
                <Text>Advance Payment Required: ${selectedSlot.price * 0.3}</Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handlePayment}>
              Pay Advance
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}