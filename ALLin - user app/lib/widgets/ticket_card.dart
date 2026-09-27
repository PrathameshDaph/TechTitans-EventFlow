import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../models/ticket.dart';
import '../theme/app_theme.dart';

class TicketCard extends StatelessWidget {
  final Ticket ticket;

  const TicketCard({super.key, required this.ticket});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.coffeeDark.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
        border: Border.all(color: AppTheme.creamBorder, width: 1.2),
      ),
      child: Column(
        children: [
          // Top Ticket Header (Coffee Brown Banner)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            decoration: const BoxDecoration(
              color: AppTheme.coffeeBrown,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(19),
                topRight: Radius.circular(19),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppTheme.caramel,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'OFFICIAL PASS',
                    style: GoogleFonts.outfit(
                      color: AppTheme.coffeeDark,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
                Flexible(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.verified_rounded, color: AppTheme.caramel, size: 14),
                      const SizedBox(width: 4),
                      Flexible(
                        child: Text(
                          'CONFIRMED ENTRY',
                          style: GoogleFonts.outfit(
                            color: AppTheme.creamText,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.5,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Event & Visitor Details
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ticket.eventTitle,
                            style: GoogleFonts.outfit(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'ICC Cricket Match Day Special',
                            style: GoogleFonts.outfit(
                              fontSize: 13,
                              color: AppTheme.textMedium,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.creamBackground,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.creamBorder),
                      ),
                      child: const Icon(
                        Icons.sports_cricket_rounded,
                        color: AppTheme.coffeeBrown,
                        size: 26,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // Visitor & Venue Row
                Row(
                  children: [
                    Expanded(
                      child: _buildInfoItem(
                        label: 'VISITOR NAME',
                        value: ticket.visitorName,
                        isBold: true,
                      ),
                    ),
                    Expanded(
                      child: _buildInfoItem(
                        label: 'VENUE',
                        value: ticket.stadiumName,
                        isBold: true,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Date & Category Row
                Row(
                  children: [
                    Expanded(
                      child: _buildInfoItem(
                        label: 'DATE & TIMING',
                        value: 'Today • 5:00 PM – 11:00 PM',
                      ),
                    ),
                    Expanded(
                      child: _buildInfoItem(
                        label: 'STAND CATEGORY',
                        value: ticket.category,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Block, Row, Seat & Gate Highlight Container
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: Row(
                    children: [
                      Expanded(child: _buildSeatBadge('BLOCK', ticket.block, isPrimary: true)),
                      Container(width: 1, height: 28, color: AppTheme.creamBorder),
                      Expanded(child: _buildSeatBadge('ROW', ticket.row)),
                      Container(width: 1, height: 28, color: AppTheme.creamBorder),
                      Expanded(child: _buildSeatBadge('SEAT', ticket.seat)),
                      Container(width: 1, height: 28, color: AppTheme.creamBorder),
                      Expanded(child: _buildSeatBadge('GATE', ticket.gate.split('(').first.trim())),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Perforated Divider with Side Notches
          _buildPerforatedDivider(context),

          // Bottom Ticket Section: QR Code & Ticket ID
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.coffeeBrown, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.coffeeBrown.withOpacity(0.06),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: QrImageView(
                        data: ticket.qrPayload,
                        version: QrVersions.auto,
                        size: 140,
                        backgroundColor: Colors.white,
                        eyeStyle: const QrEyeStyle(
                          eyeShape: QrEyeShape.square,
                          color: AppTheme.coffeeDark,
                        ),
                        dataModuleStyle: const QrDataModuleStyle(
                          dataModuleShape: QrDataModuleShape.square,
                          color: AppTheme.coffeeDark,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.successBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.successGreen.withOpacity(0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppTheme.successGreen,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Scan at Entry',
                        style: GoogleFonts.outfit(
                          color: AppTheme.successGreen,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'TICKET ID: ${ticket.ticketId}',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textMedium,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Please keep this screen ready at ${ticket.gate}',
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    color: AppTheme.textMuted,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem({
    required String label,
    required String value,
    bool isBold = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: AppTheme.textMuted,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: GoogleFonts.outfit(
            fontSize: 13,
            fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
            color: AppTheme.textDark,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }

  Widget _buildSeatBadge(String label, String value, {bool isPrimary = false}) {
    return Column(
      children: [
        Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 9,
            fontWeight: FontWeight.w700,
            color: AppTheme.textMuted,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: GoogleFonts.outfit(
            fontSize: 14,
            fontWeight: FontWeight.w800,
            color: isPrimary ? AppTheme.coffeeBrown : AppTheme.textDark,
          ),
        ),
      ],
    );
  }

  Widget _buildPerforatedDivider(BuildContext context) {
    return Row(
      children: [
        // Left semicircular notch
        Container(
          width: 14,
          height: 28,
          decoration: const BoxDecoration(
            color: AppTheme.creamBackground,
            borderRadius: BorderRadius.only(
              topRight: Radius.circular(14),
              bottomRight: Radius.circular(14),
            ),
          ),
        ),
        // Dashed horizontal line
        Expanded(
          child: LayoutBuilder(
            builder: (context, constraints) {
              const dashWidth = 6.0;
              const dashSpace = 4.0;
              final count = (constraints.maxWidth / (dashWidth + dashSpace)).floor();
              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(count, (_) {
                  return Container(
                    width: dashWidth,
                    height: 1.5,
                    color: AppTheme.creamBorder,
                  );
                }),
              );
            },
          ),
        ),
        // Right semicircular notch
        Container(
          width: 14,
          height: 28,
          decoration: const BoxDecoration(
            color: AppTheme.creamBackground,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(14),
              bottomLeft: Radius.circular(14),
            ),
          ),
        ),
      ],
    );
  }
}
