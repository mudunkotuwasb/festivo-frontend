'use client';

import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


interface VendorTypeProps {
  type: string;
  isSelected: boolean;
  onClick: () => void;
}

const vendorTypes = [
  'All',
  'Venue',
  'Catering',
  'Photography',
  'Entertainment',
  'Decoration',
  'Transportation',
  'Beauty & Salon'
];

const VendorType = ({ type, isSelected, onClick }: VendorTypeProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const selectedBgColor = useColorModeValue('teal.500', 'teal.200');
  const selectedTextColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      px={4}
      py={2}
      bg={isSelected ? selectedBgColor : bgColor}
      color={isSelected ? selectedTextColor : 'inherit'}
      borderRadius="full"
      cursor="pointer"
      _hover={{
        bg: isSelected ? selectedBgColor : useColorModeValue('gray.100', 'gray.600')
      }}
      onClick={onClick}
      boxShadow="sm"
    >
      <Text fontSize="sm" fontWeight="medium">
        {type}
      </Text>
    </Box>
  );
};

export default function VendorTypeList() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('All');

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    router.push(`/customer/vendors?type=${encodeURIComponent(type)}`);
  };

  return (
    <Flex
      overflowX="auto"
      py={4}
      px={2}
      gap={4}
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none'
      }}
    >
      {vendorTypes.map((type) => (
        <VendorType
          key={type}
          type={type}
          isSelected={selectedType === type}
          onClick={() => handleTypeClick(type)}
        />
      ))}    
    </Flex>
  );
}