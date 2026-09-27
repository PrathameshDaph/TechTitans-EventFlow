import '../models/event.dart';
import '../models/ticket.dart';
import '../models/user.dart';
import '../services/mock_data_service.dart';

abstract class EventRepository {
  Future<Event> getCurrentEvent();
  Future<Ticket> getTicketForUser(User user);
}

class MockEventRepository implements EventRepository {
  @override
  Future<Event> getCurrentEvent() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return MockDataService.currentEvent;
  }

  @override
  Future<Ticket> getTicketForUser(User user) async {
    await Future.delayed(const Duration(milliseconds: 100));
    return MockDataService.getTicketForUser(user);
  }
}
