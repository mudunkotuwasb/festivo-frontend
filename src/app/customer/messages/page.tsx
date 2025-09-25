'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Avatar,
  Divider,
  Textarea,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FiSend, 
  FiSearch, 
  FiMessageSquare,
  FiUser,
  FiClock,
  FiCheck,
  FiCheckCircle
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  isRead: boolean;
  createdAt: string;
  messageType: string;
}

interface Conversation {
  id: number;
  vendorId: number;
  vendorName: string;
  vendorBusinessName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function CustomerMessages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendor');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockConversations: Conversation[] = [
      {
        id: 1,
        vendorId: 1,
        vendorName: 'John Smith',
        vendorBusinessName: 'Elegant Catering',
        lastMessage: 'Thank you for choosing our services!',
        lastMessageTime: '2024-01-15T10:30:00',
        unreadCount: 2,
        isOnline: true
      },
      {
        id: 2,
        vendorId: 2,
        vendorName: 'Sarah Johnson',
        vendorBusinessName: 'Photo Studio Pro',
        lastMessage: 'I can send you some sample photos',
        lastMessageTime: '2024-01-14T15:45:00',
        unreadCount: 0,
        isOnline: false
      },
      {
        id: 3,
        vendorId: 3,
        vendorName: 'Mike Wilson',
        vendorBusinessName: 'Garden Venues',
        lastMessage: 'The venue is available for your date',
        lastMessageTime: '2024-01-13T09:20:00',
        unreadCount: 1,
        isOnline: true
      }
    ];
    
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (vendorId) {
      const conversation = conversations.find(c => c.vendorId === parseInt(vendorId));
      if (conversation) {
        setSelectedConversation(conversation);
        loadMessages(conversation.vendorId);
      }
    }
  }, [vendorId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (vendorId: number) => {
    // Mock messages - replace with actual API call
    const mockMessages: Message[] = [
      {
        id: 1,
        content: 'Hello! I\'m interested in your catering services for my wedding.',
        senderId: 1,
        senderName: 'You',
        receiverId: vendorId,
        receiverName: 'Vendor',
        isRead: true,
        createdAt: '2024-01-15T10:00:00',
        messageType: 'TEXT'
      },
      {
        id: 2,
        content: 'Thank you for your interest! I\'d be happy to help with your wedding catering. When is your event?',
        senderId: vendorId,
        senderName: 'Vendor',
        receiverId: 1,
        receiverName: 'You',
        isRead: true,
        createdAt: '2024-01-15T10:05:00',
        messageType: 'TEXT'
      },
      {
        id: 3,
        content: 'It\'s on February 15th, 2024. We\'re expecting about 150 guests.',
        senderId: 1,
        senderName: 'You',
        receiverId: vendorId,
        receiverName: 'Vendor',
        isRead: true,
        createdAt: '2024-01-15T10:10:00',
        messageType: 'TEXT'
      },
      {
        id: 4,
        content: 'Perfect! I can definitely accommodate that. Let me send you our wedding package options.',
        senderId: vendorId,
        senderName: 'Vendor',
        receiverId: 1,
        receiverName: 'You',
        isRead: true,
        createdAt: '2024-01-15T10:15:00',
        messageType: 'TEXT'
      },
      {
        id: 5,
        content: 'Thank you for choosing our services!',
        senderId: vendorId,
        senderName: 'Vendor',
        receiverId: 1,
        receiverName: 'You',
        isRead: false,
        createdAt: '2024-01-15T10:30:00',
        messageType: 'TEXT'
      }
    ];
    
    setMessages(mockMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now(),
        content: newMessage,
        senderId: 1, // Current user ID
        senderName: 'You',
        receiverId: selectedConversation.vendorId,
        receiverName: selectedConversation.vendorName,
        isRead: false,
        createdAt: new Date().toISOString(),
        messageType: 'TEXT'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update conversation last message
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
          : conv
      ));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.vendorBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading messages...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} h="calc(100vh - 120px)">
      <VStack spacing={4} align="stretch" h="full">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Messages</Heading>
          <Text color={textColor}>Communicate with your vendors</Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={6} h="full">
          {/* Conversations List */}
          <GridItem>
            <Card bg={bgColor} borderColor={borderColor} h="full">
              <CardHeader>
                <VStack spacing={4} align="stretch">
                  <InputGroup>
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <InputRightElement>
                      <Icon as={FiSearch} color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                </VStack>
              </CardHeader>
              
              <CardBody>
                <VStack spacing={2} align="stretch">
                  {filteredConversations.map((conversation) => (
                    <Box
                      key={conversation.id}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor={borderColor}
                      cursor="pointer"
                      bg={selectedConversation?.id === conversation.id ? 'teal.50' : 'transparent'}
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        loadMessages(conversation.vendorId);
                      }}
                    >
                      <Flex justify="space-between" align="start">
                        <HStack spacing={3}>
                          <Avatar
                            name={conversation.vendorName}
                            size="sm"
                            bg={conversation.isOnline ? 'green.500' : 'gray.400'}
                          />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" fontSize="sm">
                              {conversation.vendorBusinessName}
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                              {conversation.vendorName}
                            </Text>
                          </VStack>
                        </HStack>
                        <VStack align="end" spacing={1}>
                          <Text fontSize="xs" color={textColor}>
                            {formatTime(conversation.lastMessageTime)}
                          </Text>
                          {conversation.unreadCount > 0 && (
                            <Badge colorScheme="red" size="sm">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </VStack>
                      </Flex>
                      <Text fontSize="sm" color={textColor} mt={2} noOfLines={2}>
                        {conversation.lastMessage}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Chat Area */}
          <GridItem>
            {selectedConversation ? (
              <Card bg={bgColor} borderColor={borderColor} h="full" display="flex" flexDirection="column">
                {/* Chat Header */}
                <CardHeader borderBottom="1px" borderColor={borderColor}>
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Avatar
                        name={selectedConversation.vendorName}
                        size="sm"
                        bg={selectedConversation.isOnline ? 'green.500' : 'gray.400'}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{selectedConversation.vendorBusinessName}</Text>
                        <Text fontSize="sm" color={textColor}>
                          {selectedConversation.isOnline ? 'Online' : 'Offline'}
                        </Text>
                      </VStack>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/customer/vendors/${selectedConversation.vendorId}`)}
                    >
                      View Profile
                    </Button>
                  </Flex>
                </CardHeader>

                {/* Messages */}
                <CardBody flex="1" overflowY="auto">
                  <VStack spacing={4} align="stretch">
                    {messages.map((message) => (
                      <Flex
                        key={message.id}
                        justify={message.senderId === 1 ? 'flex-end' : 'flex-start'}
                      >
                        <Box
                          maxW="70%"
                          p={3}
                          borderRadius="lg"
                          bg={message.senderId === 1 ? 'teal.500' : 'gray.100'}
                          color={message.senderId === 1 ? 'white' : 'black'}
                        >
                          <Text fontSize="sm">{message.content}</Text>
                          <Flex justify="space-between" align="center" mt={1}>
                            <Text fontSize="xs" opacity={0.7}>
                              {formatTime(message.createdAt)}
                            </Text>
                            {message.senderId === 1 && (
                              <Icon
                                as={message.isRead ? FiCheckCircle : FiCheck}
                                ml={1}
                                opacity={0.7}
                              />
                            )}
                          </Flex>
                        </Box>
                      </Flex>
                    ))}
                    <div ref={messagesEndRef} />
                  </VStack>
                </CardBody>

                {/* Message Input */}
                <Box p={4} borderTop="1px" borderColor={borderColor}>
                  <HStack spacing={2}>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      resize="none"
                      rows={2}
                    />
                    <Button
                      colorScheme="teal"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Icon as={FiSend} />
                    </Button>
                  </HStack>
                </Box>
              </Card>
            ) : (
              <Card bg={bgColor} borderColor={borderColor} h="full">
                <CardBody display="flex" alignItems="center" justifyContent="center">
                  <VStack spacing={4}>
                    <Icon as={FiMessageSquare} boxSize={12} color="gray.400" />
                    <Text color={textColor} textAlign="center">
                      Select a conversation to start messaging
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            )}
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}