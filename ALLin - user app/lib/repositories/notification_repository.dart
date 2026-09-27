import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/notification_item.dart';
import '../services/eventflow_api_service.dart';
import '../services/mock_data_service.dart';

abstract class NotificationRepository {
  Stream<List<NotificationItem>> get notificationStream;
  List<NotificationItem> getCurrentNotifications();
  Future<void> fetchNotifications();
  Future<void> markAsRead(String id);
  Future<void> deleteNotification(String id);
  void handleRealtimeNotification(Map<String, dynamic> rawEvent);
  Future<void> reportChildFound({
    required String notificationId,
    required String foundLocationBlock,
    required String visitorContact,
    String? message,
  });
  void simulateManagerBroadcast({
    String? customTitle,
    String? customMessage,
    String? block,
    String? gate,
  });
}

class ApiNotificationRepository implements NotificationRepository {
  final EventFlowApiService _apiService = EventFlowApiService();
  final List<NotificationItem> _notifications = [];
  final _streamController = StreamController<List<NotificationItem>>.broadcast();

  ApiNotificationRepository() {
    _notifications.addAll(MockDataService.initialNotifications);
    _notify();
    fetchNotifications();
  }

  void _notify() {
    _streamController.add(List.unmodifiable(_notifications));
  }

  @override
  Stream<List<NotificationItem>> get notificationStream => _streamController.stream;

  @override
  List<NotificationItem> getCurrentNotifications() => List.unmodifiable(_notifications);

  @override
  Future<void> fetchNotifications() async {
    try {
      final url = Uri.parse('${_apiService.baseUrl}/notifications');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> raw = jsonDecode(response.body);
        _notifications.clear();

        for (final item in raw) {
          NotificationType type = NotificationType.announcement;
          final itemType = (item['type'] ?? '').toString().toUpperCase();
          final isMissingChild = item['isMissingChild'] == true || itemType == 'MISSING_CHILD' || itemType == 'CHILD';

          if (isMissingChild) {
            type = NotificationType.missingChild;
          } else if (itemType == 'GATE' || itemType == 'CROWD') {
            type = NotificationType.gateUpdate;
          } else if (itemType == 'PARKING') {
            type = NotificationType.parkingUpdate;
          } else {
            type = NotificationType.announcement;
          }

          _notifications.add(NotificationItem(
            id: item['id'] ?? 'notif_${DateTime.now().millisecondsSinceEpoch}',
            title: item['title'] ?? 'Notice',
            message: item['message'] ?? '',
            timeAgo: item['timeAgo'] ?? item['timestamp'] ?? 'Just now',
            type: type,
            isRead: item['read'] == true,
            relatedBlock: item['location'] ?? item['relatedBlock'],
            relatedGate: item['gate'] ?? item['relatedGate'],
            isManagerAlert: true,
            isMissingChild: isMissingChild,
            childName: item['childName'] ?? 'Aarav Patel',
            childAge: (item['childAge'] ?? 7).toString(),
            childDescription: item['childDescription'] ?? 'Wearing blue jersey and white cap, last seen near Gate 3',
            childLastSeen: item['location'] ?? 'Gate 3 (Section C)',
            parentContact: item['guardianContact'] ?? '+91 98200 98765',
            recommendedAction: item['recommendedAction'] ?? 'If spotted, please notify nearest field steward.',
          ));
        }
        _notify();
      }
    } catch (e) {
      debugPrint('[ApiNotificationRepository] Error fetching notifications: $e');
    }
  }

  @override
  Future<void> markAsRead(String id) async {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      _notify();
    }
  }

  @override
  Future<void> deleteNotification(String id) async {
    _notifications.removeWhere((n) => n.id == id);
    _notify();
  }

  @override
  Future<void> reportChildFound({
    required String notificationId,
    required String foundLocationBlock,
    required String visitorContact,
    String? message,
  }) async {
    try {
      final url = Uri.parse('${_apiService.baseUrl}/missing-person/$notificationId/found');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': 'Visitor / Volunteer Report',
          'foundLocationBlock': foundLocationBlock,
          'visitorContact': visitorContact,
          'message': message ?? 'Child located safely',
        }),
      );

      debugPrint('[ApiNotificationRepository] reportChildFound status: ${response.statusCode}');
    } catch (e) {
      debugPrint('[ApiNotificationRepository] reportChildFound network error: $e');
    }

    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      final updated = _notifications[index].copyWith(
        isReportedByVisitor: true,
        visitorReportBlock: foundLocationBlock,
        visitorReportContact: visitorContact,
        visitorReportMessage: message,
      );
      _notifications[index] = updated;
      _notify();
    }
  }

  @override
  void handleRealtimeNotification(Map<String, dynamic> rawEvent) {
    try {
      final payload = rawEvent['payload'] is Map<String, dynamic>
          ? rawEvent['payload'] as Map<String, dynamic>
          : (rawEvent['event'] is Map<String, dynamic>
              ? (rawEvent['event']['payload'] as Map<String, dynamic>? ?? rawEvent)
              : rawEvent);

      final notifData = payload['notification'] is Map<String, dynamic>
          ? payload['notification'] as Map<String, dynamic>
          : payload;

      final id = notifData['id']?.toString() ?? 'notif_${DateTime.now().millisecondsSinceEpoch}';

      // Avoid duplication
      if (_notifications.any((n) => n.id == id)) return;

      final itemType = (notifData['type'] ?? rawEvent['type'] ?? '').toString().toUpperCase();
      final isMissingChild = notifData['isMissingChild'] == true ||
          itemType == 'MISSING_CHILD' ||
          itemType == 'CHILD' ||
          (notifData['title'] ?? '').toString().toLowerCase().contains('missing child');

      NotificationType type = NotificationType.announcement;
      if (isMissingChild) {
        type = NotificationType.missingChild;
      } else if (itemType == 'GATE' || itemType == 'CROWD' || itemType == 'GATE_STATUS_CHANGE') {
        type = NotificationType.gateUpdate;
      } else if (itemType == 'PARKING') {
        type = NotificationType.parkingUpdate;
      } else {
        type = NotificationType.announcement;
      }

      final newItem = NotificationItem(
        id: id,
        title: notifData['title']?.toString() ?? 'Manager Operational Advisory',
        message: notifData['message']?.toString() ?? notifData['body']?.toString() ?? '',
        timeAgo: notifData['timeAgo']?.toString() ?? 'Just now',
        type: type,
        isRead: false,
        relatedBlock: notifData['relatedBlock']?.toString() ?? notifData['block']?.toString() ?? notifData['location']?.toString() ?? 'A BLOCK',
        relatedGate: notifData['relatedGate']?.toString() ?? notifData['gate']?.toString() ?? 'Gate 1',
        isManagerAlert: true,
        isMissingChild: isMissingChild,
        childName: notifData['childName']?.toString() ?? (isMissingChild ? 'Aarav Patel' : null),
        childAge: notifData['childAge']?.toString() ?? (isMissingChild ? '7' : null),
        childDescription: notifData['childDescription']?.toString() ?? (isMissingChild ? 'Wearing blue jersey and white cap, last seen near Gate 3' : null),
        childLastSeen: notifData['location']?.toString() ?? (isMissingChild ? 'Gate 3 (Section C)' : null),
        parentContact: notifData['guardianContact']?.toString() ?? notifData['parentContact']?.toString() ?? '+91 98200 98765',
        recommendedAction: notifData['recommendedAction']?.toString() ?? notifData['action']?.toString() ?? 'Follow instructions from marshals and stewards.',
      );

      _notifications.insert(0, newItem);
      _notify();
    } catch (e) {
      debugPrint('[ApiNotificationRepository] Error handling realtime notification: $e');
    }
  }

  @override
  void simulateManagerBroadcast({
    String? customTitle,
    String? customMessage,
    String? block,
    String? gate,
  }) {
    final id = 'notif_mgr_${DateTime.now().millisecondsSinceEpoch}';
    final newItem = NotificationItem(
      id: id,
      title: customTitle ?? 'Manager Advisory',
      message: customMessage ?? 'Operational broadcast from Central Command Desk.',
      timeAgo: 'Just now',
      type: NotificationType.announcement,
      isRead: false,
      relatedBlock: block ?? 'A BLOCK',
      relatedGate: gate ?? 'Gate 1',
      isManagerAlert: true,
      recommendedAction: 'Follow instructions from marshals and stewards.',
    );

    _notifications.insert(0, newItem);
    _notify();
  }

  void dispose() {
    _streamController.close();
  }
}
