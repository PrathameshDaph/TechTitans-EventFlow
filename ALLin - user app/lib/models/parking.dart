class EventParkingBooking {
  final String bookingId;
  final String block;
  final String vehicleType;
  final int durationHours;
  final double hourlyRate;
  final double totalAmount;
  final String bookingRef;
  final DateTime timestamp;
  final String allocatedSlot;

  const EventParkingBooking({
    required this.bookingId,
    required this.block,
    required this.vehicleType,
    required this.durationHours,
    required this.hourlyRate,
    required this.totalAmount,
    required this.bookingRef,
    required this.timestamp,
    required this.allocatedSlot,
  });
}

class RentalParking {
  final String id;
  final String name;
  final String address;
  final String owner;
  final String vehicleType; // 'Bike' or 'Car'
  final double pricePerHour;
  final int availableSlots;
  final int totalSlots;
  final int distanceMeters;
  final String description;
  final String features;

  const RentalParking({
    required this.id,
    required this.name,
    required this.address,
    required this.owner,
    required this.vehicleType,
    required this.pricePerHour,
    required this.availableSlots,
    required this.totalSlots,
    required this.distanceMeters,
    required this.description,
    required this.features,
  });
}

class RentalParkingBooking {
  final String bookingId;
  final String rentalSpotId;
  final String rentalSpotName;
  final String vehicleType;
  final int durationHours;
  final double hourlyRate;
  final double totalAmount;
  final String bookingRef;
  final DateTime timestamp;

  const RentalParkingBooking({
    required this.bookingId,
    required this.rentalSpotId,
    required this.rentalSpotName,
    required this.vehicleType,
    required this.durationHours,
    required this.hourlyRate,
    required this.totalAmount,
    required this.bookingRef,
    required this.timestamp,
  });
}
