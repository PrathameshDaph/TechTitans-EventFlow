import 'food.dart';

class OrderItem {
  final FoodItem foodItem;
  int quantity;

  OrderItem({
    required this.foodItem,
    required this.quantity,
  });

  double get totalPrice => foodItem.price * quantity;
}

class FoodOrder {
  final String orderId;
  final String orderType; // 'BOOK_NOW' or 'QUICK_BUY'
  final List<OrderItem> items;
  final String pickupServingTime;
  final double totalAmount;
  final String status;
  final String pickupCounter;
  final DateTime timestamp;
  final String referenceCode;

  const FoodOrder({
    required this.orderId,
    required this.orderType,
    required this.items,
    required this.pickupServingTime,
    required this.totalAmount,
    required this.status,
    required this.pickupCounter,
    required this.timestamp,
    required this.referenceCode,
  });

  int get totalItemCount => items.fold(0, (sum, item) => sum + item.quantity);
}
