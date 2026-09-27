import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../models/notification_item.dart';
import '../../providers/notification_provider.dart';

class NotificationsScreen extends StatefulWidget {
  final void Function(String block)? onNavigateToMapWithBlock;

  const NotificationsScreen({super.key, this.onNavigateToMapWithBlock});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  String _selectedFilter = 'All'; // 'All', 'Urgent Alerts', 'Gate & Venue', 'Parking & Food'

  @override
  Widget build(BuildContext context) {
    final notifProvider = context.watch<NotificationProvider>();
    final allNotifs = notifProvider.notifications;

    // Filter notifications
    final filtered = allNotifs.where((n) {
      if (_selectedFilter == 'Urgent Alerts') {
        return n.isMissingChild || n.type == NotificationType.missingChild || n.isManagerAlert;
      } else if (_selectedFilter == 'Gate & Venue') {
        return n.type == NotificationType.gateUpdate || n.type == NotificationType.venueInfo;
      } else if (_selectedFilter == 'Parking & Food') {
        return n.type == NotificationType.parkingUpdate || n.type == NotificationType.trafficAlert;
      }
      return true;
    }).toList();

    return Column(
      children: [
        // Top Filter Chips & Simulation Button Strip
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'NOTIFICATION CENTER',
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.coffeeBrown,
                        letterSpacing: 0.8,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (notifProvider.unreadCount > 0)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.warmGold.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.warmGold.withOpacity(0.4)),
                      ),
                      child: Text(
                        '${notifProvider.unreadCount} unread',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.coffeeBrown,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),

              // Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: ['All', 'Urgent Alerts', 'Gate & Venue', 'Parking & Food'].map((f) {
                    final isSel = _selectedFilter == f;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text(f),
                        selected: isSel,
                        onSelected: (_) => setState(() => _selectedFilter = f),
                        selectedColor: AppTheme.coffeeBrown,
                        backgroundColor: AppTheme.creamBackground,
                        labelStyle: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                          color: isSel ? AppTheme.creamText : AppTheme.textDark,
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        const Divider(color: AppTheme.creamBorder, height: 1),

        // Notification List
        Expanded(
          child: filtered.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.notifications_none_rounded, size: 48, color: AppTheme.textMuted),
                      const SizedBox(height: 10),
                      Text(
                        'No notifications in this view',
                        style: GoogleFonts.outfit(color: AppTheme.textMedium, fontSize: 14),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final item = filtered[index];
                    if (item.isMissingChild) {
                      return _buildMissingChildCard(item);
                    }
                    return _buildStandardNotificationCard(item);
                  },
                ),
        ),
      ],
    );
  }

  // -------------------------------------------------------------
  // MISSING CHILD NOTIFICATION CARD
  // -------------------------------------------------------------
  Widget _buildMissingChildCard(NotificationItem item) {
    final notifProvider = context.read<NotificationProvider>();

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.alertRed, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: AppTheme.alertRed.withOpacity(0.08),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Urgent Red Banner Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: const BoxDecoration(
              color: AppTheme.alertRed,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(18),
                topRight: Radius.circular(18),
              ),
            ),
            child: Row(
              children: [
                const Icon(Icons.warning_rounded, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'URGENT — MISSING CHILD',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: 0.8,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  item.timeAgo,
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
                const SizedBox(width: 8),
                // User-Side Delete Action
                InkWell(
                  onTap: () => notifProvider.deleteNotification(item.id),
                  child: const Icon(Icons.close, color: Colors.white, size: 18),
                ),
              ],
            ),
          ),

          // Child Details
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        color: AppTheme.alertBg,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.face_rounded, color: AppTheme.alertRed, size: 32),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.childName ?? 'Kabir',
                            style: GoogleFonts.outfit(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                            ),
                          ),
                          Text(
                            'Age: ${item.childAge ?? "6 years"}',
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.alertRed,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: Column(
                    children: [
                      _buildDetailRow('Last Seen', item.childLastSeen ?? 'Gate 2 Food Concourse'),
                      const SizedBox(height: 6),
                      _buildDetailRow('Reported Block', item.childReportedBlock ?? 'Block 5'),
                      const SizedBox(height: 6),
                      _buildDetailRow('Description', item.childDescription ?? 'Yellow T-shirt, blue denim shorts.'),
                      const SizedBox(height: 6),
                      _buildDetailRow('Parent Contact', item.parentContact ?? '9820112345'),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // If visitor already reported
                if (item.isReportedByVisitor) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.successBg,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.successGreen.withOpacity(0.4)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_rounded, color: AppTheme.successGreen, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'You Reported Finding This Child',
                                style: GoogleFonts.outfit(fontWeight: FontWeight.w700, color: AppTheme.successGreen, fontSize: 13),
                              ),
                              Text(
                                'Location: ${item.visitorReportBlock} • Security crew notified.',
                                style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textDark),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  // [ I FOUND THIS CHILD ] Button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: () => _openFoundChildDialog(item),
                      icon: const Icon(Icons.front_hand_rounded, size: 18),
                      label: Text(
                        'I FOUND THIS CHILD',
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.alertRed,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // STANDARD NOTIFICATION CARD
  // -------------------------------------------------------------
  Widget _buildStandardNotificationCard(NotificationItem item) {
    final notifProvider = context.read<NotificationProvider>();

    IconData icon;
    Color iconColor;
    Color iconBg;

    switch (item.type) {
      case NotificationType.gateUpdate:
        icon = Icons.door_sliding_rounded;
        iconColor = AppTheme.warningAmber;
        iconBg = AppTheme.warningBg;
        break;
      case NotificationType.parkingUpdate:
        icon = Icons.local_parking_rounded;
        iconColor = AppTheme.coffeeBrown;
        iconBg = AppTheme.coffeeBrown.withOpacity(0.1);
        break;
      case NotificationType.trafficAlert:
        icon = Icons.alt_route_rounded;
        iconColor = AppTheme.caramel;
        iconBg = AppTheme.caramel.withOpacity(0.15);
        break;
      case NotificationType.announcement:
        icon = Icons.campaign_rounded;
        iconColor = AppTheme.coffeeBrown;
        iconBg = AppTheme.coffeeBrown.withOpacity(0.1);
        break;
      case NotificationType.venueInfo:
      default:
        icon = Icons.info_outline_rounded;
        iconColor = AppTheme.coffeeMedium;
        iconBg = AppTheme.creamBackground;
    }

    return Dismissible(
      key: Key(item.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppTheme.alertRed,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.delete_outline_rounded, color: Colors.white, size: 28),
      ),
      onDismissed: (_) {
        notifProvider.deleteNotification(item.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Notification removed'),
            duration: const Duration(seconds: 2),
            backgroundColor: AppTheme.coffeeBrown,
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: item.isRead ? AppTheme.creamBorder : AppTheme.coffeeBrown.withOpacity(0.3),
            width: item.isRead ? 1 : 1.4,
          ),
          boxShadow: [
            BoxShadow(
              color: AppTheme.coffeeDark.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconBg,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: iconColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          if (item.isManagerAlert) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              margin: const EdgeInsets.only(right: 6),
                              decoration: BoxDecoration(
                                color: AppTheme.coffeeBrown,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'EVENTFLOW AI',
                                style: GoogleFonts.outfit(
                                  fontSize: 8,
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.creamText,
                                ),
                              ),
                            ),
                          ],
                          Expanded(
                            child: Text(
                              item.title,
                              style: GoogleFonts.outfit(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.textDark,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.timeAgo,
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),

                // Delete Button
                IconButton(
                  icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppTheme.textMuted),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                  tooltip: 'Delete Alert',
                  onPressed: () => notifProvider.deleteNotification(item.id),
                ),
              ],
            ),

            const SizedBox(height: 10),

            Text(
              item.message,
              style: GoogleFonts.outfit(
                fontSize: 13,
                color: AppTheme.textMedium,
                height: 1.4,
              ),
            ),

            // If location attached, provide quick action
            if (item.relatedBlock != null || item.recommendedAction != null) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.creamBackground,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.tips_and_updates_outlined, size: 16, color: AppTheme.caramel),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        item.recommendedAction ?? 'Location: ${item.relatedBlock ?? ""}',
                        style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textDark),
                      ),
                    ),
                    if (item.relatedBlock != null && widget.onNavigateToMapWithBlock != null) ...[
                      InkWell(
                        onTap: () => widget.onNavigateToMapWithBlock!(item.relatedBlock!),
                        child: Text(
                          'View on Map →',
                          style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _openFoundChildDialog(NotificationItem item) {
    final blockController = TextEditingController(text: 'Block 5');
    final phoneController = TextEditingController();
    final messageController = TextEditingController();
    final blocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6', 'Block 7', 'Block 8', 'Gate 2 Food Concourse'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.all(22),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: AppTheme.alertBg,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.front_hand_rounded, color: AppTheme.alertRed, size: 20),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          '“I found this child.”',
                          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Reporting found child: ${item.childName ?? "Kabir"}. Your report will be immediately dispatched to event management.',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                  ),

                  const SizedBox(height: 18),

                  Text('Current Location / Block', style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    isExpanded: true,
                    initialValue: blockController.text,
                    items: blocks.map((b) => DropdownMenuItem(value: b, child: Text(b, style: GoogleFonts.outfit()))).toList(),
                    onChanged: (val) {
                      if (val != null) blockController.text = val;
                    },
                  ),

                  const SizedBox(height: 14),

                  Text('Visitor Contact Number (10 Digits)', style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: phoneController,
                    keyboardType: TextInputType.phone,
                    maxLength: 10,
                    decoration: const InputDecoration(
                      hintText: 'e.g. 9820123456',
                      prefixText: '+91 ',
                      prefixIcon: Icon(Icons.phone_rounded, color: AppTheme.coffeeBrown),
                    ),
                  ),

                  const SizedBox(height: 14),

                  Text('Optional Message', style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: messageController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Child is safely seated with security staff at Counter 4.',
                    ),
                  ),

                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () async {
                        final phone = phoneController.text.trim();
                        if (phone.length < 10) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Please enter a valid 10-digit Indian phone number.'),
                              backgroundColor: AppTheme.alertRed,
                            ),
                          );
                          return;
                        }

                        Navigator.pop(ctx);
                        await context.read<NotificationProvider>().reportChildFound(
                              notificationId: item.id,
                              foundLocationBlock: blockController.text,
                              visitorContact: phone,
                              message: messageController.text.trim(),
                            );

                        if (!mounted) return;
                        showDialog(
                          context: context,
                          builder: (dCtx) => AlertDialog(
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.check_circle_rounded, color: AppTheme.successGreen, size: 54),
                                const SizedBox(height: 14),
                                Text(
                                  'Thank you. Your report has been sent to event management.',
                                  style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'A block crew assistant is on the way to your location (${blockController.text}).',
                                  style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 18),
                                ElevatedButton(
                                  onPressed: () => Navigator.pop(dCtx),
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.coffeeBrown,
                        foregroundColor: AppTheme.creamText,
                      ),
                      child: Text('REPORT FOUND', style: GoogleFonts.outfit(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 110,
          child: Text(
            label,
            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.textMuted),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textDark),
          ),
        ),
      ],
    );
  }
}
