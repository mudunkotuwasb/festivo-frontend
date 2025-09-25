'use client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiFilter, 
  FiMessageSquare,
  FiUser,
  FiClock,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { apiService, Message } from '@/lib/api';

interface MessageFilters {
  search: string;
  messageType: 'ALL' | 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isRead: 'ALL' | 'READ' | 'UNREAD';
  sortBy: 'createdAt' | 'sender';
  sortOrder: 'asc' | 'desc';
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filters, setFilters] = useState<MessageFilters>({
    search: '',
    messageType: 'ALL',
    isRead: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, filters]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getAllMessages({
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (response.success && response.data) {
        setMessages(response.data.messages);
      } else {
        setError(response.message || 'Failed to load messages');
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Messages loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(message =>
        message.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        message.sender.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        message.receiver.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Message type filter
    if (filters.messageType !== 'ALL') {
      filtered = filtered.filter(message => message.messageType === filters.messageType);
    }

    // Read status filter
    if (filters.isRead !== 'ALL') {
      const isRead = filters.isRead === 'READ';
      filtered = filtered.filter(message => message.isRead === isRead);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'sender':
          aValue = a.sender.name;
          bValue = b.sender.name;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMessages(filtered);
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    onOpen();
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await apiService.deleteMessage(messageId);
        
        if (response.success) {
          // Update local state
          setMessages(prev => prev.filter(message => message.id !== messageId));
        } else {
          console.error('Failed to delete message:', response.message);
        }
      } catch (err) {
        console.error('Failed to delete message:', err);
      }
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'TEXT': return 'blue';
      case 'IMAGE': return 'green';
      case 'FILE': return 'purple';
      case 'SYSTEM': return 'orange';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="red.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6} color="red.600">
        Message Management
      </Heading>

      {/* Filters */}
      <Card bg={cardBg} borderColor={borderColor} mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search messages..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </InputGroup>

              <Select
                maxW="200px"
                value={filters.messageType}
                onChange={(e) => setFilters(prev => ({ ...prev, messageType: e.target.value as any }))}
              >
                <option value="ALL">All Types</option>
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="FILE">File</option>
                <option value="SYSTEM">System</option>
              </Select>

              <Select
                maxW="200px"
                value={filters.isRead}
                onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value as any }))}
              >
                <option value="ALL">All Messages</option>
                <option value="READ">Read</option>
                <option value="UNREAD">Unread</option>
              </Select>

              <Select
                maxW="200px"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="createdAt">Sort by Date</option>
                <option value="sender">Sort by Sender</option>
              </Select>

              <Button
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                }))}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </HStack>

            <Text fontSize="sm" color="gray.500">
              Showing {filteredMessages.length} of {messages.length} messages
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Messages Table */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Messages ({filteredMessages.length})</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Sender</Th>
                <Th>Receiver</Th>
                <Th>Content</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredMessages.map((message) => (
                <Tr key={message.id}>
                  <Td>#{message.id}</Td>
                  <Td>
                    <HStack>
                      <Icon as={FiUser} />
                      <Text>{message.sender.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={FiUser} />
                      <Text>{message.receiver.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text maxW="200px" isTruncated>
                      {message.content}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={getMessageTypeColor(message.messageType)}>
                      {message.messageType}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={message.isRead ? 'green' : 'orange'}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={FiClock} />
                      <Text fontSize="sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FiEye />}
                        onClick={() => handleViewMessage(message)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Message Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMessage && (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">From:</Text>
                  <Text>{selectedMessage.sender.name} ({selectedMessage.sender.email})</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">To:</Text>
                  <Text>{selectedMessage.receiver.name} ({selectedMessage.receiver.email})</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Type:</Text>
                  <Badge colorScheme={getMessageTypeColor(selectedMessage.messageType)}>
                    {selectedMessage.messageType}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Status:</Text>
                  <Badge colorScheme={selectedMessage.isRead ? 'green' : 'orange'}>
                    {selectedMessage.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{new Date(selectedMessage.createdAt).toLocaleString()}</Text>
                </HStack>
                <Box>
                  <Text fontWeight="bold" mb={2}>Content:</Text>
                  <Textarea
                    value={selectedMessage.content}
                    readOnly
                    rows={6}
                    resize="none"
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme="red" 
              onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.id)}
            >
              Delete Message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
