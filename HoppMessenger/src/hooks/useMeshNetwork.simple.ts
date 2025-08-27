import { useState, useEffect } from 'react';

export const useMeshNetwork = () => {
  const [status, setStatus] = useState({
    isActive: true,
    discoveredNodes: 3,
    activeConnections: 2,
    internetGateways: 1,
    queuedMessages: 0,
    localNode: {
      id: 'test-local',
      name: 'My Hopp Device',
      deviceType: 'phone'
    }
  });

  const sendMeshMessage = async (
    content: string, 
    recipient: string = 'broadcast', 
    priority: 'low' | 'normal' | 'high' | 'emergency' = 'normal',
    requiresInternet: boolean = false
  ) => {
    console.log(`📡 Sending mesh message: "${content}" (${priority})`);
    
    // Simulate processing
    setStatus(prev => ({ ...prev, queuedMessages: prev.queuedMessages + 1 }));
    
    setTimeout(() => {
      setStatus(prev => ({ ...prev, queuedMessages: Math.max(0, prev.queuedMessages - 1) }));
      console.log(`✅ Message routed: "${content}"`);
    }, 2000);
  };

  const becomeRelayBot = async () => {
    console.log('🤖 Becoming relay bot...');
    setStatus(prev => ({
      ...prev,
      localNode: { ...prev.localNode, deviceType: 'relay_bot', name: 'AI-Relay-Bot' }
    }));
  };

  const meshManager = {
    getNetworkStatus: () => status,
    initialize: async () => console.log('✅ Mock mesh initialized'),
    shutdown: () => console.log('🛑 Mock mesh shutdown')
  };

  return {
    meshManager,
    isInitialized: true,
    status,
    sendMeshMessage,
    becomeRelayBot
  };
};