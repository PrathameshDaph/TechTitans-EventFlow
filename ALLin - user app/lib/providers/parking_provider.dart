import 'package:flutter/foundation.dart';
import '../models/parking.dart';
import '../repositories/parking_repository.dart';

class ParkingProvider extends ChangeNotifier {
  final ParkingRepository repository;

  // Event Parking Form State
  String _selectedBlock = 'Block 5';
  String _selectedVehicle = 'Bike';
  int _eventHours = 4;
  bool _isBookingEvent = false;

  // Rental Parking Filter State
  String _rentalVehicleFilter = 'All';
  String _rentalPriceFilter = 'All';
  List<RentalParking> _rentalParkings = [];
  bool _isLoadingRentals = false;

  ParkingProvider({required this.repository}) {
    loadRentalParkings();
  }

  String get selectedBlock => _selectedBlock;
  String get selectedVehicle => _selectedVehicle;
  int get eventHours => _eventHours;
  bool get isBookingEvent => _isBookingEvent;

  String get rentalVehicleFilter => _rentalVehicleFilter;
  String get rentalPriceFilter => _rentalPriceFilter;
  List<RentalParking> get rentalParkings => _rentalParkings;
  bool get isLoadingRentals => _isLoadingRentals;

  List<EventParkingBooking> get eventBookings => repository.getEventBookings();
  List<RentalParkingBooking> get rentalBookings => repository.getRentalBookings();

  double get eventRatePerHour {
    switch (_selectedVehicle) {
      case 'Bike':
        return 250.0;
      case 'Car Cruiser':
        return 350.0;
      case 'Car XYZ':
        return 450.0;
      case 'Premium SUV':
        return 500.0;
      default:
        return 250.0;
    }
  }

  double get eventTotalAmount => eventRatePerHour * _eventHours;

  void setSelectedBlock(String block) {
    _selectedBlock = block;
    notifyListeners();
  }

  void setSelectedVehicle(String vehicle) {
    _selectedVehicle = vehicle;
    notifyListeners();
  }

  void setEventHours(int hours) {
    _eventHours = hours;
    notifyListeners();
  }

  void setRentalVehicleFilter(String filter) {
    _rentalVehicleFilter = filter;
    loadRentalParkings();
  }

  void setRentalPriceFilter(String filter) {
    _rentalPriceFilter = filter;
    loadRentalParkings();
  }

  Future<void> loadRentalParkings() async {
    _isLoadingRentals = true;
    notifyListeners();

    _rentalParkings = await repository.getRentalParkings(
      vehicleFilter: _rentalVehicleFilter,
      priceRangeFilter: _rentalPriceFilter,
    );
    _isLoadingRentals = false;
    notifyListeners();
  }

  Future<EventParkingBooking> bookEventParking() async {
    _isBookingEvent = true;
    notifyListeners();

    final booking = await repository.bookEventParking(
      block: _selectedBlock,
      vehicleType: _selectedVehicle,
      hours: _eventHours,
    );

    _isBookingEvent = false;
    notifyListeners();
    return booking;
  }

  Future<RentalParkingBooking> bookRentalParking(RentalParking spot, int hours) async {
    final booking = await repository.bookRentalParking(
      rentalSpot: spot,
      hours: hours,
    );
    notifyListeners();
    return booking;
  }
}
