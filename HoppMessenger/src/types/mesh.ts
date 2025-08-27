export interface MeshNode {
  id: string;
  name: string;
  deviceType: 'phone' | 'tablet' | 'computer' | 'relay_bot';
  batteryLevel: number;
  signalStrength: number;
  isGateway: boolean;
  hasInternetAccess: boolean;
  lastSeen: Date;
  position?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  capabilities: MeshCapability[];
  trustScore: number;
}

export interface MeshCapability {
  type: 'bluetooth' | 'wifi_direct' | 'lora' | 'cellular' | 'internet_gateway';
  strength: number;
  range: number;
  active: boolean;
}

export interface MeshMessage {
  id: string;
  originalSender: string;
  finalRecipient: string;
  content: string;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  ttl: number; // time to live (hops)
  route: string[]; // nodes it has passed through
  retryCount: number;
  requiresInternet: boolean;
  encryptionKey?: string;
  messageType: 'text' | 'location' | 'sos' | 'file' | 'command';
}

export interface RouteInfo {
  path: string[];
  hopCount: number;
  reliability: number;
  estimatedDeliveryTime: number;
  energyCost: number;
  hasInternetPath: boolean;
}

export interface AIRoutingDecision {
  selectedRoute: RouteInfo;
  confidence: number;
  reasoning: string;
  alternativeRoutes: RouteInfo[];
  shouldStore: boolean;
  retryStrategy: 'immediate' | 'backoff' | 'broadcast' | 'wait_for_gateway';
}

export interface MeshNetworkState {
  localNode: MeshNode;
  discoveredNodes: Map<string, MeshNode>;
  activeConnections: Map<string, ConnectionState>;
  messageQueue: MeshMessage[];
  routingTable: Map<string, RouteInfo[]>;
  internetGateways: string[];
  networkTopology: NetworkGraph;
}

export interface ConnectionState {
  nodeId: string;
  protocol: 'bluetooth' | 'wifi_direct';
  status: 'connecting' | 'connected' | 'disconnected' | 'failed';
  bandwidth: number;
  latency: number;
  reliability: number;
  lastActivity: Date;
}

export interface NetworkGraph {
  nodes: Map<string, MeshNode>;
  edges: Map<string, ConnectionEdge[]>;
  pathsToInternet: Map<string, RouteInfo>;
}

export interface ConnectionEdge {
  from: string;
  to: string;
  weight: number;
  protocol: string;
  reliability: number;
  bandwidth: number;
}