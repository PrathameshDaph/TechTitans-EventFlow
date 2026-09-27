class User {
  final String id;
  final String name;
  final String username;
  final String phone;
  final String email;
  final String assignedBlock;
  final String seatNumber;
  final String ticketId;

  const User({
    required this.id,
    required this.name,
    required this.username,
    required this.phone,
    required this.email,
    required this.assignedBlock,
    required this.seatNumber,
    required this.ticketId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      username: json['username'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String,
      assignedBlock: json['assignedBlock'] as String,
      seatNumber: json['seatNumber'] as String,
      ticketId: json['ticketId'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'username': username,
      'phone': phone,
      'email': email,
      'assignedBlock': assignedBlock,
      'seatNumber': seatNumber,
      'ticketId': ticketId,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? username,
    String? phone,
    String? email,
    String? assignedBlock,
    String? seatNumber,
    String? ticketId,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      username: username ?? this.username,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      assignedBlock: assignedBlock ?? this.assignedBlock,
      seatNumber: seatNumber ?? this.seatNumber,
      ticketId: ticketId ?? this.ticketId,
    );
  }
}
