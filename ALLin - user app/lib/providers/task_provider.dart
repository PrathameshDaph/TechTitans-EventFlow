import 'package:flutter/foundation.dart';
import '../models/task_model.dart';
import '../services/task_service.dart';

class TaskProvider extends ChangeNotifier {
  final TaskService _taskService = TaskService();

  List<TaskModel> _tasks = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<TaskModel> get tasks => List.unmodifiable(_tasks);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<TaskModel> get pendingTasks =>
      _tasks.where((t) => t.status == 'ASSIGNED' || t.status == 'ACCEPTED').toList();

  List<TaskModel> get inProgressTasks =>
      _tasks.where((t) => t.status == 'IN_PROGRESS').toList();

  List<TaskModel> get completedTasks =>
      _tasks.where((t) => t.status == 'COMPLETED').toList();

  List<TaskModel> get declinedTasks =>
      _tasks.where((t) => t.status == 'DECLINED').toList();

  Future<void> fetchMyTasks(String token) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final fetched = await _taskService.getMyTasks(token);
      _tasks = fetched;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> acceptTask(String taskId, String token) async {
    final updated = await _taskService.acceptTask(taskId, token);
    if (updated != null) {
      _updateLocalTask(updated);
      return true;
    }
    return false;
  }

  Future<bool> startTask(String taskId, String token) async {
    final updated = await _taskService.startTask(taskId, token);
    if (updated != null) {
      _updateLocalTask(updated);
      return true;
    }
    return false;
  }

  Future<bool> completeTask(String taskId, String token, {String? notes}) async {
    final updated = await _taskService.completeTask(taskId, token, notes: notes);
    if (updated != null) {
      _updateLocalTask(updated);
      return true;
    }
    return false;
  }

  Future<bool> declineTask(String taskId, String token, {String? reason}) async {
    final updated = await _taskService.declineTask(taskId, token, reason: reason);
    if (updated != null) {
      _updateLocalTask(updated);
      return true;
    }
    return false;
  }

  void handleWebSocketEvent(Map<String, dynamic> data) {
    final event = data['event'] as String?;
    final payload = data['payload'] as Map<String, dynamic>?;

    if (event != null && event.startsWith('TASK_') && payload != null) {
      final taskData = payload['task'] as Map<String, dynamic>?;
      if (taskData != null) {
        final task = TaskModel.fromJson(taskData);
        _updateLocalTask(task);
      }
    }
  }

  void _updateLocalTask(TaskModel updated) {
    final index = _tasks.indexWhere((t) => t.id == updated.id);
    if (index != -1) {
      _tasks[index] = updated;
    } else {
      _tasks.insert(0, updated);
    }
    notifyListeners();
  }
}
