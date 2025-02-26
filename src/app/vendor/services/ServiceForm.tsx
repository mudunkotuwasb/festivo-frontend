'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Input,
  VStack,
  Textarea,
  NumberInput,
  NumberInputField,
  Grid,
  Image,
  IconButton,
  Text,
  useToast,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
}

interface ServiceFormData {
  title: string;
  description: string;
  basePrice: number;
  images: string[];
  videos: string[];
  timeSlots: TimeSlot[];
}

export default function ServiceForm() {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    basePrice: 0,
    images: [],
    videos: [],
    timeSlots: []
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, ...newVideos]
      }));
    }
  };

  const removeMedia = (index: number, type: 'images' | 'videos') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      date: '',
      startTime: '',
      endTime: '',
      price: formData.basePrice,
      isAvailable: true
    };

    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot]
    }));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: any) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement API call to save service
      toast({
        title: 'Service Created',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create service',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box>
      <Card bg={bgColor} mb={6}>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading size="md">Create New Service</Heading>
            <FormControl>
              <FormLabel>Service Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Base Price</FormLabel>
              <NumberInput
                value={formData.basePrice}
                onChange={(value) => setFormData(prev => ({ ...prev, basePrice: Number(value) }))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Box>
              <FormLabel>Images</FormLabel>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {formData.images.map((image, index) => (
                  <Box key={index} position="relative">
                    <Image src={image} alt="Service" borderRadius="md" />
                    <IconButton
                      aria-label="Remove image"
                      icon={<FiX />}
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => removeMedia(index, 'images')}
                    />
                  </Box>
                ))}
                <Button
                  as="label"
                  leftIcon={<FiPlus />}
                  cursor="pointer"
                  height="100px"
                >
                  Add Image
                  <Input
                    type="file"
                    accept="image/*"
                    display="none"
                    onChange={handleImageUpload}
                    multiple
                  />
                </Button>
              </SimpleGrid>
            </Box>

            <Box>
              <FormLabel>Videos</FormLabel>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {formData.videos.map((video, index) => (
                  <Box key={index} position="relative">
                    <video
                      src={video}
                      controls
                      style={{ width: '100%', borderRadius: '0.375rem' }}
                    />
                    <IconButton
                      aria-label="Remove video"
                      icon={<FiX />}
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => removeMedia(index, 'videos')}
                    />
                  </Box>
                ))}
                <Button
                  as="label"
                  leftIcon={<FiPlus />}
                  cursor="pointer"
                  height="100px"
                >
                  Add Video
                  <Input
                    type="file"
                    accept="video/*"
                    display="none"
                    onChange={handleVideoUpload}
                    multiple
                  />
                </Button>
              </SimpleGrid>
            </Box>

            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <FormLabel mb={0}>Time Slots</FormLabel>
                <Button
                  size="sm"
                  leftIcon={<FiPlus />}
                  onClick={addTimeSlot}
                >
                  Add Slot
                </Button>
              </Flex>
              <VStack spacing={4} align="stretch">
                {formData.timeSlots.map((slot, index) => (
                  <Grid
                    key={slot.id}
                    templateColumns="repeat(4, 1fr)"
                    gap={4}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <FormControl>
                      <FormLabel>Date</FormLabel>
                      <Input
                        type="date"
                        value={slot.date}
                        onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>End Time</FormLabel>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Price</FormLabel>
                      <NumberInput
                        value={slot.price}
                        onChange={(value) => updateTimeSlot(index, 'price', Number(value))}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </Grid>
                ))}
              </VStack>
            </Box>

            <Button colorScheme="teal" onClick={handleSubmit}>
              Create Service
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}