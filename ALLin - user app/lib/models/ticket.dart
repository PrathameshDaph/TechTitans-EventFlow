class Ticket {
  final String ticketId;
  final String eventTitle;
  final String stadiumName;
  final String visitorName;
  final String block;
  final String row;
  final String seat;
  final String gate;
  final String dateTime;
  final String qrPayload;
  final bool isScanned;
  final String category;

  const Ticket({
    required this.ticketId,
    required this.eventTitle,
    required this.stadiumName,
    required this.visitorName,
    required this.block,
    required this.row,
    required this.seat,
    required this.gate,
    required this.dateTime,
    required this.qrPayload,
    this.isScanned = false,
    this.category = 'North Stand Level 2',
  });

  Ticket copyWith({
    String? ticketId,
    String? eventTitle,
    String? stadiumName,
    String? visitorName,
    String? block,
    String? row,
    String? seat,
    String? gate,
    String? dateTime,
    String? qrPayload,
    bool? isScanned,
    String? category,
  }) {
    return Ticket(
      ticketId: ticketId ?? this.ticketId,
      eventTitle: eventTitle ?? this.eventTitle,
      stadiumName: stadiumName ?? this.stadiumName,
      visitorName: visitorName ?? this.visitorName,
      block: block ?? this.block,
      row: row ?? this.row,
      seat: seat ?? this.seat,
      gate: gate ?? this.gate,
      dateTime: dateTime ?? this.dateTime,
      qrPayload: qrPayload ?? this.qrPayload,
      isScanned: isScanned ?? this.isScanned,
      category: category ?? this.category,
    );
  }
}
