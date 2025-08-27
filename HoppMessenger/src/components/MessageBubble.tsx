import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const theme = useTheme();

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return '○';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <View style={[
      styles.container,
      message.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      <Surface
        style={[
          styles.bubble,
          {
            backgroundColor: message.isOwn 
              ? theme.colors.primary
              : theme.colors.surfaceVariant,
          },
          message.isOwn ? styles.ownBubble : styles.otherBubble
        ]}
        elevation={1}
      >
        {!message.isOwn && (
          <Text 
            variant="labelSmall" 
            style={[styles.senderName, { color: theme.colors.primary }]}
          >
            {message.senderName}
          </Text>
        )}
        
        <Text 
          variant="bodyMedium"
          style={{
            color: message.isOwn 
              ? theme.colors.onPrimary 
              : theme.colors.onSurfaceVariant,
          }}
        >
          {message.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text 
            variant="labelSmall"
            style={{
              color: message.isOwn 
                ? theme.colors.onPrimary + '80'
                : theme.colors.onSurfaceVariant + '80',
            }}
          >
            {formatTimestamp(message.timestamp)}
          </Text>
          
          {message.isOwn && (
            <Text 
              variant="labelSmall"
              style={{
                color: message.status === 'read' 
                  ? theme.colors.primary + '80'
                  : theme.colors.onPrimary + '80',
                marginLeft: 4,
              }}
            >
              {getStatusIcon(message.status)}
            </Text>
          )}
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  senderName: {
    marginBottom: 4,
    fontWeight: '600',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
});