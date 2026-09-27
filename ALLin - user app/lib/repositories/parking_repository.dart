import 'dart:math';
import '../models/parking.dart';
import '../services/mock_data_service.dart';

abstract class ParkingRepository {
  Future<List<String>> getStadiumBlocks();
  Future<Map<String, double>> getEventParkingRates();
  Future<EventParkingBooking> bookEventParking({
    required String block,
    required String vehicleType,
    required int hours,
  });
  Future<List<RentalParking>> getRentalParkings({
    String? vehicleFilter,
    String? priceRangeFilter,
  });
  Future<RentalParkingBooking> bookRentalParking({
    required RentalParking rentalSpot,
    required int hours,
  });
  List<EventParkingBooking> getEventBookings();
  List<RentalParkingBooking> getRentalBookings();
}

class MockParkingRepository implements ParkingRepository {
  final List<EventParkingBooking> _eventBookings = [];
  final List<RentalParkingBooking> _rentalBookings = [];

  @override
  Future<List<String>> getStadiumBlocks() async {
    return MockDataService.stadiumBlocks;
  }

  @override
  Future<Map<String, double>> getEventParkingRates() async {
    return MockDataService.eventParkingRates;
  }

  @override
  Future<EventParkingBooking> bookEventParking({
    required String block,
    required String vehicleType,
    required int hours,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final rate = MockDataService.eventParkingRates[vehicleType] ?? 250.0;
    final total = rate * hours;
    final randomDigits = 1000 + Random().nextInt(9000);
    final booking = EventParkingBooking(
      bookingId: 'EVT-PRK-$randomDigits',
      block: block,
      vehicleType: vehicleType,
      durationHours: hours,
      hourlyRate: rate,
      totalAmount: total,
      bookingRef: 'WAN-P-$block-$randomDigits',
      timestamp: DateTime.now(),
      allocatedSlot: 'Slot ${block.replaceAll("Block ", "B")}-${Random().nextInt(80) + 1}',
    );
    _eventBookings.insert(0, booking);
    return booking;
  }

  @override
  Future<List<RentalParking>> getRentalParkings({
    String? vehicleFilter,
    String? priceRangeFilter,
  }) async {
    await Future.delayed(const Duration(milliseconds: 150));
    var results = List<RentalParking>.from(MockDataService.rentalParkings);

    // Apply vehicle filter
    if (vehicleFilter != null && vehicleFilter != 'All') {
      results = results.where((item) => item.vehicleType.toLowerCase() == vehicleFilter.toLowerCase()).toList();
    }

    // Apply price range filter: '₹100–₹200', '₹200–₹350', '₹350–₹550', 'All'
    if (priceRangeFilter != null && priceRangeFilter != 'All' && priceRangeFilter != 'Custom/All') {
      if (priceRangeFilter.contains('100') && priceRangeFilter.contains('200')) {
        results = results.where((item) => item.pricePerHour >= 100 && item.pricePerHour <= 200).toList();
      } else if (priceRangeFilter.contains('200') && priceRangeFilter.contains('350')) {
        results = results.where((item) => item.pricePerHour > 200 && item.pricePerHour <= 350).toList();
      } else if (priceRangeFilter.contains('350') && priceRangeFilter.contains('550')) {
        results = results.where((item) => item.pricePerHour > 350 && item.pricePerHour <= 550).toList();
      }
    }

    return results;
  }

  @override
  Future<RentalParkingBooking> bookRentalParking({
    required RentalParking rentalSpot,
    required int hours,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final total = rentalSpot.pricePerHour * hours;
    final randomCode = 1000 + Random().nextInt(9000);
    final booking = RentalParkingBooking(
      bookingId: 'RNT-$randomCode',
      rentalSpotId: rentalSpot.id,
      rentalSpotName: rentalSpot.name,
      vehicleType: rentalSpot.vehicleType,
      durationHours: hours,
      hourlyRate: rentalSpot.pricePerHour,
      totalAmount: total,
      bookingRef: 'RNT-WAN-$randomCode',
      timestamp: DateTime.now(),
    );
    _rentalBookings.insert(0, booking);
    return booking;
  }

  @override
  List<EventParkingBooking> getEventBookings() => List.unmodifiable(_eventBookings);

  @override
  List<RentalParkingBooking> getRentalBookings() => List.unmodifiable(_rentalBookings);
}
