'use client';

import {
  Box,
  Container,
  Flex,
  Text,
  VStack,
  useColorModeValue,
  Avatar,
  Divider,
  Card,
  CardBody
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Chat from '@/app/components/Chat';

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isVendor: boolean;
}

export default function Messages() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendor');
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');

  const [selectedContact, setSelectedContact] = useState<string | null>(vendorId);
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'Crystal Events',
      lastMessage: 'Thank you for your booking!',
      timestamp: new Date(),
      unreadCount: 2,
      isVendor: true
    },
    {
      id: '2',
      name: 'Elegant Catering',
      lastMessage: 'We will prepare everything as discussed',
      timestamp: new Date(),
      unreadCount: 0,
      isVendor: true
    }
  ]);

  useEffect(() => {
    if (vendorId && !contacts.find(contact => contact.id === vendorId)) {
      // TODO: Fetch vendor details from API
      setContacts(prev => [
        ...prev,
        {
          id: vendorId,
          name: 'New Vendor',
          lastMessage: '',
          timestamp: new Date(),
          unreadCount: 0,
          isVendor: true
        }
      ]);
    }
  }, [vendorId]);

  return (
    <Container maxW="container.xl" py={4}>
      <Flex h="calc(100vh - 100px)" gap={4}>
        <Card w="300px" bg={bgColor}>
          <CardBody p={0}>
            <VStack spacing={0} align="stretch">
              {contacts.map((contact) => (
                <Box
                  key={contact.id}
                  p={4}
                  cursor="pointer"
                  bg={selectedContact === contact.id ? hoverBgColor : 'transparent'}
                  _hover={{ bg: hoverBgColor }}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  <Flex gap={3}>
                    <Avatar size="sm" />
                    <Box flex={1}>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="bold">{contact.name}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {contact.timestamp.toLocaleTimeString()}
                        </Text>
                      </Flex>
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
                        {contact.lastMessage}
                      </Text>
                    </Box>
                    {contact.unreadCount > 0 && (
                      <Box
                        bg="teal.500"
                        color="white"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                      >
                        {contact.unreadCount}
                      </Box>
                    )}
                  </Flex>
                  <Divider mt={4} />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Box flex={1}>
          {selectedContact ? (
            <Chat
              vendorId={selectedContact}
              customerId="current-user-id" // TODO: Get from auth context
            />
          ) : (
            <Flex
              h="full"
              align="center"
              justify="center"
              bg={bgColor}
              borderRadius="lg"
            >
              <Text color="gray.500">Select a conversation to start chatting</Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Container>
  );
}