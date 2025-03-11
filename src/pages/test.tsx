import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Button, 
  Container, 
  Text, 
  Stack,
  Group, 
  CopyButton, 
  Code, 
  ActionIcon,
  Box,
  Title,
  Paper
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
  IconCopy, 
  IconCheck, 
  IconTestPipe
} from '@tabler/icons-react';

export default function TestPage() {
  const [testData, setTestData] = useState<any>(null);
  const [postbackUrl, setPostbackUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const createTestData = async () => {
    try {
      setLoading(true);

      // Create a test offer click
      const { data: clickData, error: clickError } = await supabase
        .from('offer_clicks')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          offer_title: 'Test Offer',
          offer_type: 'test',
          reward: 10.00,
          original_link: 'https://example.com',
          status: 'pending',
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform
          }
        })
        .select()
        .single();

      if (clickError) throw clickError;

      // Generate postback URL
      const baseUrl = window.location.origin;
      const postbackUrlWithParams = `${baseUrl}/api/postback?` + new URLSearchParams({
        click_id: clickData.id,
        payout: '10.00',
        offer_id: 'TEST_' + Date.now(),
        tracking_id: 'TRACK_' + Date.now()
      }).toString();

      setTestData(clickData);
      setPostbackUrl(postbackUrlWithParams);

      notifications.show({
        title: 'Success',
        message: 'Test data created successfully',
        color: 'green'
      });

    } catch (error: any) {
      console.error('Error creating test data:', error);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Button
          onClick={createTestData}
          loading={loading}
          size="lg"
          leftSection={<IconTestPipe size={20} />}
        >
          Generate Test Data
        </Button>

        {testData && (
          <Paper withBorder p="md">
            <Title order={4} mb="md">Test Data</Title>
            <Group justify="space-between">
              <Text>Click ID:</Text>
              <CopyButton value={testData?.id} timeout={2000}>
                {({ copied, copy }) => (
                  <Group gap={8}>
                    <Code>{testData?.id}</Code>
                    <ActionIcon
                      variant="light"
                      color={copied ? 'teal' : 'blue'}
                      onClick={copy}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Group>
                )}
              </CopyButton>
            </Group>
          </Paper>
        )}

        {postbackUrl && (
          <Paper withBorder p="md">
            <Title order={4} mb="md">Postback URL</Title>
            <Group justify="space-between" mb="xs">
              <CopyButton value={postbackUrl} timeout={2000}>
                {({ copied, copy }) => (
                  <Button 
                    variant="light"
                    size="sm"
                    color={copied ? 'teal' : 'blue'}
                    leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    onClick={copy}
                  >
                    {copied ? 'Copied!' : 'Copy URL'}
                  </Button>
                )}
              </CopyButton>
            </Group>
            <Code block>
              {postbackUrl}
            </Code>
          </Paper>
        )}
      </Stack>
    </Container>
  );
} 