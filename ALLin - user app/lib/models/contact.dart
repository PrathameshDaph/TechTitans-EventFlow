enum ContactType {
  eventManager,
  blockCrewHead,
  crewMember,
}

class ContactPerson {
  final String id;
  final String name;
  final String role;
  final String phone;
  final String? email;
  final ContactType type;
  final String? block;

  const ContactPerson({
    required this.id,
    required this.name,
    required this.role,
    required this.phone,
    this.email,
    required this.type,
    this.block,
  });
}
