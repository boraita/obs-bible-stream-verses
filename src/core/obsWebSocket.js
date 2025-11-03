/**
 * OBS WebSocket Client
 * Handles WebSocket connection to OBS and provides methods to interact with OBS
 * Compatible with obs-websocket 5.x protocol
 */

import { OBS_WEBSOCKET_CONFIG, getWebSocketUrl, loadWebSocketConfig } from '../config/obsWebSocketConfig.js';

class OBSWebSocketClient {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.authenticated = false;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
    this.messageId = 1;
    this.pendingRequests = new Map();
    
    // Event listeners
    this.onConnectedCallbacks = [];
    this.onDisconnectedCallbacks = [];
    this.onSceneChangedCallbacks = [];
    this.onDownstreamKeyerStatusCallbacks = [];
    
    // Expose config for external modification
    this.config = OBS_WEBSOCKET_CONFIG;
    
    loadWebSocketConfig();
  }

  /**
   * Connect to OBS WebSocket server
   */
  async connect() {
    if (this.ws && this.connected) {
      console.log('🔌 Already connected to OBS WebSocket');
      return Promise.resolve();
    }

    // Close existing connection if any
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    return new Promise((resolve, reject) => {
      try {
        // Update config from what might have been changed externally
        loadWebSocketConfig();
        
        const url = getWebSocketUrl();
        console.log(`🔌 Connecting to OBS WebSocket at ${url}...`);
        
        this.ws = new WebSocket(url);
        
        // Store resolve/reject for later use
        this._connectResolve = resolve;
        this._connectReject = reject;
        
        // Set timeout for connection
        const connectionTimeout = setTimeout(() => {
          if (!this.connected) {
            this._connectReject = null;
            this._connectResolve = null;
            reject(new Error('Connection timeout'));
            if (this.ws) {
              this.ws.close();
            }
          }
        }, 10000); // 10 second timeout
        
        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          this.handleOpen();
        };
        
        this.ws.onmessage = (event) => this.handleMessage(event);
        
        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          this.handleError(error);
          if (this._connectReject) {
            this._connectReject(new Error('WebSocket connection error'));
            this._connectReject = null;
            this._connectResolve = null;
          }
        };
        
        this.ws.onclose = () => {
          clearTimeout(connectionTimeout);
          this.handleClose();
        };
        
      } catch (error) {
        console.error('❌ Failed to connect to OBS WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from OBS WebSocket
   */
  disconnect() {
    console.log('🔌 Disconnecting from OBS WebSocket...');
    
    // Cancel any pending reconnection
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Reset reconnect attempts to prevent auto-reconnect
    this.reconnectAttempts = OBS_WEBSOCKET_CONFIG.maxReconnectAttempts;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.connected = false;
    this.authenticated = false;
    
    console.log('✅ Disconnected from OBS WebSocket');
  }

  /**
   * Handle WebSocket open event
   */
  handleOpen() {
    console.log('✅ WebSocket connection opened');
    this.connected = true;
    this.reconnectAttempts = 0;
  }

  /**
   * Handle WebSocket message
   */
  async handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      
      // Handle different message types
      switch (message.op) {
        case 0: // Hello
          await this.handleHello(message.d);
          break;
          
        case 2: // Identified
          this.handleIdentified(message.d);
          break;
          
        case 7: // RequestResponse
          this.handleRequestResponse(message.d);
          break;
          
        case 5: // Event
          this.handleEvent(message.d);
          break;
          
        default:
          console.log('📩 Received OBS message:', message);
      }
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle Hello message (authentication challenge)
   */
  async handleHello(data) {
    console.log('👋 Received Hello from OBS');
    console.log('Authentication required:', !!data.authentication);
    console.log('Password configured:', !!OBS_WEBSOCKET_CONFIG.password);
    
    if (!data.authentication) {
      // No authentication required by OBS
      console.log('🔓 No authentication required, sending Identify...');
      this.sendIdentify();
    } else if (!OBS_WEBSOCKET_CONFIG.password) {
      // OBS requires authentication but no password configured
      console.error('❌ OBS requires a password but none is configured!');
      if (this._connectReject) {
        this._connectReject(new Error('OBS requires a password. Please configure it in the OBS tab.'));
        this._connectReject = null;
        this._connectResolve = null;
      }
      this.disconnect();
    } else {
      // Authentication required and password available
      console.log('🔐 Authenticating with password...');
      const auth = await this.generateAuthResponse(
        data.authentication.challenge,
        data.authentication.salt
      );
      this.sendIdentify(auth);
    }
  }

  /**
   * Generate authentication response
   */
  async generateAuthResponse(challenge, salt) {
    const password = OBS_WEBSOCKET_CONFIG.password;
    
    // Step 1: Hash password with salt
    const secret = await this.sha256(password + salt);
    
    // Step 2: Hash secret with challenge
    const auth = await this.sha256(secret + challenge);
    
    return auth;
  }

  /**
   * SHA256 hash function
   */
  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Send Identify message
   */
  sendIdentify(authentication = null) {
    const identifyMessage = {
      op: 1,
      d: {
        rpcVersion: 1,
        authentication: authentication,
        eventSubscriptions: 33 // Subscribe to scenes and sources events
      }
    };
    
    this.send(identifyMessage);
  }

  /**
   * Handle Identified message
   */
  handleIdentified(data) {
    console.log('✅ Successfully identified with OBS');
    this.authenticated = true;
    
    // Resolve the connection promise
    if (this._connectResolve) {
      this._connectResolve();
      this._connectResolve = null;
      this._connectReject = null;
    }
    
    // Notify connected callbacks
    this.onConnectedCallbacks.forEach(callback => callback());
    
    // Get current scene
    this.getCurrentScene();
  }

  /**
   * Handle request response
   */
  handleRequestResponse(data) {
    const { requestId, requestStatus, responseData } = data;
    
    if (this.pendingRequests.has(requestId)) {
      const { resolve, reject } = this.pendingRequests.get(requestId);
      
      if (requestStatus.result) {
        resolve(responseData);
      } else {
        reject(new Error(requestStatus.comment || 'Request failed'));
      }
      
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Handle events from OBS
   */
  handleEvent(data) {
    const { eventType, eventData } = data;
    
    console.log(`📡 OBS Event: ${eventType}`, eventData);
    
    switch (eventType) {
      case 'CurrentProgramSceneChanged':
        this.onSceneChangedCallbacks.forEach(callback => 
          callback(eventData.sceneName)
        );
        break;
        
      case 'SceneItemEnableStateChanged':
        // Check if it's a downstream keyer source
        if (eventData.sceneItemEnabled !== undefined) {
          this.onDownstreamKeyerStatusCallbacks.forEach(callback =>
            callback(eventData)
          );
        }
        break;
    }
  }

  /**
   * Handle WebSocket error
   */
  handleError(error) {
    console.error('❌ WebSocket error:', error);
    console.error('Connection details:', {
      url: getWebSocketUrl(),
      readyState: this.ws ? this.ws.readyState : 'no websocket'
    });
  }

  /**
   * Handle WebSocket close
   */
  handleClose() {
    console.log('🔌 WebSocket connection closed');
    this.connected = false;
    this.authenticated = false;
    
    // Notify disconnected callbacks
    this.onDisconnectedCallbacks.forEach(callback => callback());
    
    // Schedule reconnect
    this.scheduleReconnect();
  }

  /**
   * Schedule reconnection attempt
   */
  scheduleReconnect() {
    // Don't reconnect if we've reached max attempts or if manually disconnected
    if (this.reconnectAttempts >= OBS_WEBSOCKET_CONFIG.maxReconnectAttempts) {
      console.log('ℹ️ Not reconnecting (max attempts reached or manually disconnected)');
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`🔄 Reconnecting in ${OBS_WEBSOCKET_CONFIG.reconnectInterval / 1000}s (attempt ${this.reconnectAttempts})...`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(error => {
        console.error('❌ Reconnection failed:', error);
      });
    }, OBS_WEBSOCKET_CONFIG.reconnectInterval);
  }

  /**
   * Send message to OBS
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  }

  /**
   * Send request to OBS and wait for response
   */
  sendRequest(requestType, requestData = {}) {
    return new Promise((resolve, reject) => {
      if (!this.connected || !this.authenticated) {
        reject(new Error('Not connected to OBS'));
        return;
      }
      
      const requestId = this.messageId++;
      
      this.pendingRequests.set(requestId, { resolve, reject });
      
      const message = {
        op: 6, // Request
        d: {
          requestType,
          requestId,
          requestData
        }
      };
      
      this.send(message);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Get current scene name
   */
  async getCurrentScene() {
    try {
      const response = await this.sendRequest('GetCurrentProgramScene');
      console.log('🎬 Current scene:', response.currentProgramSceneName);
      return response.currentProgramSceneName;
    } catch (error) {
      console.error('❌ Failed to get current scene:', error);
      return null;
    }
  }

  /**
   * Set current scene
   */
  async setCurrentScene(sceneName) {
    try {
      console.log('🎬 Changing to scene:', sceneName);
      await this.sendRequest('SetCurrentProgramScene', {
        sceneName
      });
      console.log('✅ Scene changed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to set current scene:', error);
      throw error;
    }
  }

  /**
   * Get scene item list
   */
  async getSceneItemList(sceneName) {
    try {
      const response = await this.sendRequest('GetSceneItemList', {
        sceneName
      });
      return response.sceneItems;
    } catch (error) {
      console.error('❌ Failed to get scene items:', error);
      return [];
    }
  }

  /**
   * Check if downstream keyer is active in current scene
   */
  async checkDownstreamKeyerStatus() {
    try {
      const sceneName = await this.getCurrentScene();
      if (!sceneName) return null;
      
      const sceneItems = await this.getSceneItemList(sceneName);
      
      // Find downstream keyer sources
      const dskSources = sceneItems.filter(item => 
        item.sourceName.includes(OBS_WEBSOCKET_CONFIG.downstreamKeyer.sourceNamePrefix)
      );
      
      if (dskSources.length === 0) {
        console.log('ℹ️ No downstream keyer sources found in current scene');
        return null;
      }
      
      // Check if any DSK source is enabled
      const activeDSK = dskSources.find(item => item.sceneItemEnabled);
      
      return {
        sceneName,
        hasDSK: dskSources.length > 0,
        dskActive: !!activeDSK,
        dskSources: dskSources.map(item => ({
          id: item.sceneItemId,
          name: item.sourceName,
          enabled: item.sceneItemEnabled
        }))
      };
    } catch (error) {
      console.error('❌ Failed to check downstream keyer status:', error);
      return null;
    }
  }

  /**
   * Register callback for connection event
   */
  onConnected(callback) {
    this.onConnectedCallbacks.push(callback);
  }

  /**
   * Register callback for disconnection event
   */
  onDisconnected(callback) {
    this.onDisconnectedCallbacks.push(callback);
  }

  /**
   * Register callback for scene change event
   */
  onSceneChanged(callback) {
    this.onSceneChangedCallbacks.push(callback);
  }

  /**
   * Register callback for downstream keyer status change
   */
  onDownstreamKeyerStatusChanged(callback) {
    this.onDownstreamKeyerStatusCallbacks.push(callback);
  }
}

// Create singleton instance
const obsWebSocket = new OBSWebSocketClient();

export default obsWebSocket;
