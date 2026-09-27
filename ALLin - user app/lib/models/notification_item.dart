enum NotificationType {
  missingChild,
  gateUpdate,
  parkingUpdate,
  trafficAlert,
  announcement,
  venueInfo,
}

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final String timeAgo;
  final NotificationType type;
  final bool isRead;
  final String? relatedBlock;
  final String? relatedGate;
  final String? recommendedAction;
  final bool isManagerAlert;

  // Specific to Missing Child alerts
  final bool isMissingChild;
  final String? childName;
  final String? childAge;
  final String? childLastSeen;
  final String? childReportedBlock;
  final String? childDescription;
  final String? parentContact;
  final bool isReportedByVisitor;
  final String? visitorReportBlock;
  final String? visitorReportContact;
  final String? visitorReportMessage;

  const NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.timeAgo,
    required this.type,
    this.isRead = false,
    this.relatedBlock,
    this.relatedGate,
    this.recommendedAction,
    this.isManagerAlert = false,
    this.isMissingChild = false,
    this.childName,
    this.childAge,
    this.childLastSeen,
    this.childReportedBlock,
    this.childDescription,
    this.parentContact,
    this.isReportedByVisitor = false,
    this.visitorReportBlock,
    this.visitorReportContact,
    this.visitorReportMessage,
  });

  NotificationItem copyWith({
    String? id,
    String? title,
    String? message,
    String? timeAgo,
    NotificationType? type,
    bool? isRead,
    String? relatedBlock,
    String? relatedGate,
    String? recommendedAction,
    bool? isManagerAlert,
    bool? isMissingChild,
    String? childName,
    String? childAge,
    String? childLastSeen,
    String? childReportedBlock,
    String? childDescription,
    String? parentContact,
    bool? isReportedByVisitor,
    String? visitorReportBlock,
    String? visitorReportContact,
    String? visitorReportMessage,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      timeAgo: timeAgo ?? this.timeAgo,
      type: type ?? this.type,
      isRead: isRead ?? this.isRead,
      relatedBlock: relatedBlock ?? this.relatedBlock,
      relatedGate: relatedGate ?? this.relatedGate,
      recommendedAction: recommendedAction ?? this.recommendedAction,
      isManagerAlert: isManagerAlert ?? this.isManagerAlert,
      isMissingChild: isMissingChild ?? this.isMissingChild,
      childName: childName ?? this.childName,
      childAge: childAge ?? this.childAge,
      childLastSeen: childLastSeen ?? this.childLastSeen,
      childReportedBlock: childReportedBlock ?? this.childReportedBlock,
      childDescription: childDescription ?? this.childDescription,
      parentContact: parentContact ?? this.parentContact,
      isReportedByVisitor: isReportedByVisitor ?? this.isReportedByVisitor,
      visitorReportBlock: visitorReportBlock ?? this.visitorReportBlock,
      visitorReportContact: visitorReportContact ?? this.visitorReportContact,
      visitorReportMessage: visitorReportMessage ?? this.visitorReportMessage,
    );
  }
}
