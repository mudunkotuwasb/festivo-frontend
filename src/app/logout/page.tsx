'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  VStack,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  Heading,
  Spinner
} from '@chakra-ui/react';
import { FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    // Simulate logout process
    const logoutTimer = setTimeout(() => {
      setIsLoggingOut(false);
      setIsLoggedOut(true);
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1500);

    return () => clearTimeout(logoutTimer);
  }, [router]);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Box maxW="md" mx="auto" px={6}>
        <VStack spacing={8}>
          <Card w="full" bg={bgColor} borderColor={borderColor} boxShadow="lg">
            <CardBody textAlign="center" py={12}>
              <VStack spacing={6}>
                {isLoggingOut && (
                  <>
                    <Spinner size="xl" color="teal.500" />
                    <VStack spacing={2}>
                      <Heading size="lg">Signing Out</Heading>
                      <Text color={textColor}>Please wait while we sign you out...</Text>
                    </VStack>
                  </>
                )}

                {isLoggedOut && (
                  <>
                    <Icon as={FiCheckCircle} boxSize={16} color="green.500" />
                    <VStack spacing={2}>
                      <Heading size="lg" color="green.500">Successfully Signed Out</Heading>
                      <Text color={textColor}>
                        You have been signed out of your account. Redirecting to home page...
                      </Text>
                    </VStack>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>

          {isLoggedOut && (
            <VStack spacing={4}>
              <Button
                colorScheme="teal"
                size="lg"
                w="full"
                onClick={handleLoginRedirect}
                leftIcon={<Icon as={FiLogOut} />}
              >
                Sign In Again
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                w="full"
                onClick={handleHomeRedirect}
              >
                Go to Home Page
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    </Box>
  );
}