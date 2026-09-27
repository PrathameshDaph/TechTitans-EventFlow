import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'site_plan_data.dart';

class SitePlanPainter extends CustomPainter {
  final String? selectedBlockId;
  final String userAssignedBlock;
  final List<String> alertBlockIds;

  SitePlanPainter({
    required this.selectedBlockId,
    required this.userAssignedBlock,
    required this.alertBlockIds,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Background fill
    final bgPaint = Paint()..color = const Color(0xFFF9F7F1);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), bgPaint);

    // 1. Draw outer peripheral roads
    _drawPeripheralRoads(canvas, size);

    // 2. Draw outer border with coordinate marks
    _drawOuterBorderAndCoordinates(canvas, size);

    // 3. Draw perimeter boundary wall
    _drawPerimeterBoundary(canvas, size);

    // 4. Draw internal concourse pathways
    _drawConcoursePathways(canvas, size);

    // 5. Draw Central Wankhede Stadium Bowl & Seating
    _drawWankhedeStadium(canvas, size);

    // 6. Draw surrounding functional blocks
    _drawSiteBlocks(canvas, size);

    // 7. Draw Cartographic North Arrow
    _drawNorthCompass(canvas, const Offset(785, 78));

    // 8. Draw Metric Scale Bar
    _drawScaleBar(canvas, const Offset(65, 570));

    // 9. Draw Map Title Header
    _drawMapHeader(canvas, size);
  }

  void _drawPeripheralRoads(Canvas canvas, Size size) {
    final roadPaint = Paint()
      ..color = const Color(0xFFE2DFD9)
      ..style = PaintingStyle.fill;

    final roadBorderPaint = Paint()
      ..color = const Color(0xFFBDB9B0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    // West Road: D ROAD / MARINE DRIVE
    final westRoad = Rect.fromLTWH(6, 45, 34, size.height - 85);
    canvas.drawRect(westRoad, roadPaint);
    canvas.drawRect(westRoad, roadBorderPaint);
    _drawVerticalText(canvas, 'D ROAD / MARINE DRIVE', const Offset(23, 310), isUpward: true);

    // East Road: E ROAD / VINOOD HINDOOCHA MARG
    final eastRoad = Rect.fromLTWH(size.width - 40, 45, 34, size.height - 85);
    canvas.drawRect(eastRoad, roadPaint);
    canvas.drawRect(eastRoad, roadBorderPaint);
    _drawVerticalText(canvas, 'E ROAD / VINOOD HINDOOCHA MARG', Offset(size.width - 23, 310), isUpward: false);

    // North Road: H ROAD / CHURCHGATE LINK
    final northRoad = Rect.fromLTWH(42, 6, size.width - 84, 28);
    canvas.drawRect(northRoad, roadPaint);
    canvas.drawRect(northRoad, roadBorderPaint);
    _drawHorizontalText(canvas, 'H ROAD  ◄  CHURCHGATE LINK  ►', Offset(size.width / 2, 20), 10, FontWeight.w700);

    // South Road: AIR INDIA MARG
    final southRoad = Rect.fromLTWH(42, size.height - 34, size.width - 84, 28);
    canvas.drawRect(southRoad, roadPaint);
    canvas.drawRect(southRoad, roadBorderPaint);
    _drawHorizontalText(canvas, 'AIR INDIA MARG  ◄  SOUTH CONCOURSE LINK  ►', Offset(size.width / 2, size.height - 20), 10, FontWeight.w700);
  }

  void _drawOuterBorderAndCoordinates(Canvas canvas, Size size) {
    final outerFrame = Rect.fromLTWH(40, 36, size.width - 80, size.height - 72);
    final borderPaint = Paint()
      ..color = const Color(0xFF26150B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    canvas.drawRect(outerFrame, borderPaint);

    final innerFrame = Rect.fromLTWH(44, 40, size.width - 88, size.height - 80);
    final innerPaint = Paint()
      ..color = const Color(0xFF5D4037)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.8;
    canvas.drawRect(innerFrame, innerPaint);

    // Coordinate markers
    _drawCoordinateText(canvas, '18°56\'15"N', Offset(size.width * 0.28, 41));
    _drawCoordinateText(canvas, '18°56\'20"N', Offset(size.width * 0.72, 41));
    _drawCoordinateText(canvas, '18°56\'10"N', Offset(size.width * 0.28, size.height - 43));
    _drawCoordinateText(canvas, '18°56\'05"N', Offset(size.width * 0.72, size.height - 43));
  }

  void _drawPerimeterBoundary(Canvas canvas, Size size) {
    final boundaryPath = Path()
      ..moveTo(52, 48)
      ..lineTo(size.width - 52, 48)
      ..lineTo(size.width - 52, size.height - 48)
      ..lineTo(52, size.height - 48)
      ..close();

    final dashPaint = Paint()
      ..color = const Color(0xFF8D6E63)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.4;

    _drawDashedPath(canvas, boundaryPath, dashPaint, [6, 4]);
  }

  void _drawConcoursePathways(Canvas canvas, Size size) {
    final pathPaint = Paint()
      ..color = const Color(0xFFEDE4D3)
      ..style = PaintingStyle.fill;

    // Concourse Ring connecting the central stadium to gates and east buildings
    final stadiumCenter = const Offset(260, 290);
    canvas.drawOval(
      Rect.fromCenter(center: stadiumCenter, width: 380, height: 340),
      pathPaint,
    );

    // Concourse avenues linking eastward
    canvas.drawRRect(
      RRect.fromRectAndRadius(const Rect.fromLTWH(390, 140, 310, 360), const Radius.circular(16)),
      pathPaint,
    );

    // Gate entry paths
    canvas.drawRect(const Rect.fromLTWH(50, 260, 70, 36), pathPaint); // West Gate 1
    canvas.drawRect(const Rect.fromLTWH(230, 48, 60, 70), pathPaint); // North Gate 2
    canvas.drawRect(const Rect.fromLTWH(380, 260, 70, 36), pathPaint); // East Gate 3
    canvas.drawRect(const Rect.fromLTWH(230, 460, 60, 70), pathPaint); // South Gate 4
  }

  void _drawWankhedeStadium(Canvas canvas, Size size) {
    final center = const Offset(260, 290);

    // 1. Stadium Outer Shell
    final outerOval = Rect.fromCenter(center: center, width: 330, height: 290);
    final shellPaint = Paint()
      ..color = const Color(0xFFE8EEF5)
      ..style = PaintingStyle.fill;
    canvas.drawOval(outerOval, shellPaint);

    final shellBorder = Paint()
      ..color = const Color(0xFF1E3A8A)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawOval(outerOval, shellBorder);

    // 2. Seating Bowl Background Ring
    final bowlOval = Rect.fromCenter(center: center, width: 270, height: 230);
    final bowlPaint = Paint()
      ..color = const Color(0xFFDCEAF7)
      ..style = PaintingStyle.fill;
    canvas.drawOval(bowlOval, bowlPaint);

    // 3. Central Cricket Pitch Grass Field
    final fieldOval = Rect.fromCenter(center: center, width: 170, height: 140);
    final grassPaint = Paint()
      ..color = const Color(0xFF7CB342)
      ..style = PaintingStyle.fill;
    canvas.drawOval(fieldOval, grassPaint);

    final fieldBorder = Paint()
      ..color = const Color(0xFF558B2F)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawOval(fieldOval, fieldBorder);

    // Turf stripe pattern
    final turfPaint = Paint()
      ..color = const Color(0xFF689F38).withOpacity(0.35)
      ..style = PaintingStyle.fill;
    for (double y = center.dy - 55; y <= center.dy + 45; y += 18) {
      canvas.drawRect(Rect.fromLTWH(center.dx - 70, y, 140, 9), turfPaint);
    }

    // Cricket Pitch Strip
    final pitchRect = Rect.fromCenter(center: center, width: 28, height: 58);
    final pitchPaint = Paint()
      ..color = const Color(0xFFD7CCC8)
      ..style = PaintingStyle.fill;
    canvas.drawRect(pitchRect, pitchPaint);

    final pitchBorder = Paint()
      ..color = const Color(0xFF8D6E63)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
    canvas.drawRect(pitchRect, pitchBorder);

    // Bowling creases
    final creasePaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;
    canvas.drawLine(Offset(center.dx - 12, center.dy - 24), Offset(center.dx + 12, center.dy - 24), creasePaint);
    canvas.drawLine(Offset(center.dx - 12, center.dy + 24), Offset(center.dx + 12, center.dy + 24), creasePaint);

    // Center pitch labels (Required by verification tests)
    _drawPitchLabel(canvas, 'WANKHEDE', center - const Offset(0, 16));
    _drawPitchLabel(canvas, 'STADIUM', center + const Offset(0, 2));
    _drawPitchSubLabel(canvas, 'CENTRAL PITCH', center + const Offset(0, 18));
  }

  void _drawSiteBlocks(Canvas canvas, Size size) {
    for (final block in SitePlanData.blocks) {
      final isSelected = selectedBlockId == block.id ||
          (selectedBlockId != null && block.name.toLowerCase().contains(selectedBlockId!.toLowerCase()));
      final isUserStand = userAssignedBlock.toLowerCase().contains(block.keyNumber) && block.category == SiteCategory.stadium;
      final hasAlert = alertBlockIds.any((a) => block.name.toLowerCase().contains(a.toLowerCase()) || block.id.contains(a.toLowerCase()));

      // Draw Block Container
      final rrect = RRect.fromRectAndRadius(block.bounds, const Radius.circular(7));

      final fillPaint = Paint()
        ..color = isSelected
            ? const Color(0xFFFFF176) // Bright highlight for selected
            : isUserStand
                ? const Color(0xFF42A5F5)
                : block.fillColor
        ..style = PaintingStyle.fill;

      canvas.drawRRect(rrect, fillPaint);

      // Stroke
      final strokePaint = Paint()
        ..color = isSelected
            ? const Color(0xFFE65100)
            : isUserStand
                ? const Color(0xFF0D47A1)
                : block.strokeColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = isSelected || isUserStand ? 2.2 : 1.2;

      canvas.drawRRect(rrect, strokePaint);

      // Draw key badge & readable text inside block
      _drawBlockContent(canvas, block, isSelected, isUserStand, hasAlert);
    }
  }

  void _drawBlockContent(Canvas canvas, SitePlanBlock block, bool isSelected, bool isUserStand, bool hasAlert) {
    final b = block.bounds;

    // Number circle badge
    final badgeCenter = Offset(b.left + 12, b.top + 12);
    final badgePaint = Paint()
      ..color = block.strokeColor
      ..style = PaintingStyle.fill;
    canvas.drawCircle(badgeCenter, 7.5, badgePaint);

    final badgeText = TextPainter(
      text: TextSpan(
        text: block.keyNumber,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 8.5,
          fontWeight: FontWeight.w800,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    badgeText.paint(canvas, badgeCenter - Offset(badgeText.width / 2, badgeText.height / 2));

    // Stand / Block Name Text
    final textColor = isUserStand ? const Color(0xFF0D47A1) : const Color(0xFF26150B);
    final textPainter = TextPainter(
      text: TextSpan(
        text: block.shortLabel,
        style: TextStyle(
          color: textColor,
          fontSize: b.height < 45 ? 9.0 : 10.0,
          fontWeight: isUserStand || isSelected ? FontWeight.w800 : FontWeight.w700,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 2,
    )..layout(maxWidth: b.width - 24);

    textPainter.paint(canvas, Offset(b.left + 22, b.top + 6));

    // Optional second line for stands
    if (b.height >= 48) {
      String subtitle = '';
      if (block.keyNumber == '1') subtitle = 'Gavaskar Stand';
      if (block.keyNumber == '3') subtitle = 'Tendulkar Stand';
      if (block.keyNumber == '5') subtitle = '★ YOUR STAND';
      if (block.keyNumber == '7') subtitle = 'Merchant Stand';
      if (block.keyNumber == '11') subtitle = 'Food Court';
      if (block.keyNumber == '13') subtitle = 'Official VIP';
      if (block.keyNumber == '15') subtitle = 'Metro Hub';
      if (block.keyNumber == '17') subtitle = 'First Aid';

      if (subtitle.isNotEmpty) {
        final subPainter = TextPainter(
          text: TextSpan(
            text: subtitle,
            style: TextStyle(
              color: isUserStand ? const Color(0xFF0D47A1) : const Color(0xFF5D4037),
              fontSize: 7.5,
              fontWeight: isUserStand ? FontWeight.w800 : FontWeight.w600,
              fontFamily: 'Outfit',
            ),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        subPainter.paint(canvas, Offset(b.left + 8, b.bottom - 13));
      }
    }

    // Active alert dot indicator
    if (hasAlert) {
      final alertCenter = Offset(b.right - 9, b.top + 9);
      final alertPaint = Paint()
        ..color = const Color(0xFFD32F2F)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(alertCenter, 6, alertPaint);

      final alertBorder = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5;
      canvas.drawCircle(alertCenter, 6, alertBorder);
    }
  }

  void _drawNorthCompass(Canvas canvas, Offset center) {
    final armLength = 22.0;

    final northPath = Path()
      ..moveTo(center.dx, center.dy - armLength)
      ..lineTo(center.dx - 5, center.dy)
      ..lineTo(center.dx, center.dy - 3)
      ..close();

    final northPaint = Paint()
      ..color = const Color(0xFF26150B)
      ..style = PaintingStyle.fill;
    canvas.drawPath(northPath, northPaint);

    final southPath = Path()
      ..moveTo(center.dx, center.dy + armLength)
      ..lineTo(center.dx + 5, center.dy)
      ..lineTo(center.dx, center.dy + 3)
      ..close();

    final southPaint = Paint()
      ..color = const Color(0xFF8D6E63)
      ..style = PaintingStyle.fill;
    canvas.drawPath(southPath, southPaint);

    // East / West
    final eastWestPaint = Paint()
      ..color = const Color(0xFF5D4037)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
    canvas.drawLine(center - const Offset(14, 0), center + const Offset(14, 0), eastWestPaint);

    // "N" Label
    final nPainter = TextPainter(
      text: const TextSpan(
        text: 'N',
        style: TextStyle(
          color: Color(0xFF26150B),
          fontSize: 12,
          fontWeight: FontWeight.w900,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    nPainter.paint(canvas, center - Offset(nPainter.width / 2, armLength + 14));
  }

  void _drawScaleBar(Canvas canvas, Offset origin) {
    const double barHeight = 6.0;
    const double segmentWidth = 24.0;

    final blackPaint = Paint()..color = const Color(0xFF26150B);
    final whitePaint = Paint()..color = Colors.white;
    final strokePaint = Paint()
      ..color = const Color(0xFF26150B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    for (int i = 0; i < 4; i++) {
      final rect = Rect.fromLTWH(origin.dx + (i * segmentWidth), origin.dy, segmentWidth, barHeight);
      canvas.drawRect(rect, i % 2 == 0 ? blackPaint : whitePaint);
      canvas.drawRect(rect, strokePaint);
    }

    // Scale tick numbers
    _drawScaleText(canvas, '0', origin + const Offset(0, -11));
    _drawScaleText(canvas, '25', origin + const Offset(segmentWidth, -11));
    _drawScaleText(canvas, '50', origin + const Offset(segmentWidth * 2, -11));
    _drawScaleText(canvas, '75', origin + const Offset(segmentWidth * 3, -11));
    _drawScaleText(canvas, '100 Metre', origin + const Offset(segmentWidth * 4 + 8, -11));
  }

  void _drawMapHeader(Canvas canvas, Size size) {
    final titlePainter = TextPainter(
      text: const TextSpan(
        text: 'WANKHEDE STADIUM EVENT COMPLEX — SITE & VENUE PLAN',
        style: TextStyle(
          color: Color(0xFF26150B),
          fontSize: 13,
          fontWeight: FontWeight.w900,
          letterSpacing: 0.8,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();

    titlePainter.paint(canvas, const Offset(55, 48));
  }

  void _drawPitchLabel(Canvas canvas, String text, Offset center) {
    final p = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w900,
          letterSpacing: 1.2,
          fontFamily: 'Outfit',
          shadows: [
            Shadow(color: Colors.black45, blurRadius: 3, offset: Offset(0, 1)),
          ],
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    p.paint(canvas, center - Offset(p.width / 2, p.height / 2));
  }

  void _drawPitchSubLabel(Canvas canvas, String text, Offset center) {
    final p = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Color(0xFFF1F8E9),
          fontSize: 8,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.8,
          fontFamily: 'Outfit',
          shadows: [
            Shadow(color: Colors.black54, blurRadius: 2, offset: Offset(0, 1)),
          ],
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    p.paint(canvas, center - Offset(p.width / 2, p.height / 2));
  }

  void _drawScaleText(Canvas canvas, String text, Offset pos) {
    final p = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Color(0xFF3E2313),
          fontSize: 8.5,
          fontWeight: FontWeight.w700,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    p.paint(canvas, pos - Offset(p.width / 2, 0));
  }

  void _drawCoordinateText(Canvas canvas, String text, Offset pos) {
    final p = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Color(0xFF5D4037),
          fontSize: 8.5,
          fontWeight: FontWeight.w600,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    p.paint(canvas, pos - Offset(p.width / 2, p.height / 2));
  }

  void _drawHorizontalText(Canvas canvas, String text, Offset pos, double size, FontWeight weight) {
    final p = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          color: const Color(0xFF424242),
          fontSize: size,
          fontWeight: weight,
          letterSpacing: 1.0,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    p.paint(canvas, pos - Offset(p.width / 2, p.height / 2));
  }

  void _drawVerticalText(Canvas canvas, String text, Offset pos, {required bool isUpward}) {
    canvas.save();
    canvas.translate(pos.dx, pos.dy);
    canvas.rotate(isUpward ? -math.pi / 2 : math.pi / 2);

    final p = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Color(0xFF424242),
          fontSize: 9.5,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
          fontFamily: 'Outfit',
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    p.paint(canvas, Offset(-p.width / 2, -p.height / 2));
    canvas.restore();
  }

  void _drawDashedPath(Canvas canvas, Path path, Paint paint, List<double> dashPattern) {
    final metrics = path.computeMetrics();
    for (final metric in metrics) {
      double distance = 0.0;
      int patternIndex = 0;
      while (distance < metric.length) {
        final length = dashPattern[patternIndex];
        if (patternIndex % 2 == 0) {
          final extract = metric.extractPath(distance, distance + length);
          canvas.drawPath(extract, paint);
        }
        distance += length;
        patternIndex = (patternIndex + 1) % dashPattern.length;
      }
    }
  }

  @override
  bool shouldRepaint(covariant SitePlanPainter oldDelegate) {
    return oldDelegate.selectedBlockId != selectedBlockId ||
        oldDelegate.userAssignedBlock != userAssignedBlock ||
        oldDelegate.alertBlockIds != alertBlockIds;
  }
}
