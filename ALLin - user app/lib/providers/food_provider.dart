import 'package:flutter/foundation.dart';
import '../models/food.dart';
import '../models/order.dart';
import '../repositories/food_repository.dart';

class FoodProvider extends ChangeNotifier {
  final FoodRepository repository;

  List<FoodItem> _allFoodItems = [];
  bool? _vegFilter; // null = all, true = veg, false = non-veg
  List<String> _pickupSlots = [];
  String _selectedPickupSlot = '7:45 PM (Innings Break)';
  final Map<String, int> _cart = {}; // foodId -> quantity
  bool _isLoading = false;

  FoodProvider({required this.repository}) {
    _init();
  }

  bool? get vegFilter => _vegFilter;
  List<String> get pickupSlots => _pickupSlots;
  String get selectedPickupSlot => _selectedPickupSlot;
  bool get isLoading => _isLoading;
  Map<String, int> get cart => _cart;

  List<FoodItem> get filteredFoodItems {
    if (_vegFilter == null) return _allFoodItems;
    return _allFoodItems.where((item) => item.isVeg == _vegFilter).toList();
  }

  List<OrderItem> get cartOrderItems {
    final List<OrderItem> items = [];
    _cart.forEach((foodId, qty) {
      if (qty > 0) {
        final food = _allFoodItems.firstWhere((f) => f.id == foodId);
        items.add(OrderItem(foodItem: food, quantity: qty));
      }
    });
    return items;
  }

  int get totalCartCount => _cart.values.fold(0, (sum, q) => sum + q);

  double get totalCartPrice {
    double total = 0.0;
    _cart.forEach((foodId, qty) {
      if (qty > 0) {
        final food = _allFoodItems.firstWhere((f) => f.id == foodId);
        total += food.price * qty;
      }
    });
    return total;
  }

  List<FoodOrder> get orderHistory => repository.getOrderHistory();

  Future<void> _init() async {
    _isLoading = true;
    notifyListeners();
    _allFoodItems = await repository.getFoodItems();
    _pickupSlots = await repository.getPickupTimeSlots();
    if (_pickupSlots.isNotEmpty) {
      _selectedPickupSlot = _pickupSlots[2]; // Default to Innings Break
    }
    _isLoading = false;
    notifyListeners();
  }

  void setVegFilter(bool? isVeg) {
    _vegFilter = isVeg;
    notifyListeners();
  }

  void setSelectedPickupSlot(String slot) {
    _selectedPickupSlot = slot;
    notifyListeners();
  }

  void addItem(FoodItem item) {
    _cart[item.id] = (_cart[item.id] ?? 0) + 1;
    notifyListeners();
  }

  void removeItem(FoodItem item) {
    if (_cart.containsKey(item.id) && _cart[item.id]! > 0) {
      _cart[item.id] = _cart[item.id]! - 1;
      if (_cart[item.id] == 0) {
        _cart.remove(item.id);
      }
      notifyListeners();
    }
  }

  int getItemQuantity(String foodId) {
    return _cart[foodId] ?? 0;
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }

  Future<FoodOrder> placeOrder({
    required String orderType,
    required String userBlock,
    String? customPickupTime,
  }) async {
    final order = await repository.placeOrder(
      orderType: orderType,
      items: cartOrderItems,
      pickupServingTime: customPickupTime ?? _selectedPickupSlot,
      userBlock: userBlock,
    );
    clearCart();
    notifyListeners();
    return order;
  }
}
