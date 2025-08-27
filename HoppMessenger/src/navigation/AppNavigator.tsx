import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen } from '../screens/ChatListScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { AIChatScreen } from '../screens/AIChatScreen';
import { Chat } from '../types/chat';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chat: Chat };
  AIChat: { chat: Chat };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ChatList"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="ChatList" 
          component={ChatListScreen} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen}
        />
        <Stack.Screen 
          name="AIChat" 
          component={AIChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};