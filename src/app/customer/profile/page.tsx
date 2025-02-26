'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
  useToast,
  Heading,
  Card,
  CardBody,
  Avatar,
  Center,
  IconButton
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

export default function Profile() {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Integrate with API to update profile
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Card bg={bgColor} mb={6}>
        <CardBody>
          <VStack spacing={8}>
            <Heading size="lg">Profile Settings</Heading>
            
            <Center position="relative">
              <Avatar size="2xl" name={formData.name} />
              <IconButton
                aria-label="Edit profile picture"
                icon={<FiEdit />}
                size="sm"
                position="absolute"
                bottom="0"
                right="0"
                colorScheme="teal"
                rounded="full"
              />
            </Center>

            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                {isEditing ? (
                  <Button type="submit" colorScheme="teal" w="full">
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    colorScheme="teal"
                    w="full"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}