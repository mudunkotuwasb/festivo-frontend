'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, Text, VStack, Spinner } from '@chakra-ui/react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // TODO: Implement session cleanup and token removal
        // Clear any stored tokens or session data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userType');

        // Add a small delay to show the logout message
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    };

    handleLogout();
  }, [router]);

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={6} align="center">
        <Heading size="lg">Logging Out</Heading>
        <Spinner size="xl" color="teal.500" thickness="4px" />
        <Text>Thank you for using Festivo. See you soon!</Text>
      </VStack>
    </Container>
  );
}