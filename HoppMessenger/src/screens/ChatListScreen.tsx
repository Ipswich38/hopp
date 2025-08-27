import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, FAB, Button } from 'react-native-paper';
import { ChatList } from '../components/ChatList';
import { MeshStatusBar } from '../components/MeshStatusBar';
import { Chat } from '../types/chat';
import { useMeshNetwork } from '../hooks/useMeshNetwork.simple';

interface ChatListScreenProps {
  navigation: any;
}

const mockChats: Chat[] = [
  {
    id: 'ai-assistant',
    name: '🤖 AI Emergency Assistant',
    lastMessage: 'How can I help with emergency communications?',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    unreadCount: 1,
    isOnline: true,
    isGroup: false,
  },
  {
    id: '1',
    name: 'Emergency Team Alpha',
    lastMessage: 'All units report to checkpoint 7',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 3,
    isOnline: true,
    isGroup: true,
  },
  {
    id: '2',
    name: 'Sarah Connor',
    lastMessage: 'Signal strength is good here',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 0,
    isOnline: true,
    isGroup: false,
  },
  {
    id: '3',
    name: 'Mesh Node Beta',
    lastMessage: 'Connection established with Node Gamma',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 1,
    isOnline: false,
    isGroup: true,
  },
  {
    id: '4',
    name: 'John Smith',
    lastMessage: 'Ready for emergency protocol',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    isGroup: false,
  },
];

export const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const { meshManager, becomeRelayBot, status } = useMeshNetwork();
  
  const handleChatPress = (chat: Chat) => {
    if (chat.id === 'ai-assistant') {
      navigation.navigate('AIChat', { chat });
    } else {
      navigation.navigate('Chat', { chat });
    }
  };

  const createNewAIChat = () => {
    const aiChat: Chat = {
      id: 'ai-assistant-new',
      name: '🤖 AI Emergency Assistant',
      lastMessage: 'New conversation started',
      timestamp: new Date(),
      unreadCount: 0,
      isOnline: true,
      isGroup: false,
    };
    navigation.navigate('AIChat', { chat: aiChat });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Hopp Messenger" />
        <Appbar.Action 
          icon="robot" 
          onPress={() => becomeRelayBot()} 
        />
        <Appbar.Action icon="magnify" onPress={() => console.log('Search')} />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('Menu')} />
      </Appbar.Header>
      
      {meshManager && <MeshStatusBar meshManager={meshManager} />}
      
      <ChatList chats={mockChats} onChatPress={handleChatPress} />
      
      <FAB
        icon="robot"
        label="AI Assistant"
        style={styles.fab}
        onPress={createNewAIChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});