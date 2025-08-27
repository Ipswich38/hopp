import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, ProgressBar, useTheme } from 'react-native-paper';
interface MeshStatusBarProps {
  meshManager: any;
}

export const MeshStatusBar: React.FC<MeshStatusBarProps> = ({ meshManager }) => {
  const theme = useTheme();
  const [status, setStatus] = useState({
    isActive: false,
    discoveredNodes: 0,
    activeConnections: 0,
    internetGateways: 0,
    queuedMessages: 0,
    localNode: null as any
  });

  useEffect(() => {
    const updateStatus = () => {
      setStatus(meshManager.getNetworkStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    
    return () => clearInterval(interval);
  }, [meshManager]);

  const getNetworkHealthColor = () => {
    if (status.internetGateways > 0) return theme.colors.primary;
    if (status.activeConnections > 0) return '#FF9800'; // Orange
    return theme.colors.error;
  };

  const getNetworkHealthText = () => {
    if (status.internetGateways > 0) return 'INTERNET CONNECTED';
    if (status.activeConnections > 0) return 'MESH CONNECTED';
    if (status.discoveredNodes > 0) return 'NODES DISCOVERED';
    return 'SEARCHING...';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <View style={styles.row}>
        <Chip 
          icon="access-point-network" 
          textStyle={{ color: getNetworkHealthColor() }}
          style={[styles.statusChip, { backgroundColor: getNetworkHealthColor() + '20' }]}
        >
          {getNetworkHealthText()}
        </Chip>
        
        <View style={styles.stats}>
          <Text variant="labelSmall" style={styles.statText}>
            🌐 {status.internetGateways} • 📡 {status.discoveredNodes} • 💬 {status.queuedMessages}
          </Text>
        </View>
      </View>

      {status.queuedMessages > 0 && (
        <View style={styles.progressContainer}>
          <Text variant="labelSmall">
            🤖 AI routing {status.queuedMessages} message{status.queuedMessages > 1 ? 's' : ''}...
          </Text>
          <ProgressBar 
            progress={0.7} 
            style={styles.progressBar}
            color={theme.colors.primary}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusChip: {
    height: 28,
  },
  stats: {
    flex: 1,
    marginLeft: 12,
  },
  statText: {
    textAlign: 'right',
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    marginTop: 4,
    height: 4,
  },
});