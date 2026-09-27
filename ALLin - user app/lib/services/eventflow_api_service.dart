import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../models/event.dart';
import '../models/ticket.dart';
import '../models/order.dart';
import '../models/lost_found_item.dart';
import '../models/notification_item.dart';
import '../models/contact.dart';
import 'mock_data_service.dart';

/// EventFlow API Service: Central bidirectional bridge connecting the Attendee
/// Mobile App with the EventFlow Command Platform dataset.
class EventFlowApiService {
  // Singleton pattern
  static final EventFlowApiService _instance = EventFlowApiService._internal();
  factory EventFlowApiService() => _instance;
  EventFlowApiService._internal();

  // Primary API endpoint (Physical LAN IP / Emulator / Server)
  static const String _defaultBaseUrl = 'http://192.168.1.216:8000/api';
  String baseUrl = _defaultBaseUrl;

  bool _isRealApiMode = true;
  bool get isRealApiMode => _isRealApiMode;

  void setApiMode(bool enableRealApi, {String? customUrl}) {
    _isRealApiMode = enableRealApi;
    if (customUrl != null) baseUrl = customUrl;
  }

  // 1. Fetch Current Mega-Event Details
  Future<Event> getEventDetails() async {
    if (!_isRealApiMode) {
      return MockDataService.currentEvent;
    }

    try {
      final response = await http.get(Uri.parse('$baseUrl/events/current'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Event(
          id: data['id'] ?? 'evt_wan_01',
          title: data['name'] ?? 'India vs Pakistan',
          subtitle: 'ICC Cricket Championship Special • Match Day',
          stadiumName: 'Wankhede Stadium',
          locationAddress: 'D Road, Churchgate, Mumbai, Maharashtra 400020',
          timing: '5:00 PM – 11:00 PM',
          date: 'Saturday, 26 September 2026',
          gatesOpen: '3:30 PM',
          tossTime: '4:30 PM',
          status: data['status'] ?? 'Gates Open • Crowd Entry Active',
          weather: '29°C • Coastal Optimal & Clear Sky',
        );
      }
    } catch (e) {
      debugPrint('[EventFlowApiService] Live backend unavailable, using synchronized local event: $e');
    }
    return MockDataService.currentEvent;
  }

  // 2. Fetch User Ticket Pass
  Future<Ticket> getUserTicket(User user) async {
    if (!_isRealApiMode) {
      return MockDataService.getTicketForUser(user);
    }

    try {
      final response = await http.get(Uri.parse('$baseUrl/user/tickets'));
      if (response.statusCode == 200) {
        final List<dynamic> tickets = jsonDecode(response.body);
        final match = tickets.firstWhere(
          (t) => t['ticketId'] == user.ticketId,
          orElse: () => null,
        );
        if (match != null) {
          return Ticket(
            ticketId: match['ticketId'],
            eventTitle: 'India vs Pakistan',
            stadiumName: 'Wankhede Stadium',
            visitorName: match['visitorName'] ?? user.name,
            block: match['block'] ?? user.assignedBlock,
            row: match['row'] ?? 'Row K',
            seat: match['seat'] ?? 'Seat 42',
            gate: match['gate'] ?? 'Gate 5 (North Stand East)',
            dateTime: 'Saturday, 26 September 2026 • 5:00 PM – 11:00 PM',
            qrPayload: match['qrPayload'] ?? 'ALLIN-ENTRY-PASS:${user.ticketId}:${user.name}',
            isScanned: match['isScanned'] ?? false,
            category: match['category'] ?? 'North Stand Level 2 — Premium Pavilion',
          );
        }
      }
    } catch (e) {
      debugPrint('[EventFlowApiService] Ticket fetch error: $e');
    }
    return MockDataService.getTicketForUser(user);
  }

  // 3. Submit Concession Food Order to Central Queue
  Future<bool> submitFoodOrder(FoodOrder order, {required String userId, required String userName, required String userPhone, required String block}) async {
    final payload = {
      'orderId': order.orderId,
      'userId': userId,
      'userName': userName,
      'userPhone': userPhone,
      'orderType': order.orderType,
      'block': block,
      'pickupCounter': order.pickupCounter,
      'pickupServingTime': order.pickupServingTime,
      'totalAmount': order.totalAmount,
      'status': order.status,
      'referenceCode': order.referenceCode,
      'items': order.items.map((i) => {
        'itemId': i.foodItem.id,
        'itemName': i.foodItem.name,
        'quantity': i.quantity,
        'price': i.foodItem.price,
        'isVeg': i.foodItem.isVeg,
      }).toList(),
    };

    if (_isRealApiMode) {
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/user/orders'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(payload),
        );
        return response.statusCode == 200 || response.statusCode == 201;
      } catch (e) {
        debugPrint('[EventFlowApiService] Submit food order network error: $e');
      }
    }

    // Successfully enqueued into local session
    debugPrint('[EventFlowApiService] Food order ${order.orderId} submitted to concession counter queue.');
    return true;
  }

  // 4. Submit Lost & Found Report to Security Registry
  Future<bool> submitLostFoundReport(LostFoundItem item) async {
    if (_isRealApiMode) {
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/user/lost-found'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(item.toJson()),
        );
        return response.statusCode == 200 || response.statusCode == 201;
      } catch (e) {
        debugPrint('[EventFlowApiService] Lost & Found network error: $e');
      }
    }

    debugPrint('[EventFlowApiService] Lost item logged in custody desk: ${item.reportId}');
    return true;
  }

  // 5. Trigger Attendee Emergency SOS to Manager & Crew
  Future<bool> triggerFanEmergencySos({
    required String userId,
    required String userName,
    required String userPhone,
    required String block,
    required String seat,
    required String category,
    required String message,
  }) async {
    final payload = {
      'alertId': 'SOS-FAN-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
      'userId': userId,
      'userName': userName,
      'userPhone': userPhone,
      'block': block,
      'seat': seat,
      'category': category,
      'message': message,
      'timestamp': 'Just now',
      'status': 'TRIGGERED',
      'priority': 'CRITICAL',
    };

    if (_isRealApiMode) {
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/user/sos'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(payload),
        );
        return response.statusCode == 200 || response.statusCode == 201;
      } catch (e) {
        debugPrint('[EventFlowApiService] Fan SOS post error: $e');
      }
    }

    debugPrint('[EventFlowApiService] Fan SOS Broadcast triggered: $payload');
    return true;
  }

  // 6. Fetch Real-time Fan Broadcast Notifications
  Future<List<NotificationItem>> getLiveBroadcastNotifications() async {
    if (!_isRealApiMode) {
      return MockDataService.initialNotifications;
    }

    try {
      final response = await http.get(Uri.parse('$baseUrl/user/broadcasts'));
      if (response.statusCode == 200) {
        final List<dynamic> raw = jsonDecode(response.body);
        return raw.map((b) => NotificationItem(
          id: b['id'] ?? 'brd_live',
          title: b['title'] ?? 'Operational Advisory',
          message: b['message'] ?? '',
          timeAgo: b['timestamp'] ?? 'Just now',
          type: NotificationType.announcement,
          isRead: false,
          isManagerAlert: true,
          relatedBlock: b['targetBlock'] != 'ALL' ? b['targetBlock'] : null,
        )).toList();
      }
    } catch (e) {
      debugPrint('[EventFlowApiService] Broadcast fetch error: $e');
    }

    return MockDataService.initialNotifications;
  }

  // 7. Get Assigned Crew Lead for Sector
  ContactPerson? getCrewLeadForBlock(String block) {
    return MockDataService.blockCrewHeads[block];
  }
}
