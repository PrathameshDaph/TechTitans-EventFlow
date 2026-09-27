import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

typedef WebSocketCallback = void Function(Map<String, dynamic> data);

class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  WebSocketChannel? _channel;
  Timer? _reconnectTimer;
  Timer? _pingTimer;
  bool _isConnected = false;
  String _wsUrl = 'ws://192.168.1.216:8000/ws';

  final List<WebSocketCallback> _listeners = [];
  Map<String, dynamic>? _clientIdentity;

  bool get isConnected => _isConnected;

  void setUrl(String url) {
    _wsUrl = url;
    if (_isConnected) {
      disconnect();
      connect();
    }
  }

  void setIdentity({required String clientId, required String role, String? name}) {
    _clientIdentity = {
      'clientId': clientId,
      'role': role,
      'name': name ?? clientId,
    };
    if (_isConnected) {
      _sendIdentity();
    }
  }

  void addListener(WebSocketCallback callback) {
    if (!_listeners.contains(callback)) {
      _listeners.add(callback);
    }
  }

  void removeListener(WebSocketCallback callback) {
    _listeners.remove(callback);
  }

  void connect() {
    if (_isConnected) return;

    try {
      debugPrint('[WebSocketService] Connecting to $_wsUrl ...');
      _channel = WebSocketChannel.connect(Uri.parse(_wsUrl));

      _channel!.stream.listen(
        (message) {
          _isConnected = true;
          try {
            final data = jsonDecode(message.toString());
            debugPrint('[WebSocketService] Received message: $data');

            for (final listener in List.from(_listeners)) {
              listener(data);
            }
          } catch (e) {
            debugPrint('[WebSocketService] Error parsing message: $e');
          }
        },
        onDone: () {
          debugPrint('[WebSocketService] Connection closed.');
          _isConnected = false;
          _scheduleReconnect();
        },
        onError: (error) {
          debugPrint('[WebSocketService] Connection error: $error');
          _isConnected = false;
          _scheduleReconnect();
        },
      );

      _isConnected = true;
      _sendIdentity();
      _startPing();
    } catch (e) {
      debugPrint('[WebSocketService] Connect failed: $e');
      _isConnected = false;
      _scheduleReconnect();
    }
  }

  void _sendIdentity() {
    if (_channel != null && _clientIdentity != null) {
      try {
        final payload = {
          'type': 'REGISTER',
          ..._clientIdentity!,
        };
        _channel!.sink.add(jsonEncode(payload));
        debugPrint('[WebSocketService] Sent identity register: $payload');
      } catch (e) {
        debugPrint('[WebSocketService] Error sending identity: $e');
      }
    }
  }

  void _startPing() {
    _pingTimer?.cancel();
    _pingTimer = Timer.periodic(const Duration(seconds: 25), (timer) {
      if (_isConnected && _channel != null) {
        try {
          _channel!.sink.add(jsonEncode({'type': 'PING'}));
        } catch (e) {
          debugPrint('[WebSocketService] Ping failed: $e');
        }
      }
    });
  }

  void _scheduleReconnect() {
    _pingTimer?.cancel();
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 4), () {
      if (!_isConnected) {
        connect();
      }
    });
  }

  void send(Map<String, dynamic> data) {
    if (_channel != null && _isConnected) {
      _channel!.sink.add(jsonEncode(data));
    }
  }

  void disconnect() {
    _pingTimer?.cancel();
    _reconnectTimer?.cancel();
    _isConnected = false;
    _channel?.sink.close(status.goingAway);
    _channel = null;
  }
}
