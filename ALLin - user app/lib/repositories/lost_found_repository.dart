import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/lost_found_item.dart';
import '../services/eventflow_api_service.dart';

abstract class LostFoundRepository {
  Future<LostFoundItem> reportFoundItem({
    required String description,
    required String block,
    required String contactNumber,
    required String additionalDetails,
    required String photoAsset,
    String? category,
    String? photoPath,
    String? photoName,
    String? finderUserId,
    String? finderName,
    String? eventName,
  });
  List<LostFoundItem> getReportedItems();
  Future<List<LostFoundItem>> fetchAllReportedItems();
}

class ApiLostFoundRepository implements LostFoundRepository {
  final EventFlowApiService _apiService = EventFlowApiService();
  final List<LostFoundItem> _reportedItems = [];

  @override
  Future<LostFoundItem> reportFoundItem({
    required String description,
    required String block,
    required String contactNumber,
    required String additionalDetails,
    required String photoAsset,
    String? category,
    String? photoPath,
    String? photoName,
    String? finderUserId,
    String? finderName,
    String? eventName,
  }) async {
    final payload = {
      'type': 'FOUND',
      'category': category ?? 'GENERAL',
      'title': description.length > 30 ? description.substring(0, 30) : description,
      'description': '$description. $additionalDetails',
      'location': block,
      'reportedBy': finderName ?? finderUserId ?? 'Visitor App',
      'contactPhone': contactNumber,
      'status': 'OPEN',
    };

    String generatedId = 'LF-WAN-${1000 + Random().nextInt(9000)}';

    try {
      final url = Uri.parse('${_apiService.baseUrl}/lost-found');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final item = data['item'];
        if (item != null && item['id'] != null) {
          generatedId = item['id'];
        }
      }
    } catch (e) {
      debugPrint('[ApiLostFoundRepository] Network error submitting lost item: $e');
    }

    final newItem = LostFoundItem(
      reportId: generatedId,
      category: category ?? 'Other Item',
      description: description,
      block: block,
      contactNumber: contactNumber,
      additionalDetails: additionalDetails,
      photoAsset: photoAsset,
      photoPath: photoPath,
      photoName: photoName,
      timestamp: DateTime.now(),
      status: 'Submitted to Event Management Desk',
      finderUserId: finderUserId,
      finderName: finderName,
      eventName: eventName ?? 'India vs Pakistan — Wankhede Stadium',
    );

    _reportedItems.insert(0, newItem);
    return newItem;
  }

  @override
  List<LostFoundItem> getReportedItems() => List.unmodifiable(_reportedItems);

  @override
  Future<List<LostFoundItem>> fetchAllReportedItems() async {
    try {
      final url = Uri.parse('${_apiService.baseUrl}/lost-found');
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> items = jsonDecode(response.body);
        _reportedItems.clear();
        for (final item in items) {
          _reportedItems.add(LostFoundItem(
            reportId: item['id'] ?? 'LF-WAN-000',
            category: item['category'] ?? 'General',
            description: item['title'] ?? item['description'] ?? '',
            block: item['location'] ?? 'Perimeter',
            contactNumber: item['contactPhone'] ?? '',
            additionalDetails: item['description'] ?? '',
            photoAsset: 'item',
            timestamp: item['createdAt'] != null
                ? DateTime.tryParse(item['createdAt']) ?? DateTime.now()
                : DateTime.now(),
            status: item['status'] == 'OPEN' ? 'Active Investigation' : item['status'],
            finderName: item['reportedBy'],
          ));
        }
      }
    } catch (e) {
      debugPrint('[ApiLostFoundRepository] fetchAllReportedItems error: $e');
    }
    return List.unmodifiable(_reportedItems);
  }
}
