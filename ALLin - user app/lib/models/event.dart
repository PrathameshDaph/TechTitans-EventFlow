class Event {
  final String id;
  final String title;
  final String subtitle;
  final String stadiumName;
  final String locationAddress;
  final String timing;
  final String date;
  final String gatesOpen;
  final String tossTime;
  final String status;
  final String weather;

  const Event({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.stadiumName,
    required this.locationAddress,
    required this.timing,
    required this.date,
    required this.gatesOpen,
    required this.tossTime,
    required this.status,
    required this.weather,
  });
}
