/**
 * OBS WebSocket Configuration
 * Configuration for connecting to OBS via WebSocket protocol
 */

export const OBS_WEBSOCKET_CONFIG = {
  host: 'localhost',
  port: 4455,
  password: '',

  reconnectInterval: 5000,
  maxReconnectAttempts: 5,

  downstreamKeyer: {
    enabled: true,
    sourceNamePrefix: 'DSK',
  },
};

/**
 * Get WebSocket URL
 * @returns {string} WebSocket connection URL
 */
export function getWebSocketUrl() {
  return `ws://${OBS_WEBSOCKET_CONFIG.host}:${OBS_WEBSOCKET_CONFIG.port}`;
}

/**
 * Load saved WebSocket configuration from localStorage
 */
export function loadWebSocketConfig() {
  const savedHost = localStorage.getItem('obsWebSocketHost');
  const savedPort = localStorage.getItem('obsWebSocketPort');
  const savedPassword = localStorage.getItem('obsWebSocketPassword');

  if (savedHost) OBS_WEBSOCKET_CONFIG.host = savedHost;
  if (savedPort) OBS_WEBSOCKET_CONFIG.port = parseInt(savedPort, 10);
  if (savedPassword) OBS_WEBSOCKET_CONFIG.password = savedPassword;
}

/**
 * Save WebSocket configuration to localStorage
 */
export function saveWebSocketConfig(host, port, password) {
  localStorage.setItem('obsWebSocketHost', host);
  localStorage.setItem('obsWebSocketPort', port.toString());
  localStorage.setItem('obsWebSocketPassword', password);

  OBS_WEBSOCKET_CONFIG.host = host;
  OBS_WEBSOCKET_CONFIG.port = port;
  OBS_WEBSOCKET_CONFIG.password = password;
}
