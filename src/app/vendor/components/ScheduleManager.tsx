'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Select,
  VStack,
  useToast,
  Grid,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Input,
  Checkbox,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  isRecurring: boolean;
  recurrenceType: 'weekly' | 'monthly' | 'none';
}

export default function ScheduleManager() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.700');

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({ 
    startTime: '',
    endTime: '',
    dayOfWeek: 1,
    isRecurring: false,
    recurrenceType: 'none'
  });

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const handleAddTimeSlot = () => {
    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot
    };

    setTimeSlots([...timeSlots, newTimeSlot]);
    toast({
      title: 'Time slot added',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    onClose();
  };

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    toast({
      title: 'Time slot removed',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Schedule Management</Text>
          <Button colorScheme="teal" onClick={onOpen}>
            Add Time Slot
          </Button>
        </HStack>

        <Grid templateColumns="repeat(7, 1fr)" gap={4}>
          {daysOfWeek.map((day, index) => (
            <Box key={day} p={4} bg={bgColor} borderRadius="md" boxShadow="sm">
              <Text fontWeight="bold" mb={4}>{day}</Text>
              <VStack spacing={3} align="stretch">
                {timeSlots
                  .filter(slot => slot.dayOfWeek === index)
                  .map(slot => (
                    <Box
                      key={slot.id}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      position="relative"
                    >
                      <Text fontSize="sm">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                      {slot.isRecurring && (
                        <Text fontSize="xs" color="gray.500">
                          Repeats {slot.recurrenceType}
                        </Text>
                      )}
                      <Button
                        size="xs"
                        colorScheme="red"
                        position="absolute"
                        right={2}
                        top={2}
                        onClick={() => handleRemoveTimeSlot(slot.id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
              </VStack>
            </Box>
          ))}
        </Grid>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Time Slot</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    value={newSlot.dayOfWeek}
                    onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(e.target.value) })}
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={day} value={index}>
                        {day}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <Checkbox
                    isChecked={newSlot.isRecurring}
                    onChange={(e) => setNewSlot({ ...newSlot, isRecurring: e.target.checked })}
                  >
                    Recurring Time Slot
                  </Checkbox>
                </FormControl>

                {newSlot.isRecurring && (
                  <FormControl>
                    <FormLabel>Recurrence Type</FormLabel>
                    <Select
                      value={newSlot.recurrenceType}
                      onChange={(e) => setNewSlot({ ...newSlot, recurrenceType: e.target.value as 'weekly' | 'monthly' | 'none' })}
                    >
                      <option value="none">None</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </FormControl>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={handleAddTimeSlot}>
                Add Slot
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}