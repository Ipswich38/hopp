import { useEffect, useRef, useState } from 'react';
import { MeshNetworkManager } from '../services/MeshNetworkManager';

export const useMeshNetwork = () => {
  const meshManager = useRef<MeshNetworkManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState({
    isActive: false,
    discoveredNodes: 0,
    activeConnections: 0,
    internetGateways: 0,
    queuedMessages: 0,
    localNode: null as any
  });

  useEffect(() => {
    const initializeMesh = async () => {
      try {
        meshManager.current = new MeshNetworkManager();
        await meshManager.current.initialize();
        setIsInitialized(true);
        console.log('🚀 Mesh network hook initialized');
      } catch (error) {
        console.error('Failed to initialize mesh network:', error);
      }
    };

    initializeMesh();

    return () => {
      if (meshManager.current) {
        meshManager.current.shutdown();
      }
    };
  }, []);

  useEffect(() => {
    if (!meshManager.current) return;

    const updateStatus = () => {
      if (meshManager.current) {
        setStatus(meshManager.current.getNetworkStatus());
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const sendMeshMessage = async (
    content: string, 
    recipient: string = 'broadcast', 
    priority: 'low' | 'normal' | 'high' | 'emergency' = 'normal',
    requiresInternet: boolean = false
  ) => {
    if (meshManager.current) {
      await meshManager.current.sendMessage(content, recipient, priority, requiresInternet);
    }
  };

  const becomeRelayBot = async () => {
    if (meshManager.current) {
      await meshManager.current.becomeRelayBot();
    }
  };

  return {
    meshManager: meshManager.current,
    isInitialized,
    status,
    sendMeshMessage,
    becomeRelayBot
  };
};