class LostFoundItem {
  final String reportId;
  final String category;
  final String description;
  final String block;
  final String contactNumber;
  final String additionalDetails;
  final String photoAsset;
  final String? photoPath;
  final String? photoName;
  final DateTime timestamp;
  final String status;
  final String? finderUserId;
  final String? finderName;
  final String? eventName;

  const LostFoundItem({
    required this.reportId,
    this.category = 'Other Item',
    required this.description,
    required this.block,
    required this.contactNumber,
    required this.additionalDetails,
    required this.photoAsset,
    this.photoPath,
    this.photoName,
    required this.timestamp,
    this.status = 'Submitted to Event Management Desk',
    this.finderUserId,
    this.finderName,
    this.eventName = 'India vs Pakistan — Wankhede Stadium',
  });

  Map<String, dynamic> toJson() {
    return {
      'reportId': reportId,
      'category': category,
      'description': description,
      'block': block,
      'contactNumber': contactNumber,
      'additionalDetails': additionalDetails,
      'photoAsset': photoAsset,
      'photoPath': photoPath,
      'photoName': photoName,
      'timestamp': timestamp.toIso8601String(),
      'status': status,
      'finderUserId': finderUserId,
      'finderName': finderName,
      'eventName': eventName,
    };
  }
}
