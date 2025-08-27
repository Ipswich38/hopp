import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { Message, Chat } from '../types/chat';

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      chat: Chat;
    };
  };
}

const generateMockMessages = (chatId: string): Message[] => [
  {
    id: '1',
    text: 'Emergency protocol activated. All units respond.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    senderId: 'other1',
    senderName: 'Command Center',
    isOwn: false,
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    text: 'Roger that. En route to checkpoint 7.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    senderId: 'me',
    senderName: 'You',
    isOwn: true,
    status: 'read',
    type: 'text',
  },
  {
    id: '3',
    text: 'Network mesh is stable. Signal strength at 85%.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    senderId: 'other2',
    senderName: 'Node Beta',
    isOwn: false,
    status: 'read',
    type: 'text',
  },
  {
    id: '4',
    text: 'ETA 5 minutes to checkpoint.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    senderId: 'me',
    senderName: 'You',
    isOwn: true,
    status: 'delivered',
    type: 'text',
  },
];

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { chat } = route.params;
  const [messages, setMessages] = useState<Message[]>(generateMockMessages(chat.id));

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      senderId: 'me',
      senderName: 'You',
      isOwn: true,
      status: 'sending',
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title={chat.name}
          subtitle={chat.isGroup 
            ? `${chat.participants?.length || 0} participants`
            : chat.isOnline ? 'Online' : 'Last seen recently'
          }
        />
        <Appbar.Action icon="phone" onPress={() => console.log('Call')} />
        <Appbar.Action icon="video" onPress={() => console.log('Video call')} />
        <Appbar.Action icon="dots-vertical" onPress={() => console.log('Menu')} />
      </Appbar.Header>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      <MessageInput 
        onSendMessage={handleSendMessage}
        placeholder={`Message ${chat.name}...`}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 8,
  },
});