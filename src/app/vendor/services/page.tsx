'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FiEdit2, FiPackage, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function VendorServices() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.700');

  const services: Service[] = [
    {
      id: 1,
      name: 'Premium Wedding Photography',
      description: 'Professional photography service for your special day',
      price: 1500,
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=300'
    },
    {
      id: 2,
      name: 'Deluxe Catering Package',
      description: 'Complete catering solution for events up to 200 guests',
      price: 3000,
      category: 'Catering',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=300'
    }
  ];

  const handleEdit = (serviceId: number) => {
    router.push(`/vendor/services/${serviceId}/edit`);
  };

  const handleDelete = (serviceId: number) => {
    // TODO: Implement delete functionality
    console.log('Delete service:', serviceId);
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">My Services</Heading>
          <Button
            leftIcon={<FiPackage />}
            colorScheme="teal"
            onClick={() => router.push('/vendor/services/new')}
          >
            Add New Service
          </Button>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {services.map((service) => (
            <Card key={service.id} bg={cardBg}>
              <CardBody>
                <Image
                  src={service.image}
                  alt={service.name}
                  borderRadius="lg"
                  mb={4}
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
                <Stack spacing={3}>
                  <Heading size="md">{service.name}</Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.300')}>
                    {service.description}
                  </Text>
                  <Text color={useColorModeValue('gray.800', 'gray.100')} fontSize="xl" fontWeight="bold">
                    ${service.price}
                  </Text>
                  <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize="sm">
                    Category: {service.category}
                  </Text>
                  <Flex justify="space-between" mt={4}>
                    <Button
                      leftIcon={<Icon as={FiEdit2} />}
                      colorScheme="teal"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<Icon as={FiTrash2} />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
}