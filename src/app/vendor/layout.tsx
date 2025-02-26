'use client';

import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { FiCalendar, FiHome, FiLogOut, FiMenu, FiMessageSquare, FiPackage, FiSettings, FiUser } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItemProps {
  icon: any;
  children: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, children, href, active }: NavItemProps) => {
  const color = useColorModeValue('gray.600', 'gray.300');
  const activeColor = useColorModeValue('teal.600', 'teal.300');
  const activeBg = useColorModeValue('teal.50', 'gray.700');

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={active ? activeBg : 'transparent'}
        color={active ? activeColor : color}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
      >
        
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const SidebarContent = ({ pathname }: { pathname: string }) => {
  const navItems = [
    { name: 'Dashboard', icon: FiHome, href: '/vendor/dashboard' },
    { name: 'Services', icon: FiPackage, href: '/vendor/services' },
    { name: 'Bookings', icon: FiCalendar, href: '/vendor/bookings' },
    { name: 'Messages', icon: FiMessageSquare, href: '/vendor/messages' },
    { name: 'Settings', icon: FiSettings, href: '/vendor/settings' },
    { name: 'Profile', icon: FiUser, href: '/vendor/profile' },
  ];

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Festivo
        </Text>
      </Flex>
      {navItems.map((item) => (
        <NavItem
          key={item.name}
          icon={item.icon}
          href={item.href}
          active={pathname === item.href}
        >
          {item.name}
        </NavItem>
      ))}
      <NavItem icon={FiLogOut} href="/logout">
        Logout
      </NavItem>
    </Box>
  );
};

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Box display={{ base: 'none', md: 'block' }} w={60}>
        <SidebarContent pathname={pathname} />
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent pathname={pathname} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex
          display={{ base: 'flex', md: 'none' }}
          alignItems="center"
          justifyContent="flex-start"
          mb={4}
        >
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu />}
            onClick={onOpen}
            variant="outline"
          />
        </Flex>
        {children}
      </Box>
    </Box>
  );
}