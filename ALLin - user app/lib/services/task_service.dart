import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/task_model.dart';
import 'eventflow_api_service.dart';

class TaskService {
  final EventFlowApiService _apiService = EventFlowApiService();

  String get _baseUrl => _apiService.baseUrl;

  Future<List<TaskModel>> getMyTasks(String token) async {
    try {
      final url = Uri.parse('$_baseUrl/tasks/my');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> rawTasks = data['tasks'] ?? [];
        return rawTasks.map((t) => TaskModel.fromJson(t)).toList();
      } else {
        debugPrint('[TaskService] getMyTasks error status: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('[TaskService] getMyTasks exception: $e');
    }
    return [];
  }

  Future<TaskModel?> acceptTask(String taskId, String token) async {
    try {
      final url = Uri.parse('$_baseUrl/tasks/$taskId/accept');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return TaskModel.fromJson(data['task']);
      }
    } catch (e) {
      debugPrint('[TaskService] acceptTask error: $e');
    }
    return null;
  }

  Future<TaskModel?> startTask(String taskId, String token) async {
    try {
      final url = Uri.parse('$_baseUrl/tasks/$taskId/start');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return TaskModel.fromJson(data['task']);
      }
    } catch (e) {
      debugPrint('[TaskService] startTask error: $e');
    }
    return null;
  }

  Future<TaskModel?> completeTask(String taskId, String token, {String? notes}) async {
    try {
      final url = Uri.parse('$_baseUrl/tasks/$taskId/complete');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'notes': notes ?? 'Task completed by volunteer'}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return TaskModel.fromJson(data['task']);
      }
    } catch (e) {
      debugPrint('[TaskService] completeTask error: $e');
    }
    return null;
  }

  Future<TaskModel?> declineTask(String taskId, String token, {String? reason}) async {
    try {
      final url = Uri.parse('$_baseUrl/tasks/$taskId/decline');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'reason': reason ?? 'Declined by volunteer'}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return TaskModel.fromJson(data['task']);
      }
    } catch (e) {
      debugPrint('[TaskService] declineTask error: $e');
    }
    return null;
  }
}
