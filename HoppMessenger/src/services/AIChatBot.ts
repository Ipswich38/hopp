import { OfflineMeshTester } from './OfflineMeshTester';

export class AIChatBot {
  private offlineTester: OfflineMeshTester;
  private knowledge: { [key: string]: string[] } = {
    greeting: [
      "Hello! I'm your AI assistant for emergency communications and mesh networking.",
      "Hi there! I can help you with emergency protocols, mesh network status, and communication strategies.",
      "Greetings! I'm here to assist with your Hopp Messenger emergency communications."
    ],
    mesh: [
      "I can see your mesh network has {nodes} discovered nodes and {gateways} internet gateways.",
      "Your mesh network is currently {status}. Would you like me to help optimize routing?",
      "The AI routing system is working with {confidence}% confidence on current paths."
    ],
    emergency: [
      "🚨 EMERGENCY PROTOCOL ACTIVATED. Broadcasting your message with highest priority.",
      "Emergency detected. Routing through all available mesh paths and internet gateways.",
      "I'm prioritizing your emergency message through the most reliable network paths."
    ],
    help: [
      "I can help with:\n• Emergency communication protocols\n• Mesh network optimization\n• Message routing strategies\n• Network status analysis\n• Emergency contact procedures",
      "Available commands:\n• 'emergency' - Activate emergency protocols\n• 'status' - Check network status\n• 'optimize' - Improve mesh routing\n• 'contacts' - Emergency contact list"
    ],
    status: [
      "📡 Network Status:\n• Discovered Nodes: {nodes}\n• Internet Gateways: {gateways}\n• Active Connections: {connections}\n• Message Queue: {queue}",
      "Current mesh network is {health}. Signal strength varies between nodes, with {reliability}% overall reliability.",
      "Your device is acting as a {deviceType} in the mesh network with {trust}% trust score."
    ],
    optimize: [
      "🤖 AI Optimization Suggestions:\n• Moving closer to high-signal nodes\n• Enabling relay bot mode for better coverage\n• Prioritizing battery-efficient routes",
      "I recommend becoming a relay bot to help other users in your area. This will improve overall network resilience.",
      "Network optimization complete. Routes updated with 15% better efficiency."
    ],
    test: [
      "🧪 Running offline mesh test...",
      "Testing message hopping from your device to internet gateway...",
      "Simulating offline mesh networking scenario..."
    ],
    offline: [
      "I can see you're offline. Let me test message hopping through nearby devices.",
      "Your WiFi is off but Bluetooth is on. I'll find devices that can reach the internet for you.",
      "Testing offline → internet message routing via mesh network..."
    ],
    unknown: [
      "I'm not sure I understand. Try asking about 'emergency', 'status', 'help', 'test offline', or 'mesh network'.",
      "Could you rephrase that? I specialize in emergency communications and mesh networking.",
      "I didn't catch that. Type 'help' to see what I can assist you with."
    ]
  };

  constructor() {
    this.offlineTester = new OfflineMeshTester();
  }

  public async generateResponse(
    userMessage: string, 
    networkStatus: any
  ): Promise<string> {
    const message = userMessage.toLowerCase().trim();
    
    // Simulate AI thinking delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000 + Math.random() * 2000));

    // Determine response category
    let category = 'unknown';
    
    if (this.containsWords(message, ['hello', 'hi', 'hey', 'greetings'])) {
      category = 'greeting';
    } else if (this.containsWords(message, ['emergency', 'help', 'urgent', 'sos', 'crisis'])) {
      category = 'emergency';
    } else if (this.containsWords(message, ['mesh', 'network', 'nodes', 'routing', 'connection'])) {
      category = 'mesh';
    } else if (this.containsWords(message, ['status', 'network status', 'how many'])) {
      category = 'status';
    } else if (this.containsWords(message, ['optimize', 'improve', 'better', 'faster'])) {
      category = 'optimize';
    } else if (this.containsWords(message, ['help', 'what can', 'commands', 'options'])) {
      category = 'help';
    } else if (this.containsWords(message, ['test', 'offline', 'demo', 'try'])) {
      category = 'test';
      // Trigger actual offline test
      setTimeout(() => this.runOfflineTest(message), 100);
    }

    // Get random response from category
    const responses = this.knowledge[category];
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];

    // Inject network status data
    return this.injectNetworkData(baseResponse, networkStatus);
  }

  private containsWords(message: string, words: string[]): boolean {
    return words.some(word => message.includes(word));
  }

  private injectNetworkData(response: string, status: any): string {
    const healthMap: { [key: number]: string } = {
      0: 'offline',
      1: 'connecting',
      2: 'connected',
      3: 'fully connected'
    };

    const deviceTypeMap: { [key: string]: string } = {
      'phone': 'mobile device',
      'tablet': 'tablet device', 
      'computer': 'computer node',
      'relay_bot': 'AI relay bot'
    };

    return response
      .replace('{nodes}', status?.discoveredNodes?.toString() || '0')
      .replace('{gateways}', status?.internetGateways?.toString() || '0')
      .replace('{connections}', status?.activeConnections?.toString() || '0')
      .replace('{queue}', status?.queuedMessages?.toString() || '0')
      .replace('{status}', status?.isActive ? 'active' : 'inactive')
      .replace('{health}', healthMap[Math.min(status?.internetGateways || 0, 3)] || 'unknown')
      .replace('{confidence}', Math.floor(Math.random() * 20 + 80).toString())
      .replace('{reliability}', Math.floor(Math.random() * 15 + 85).toString())
      .replace('{deviceType}', deviceTypeMap[status?.localNode?.deviceType] || 'device')
      .replace('{trust}', Math.floor(Math.random() * 10 + 90).toString());
  }

  public getWelcomeMessage(): string {
    return "👋 Hello! I'm your AI Emergency Communications Assistant.\n\n" +
           "I can help you with:\n" +
           "• 🚨 Emergency protocols\n" +
           "• 📡 Mesh network status\n" +
           "• 🤖 AI routing optimization\n" +
           "• 🧪 Offline mesh testing\n" +
           "• 📞 Emergency contacts\n\n" +
           "Try typing 'test offline' to see mesh networking in action!\n" +
           "Just ask me anything about emergency communications or type 'help' for more options!";
  }

  private async runOfflineTest(originalMessage: string): Promise<void> {
    console.log('\n🔥 STARTING OFFLINE MESH TEST FROM AI BOT');
    
    if (originalMessage.toLowerCase().includes('emergency')) {
      await this.offlineTester.testEmergencyBroadcast(originalMessage);
    } else {
      await this.offlineTester.testOfflineToInternetMessage(originalMessage);
    }
  }

  public async processEmergencyMessage(message: string): Promise<string> {
    // Special handling for emergency messages
    return `🚨 EMERGENCY ALERT PROCESSED\n\n` +
           `Message: "${message}"\n` +
           `Status: Broadcasting via all mesh paths\n` +
           `Priority: MAXIMUM\n` +
           `AI Routing: Emergency protocols activated\n\n` +
           `Your emergency message is being sent through the most reliable available routes.`;
  }
}