import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton, Surface, useTheme } from 'react-native-paper';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type a message..." 
}) => {
  const [message, setMessage] = useState('');
  const theme = useTheme();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <Surface style={styles.container} elevation={2}>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          multiline
          maxLength={1000}
          style={styles.textInput}
          contentStyle={styles.textInputContent}
          outlineStyle={styles.textInputOutline}
          mode="outlined"
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSend}
              disabled={!message.trim()}
            />
          }
          left={
            <TextInput.Icon
              icon="attachment"
              onPress={() => console.log('Attachment pressed')}
            />
          }
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    maxHeight: 120,
  },
  textInputContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInputOutline: {
    borderRadius: 24,
  },
});