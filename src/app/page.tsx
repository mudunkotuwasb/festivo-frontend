'use client';

import { Box, Container, Heading, VStack, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200');
  const buttonHoverBgColor = useColorModeValue('teal.600', 'teal.300');

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="container.sm">
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" size="2xl" mb={8}>
            Welcome to Festivo
          </Heading>
          <VStack spacing={4}>
            <Button
              size="lg"
              w="full"
              bg={buttonBgColor}
              color="white"
              _hover={{ bg: buttonHoverBgColor }}
              onClick={() => router.push('/register/customer')}
            >
              Register as Customer
            </Button>
            <Button
              size="lg"
              w="full"
              bg={buttonBgColor}
              color="white"
              _hover={{ bg: buttonHoverBgColor }}
              onClick={() => router.push('/register/vendor')}
            >
              Register as Vendor
            </Button>
            <Button
              size="lg"
              w="full"
              variant="outline"
              onClick={() => router.push('/login')}
            >
              Already have an account? Login
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}