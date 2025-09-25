'use client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useColorModeValue,
  Divider,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Business Settings
    platformName: 'Festivo',
    supportEmail: 'support@festivo.com',
    supportPhone: '+1-800-FESTIVO',
    businessAddress: '123 Event Street, City, State 12345',
    
    // Feature Flags
    enableReviews: true,
    enableMessaging: true,
    enablePayments: true,
    enableAnalytics: true,
    
    // Limits
    maxFileSize: '10',
    maxBookingsPerUser: '50',
    sessionTimeout: '30'
  });

  const [loading, setLoading] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to save settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6} color="red.600">
        System Settings
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* System Settings */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">System Configuration</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Maintenance Mode</FormLabel>
                <Switch
                  isChecked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">User Registration</FormLabel>
                <Switch
                  isChecked={settings.registrationEnabled}
                  onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Email Notifications</FormLabel>
                <Switch
                  isChecked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">SMS Notifications</FormLabel>
                <Switch
                  isChecked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Business Information */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Business Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Platform Name</FormLabel>
                <Input
                  value={settings.platformName}
                  onChange={(e) => handleSettingChange('platformName', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Support Email</FormLabel>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Support Phone</FormLabel>
                <Input
                  value={settings.supportPhone}
                  onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Business Address</FormLabel>
                <Textarea
                  value={settings.businessAddress}
                  onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
                  rows={3}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Feature Flags */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Feature Management</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Enable Reviews</FormLabel>
                <Switch
                  isChecked={settings.enableReviews}
                  onChange={(e) => handleSettingChange('enableReviews', e.target.checked)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Enable Messaging</FormLabel>
                <Switch
                  isChecked={settings.enableMessaging}
                  onChange={(e) => handleSettingChange('enableMessaging', e.target.checked)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Enable Payments</FormLabel>
                <Switch
                  isChecked={settings.enablePayments}
                  onChange={(e) => handleSettingChange('enablePayments', e.target.checked)}
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb="0">Enable Analytics</FormLabel>
                <Switch
                  isChecked={settings.enableAnalytics}
                  onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* System Limits */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">System Limits</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Max File Size (MB)</FormLabel>
                <Input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Max Bookings Per User</FormLabel>
                <Input
                  type="number"
                  value={settings.maxBookingsPerUser}
                  onChange={(e) => handleSettingChange('maxBookingsPerUser', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <Select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </Select>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Danger Zone */}
        <Card bg={cardBg} borderColor="red.200">
          <CardHeader>
            <Heading size="md" color="red.600">Danger Zone</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning">
                <AlertIcon />
                These actions are irreversible. Please proceed with caution.
              </Alert>
              
              <HStack spacing={4}>
                <Button colorScheme="red" variant="outline">
                  Clear All Cache
                </Button>
                <Button colorScheme="red" variant="outline">
                  Reset Database
                </Button>
                <Button colorScheme="red" variant="outline">
                  Delete All Users
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Save Button */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <HStack justify="flex-end">
              <Button
                colorScheme="red"
                size="lg"
                onClick={handleSaveSettings}
                isLoading={loading}
                loadingText="Saving..."
              >
                Save Settings
              </Button>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
