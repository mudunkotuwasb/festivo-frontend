'use client';

import {
  Box,
  Container,
  Grid,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
  Card,
  CardBody,
  Button,
  useColorModeValue,
  Icon,
  Flex,
  Badge
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiClock, FiDollarSign, FiStar } from 'react-icons/fi';

interface Vendor {
  id: string;
  businessName: string;
  vendorType: string;
  description: string;
  rating: number;
  services: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  availableSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
    price: number;
  }>;
}

export default function VendorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorType = searchParams.get('type');
  const bgColor = useColorModeValue('white', 'gray.700');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(vendorType || '');

  // Mock data - replace with API call
  const vendors: Vendor[] = [
    {
      id: '1',
      businessName: 'Crystal Events',
      vendorType: 'Venue',
      description: 'Luxury event venue with modern amenities',
      rating: 4.5,
      services: [
        {
          name: 'Grand Ballroom',
          price: 2500,
          description: 'Elegant ballroom for up to 300 guests'
        },
        {
          name: 'Garden Venue',
          price: 1800,
          description: 'Beautiful outdoor space for ceremonies'
        }
      ],
      availableSlots: [
        {
          date: '2024-03-15',
          startTime: '10:00',
          endTime: '16:00',
          price: 2500
        },
        {
          date: '2024-03-16',
          startTime: '12:00',
          endTime: '18:00',
          price: 1800
        }
      ]
    },
    // Add more mock vendors here
  ];

  const vendorTypes = [
    'Venue',
    'Catering',
    'Photography',
    'Entertainment',
    'Decoration',
    'Transportation',
    'Beauty & Salon'
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || vendor.vendorType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            placeholder="Select vendor type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {vendorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </Grid>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredVendors.map(vendor => (
            <Card
              key={vendor.id}
              bg={bgColor}
              cursor="pointer"
              onClick={() => router.push(`/customer/vendors/${vendor.id}`)}
              _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
            >
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{vendor.businessName}</Heading>
                    <Badge colorScheme="teal">{vendor.vendorType}</Badge>
                  </Flex>
                  <Text noOfLines={2}>{vendor.description}</Text>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Icon as={FiStar} color="yellow.400" mr={1} />
                      <Text>{vendor.rating}</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FiDollarSign} color="green.500" mr={1} />
                      <Text>From ${Math.min(...vendor.services.map(s => s.price))}</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FiClock} color="blue.500" mr={1} />
                      <Text>{vendor.availableSlots.length} slots</Text>
                    </Flex>
                  </Flex>
                  <Button colorScheme="teal" size="sm">
                    View Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}