import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Text, Chip } from 'react-native-paper';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { MeshStatusBar } from '../components/MeshStatusBar';
import { Message, Chat } from '../types/chat';
import { useMeshNetwork } from '../hooks/useMeshNetwork.simple';
import { AIChatBot } from '../services/AIChatBot';

interface AIChatScreenProps {
  navigation: any;
  route: {
    params: {
      chat: Chat;
    };
  };
}

export const AIChatScreen: React.FC<AIChatScreenProps> = ({ navigation, route }) => {
  const { chat } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const { meshManager, sendMeshMessage, status } = useMeshNetwork();
  const [aiBot] = useState(new AIChatBot());
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: aiBot.getWelcomeMessage(),
      timestamp: new Date(),
      senderId: 'ai-assistant',
      senderName: '🤖 AI Assistant',
      isOwn: false,
      status: 'read',
      type: 'text',
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      senderId: 'me',
      senderName: 'You',
      isOwn: true,
      status: 'sending',
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    // Send via mesh network if it's an emergency or special command
    if (text.toLowerCase().includes('emergency') || text.toLowerCase().includes('broadcast')) {
      await sendMeshMessage(text, 'broadcast', 'emergency', true);
    }

    try {
      // Get AI response
      let aiResponse: string;
      
      if (text.toLowerCase().includes('emergency')) {
        aiResponse = await aiBot.processEmergencyMessage(text);
      } else {
        aiResponse = await aiBot.generateResponse(text, status);
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        timestamp: new Date(),
        senderId: 'ai-assistant',
        senderName: '🤖 AI Assistant',
        isOwn: false,
        status: 'read',
        type: 'text',
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);

      // Update user message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );

    } catch (error) {
      console.error('AI response failed:', error);
      setIsAiTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I'm experiencing technical difficulties. Please try again.",
        timestamp: new Date(),
        senderId: 'ai-assistant',
        senderName: '🤖 AI Assistant',
        isOwn: false,
        status: 'read',
        type: 'text',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const QuickActions = () => (
    <View style={styles.quickActions}>
      <Chip 
        mode="outlined" 
        onPress={() => handleSendMessage('What is the weather?')}
        style={styles.quickChip}
      >
        🌤️ Weather
      </Chip>
      <Chip 
        mode="outlined" 
        onPress={() => handleSendMessage('Find nearest hospital')}
        style={styles.quickChip}
      >
        🏥 Hospitals
      </Chip>
      <Chip 
        mode="outlined" 
        onPress={() => handleSendMessage('Where am I?')}
        style={styles.quickChip}
      >
        📍 Location
      </Chip>
      <Chip 
        mode="outlined" 
        onPress={() => handleSendMessage('Emergency services')}
        style={styles.quickChip}
      >
        🚨 Emergency
      </Chip>
      <Chip 
        mode="outlined" 
        onPress={() => handleSendMessage('What is my network status?')}
        style={styles.quickChip}
      >
        📡 Status
      </Chip>
      <Chip 
        mode="outlined" 
        onPress={() => handleSendMessage('test offline mesh networking')}
        style={[styles.quickChip, styles.testChip]}
      >
        🧪 Test
      </Chip>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title={chat.name}
          subtitle={isAiTyping ? 'AI is typing...' : 'AI Emergency Assistant • Online'}
        />
        <Appbar.Action icon="information" onPress={() => console.log('AI Info')} />
      </Appbar.Header>

      {meshManager && <MeshStatusBar meshManager={meshManager} />}

      <QuickActions />

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
        placeholder="Ask me about emergency protocols, mesh network, or anything..."
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  quickChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  testChip: {
    borderColor: '#FF6B35',
  },
});