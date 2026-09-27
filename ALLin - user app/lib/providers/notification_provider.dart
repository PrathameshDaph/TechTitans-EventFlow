import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/notification_item.dart';
import '../repositories/notification_repository.dart';
import '../services/sound_service.dart';

class NotificationProvider extends ChangeNotifier {
  final NotificationRepository repository;
  StreamSubscription<List<NotificationItem>>? _subscription;
  List<NotificationItem> _notifications = [];
  final Set<String> _knownNotificationIds = {};
  bool _isInitialized = false;

  NotificationProvider({required this.repository}) {
    _notifications = repository.getCurrentNotifications();
    for (final n in _notifications) {
      _knownNotificationIds.add(n.id);
    }
    _isInitialized = true;

    _subscription = repository.notificationStream.listen((items) {
      if (_isInitialized) {
        bool hasNewArrival = false;
        for (final item in items) {
          if (!_knownNotificationIds.contains(item.id)) {
            _knownNotificationIds.add(item.id);
            hasNewArrival = true;
          }
        }
        if (hasNewArrival) {
          SoundService.playNotificationSound();
        }
      }
      _notifications = items;
      notifyListeners();
    });
  }

  List<NotificationItem> get notifications => _notifications;

  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  bool get hasUrgentAlert => _notifications.any((n) => n.isMissingChild || n.type == NotificationType.missingChild);

  NotificationItem? get activeMissingChildNotification =>
      _notifications.where((n) => n.isMissingChild).firstOrNull;

  List<NotificationItem> getAlertsForBlock(String block) {
    return _notifications.where((n) => n.relatedBlock?.toLowerCase() == block.toLowerCase()).toList();
  }

  Future<void> markAsRead(String id) async {
    await repository.markAsRead(id);
  }

  Future<void> deleteNotification(String id) async {
    try {
      await repository.deleteNotification(id);
      _knownNotificationIds.remove(id);
      await SoundService.playDeleteSound();
    } catch (_) {
      // If deletion fails, do not play delete sound
    }
  }

  Future<void> reportChildFound({
    required String notificationId,
    required String foundLocationBlock,
    required String visitorContact,
    String? message,
  }) async {
    await repository.reportChildFound(
      notificationId: notificationId,
      foundLocationBlock: foundLocationBlock,
      visitorContact: visitorContact,
      message: message,
    );
  }

  /// Pipeline bridge for EventFlow AI system / Manager to push live alerts into the user app
  void triggerManagerBroadcast({String? customTitle, String? customMessage, String? block, String? gate}) {
    repository.simulateManagerBroadcast(
      customTitle: customTitle,
      customMessage: customMessage,
      block: block,
      gate: gate,
    );
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
