import 'dart:math';
import '../models/food.dart';
import '../models/order.dart';
import '../services/mock_data_service.dart';

abstract class FoodRepository {
  Future<List<FoodItem>> getFoodItems({bool? isVegFilter});
  Future<List<String>> getPickupTimeSlots();
  Future<FoodOrder> placeOrder({
    required String orderType, // 'BOOK_NOW' or 'QUICK_BUY'
    required List<OrderItem> items,
    required String pickupServingTime,
    required String userBlock,
  });
  List<FoodOrder> getOrderHistory();
}

class MockFoodRepository implements FoodRepository {
  final List<FoodOrder> _orders = [];

  @override
  Future<List<FoodItem>> getFoodItems({bool? isVegFilter}) async {
    await Future.delayed(const Duration(milliseconds: 100));
    if (isVegFilter == null) {
      return MockDataService.foodItems;
    }
    return MockDataService.foodItems.where((item) => item.isVeg == isVegFilter).toList();
  }

  @override
  Future<List<String>> getPickupTimeSlots() async {
    return MockDataService.pickupTimeSlots;
  }

  @override
  Future<FoodOrder> placeOrder({
    required String orderType,
    required List<OrderItem> items,
    required String pickupServingTime,
    required String userBlock,
  }) async {
    await Future.delayed(const Duration(milliseconds: 350));
    final double total = items.fold(0.0, (sum, i) => sum + i.totalPrice);
    final randomNum = 1000 + Random().nextInt(9000);
    final isQuick = orderType == 'QUICK_BUY';
    final counter = isQuick
        ? '$userBlock Express Kiosk (Counter 5A - In-Seat Dispatch)'
        : '$userBlock Main Concourse (Counter 3 - Pre-Order Pickup)';

    final order = FoodOrder(
      orderId: 'ALLIN-FD-$randomNum',
      orderType: orderType,
      items: List.from(items),
      pickupServingTime: pickupServingTime,
      totalAmount: total,
      status: isQuick ? 'Confirmed • Preparing for In-Seat/Express Pickup' : 'Accepted • Scheduled for Pickup',
      pickupCounter: counter,
      timestamp: DateTime.now(),
      referenceCode: 'FD-${Random().nextInt(899) + 100}',
    );

    _orders.insert(0, order);
    return order;
  }

  @override
  List<FoodOrder> getOrderHistory() => List.unmodifiable(_orders);
}
