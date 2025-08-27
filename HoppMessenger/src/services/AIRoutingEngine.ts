import { MeshMessage, MeshNode, RouteInfo, AIRoutingDecision, NetworkGraph, MeshNetworkState } from '../types/mesh';

export class AIRoutingEngine {
  private networkState: MeshNetworkState;
  private learningData: Map<string, RoutingPerformance> = new Map();

  constructor(networkState: MeshNetworkState) {
    this.networkState = networkState;
  }

  /**
   * AI-powered intelligent routing decision
   * Uses machine learning-like heuristics to find optimal paths
   */
  public async makeRoutingDecision(message: MeshMessage): Promise<AIRoutingDecision> {
    const availableRoutes = await this.discoverAllRoutes(message);
    const scoredRoutes = await this.scoreRoutes(availableRoutes, message);
    const bestRoute = this.selectOptimalRoute(scoredRoutes, message);

    return {
      selectedRoute: bestRoute,
      confidence: this.calculateConfidence(bestRoute, message),
      reasoning: this.generateReasoning(bestRoute, message),
      alternativeRoutes: scoredRoutes.slice(1, 4), // Top 3 alternatives
      shouldStore: this.shouldStoreMessage(message, bestRoute),
      retryStrategy: this.determineRetryStrategy(message, bestRoute)
    };
  }

  /**
   * Discover all possible routes to destination or internet gateway
   */
  private async discoverAllRoutes(message: MeshMessage): Promise<RouteInfo[]> {
    const routes: RouteInfo[] = [];
    const targetNodes: string[] = [];

    // If message requires internet, target gateways
    if (message.requiresInternet || message.messageType === 'sos') {
      targetNodes.push(...this.networkState.internetGateways);
    }

    // Also include direct recipient if available
    if (this.networkState.discoveredNodes.has(message.finalRecipient)) {
      targetNodes.push(message.finalRecipient);
    }

    // Use Dijkstra-like algorithm with AI enhancements
    for (const target of targetNodes) {
      const pathsToTarget = await this.findAIPaths(message.originalSender, target, message);
      routes.push(...pathsToTarget);
    }

    return routes;
  }

  /**
   * AI-enhanced pathfinding with dynamic weights
   */
  private async findAIPaths(from: string, to: string, message: MeshMessage): Promise<RouteInfo[]> {
    const graph = this.networkState.networkTopology;
    const visited = new Set<string>();
    const distances = new Map<string, number>();
    const previousNodes = new Map<string, string>();
    const routes: RouteInfo[] = [];

    // Initialize distances
    for (const [nodeId] of graph.nodes) {
      distances.set(nodeId, Infinity);
    }
    distances.set(from, 0);

    const priorityQueue = new Map<string, number>();
    priorityQueue.set(from, 0);

    while (priorityQueue.size > 0) {
      // Get node with minimum distance
      const currentNode = Array.from(priorityQueue.entries())
        .reduce((min, [node, dist]) => dist < min[1] ? [node, dist] : min)[0];
      
      priorityQueue.delete(currentNode);
      
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      if (currentNode === to) {
        // Found path, reconstruct it
        const path = this.reconstructPath(previousNodes, from, to);
        const route = await this.buildRouteInfo(path, message);
        routes.push(route);
        continue;
      }

      // Check neighbors
      const edges = graph.edges.get(currentNode) || [];
      for (const edge of edges) {
        if (visited.has(edge.to)) continue;

        // AI-enhanced edge weight calculation
        const edgeWeight = await this.calculateAIEdgeWeight(edge, message);
        const newDistance = (distances.get(currentNode) || 0) + edgeWeight;

        if (newDistance < (distances.get(edge.to) || Infinity)) {
          distances.set(edge.to, newDistance);
          previousNodes.set(edge.to, currentNode);
          priorityQueue.set(edge.to, newDistance);
        }
      }
    }

    return routes;
  }

  /**
   * AI scoring system for route selection
   */
  private async scoreRoutes(routes: RouteInfo[], message: MeshMessage): Promise<RouteInfo[]> {
    const scoredRoutes = routes.map(route => {
      const score = this.calculateRouteScore(route, message);
      return { ...route, aiScore: score };
    });

    return scoredRoutes.sort((a, b) => (b as any).aiScore - (a as any).aiScore);
  }

  /**
   * Machine learning-inspired route scoring
   */
  private calculateRouteScore(route: RouteInfo, message: MeshMessage): number {
    let score = 100; // Base score

    // Distance penalty (shorter is better)
    score -= route.hopCount * 5;

    // Reliability bonus
    score += route.reliability * 30;

    // Internet access bonus for messages requiring it
    if (message.requiresInternet && route.hasInternetPath) {
      score += 50;
    }

    // Emergency message priorities
    if (message.priority === 'emergency') {
      if (route.hasInternetPath) score += 40;
      if (route.hopCount <= 3) score += 20;
    }

    // Battery efficiency
    score -= route.energyCost * 0.1;

    // Historical performance (learning component)
    const pathKey = route.path.join('-');
    const historicalData = this.learningData.get(pathKey);
    if (historicalData) {
      score += historicalData.successRate * 20;
      score -= historicalData.averageDelay * 0.001;
    }

    // Node trust scores
    const pathTrustScore = route.path.reduce((sum, nodeId) => {
      const node = this.networkState.discoveredNodes.get(nodeId);
      return sum + (node?.trustScore || 0.5);
    }, 0) / route.path.length;
    score += pathTrustScore * 15;

    return Math.max(0, score);
  }

  /**
   * Smart retry strategy based on AI analysis
   */
  private determineRetryStrategy(message: MeshMessage, route: RouteInfo): AIRoutingDecision['retryStrategy'] {
    if (message.priority === 'emergency') {
      return 'broadcast'; // Emergency messages get broadcast
    }

    if (route.hasInternetPath && route.reliability > 0.7) {
      return 'immediate';
    }

    if (this.networkState.internetGateways.length === 0) {
      return 'wait_for_gateway';
    }

    return 'backoff';
  }

  /**
   * Generate human-readable reasoning for routing decision
   */
  private generateReasoning(route: RouteInfo, message: MeshMessage): string {
    const reasons: string[] = [];

    if (route.hasInternetPath) {
      reasons.push('Route has internet gateway access');
    }

    if (route.hopCount <= 2) {
      reasons.push('Short path with minimal hops');
    }

    if (route.reliability > 0.8) {
      reasons.push('High reliability based on node history');
    }

    if (message.priority === 'emergency') {
      reasons.push('Emergency message prioritized');
    }

    return reasons.join('; ') || 'Default routing selected';
  }

  // Helper methods
  private reconstructPath(previous: Map<string, string>, start: string, end: string): string[] {
    const path: string[] = [];
    let current = end;
    
    while (current !== start) {
      path.unshift(current);
      current = previous.get(current)!;
    }
    path.unshift(start);
    
    return path;
  }

  private async buildRouteInfo(path: string[], message: MeshMessage): Promise<RouteInfo> {
    let reliability = 1.0;
    let energyCost = 0;
    let hasInternet = false;

    for (const nodeId of path) {
      const node = this.networkState.discoveredNodes.get(nodeId);
      if (node) {
        reliability *= (node.trustScore + 0.5) / 1.5; // Adjust reliability
        energyCost += 1.0 / Math.max(node.batteryLevel, 0.1); // Battery impact
        if (node.hasInternetAccess) hasInternet = true;
      }
    }

    return {
      path,
      hopCount: path.length - 1,
      reliability,
      estimatedDeliveryTime: path.length * 2000, // 2 seconds per hop
      energyCost,
      hasInternetPath: hasInternet
    };
  }

  private selectOptimalRoute(routes: RouteInfo[], message: MeshMessage): RouteInfo {
    return routes[0] || {
      path: [message.originalSender],
      hopCount: 0,
      reliability: 0,
      estimatedDeliveryTime: 0,
      energyCost: 0,
      hasInternetPath: false
    };
  }

  private calculateConfidence(route: RouteInfo, message: MeshMessage): number {
    let confidence = route.reliability * 0.6;
    
    if (route.hasInternetPath && message.requiresInternet) {
      confidence += 0.3;
    }
    
    if (route.hopCount <= 3) {
      confidence += 0.1;
    }
    
    return Math.min(1.0, confidence);
  }

  private shouldStoreMessage(message: MeshMessage, route: RouteInfo): boolean {
    return route.reliability < 0.5 || !route.hasInternetPath && message.requiresInternet;
  }

  private async calculateAIEdgeWeight(edge: any, message: MeshMessage): Promise<number> {
    let weight = 1.0;
    
    // Base weight from connection quality
    weight *= (2.0 - edge.reliability);
    
    // Adjust for bandwidth
    if (message.messageType === 'file') {
      weight *= (100.0 / Math.max(edge.bandwidth, 1));
    }
    
    return weight;
  }

  /**
   * Update learning data based on routing performance
   */
  public recordRoutingPerformance(pathKey: string, success: boolean, deliveryTime: number) {
    const existing = this.learningData.get(pathKey) || {
      attempts: 0,
      successes: 0,
      totalDelay: 0,
      successRate: 0.5,
      averageDelay: 1000
    };

    existing.attempts += 1;
    if (success) {
      existing.successes += 1;
      existing.totalDelay += deliveryTime;
    }

    existing.successRate = existing.successes / existing.attempts;
    existing.averageDelay = existing.totalDelay / existing.successes || 1000;

    this.learningData.set(pathKey, existing);
  }
}

interface RoutingPerformance {
  attempts: number;
  successes: number;
  totalDelay: number;
  successRate: number;
  averageDelay: number;
}