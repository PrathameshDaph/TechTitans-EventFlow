class TaskModel {
  final String id;
  final String title;
  final String description;
  final String assignedTo;
  final String? assignedVolunteerName;
  final String priority; // 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'
  final String location;
  final String block;
  final String status; // 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED' | 'CANCELLED'
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime dueAt;

  TaskModel({
    required this.id,
    required this.title,
    required this.description,
    required this.assignedTo,
    this.assignedVolunteerName,
    required this.priority,
    required this.location,
    required this.block,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.dueAt,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      assignedTo: json['assignedTo'] ?? '',
      assignedVolunteerName: json['assignedVolunteerName'],
      priority: json['priority'] ?? 'NORMAL',
      location: json['location'] ?? '',
      block: json['block'] ?? '',
      status: json['status'] ?? 'ASSIGNED',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt']) ?? DateTime.now()
          : DateTime.now(),
      dueAt: json['dueAt'] != null
          ? DateTime.tryParse(json['dueAt']) ?? DateTime.now().add(const Duration(minutes: 30))
          : DateTime.now().add(const Duration(minutes: 30)),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'assignedTo': assignedTo,
      'assignedVolunteerName': assignedVolunteerName,
      'priority': priority,
      'location': location,
      'block': block,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'dueAt': dueAt.toIso8601String(),
    };
  }

  TaskModel copyWith({
    String? id,
    String? title,
    String? description,
    String? assignedTo,
    String? assignedVolunteerName,
    String? priority,
    String? location,
    String? block,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? dueAt,
  }) {
    return TaskModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      assignedTo: assignedTo ?? this.assignedTo,
      assignedVolunteerName: assignedVolunteerName ?? this.assignedVolunteerName,
      priority: priority ?? this.priority,
      location: location ?? this.location,
      block: block ?? this.block,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      dueAt: dueAt ?? this.dueAt,
    );
  }
}
