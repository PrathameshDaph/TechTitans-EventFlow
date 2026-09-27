import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Palette: Coffee Brown + Cream + White
  static const Color coffeeDark = Color(0xFF23120B);      // Deep roasted coffee
  static const Color coffeeBrown = Color(0xFF3E2313);     // Signature coffee brown for headers
  static const Color coffeeMedium = Color(0xFF5D3924);    // Medium warm coffee
  static const Color coffeeLight = Color(0xFF8A5A3C);     // Muted coffee accent
  static const Color caramel = Color(0xFFC48B54);         // Warm golden caramel accent
  static const Color warmGold = Color(0xFFC48B54);        // Warm gold accent

  // Neutral Warm Palette
  static const Color creamBackground = Color(0xFFFAF7F2); // Warm cream content background
  static const Color creamCard = Color(0xFFFFFFFF);       // Crisp white cards
  static const Color creamBorder = Color(0xFFEFE6DC);     // Subtle cream divider & borders
  static const Color creamPill = Color(0xFFF3ECE3);       // Soft cream chips/pills
  static const Color creamText = Color(0xFFFFFBF5);       // White/cream for header text

  // Typography Palette
  static const Color textDark = Color(0xFF26150D);        // Primary text
  static const Color textMedium = Color(0xFF6B584E);      // Secondary / subtitle text
  static const Color textMuted = Color(0xFF9E8B81);       // Subtle helper text

  // Status & Functional Accents
  static const Color successGreen = Color(0xFF1E824C);    // Confirmed / active
  static const Color successBg = Color(0xFFE8F6ED);
  static const Color warningAmber = Color(0xFFD97706);    // Crowded / limited
  static const Color warningBg = Color(0xFFFEF3C7);
  static const Color alertRed = Color(0xFFDC2626);        // Urgent missing child / emergency
  static const Color alertBg = Color(0xFFFEE2E2);
  static const Color vegGreen = Color(0xFF15803D);        // Vegetarian indicator
  static const Color nonVegRed = Color(0xFFB91C1C);       // Non-vegetarian indicator

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: creamBackground,
      colorScheme: const ColorScheme.light(
        primary: coffeeBrown,
        onPrimary: creamText,
        secondary: caramel,
        onSecondary: coffeeDark,
        surface: creamCard,
        onSurface: textDark,
        error: alertRed,
        onError: Colors.white,
      ),
      textTheme: GoogleFonts.outfitTextTheme().copyWith(
        displayLarge: GoogleFonts.outfit(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          color: textDark,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.outfit(
          fontSize: 26,
          fontWeight: FontWeight.w700,
          color: textDark,
        ),
        titleLarge: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textDark,
        ),
        titleMedium: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textDark,
        ),
        bodyLarge: GoogleFonts.outfit(
          fontSize: 15,
          fontWeight: FontWeight.w400,
          color: textDark,
        ),
        bodyMedium: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: textMedium,
        ),
        bodySmall: GoogleFonts.outfit(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: textMuted,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: coffeeBrown,
        foregroundColor: creamText,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: creamCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: creamBorder, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: coffeeBrown,
          foregroundColor: creamText,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: coffeeBrown,
          side: const BorderSide(color: coffeeBrown, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: creamBorder, width: 1.2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: creamBorder, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: coffeeBrown, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: alertRed, width: 1.2),
        ),
        hintStyle: GoogleFonts.outfit(
          color: textMuted,
          fontSize: 14,
        ),
      ),
    );
  }
}
