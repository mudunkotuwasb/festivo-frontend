'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Divider
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiDollarSign, FiMessageSquare } from 'react-icons/fi';
import Chat from './Chat';

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed';
  date: string;
  type: 'advance' | 'final';
}

interface BookingDetailsProps {
  bookingId: string;
  vendorId: string;
  customerId: string;
  eventName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  advanceAmount: number;
  isVendor: boolean;
}

export default function BookingDetails({
  bookingId,
  vendorId,
  customerId,
  eventName,
  date,
  status,
  totalAmount,
  advanceAmount,
  isVendor
}: BookingDetailsProps) {
  const { isOpen: isPaymentOpen, onOpen: onPaymentOpen, onClose: onPaymentClose } = useDisclosure();
  const { isOpen: isChatOpen, onOpen: onChatOpen, onClose: onChatClose } = useDisclosure();
  const { isOpen: isPriceUpdateOpen, onOpen: onPriceUpdateOpen, onClose: onPriceUpdateClose } = useDisclosure();
  
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      amount: advanceAmount,
      status: 'completed',
      date: new Date().toISOString(),
      type: 'advance'
    }
  ]);
  
  const [newPrice, setNewPrice] = useState(totalAmount);
  const [priceUpdateReason, setPriceUpdateReason] = useState('');
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const remainingAmount = totalAmount - payments.reduce((sum, payment) => sum + (payment.status === 'completed' ? payment.amount : 0), 0);

  const handlePayment = async () => {
    try {
      // TODO: Implement payment gateway integration
      const newPayment: Payment = {
        id: Date.now().toString(),
        amount: remainingAmount,
        status: 'completed',
        date: new Date().toISOString(),
        type: 'final'
      };
      setPayments([...payments, newPayment]);
      onPaymentClose();
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

  const handlePriceUpdate = async () => {
    try {
      // TODO: Implement API call to update price
      // This should trigger a notification to the customer
      onPriceUpdateClose();
      toast({
        title: 'Price Update Sent',
        description: 'Waiting for customer approval',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleCancel = async () => {
    try {
      // TODO: Implement API call to cancel booking
      // Handle refund logic based on who cancelled
      toast({
        title: 'Booking Cancelled',
        description: isVendor ? 'Refund will be processed' : 'Advance payment is non-refundable',
        status: 'info',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box>
      <Card bg={bgColor} mb={6}>
        <CardHeader>
          <Heading size="md">Booking Details</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">{eventName}</Text>
              <Badge
                colorScheme={
                  status === 'confirmed' ? 'green' :
                  status === 'cancelled' ? 'red' : 'yellow'
                }
              >
                {status}
              </Badge>
            </Flex>
            <Text>Date: {new Date(date).toLocaleDateString()}</Text>
            <Divider />
            <Box>
              <Text fontWeight="bold" mb={2}>Payment Summary</Text>
              <Stack spacing={2}>
                <Flex justify="space-between">
                  <Text>Total Amount:</Text>
                  <Text>${totalAmount}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Paid Amount:</Text>
                  <Text>${totalAmount - remainingAmount}</Text>
                </Flex>
                <Flex justify="space-between" fontWeight="bold">
                  <Text>Remaining Amount:</Text>
                  <Text>${remainingAmount}</Text>
                </Flex>
              </Stack>
            </Box>
            <Divider />
            <Stack direction="row" spacing={4}>
              {!isVendor && remainingAmount > 0 && (
                <Button
                  leftIcon={<FiDollarSign />}
                  colorScheme="teal"
                  onClick={onPaymentOpen}
                >
                  Make Payment
                </Button>
              )}
              {isVendor && status === 'confirmed' && (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={onPriceUpdateOpen}
                >
                  Update Price
                </Button>
              )}
              <Button
                leftIcon={<FiMessageSquare />}
                colorScheme="teal"
                variant="outline"
                onClick={onChatOpen}
              >
                Chat
              </Button>
              {status === 'confirmed' && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel Booking
                </Button>
              )}
            </Stack>
          </VStack>
        </CardBody>
      </Card>

      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Remaining Amount: ${remainingAmount}</Text>
              {/* Add payment form/gateway integration here */}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPaymentClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handlePayment}>
              Pay Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isPriceUpdateOpen} onClose={onPriceUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Price</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>New Price</FormLabel>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Reason for Update</FormLabel>
                <Textarea
                  value={priceUpdateReason}
                  onChange={(e) => setPriceUpdateReason(e.target.value)}
                  placeholder="Explain the reason for price update"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPriceUpdateClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handlePriceUpdate}>
              Send Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isChatOpen} onClose={onChatClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chat
              vendorId={vendorId}
              customerId={customerId}
              bookingId={bookingId}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}