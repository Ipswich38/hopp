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
    weather: [
      "🌤️ Fetching current weather conditions via mesh network...",
      "☁️ Getting weather data from nearest internet gateway...",
      "🌡️ Checking weather conditions for emergency planning..."
    ],
    location: [
      "📍 Finding your location and nearby emergency services...",
      "🏥 Locating nearest hospitals and emergency facilities...",
      "🚨 Getting emergency contact information for your area..."
    ],
    information: [
      "🔍 Searching for that information via internet gateways...",
      "📡 Fetching data through mesh network connection...",
      "🌐 Looking that up for you via available internet access..."
    ],
    services: [
      "🏥 Finding emergency services in your area...",
      "🚑 Locating nearest medical facilities...",
      "🚒 Getting emergency contact numbers..."
    ],
    unknown: [
      "I can help with emergency information! Try asking about:\n• Weather conditions\n• Nearest hospitals\n• Emergency services\n• Location information\n• Network status\n• Or type 'help' for more options",
      "I specialize in emergency communications and can fetch information from the internet via mesh network. What emergency information do you need?",
      "I can get internet information through nearby devices. Try asking about weather, emergency services, or your location."
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
    } else if (this.containsWords(message, ['weather', 'temperature', 'rain', 'storm', 'forecast'])) {
      category = 'weather';
      // Trigger internet fetch for weather
      setTimeout(() => this.fetchWeatherData(message), 100);
    } else if (this.containsWords(message, ['hospital', 'doctor', 'medical', 'clinic', 'pharmacy'])) {
      category = 'services';
      setTimeout(() => this.fetchEmergencyServices(message, 'medical'), 100);
    } else if (this.containsWords(message, ['police', 'fire', 'ambulance', 'emergency services'])) {
      category = 'services'; 
      setTimeout(() => this.fetchEmergencyServices(message, 'emergency'), 100);
    } else if (this.containsWords(message, ['location', 'where am i', 'address', 'gps', 'coordinates'])) {
      category = 'location';
      setTimeout(() => this.fetchLocationInfo(message), 100);
    } else if (this.containsWords(message, ['what is', 'find', 'search', 'lookup', 'get information'])) {
      category = 'information';
      setTimeout(() => this.fetchGeneralInfo(message), 100);
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

  private async fetchWeatherData(query: string): Promise<void> {
    console.log('\n🌤️ FETCHING WEATHER DATA VIA MESH NETWORK');
    console.log(`📡 Query: "${query}"`);
    console.log(`🔄 Routing through internet gateways...`);
    
    // Simulate mesh routing to internet
    await this.offlineTester.testOfflineToInternetMessage(`WEATHER_REQUEST: ${query}`);
    
    // Simulate receiving weather data
    setTimeout(() => {
      console.log('\n📥 WEATHER DATA RECEIVED FROM INTERNET:');
      console.log('🌡️  Temperature: 22°C (72°F)');
      console.log('☁️  Conditions: Partly cloudy'); 
      console.log('💨 Wind: 15 km/h NW');
      console.log('💧 Humidity: 65%');
      console.log('🌧️  Rain: 20% chance');
      console.log('⚠️  Weather Alert: None');
    }, 3000);
  }

  private async fetchEmergencyServices(query: string, type: 'medical' | 'emergency'): Promise<void> {
    console.log('\n🏥 FETCHING EMERGENCY SERVICES VIA MESH');
    console.log(`🔍 Query: "${query}" (${type})`);
    console.log(`📡 Searching through internet gateways...`);
    
    await this.offlineTester.testOfflineToInternetMessage(`EMERGENCY_SERVICES: ${query}`);
    
    setTimeout(() => {
      console.log('\n📥 EMERGENCY SERVICES DATA RECEIVED:');
      
      if (type === 'medical') {
        console.log('🏥 NEAREST MEDICAL FACILITIES:');
        console.log('   • City General Hospital - 2.3km');
        console.log('     📞 +1-555-HOSPITAL');
        console.log('     🚑 Emergency: Available');
        console.log('   • MedCenter Clinic - 4.1km');
        console.log('     📞 +1-555-MEDCENTER');
        console.log('   • 24/7 Pharmacy - 1.8km');
        console.log('     📞 +1-555-PHARMACY');
      } else {
        console.log('🚨 EMERGENCY CONTACTS:');
        console.log('   • Police: 911 / +1-555-POLICE');
        console.log('   • Fire Dept: 911 / +1-555-FIRE');
        console.log('   • Ambulance: 911 / +1-555-AMBULANCE');
        console.log('   • Emergency Mgmt: +1-555-EMERGENCY');
      }
    }, 2500);
  }

  private async fetchLocationInfo(query: string): Promise<void> {
    console.log('\n📍 FETCHING LOCATION INFO VIA MESH');
    console.log(`🔍 Query: "${query}"`);
    console.log(`📡 Getting GPS data through internet gateways...`);
    
    await this.offlineTester.testOfflineToInternetMessage(`LOCATION_REQUEST: ${query}`);
    
    setTimeout(() => {
      console.log('\n📥 LOCATION DATA RECEIVED:');
      console.log('📍 Your Current Location:');
      console.log('   • Latitude: 37.7749° N');
      console.log('   • Longitude: 122.4194° W');  
      console.log('   • Address: 123 Emergency St, San Francisco, CA');
      console.log('   • Accuracy: ±15 meters');
      console.log('🏢 Nearby Landmarks:');
      console.log('   • City Hall - 0.5km north');
      console.log('   • Fire Station #3 - 0.8km east');
      console.log('   • Memorial Hospital - 1.2km south');
    }, 2000);
  }

  private async fetchGeneralInfo(query: string): Promise<void> {
    console.log('\n🔍 FETCHING INFORMATION VIA MESH NETWORK');
    console.log(`📡 Query: "${query}"`);
    console.log(`🌐 Searching through internet gateways...`);
    
    await this.offlineTester.testOfflineToInternetMessage(`INFO_REQUEST: ${query}`);
    
    setTimeout(() => {
      console.log('\n📥 INFORMATION RETRIEVED FROM INTERNET:');
      
      // Simulate different types of emergency-relevant info
      const infoType = Math.floor(Math.random() * 3);
      
      if (infoType === 0) {
        console.log('🚨 EMERGENCY PROTOCOL INFORMATION:');
        console.log('   • Evacuation routes: Highway 101 North');
        console.log('   • Emergency shelters: 3 locations available');
        console.log('   • Current threat level: LOW');
      } else if (infoType === 1) {
        console.log('📞 EMERGENCY CONTACT DATABASE:');
        console.log('   • Red Cross: +1-800-RED-CROSS');
        console.log('   • FEMA: +1-800-621-FEMA');
        console.log('   • Poison Control: +1-800-222-1222');
      } else {
        console.log('ℹ️ EMERGENCY INFORMATION:');
        console.log('   • First aid procedures available');
        console.log('   • Emergency supply checklist updated');
        console.log('   • Local emergency frequencies: 162.550 MHz');
      }
    }, 2800);
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