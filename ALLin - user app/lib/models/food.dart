class FoodItem {
  final String id;
  final String name;
  final String description;
  final bool isVeg;
  final double price;
  final String availableTime;
  final String category;
  final String preparationTime;

  const FoodItem({
    required this.id,
    required this.name,
    required this.description,
    required this.isVeg,
    required this.price,
    required this.availableTime,
    required this.category,
    this.preparationTime = '10-15 mins',
  });
}
