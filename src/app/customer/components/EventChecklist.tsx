'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface ChecklistItem {
  id: string;
  title: string;
  vendorType: string;
  isCompleted: boolean;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export default function EventChecklist() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [selectedVendorTypes, setSelectedVendorTypes] = useState<string[]>([]);
  const bgColor = useColorModeValue('white', 'gray.700');

  const vendorTypes = [
    'Venue',
    'Catering',
    'Photography',
    'Entertainment',
    'Decoration',
    'Transportation',
    'Beauty & Salon'
  ];

  const handleCreateChecklist = () => {
    if (!newChecklistTitle) return;

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: newChecklistTitle,
      items: selectedVendorTypes.map(type => ({
        id: `${Date.now()}-${type}`,
        title: `Book ${type}`,
        vendorType: type,
        isCompleted: false
      }))
    };

    setChecklists([...checklists, newChecklist]);
    setNewChecklistTitle('');
    setSelectedVendorTypes([]);
    onClose();
  };

  const handleItemClick = (vendorType: string) => {
    router.push(`/customer/vendors?type=${encodeURIComponent(vendorType)}`);
  };

  const toggleVendorType = (type: string) => {
    setSelectedVendorTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleItemCompletion = (checklistId: string, itemId: string) => {
    setChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map(item =>
                item.id === itemId
                  ? { ...item, isCompleted: !item.isCompleted }
                  : item
              )
            }
          : checklist
      )
    );
  };

  return (
    <Box>
      <Button colorScheme="teal" onClick={onOpen} mb={4}>
        Create New Checklist
      </Button>

      <VStack spacing={4} align="stretch">
        {checklists.map(checklist => (
          <Box
            key={checklist.id}
            p={4}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="sm"
          >
            <Text fontWeight="bold" mb={3}>
              {checklist.title}
            </Text>
            <Stack spacing={2}>
              {checklist.items.map(item => (
                <Box
                  key={item.id}
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Checkbox
                    isChecked={item.isCompleted}
                    onChange={() => toggleItemCompletion(checklist.id, item.id)}
                  >
                    {item.title}
                  </Checkbox>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    variant="ghost"
                    onClick={() => handleItemClick(item.vendorType)}
                  >
                    Find Vendors
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Checklist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Checklist Title</FormLabel>
              <Input
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder="Enter checklist title"
              />
            </FormControl>
            <Box mt={4}>
              <Text mb={2}>Select Vendor Types:</Text>
              <Stack spacing={2}>
                {vendorTypes.map(type => (
                  <Checkbox
                    key={type}
                    isChecked={selectedVendorTypes.includes(type)}
                    onChange={() => toggleVendorType(type)}
                  >
                    {type}
                  </Checkbox>
                ))}
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleCreateChecklist}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}