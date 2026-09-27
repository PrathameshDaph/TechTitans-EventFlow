import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../services/auth_service.dart';
import '../providers/notification_provider.dart';

class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onMenuPressed;
  final VoidCallback? onNotificationPressed;
  final String? sectionSubtitle;

  const AppHeader({
    super.key,
    required this.onMenuPressed,
    this.onNotificationPressed,
    this.sectionSubtitle,
  });

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final notifs = context.watch<NotificationProvider>();
    final unread = notifs.unreadCount;
    final userBlock = auth.currentUser?.assignedBlock ?? 'Block 5';

    return Container(
      color: AppTheme.coffeeBrown,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: SafeArea(
        bottom: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Hamburger Icon on the LEFT
            IconButton(
              icon: const Icon(
                Icons.menu_rounded,
                color: AppTheme.creamText,
                size: 26,
              ),
              tooltip: 'Open Navigation Menu',
              onPressed: onMenuPressed,
            ),
            const SizedBox(width: 4),

            // "ALLin" Branding in WHITE/CREAM with CREW_IT badge
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'ALLin',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          color: AppTheme.creamText,
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                      if (auth.currentUser != null &&
                          (auth.currentUser!.id.toUpperCase().startsWith('V0') ||
                              auth.currentUser!.id.toUpperCase().startsWith('AAA') ||
                              auth.currentUser!.id.toUpperCase().startsWith('AAB') ||
                              auth.currentUser!.id.toUpperCase().startsWith('CREW') ||
                              auth.currentUser!.ticketId.toUpperCase().contains('VOL') ||
                              auth.currentUser!.ticketId.toUpperCase().contains('CREW'))) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE5A93C),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          child: Text(
                            'CREW_IT',
                            style: GoogleFonts.outfit(
                              color: AppTheme.coffeeDark,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (sectionSubtitle != null)
                    Text(
                      sectionSubtitle!.toUpperCase(),
                      style: GoogleFonts.outfit(
                        color: AppTheme.caramel,
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                ],
              ),
            ),
          const SizedBox(width: 8),

          // Active Block Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.coffeeDark.withOpacity(0.6),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.caramel.withOpacity(0.5), width: 1),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.stadium_outlined,
                  color: AppTheme.caramel,
                  size: 13,
                ),
                const SizedBox(width: 4),
                Text(
                  userBlock,
                  style: GoogleFonts.outfit(
                    color: AppTheme.creamText,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          // Notification Bell with Badge
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                icon: const Icon(
                  Icons.notifications_outlined,
                  color: AppTheme.creamText,
                  size: 24,
                ),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
                tooltip: 'Notifications',
                onPressed: onNotificationPressed,
              ),
              if (unread > 0)
                Positioned(
                  right: 2,
                  top: 2,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppTheme.alertRed,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Center(
                      child: Text(
                        '$unread',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      ),
    );
  }
}
