import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { List, Avatar, Badge, Surface, Text } from 'react-native-paper';
import { Chat } from '../types/chat';

interface ChatListProps {
  chats: Chat[];
  onChatPress: (chat: Chat) => void;
}

const ChatListItem: React.FC<{ chat: Chat; onPress: () => void }> = ({ chat, onPress }) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Surface style={styles.listItem} elevation={0}>
      <List.Item
        title={chat.name}
        description={chat.lastMessage}
        onPress={onPress}
        left={() => (
          <Avatar.Text 
            size={48} 
            label={chat.name.charAt(0).toUpperCase()} 
            style={styles.avatar}
          />
        )}
        right={() => (
          <React.Fragment>
            <Text variant="bodySmall" style={styles.timestamp}>
              {formatTimestamp(chat.timestamp)}
            </Text>
            {chat.unreadCount > 0 && (
              <Badge size={20} style={styles.badge}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Badge>
            )}
          </React.Fragment>
        )}
        titleNumberOfLines={1}
        descriptionNumberOfLines={1}
        style={styles.listItemContent}
      />
    </Surface>
  );
};

export const ChatList: React.FC<ChatListProps> = ({ chats, onChatPress }) => {
  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatListItem chat={item} onPress={() => onChatPress(item)} />
      )}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
  },
  listItemContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatar: {
    marginRight: 8,
  },
  timestamp: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});