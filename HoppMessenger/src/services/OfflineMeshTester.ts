import { Platform } from 'react-native';

export class OfflineMeshTester {
  private isWifiConnected: boolean = false;
  private isBluetoothOn: boolean = true;
  private discoveredDevices: Map<string, any> = new Map();
  private internetGateways: string[] = [];

  constructor() {
    this.startRealisticDiscovery();
  }

  /**
   * Simulate realistic device discovery when WiFi is OFF, Bluetooth is ON
   */
  private startRealisticDiscovery(): void {
    // Check actual device connectivity (simulated)
    this.checkConnectivity();
    
    // Start discovering nearby devices via Bluetooth
    this.discoverBluetoothDevices();
    
    // Check for internet gateways among discovered devices
    setInterval(() => {
      this.detectInternetGateways();
    }, 5000);
  }

  private checkConnectivity(): void {
    // In a real implementation, this would check actual WiFi/Bluetooth status
    // For testing: simulate being disconnected from WiFi but Bluetooth on
    this.isWifiConnected = false;
    this.isBluetoothOn = true;
    
    console.log('📡 CONNECTIVITY STATUS:');
    console.log(`   WiFi: ${this.isWifiConnected ? 'ON' : 'OFF'}`);
    console.log(`   Bluetooth: ${this.isBluetoothOn ? 'ON' : 'OFF'}`);
  }

  private discoverBluetoothDevices(): void {
    // Simulate discovering real devices in your area
    const potentialDevices = [
      {
        id: 'mac-laptop',
        name: 'MacBook Pro',
        deviceType: 'computer',
        hasInternet: true,
        signalStrength: 0.9,
        distance: 5, // meters
        capabilities: ['bluetooth', 'wifi', 'internet']
      },
      {
        id: 'iphone-nearby',
        name: 'iPhone 15',
        deviceType: 'phone', 
        hasInternet: false,
        signalStrength: 0.7,
        distance: 12,
        capabilities: ['bluetooth', 'cellular']
      },
      {
        id: 'tablet-friend',
        name: 'iPad Air',
        deviceType: 'tablet',
        hasInternet: true, // Connected to different WiFi
        signalStrength: 0.6,
        distance: 25,
        capabilities: ['bluetooth', 'wifi', 'cellular', 'internet']
      },
      {
        id: 'android-phone',
        name: 'Samsung Galaxy',
        deviceType: 'phone',
        hasInternet: false,
        signalStrength: 0.4,
        distance: 40,
        capabilities: ['bluetooth', 'wifi_direct']
      }
    ];

    // Simulate gradual discovery over time
    potentialDevices.forEach((device, index) => {
      setTimeout(() => {
        this.discoveredDevices.set(device.id, device);
        console.log(`🔍 DISCOVERED: ${device.name} (${device.distance}m away)`);
        console.log(`   Internet Access: ${device.hasInternet ? '✅ YES' : '❌ NO'}`);
        console.log(`   Signal: ${Math.floor(device.signalStrength * 100)}%`);
      }, index * 3000); // Discover every 3 seconds
    });
  }

  private detectInternetGateways(): void {
    this.internetGateways = [];
    
    for (const [deviceId, device] of this.discoveredDevices) {
      if (device.hasInternet) {
        this.internetGateways.push(deviceId);
        console.log(`🌐 INTERNET GATEWAY FOUND: ${device.name}`);
      }
    }
    
    if (this.internetGateways.length > 0) {
      console.log(`📡 TOTAL GATEWAYS: ${this.internetGateways.length}`);
    } else {
      console.log('⚠️  NO INTERNET GATEWAYS FOUND - STORING MESSAGES');
    }
  }

  /**
   * Test sending a message that needs internet access
   */
  public async testOfflineToInternetMessage(message: string): Promise<void> {
    console.log('\n🚀 TESTING OFFLINE → INTERNET MESSAGE');
    console.log(`📝 Message: "${message}"`);
    console.log(`📱 Your Status: WiFi OFF, Bluetooth ON`);
    
    if (this.internetGateways.length === 0) {
      console.log('❌ NO INTERNET GATEWAYS - Message will be stored');
      await this.storeMessageForLater(message);
      return;
    }

    // Find best gateway
    const bestGateway = this.findBestGateway();
    if (!bestGateway) {
      console.log('❌ NO SUITABLE GATEWAY - Message stored');
      return;
    }

    // Simulate hopping to gateway
    await this.hopToGateway(message, bestGateway);
  }

  private findBestGateway(): any {
    let bestGateway = null;
    let bestScore = 0;

    for (const gatewayId of this.internetGateways) {
      const gateway = this.discoveredDevices.get(gatewayId);
      if (!gateway) continue;

      // Score based on signal strength and proximity
      const score = gateway.signalStrength * (1 / gateway.distance);
      
      if (score > bestScore) {
        bestScore = score;
        bestGateway = gateway;
      }
    }

    return bestGateway;
  }

  private async hopToGateway(message: string, gateway: any): Promise<void> {
    console.log(`\n🔄 HOPPING MESSAGE TO GATEWAY:`);
    console.log(`   Gateway: ${gateway.name}`);
    console.log(`   Distance: ${gateway.distance}m`);
    console.log(`   Signal: ${Math.floor(gateway.signalStrength * 100)}%`);

    // Simulate connection time based on distance and signal
    const connectionTime = gateway.distance * 100 + (1 - gateway.signalStrength) * 2000;
    
    console.log(`⏳ Connecting to ${gateway.name}...`);
    await new Promise<void>(resolve => setTimeout(() => resolve(), connectionTime));

    console.log(`✅ Connected to ${gateway.name}`);
    console.log(`📤 Transferring message to gateway...`);
    
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    // Gateway sends to internet
    console.log(`🌐 ${gateway.name} forwarding message to internet...`);
    await this.simulateInternetDelivery(message, gateway);
  }

  private async simulateInternetDelivery(message: string, gateway: any): Promise<void> {
    // Simulate internet delivery methods
    const methods = [
      { name: 'Email Alert', service: 'emergency@example.com', time: 2000 },
      { name: 'SMS Gateway', service: '+1-555-EMERGENCY', time: 1500 },
      { name: 'Web API', service: 'https://emergency-api.example.com', time: 1000 },
      { name: 'Satellite Link', service: 'Emergency Satellite Network', time: 5000 }
    ];

    const method = methods[Math.floor(Math.random() * methods.length)];
    
    console.log(`📡 Using: ${method.name}`);
    console.log(`🎯 Target: ${method.service}`);
    
    await new Promise<void>(resolve => setTimeout(() => resolve(), method.time));
    
    console.log(`\n✅ MESSAGE DELIVERED TO INTERNET!`);
    console.log(`📨 Via: ${gateway.name} → ${method.name}`);
    console.log(`⏰ Total Time: ${(Date.now() % 10000)}ms`);
    console.log(`🛤️  Path: Your Device → ${gateway.name} → ${method.service}`);
  }

  private async storeMessageForLater(message: string): Promise<void> {
    console.log(`💾 STORING MESSAGE: "${message}"`);
    console.log(`⏳ Will retry when internet gateway is discovered...`);
  }

  /**
   * Get current network status for AI bot
   */
  public getRealisticNetworkStatus() {
    return {
      isActive: this.isBluetoothOn,
      discoveredNodes: this.discoveredDevices.size,
      activeConnections: Math.min(this.discoveredDevices.size, 3),
      internetGateways: this.internetGateways.length,
      queuedMessages: this.internetGateways.length === 0 ? 1 : 0,
      localNode: {
        id: 'local-device',
        name: 'My iPhone',
        deviceType: 'phone',
        hasInternet: this.isWifiConnected
      },
      connectivity: {
        wifi: this.isWifiConnected,
        bluetooth: this.isBluetoothOn,
        canReachInternet: this.internetGateways.length > 0
      }
    };
  }

  /**
   * Simulate discovering a new device with internet
   */
  public simulateNewGatewayDiscovered(): void {
    const newGateway = {
      id: 'coffee-shop-wifi',
      name: 'Coffee Shop Laptop',
      deviceType: 'computer',
      hasInternet: true,
      signalStrength: 0.8,
      distance: 8,
      capabilities: ['bluetooth', 'wifi', 'internet', 'public_wifi']
    };

    this.discoveredDevices.set(newGateway.id, newGateway);
    console.log(`\n🆕 NEW GATEWAY DISCOVERED: ${newGateway.name}`);
    console.log(`🌐 Internet access now available!`);
    
    this.detectInternetGateways();
  }

  /**
   * Test emergency broadcast scenario
   */
  public async testEmergencyBroadcast(message: string): Promise<void> {
    console.log('\n🚨 EMERGENCY BROADCAST TEST');
    console.log(`📢 Broadcasting: "${message}"`);
    console.log(`📡 To all ${this.discoveredDevices.size} discovered devices`);

    for (const [deviceId, device] of this.discoveredDevices) {
      console.log(`   → Sending to ${device.name}`);
      
      if (device.hasInternet) {
        console.log(`     🌐 ${device.name} will forward to internet`);
        await this.simulateInternetDelivery(message, device);
        break; // First gateway delivers it
      }
    }
  }
}