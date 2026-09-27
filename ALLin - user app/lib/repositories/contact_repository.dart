import '../models/contact.dart';
import '../services/mock_data_service.dart';

abstract class ContactRepository {
  Future<ContactPerson> getEventManager();
  Future<ContactPerson> getBlockCrewHead(String block);
  Future<List<ContactPerson>> getCrewMembers();
}

class MockContactRepository implements ContactRepository {
  @override
  Future<ContactPerson> getEventManager() async {
    return MockDataService.eventManager;
  }

  @override
  Future<ContactPerson> getBlockCrewHead(String block) async {
    return MockDataService.blockCrewHeads[block] ??
        ContactPerson(
          id: 'ch_def',
          name: 'Rahul Sharma',
          role: '$block Ground Lead',
          phone: '9819234567',
          type: ContactType.blockCrewHead,
          block: block,
        );
  }

  @override
  Future<List<ContactPerson>> getCrewMembers() async {
    return MockDataService.crewMembers;
  }
}
