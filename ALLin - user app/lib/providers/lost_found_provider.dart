import 'package:flutter/foundation.dart';
import '../models/lost_found_item.dart';
import '../repositories/lost_found_repository.dart';

class LostFoundProvider extends ChangeNotifier {
  final LostFoundRepository repository;
  bool _isSubmitting = false;

  LostFoundProvider({required this.repository});

  bool get isSubmitting => _isSubmitting;
  List<LostFoundItem> get reportedItems => repository.getReportedItems();

  Future<LostFoundItem> reportItem({
    required String description,
    required String block,
    required String contactNumber,
    required String additionalDetails,
    required String photoAsset,
    String? category,
    String? photoPath,
    String? photoName,
    String? finderUserId,
    String? finderName,
    String? eventName,
  }) async {
    _isSubmitting = true;
    notifyListeners();

    try {
      final item = await repository.reportFoundItem(
        description: description,
        block: block,
        contactNumber: contactNumber,
        additionalDetails: additionalDetails,
        photoAsset: photoAsset,
        category: category,
        photoPath: photoPath,
        photoName: photoName,
        finderUserId: finderUserId,
        finderName: finderName,
        eventName: eventName,
      );

      _isSubmitting = false;
      notifyListeners();
      return item;
    } catch (e) {
      _isSubmitting = false;
      notifyListeners();
      rethrow;
    }
  }
}
