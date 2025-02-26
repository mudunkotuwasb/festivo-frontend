'use client';

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  useColorModeValue,
  Avatar,
  IconButton
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isVendor: boolean;
}

interface ChatProps {
  vendorId: string;
  customerId: string;
  bookingId?: string;
}

export default function Chat({ vendorId, customerId, bookingId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bgColor = useColorModeValue('white', 'gray.700');
  const bubbleBgColor = useColorModeValue('gray.100', 'gray.600');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: customerId, // or vendorId depending on the user type
      text: newMessage,
      timestamp: new Date(),
      isVendor: false // set based on user type
    };

    setMessages([...messages, message]);
    setNewMessage('');
    // TODO: Implement API call to save message
  };

  return (
    <Box
      h="600px"
      bg={bgColor}
      borderRadius="lg"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
    >
      <Box flex="1" overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <Flex
              key={message.id}
              justify={message.isVendor ? 'flex-start' : 'flex-end'}
            >
              {message.isVendor && (
                <Avatar size="sm" mr={2} />
              )}
              <Box
                maxW="70%"
                bg={bubbleBgColor}
                p={3}
                borderRadius="lg"
                position="relative"
              >
                <Text>{message.text}</Text>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  textAlign={message.isVendor ? 'left' : 'right'}
                  mt={1}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
              {!message.isVendor && (
                <Avatar size="sm" ml={2} />
              )}
            </Flex>
          ))}
        </VStack>
      </Box>
      <Flex p={4} borderTopWidth="1px">
        <IconButton
          aria-label="Attach file"
          icon={<FiPaperclip />}
          variant="ghost"
          mr={2}
        />
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          mr={2}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button
          colorScheme="teal"
          onClick={handleSendMessage}
          leftIcon={<FiSend />}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
}