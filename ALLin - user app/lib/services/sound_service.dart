import 'package:flutter/services.dart';

/// SoundService handles notification arrival tones and delete/discard pop sounds.
/// Uses Flutter's SystemSound and HapticFeedback to provide a native,
/// fail-safe, crash-proof audio-tactile response across all platforms.
class SoundService {
  SoundService._();

  /// Plays a professional, short notification alert tone for newly arrived alerts.
  static Future<void> playNotificationSound() async {
    try {
      await SystemSound.play(SystemSoundType.alert);
      await HapticFeedback.mediumImpact();
    } catch (_) {
      // Gracefully ignore audio subsystem or platform errors to prevent any crash
    }
  }

  /// Plays a subtle, short pop/click discard sound when a notification is dismissed.
  static Future<void> playDeleteSound() async {
    try {
      await SystemSound.play(SystemSoundType.click);
      await HapticFeedback.lightImpact();
    } catch (_) {
      // Gracefully ignore audio subsystem or platform errors to prevent any crash
    }
  }
}
