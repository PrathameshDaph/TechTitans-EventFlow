/**
 * EventFlow Central Real-Time WebSocket Client
 * Connects directly to ws://localhost:8000/ws
 * Maintains identity-tied realtime connection with auto-reconnection.
 */

export interface RealtimeEvent {
  id: string;
  type: string;
  timestamp: string;
  source: string;
  target?: string;
  targetRole?: string;
  scope?: 'individual' | 'role' | 'zone' | 'gate' | 'broadcast';
  payload: any;
}

export type ConnectionStatus = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

type EventListener = (event: RealtimeEvent) => void;
type StatusListener = (status: ConnectionStatus) => void;

class RealtimeService {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8000/ws';
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private status: ConnectionStatus = 'DISCONNECTED';
  private clientIdentity: { clientId: string; role: string; name?: string; gateId?: string; zoneId?: string } | null = null;

  private eventListeners: Set<EventListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();

  constructor() {
    // Listen to window offline/online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.connect());
      window.addEventListener('offline', () => this.setStatus('DISCONNECTED'));
    }
  }

  public setIdentity(identity: { clientId: string; role: string; name?: string; gateId?: string; zoneId?: string } | null) {
    this.clientIdentity = identity;
    if (this.ws && this.ws.readyState === WebSocket.OPEN && identity) {
      this.send({
        type: 'REGISTER',
        payload: identity,
      });
    }
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  private setStatus(newStatus: ConnectionStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach(listener => listener(newStatus));
    }
  }

  public connect() {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.setStatus('RECONNECTING');
      const wsUrl = this.clientIdentity?.clientId
        ? `${this.url}?clientId=${encodeURIComponent(this.clientIdentity.clientId)}&role=${encodeURIComponent(this.clientIdentity.role)}`
        : this.url;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('CONNECTED');
        console.log('[EventFlow Realtime] Connected to central server.');

        // Send registration packet if identity exists
        if (this.clientIdentity) {
          this.send({
            type: 'REGISTER',
            payload: this.clientIdentity,
          });
        }

        // Start heartbeat ping
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'EVENT' && data.event) {
            this.notifyEventListeners(data.event);
          } else if (data.type === 'SYNC_STATE') {
            console.log('[EventFlow Realtime] Synced initial server state.');
          }
        } catch (e) {
          console.error('[EventFlow Realtime] Error parsing message:', e);
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.setStatus('RECONNECTING');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[EventFlow Realtime] WebSocket connection issue, will reconnect:', err);
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (err) {
      console.warn('[EventFlow Realtime] Failed to initialize WebSocket:', err);
      this.setStatus('RECONNECTING');
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.clientIdentity = null;
    this.setStatus('DISCONNECTED');
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 3000);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  public emitEvent(event: Omit<RealtimeEvent, 'id' | 'timestamp'>) {
    return this.send({
      type: 'EMIT_EVENT',
      event,
    });
  }

  public onEvent(listener: EventListener): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyEventListeners(event: RealtimeEvent) {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (err) {
        console.error('[EventFlow Realtime] Listener error:', err);
      }
    });
  }
}

export const realtimeService = new RealtimeService();
