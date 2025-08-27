import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MeshNode, MeshMessage, MeshNetworkState } from '../types/mesh';

export class SimpleMeshNetworkManager {
  private networkState: MeshNetworkState;
  private isActive = false;
  private discoveryInterval?: any;

  constructor() {
    this.networkState = {
      localNode: this.createLocalNode(),
      discoveredNodes: new Map(),
      activeConnections: new Map(),
      messageQueue: [],
      routingTable: new Map(),
      internetGateways: [],
      networkTopology: {
        nodes: new Map(),
        edges: new Map(),
        pathsToInternet: new Map()
      }
    };
  }

  public async initialize(): Promise<void> {
    try {
      this.startSimpleDiscovery();
      this.isActive = true;
      console.log('🚀 Simple Mesh Network initialized');
    } catch (error) {
      console.error('Failed to initialize simple mesh:', error);
    }
  }

  private startSimpleDiscovery(): void {
    // Add mock nodes immediately
    this.addMockNodes();
    
    this.discoveryInterval = setInterval(() => {
      if (!this.isActive) return;
      this.updateMockNetwork();
    }, 3000);
  }

  private addMockNodes(): void {
    const mockNodes: MeshNode[] = [
      {
        id: 'emergency-alpha',
        name: 'Emergency Team Alpha',
        deviceType: 'phone',
        batteryLevel: 0.8,
        signalStrength: 0.9,
        isGateway: false,
        hasInternetAccess: false,
        lastSeen: new Date(),
        capabilities: [{ type: 'bluetooth', strength: 0.8, range: 100, active: true }],
        trustScore: 0.9
      },
      {
        id: 'command-center',
        name: 'Command Center',
        deviceType: 'computer',
        batteryLevel: 1.0,
        signalStrength: 1.0,
        isGateway: true,
        hasInternetAccess: true,
        lastSeen: new Date(),
        capabilities: [
          { type: 'wifi_direct', strength: 1.0, range: 200, active: true },
          { type: 'internet_gateway', strength: 1.0, range: 1000, active: true }
        ],
        trustScore: 1.0
      },
      {
        id: 'mesh-beta',
        name: 'Mesh Node Beta',
        deviceType: 'tablet',
        batteryLevel: 0.6,
        signalStrength: 0.7,
        isGateway: false,
        hasInternetAccess: false,
        lastSeen: new Date(),
        capabilities: [{ type: 'wifi_direct', strength: 0.7, range: 150, active: true }],
        trustScore: 0.8
      }
    ];

    mockNodes.forEach(node => {
      this.networkState.discoveredNodes.set(node.id, node);
    });

    // Set internet gateways
    this.networkState.internetGateways = ['command-center'];
    
    console.log(`📡 Added ${mockNodes.length} mock mesh nodes`);
  }

  private updateMockNetwork(): void {
    // Simulate network changes
    for (const [nodeId, node] of this.networkState.discoveredNodes) {
      // Simulate battery drain
      node.batteryLevel = Math.max(0.1, node.batteryLevel - 0.01);
      
      // Simulate signal strength changes
      node.signalStrength = Math.max(0.3, Math.min(1.0, node.signalStrength + (Math.random() - 0.5) * 0.1));
      
      node.lastSeen = new Date();
    }
  }

  public async sendMessage(
    content: string, 
    recipient: string = 'broadcast', 
    priority: 'low' | 'normal' | 'high' | 'emergency' = 'normal',
    requiresInternet: boolean = false
  ): Promise<void> {
    const message: MeshMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalSender: this.networkState.localNode.id,
      finalRecipient: recipient,
      content,
      timestamp: new Date(),
      priority,
      ttl: priority === 'emergency' ? 20 : 10,
      route: [this.networkState.localNode.id],
      retryCount: 0,
      requiresInternet,
      messageType: 'text'
    };

    this.networkState.messageQueue.push(message);
    console.log(`📝 Queued message: "${content}" (${priority})`);
    
    // Simulate routing
    setTimeout(() => {
      this.simulateRouting(message);
    }, 1000);
  }

  private simulateRouting(message: MeshMessage): void {
    console.log(`🤖 AI Routing: ${message.content}`);
    
    if (message.requiresInternet && this.networkState.internetGateways.length > 0) {
      console.log(`🌐 Routing to internet via ${this.networkState.internetGateways[0]}`);
    } else if (message.priority === 'emergency') {
      console.log(`🚨 Broadcasting emergency message`);
    } else {
      console.log(`📡 Routing via mesh network`);
    }

    // Remove from queue
    this.networkState.messageQueue = this.networkState.messageQueue.filter(m => m.id !== message.id);
  }

  public async becomeRelayBot(): Promise<void> {
    console.log('🤖 Becoming autonomous AI relay bot...');
    this.networkState.localNode.deviceType = 'relay_bot';
    this.networkState.localNode.name = `AI-Relay-${this.networkState.localNode.id.substring(0, 8)}`;
  }

  public getNetworkStatus() {
    return {
      isActive: this.isActive,
      discoveredNodes: this.networkState.discoveredNodes.size,
      activeConnections: this.networkState.activeConnections.size,
      internetGateways: this.networkState.internetGateways.length,
      queuedMessages: this.networkState.messageQueue.length,
      localNode: this.networkState.localNode
    };
  }

  public shutdown(): void {
    this.isActive = false;
    if (this.discoveryInterval) clearInterval(this.discoveryInterval);
    console.log('🛑 Simple mesh network shutdown');
  }

  private createLocalNode(): MeshNode {
    return {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'My Hopp Device',
      deviceType: 'phone',
      batteryLevel: 0.9,
      signalStrength: 1.0,
      isGateway: false,
      hasInternetAccess: false,
      lastSeen: new Date(),
      capabilities: [
        { type: 'bluetooth', strength: 0.8, range: 100, active: true },
        { type: 'wifi_direct', strength: 0.9, range: 200, active: true }
      ],
      trustScore: 1.0
    };
  }
}