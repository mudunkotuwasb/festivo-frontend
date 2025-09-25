'use client';

import {
  Box,
  Button,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  Divider
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { apiService, User, Customer, Vendor } from '@/lib/api';

interface UserFilters {
  search: string;
  userType: 'ALL' | 'CUSTOMER' | 'VENDOR';
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  sortBy: 'name' | 'email' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    userType: 'ALL',
    status: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getAllUsers({
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (response.success && response.data) {
        setUsers(response.data.users);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Users loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // User type filter
    if (filters.userType !== 'ALL') {
      filtered = filtered.filter(user => user.userType === filters.userType);
    }

    // Status filter
    if (filters.status !== 'ALL') {
      const isActive = filters.status === 'ACTIVE';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
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

    setFilteredUsers(filtered);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const response = await apiService.updateUserStatus(userId, !user.isActive);
      
      if (response.success && response.data) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        ));
      } else {
        console.error('Failed to update user status:', response.message);
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await apiService.deleteUser(userId);
        
        if (response.success) {
          // Update local state
          setUsers(prev => prev.filter(user => user.id !== userId));
        } else {
          console.error('Failed to delete user:', response.message);
        }
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
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
        User Management
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
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </InputGroup>

              <Select
                maxW="200px"
                value={filters.userType}
                onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value as any }))}
              >
                <option value="ALL">All Types</option>
                <option value="CUSTOMER">Customers</option>
                <option value="VENDOR">Vendors</option>
              </Select>

              <Select
                maxW="200px"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>

              <Select
                maxW="200px"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="createdAt">Sort by Date</option>
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
              Showing {filteredUsers.length} of {users.length} users
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Users ({filteredUsers.length})</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Registered</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack>
                      <Icon as={FiUser} />
                      <Text>{user.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={FiMail} />
                      <Text>{user.email}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={FiPhone} />
                      <Text>{user.phoneNumber}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.userType === 'CUSTOMER' ? 'blue' : 'green'}>
                      {user.userType}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FiEye />}
                        onClick={() => handleViewUser(user)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme={user.isActive ? 'red' : 'green'}
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDeleteUser(user.id)}
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

      {/* User Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={FiUser} />
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{selectedUser.name}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiMail} />
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedUser.email}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiPhone} />
                  <Text fontWeight="bold">Phone:</Text>
                  <Text>{selectedUser.phoneNumber}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiShield} />
                  <Text fontWeight="bold">Type:</Text>
                  <Badge colorScheme={selectedUser.userType === 'CUSTOMER' ? 'blue' : 'green'}>
                    {selectedUser.userType}
                  </Badge>
                </HStack>
                <HStack>
                  <Icon as={FiCalendar} />
                  <Text fontWeight="bold">Registered:</Text>
                  <Text>{new Date(selectedUser.createdAt).toLocaleString()}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Status:</Text>
                  <Badge colorScheme={selectedUser.isActive ? 'green' : 'red'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="red" onClick={() => selectedUser && handleToggleUserStatus(selectedUser.id)}>
              {selectedUser?.isActive ? 'Deactivate User' : 'Activate User'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
