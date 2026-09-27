import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../services/auth_service.dart';
import '../providers/notification_provider.dart';
import '../screens/login/login_screen.dart';

enum AppSection {
  myEvent,
  myTasks,
  bookParking,
  orderFood,
  notifications,
  foundIt,
  areaMap,
  contactUs,
}

class AppNavigationDrawer extends StatelessWidget {
  final AppSection currentSection;
  final ValueChanged<AppSection> onSectionSelected;

  const AppNavigationDrawer({
    super.key,
    required this.currentSection,
    required this.onSectionSelected,
  });

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final notifs = context.watch<NotificationProvider>();
    final user = auth.currentUser;

    return Drawer(
      backgroundColor: AppTheme.creamBackground,
      child: Column(
        children: [
          // Drawer Header with Coffee-Brown styling and User Profile Context
          Container(
            width: double.infinity,
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 20,
              left: 20,
              right: 20,
              bottom: 20,
            ),
            decoration: const BoxDecoration(
              color: AppTheme.coffeeBrown,
              borderRadius: BorderRadius.only(
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // App Logo & Brand Header in Drawer
                Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFBE9),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.caramel.withOpacity(0.8), width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.5),
                        child: Image.asset(
                          'assets/images/app_logo.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ALLin',
                          style: GoogleFonts.outfit(
                            color: AppTheme.creamText,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.0,
                          ),
                        ),
                        Text(
                          'VISITOR COMPANION',
                          style: GoogleFonts.outfit(
                            color: AppTheme.caramel,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Divider(color: AppTheme.caramel.withOpacity(0.3), thickness: 1, height: 1),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.caramel.withOpacity(0.2),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.caramel, width: 1.5),
                      ),
                      child: const Icon(
                        Icons.person_rounded,
                        color: AppTheme.creamText,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome, ${user?.name ?? "Visitor"}',
                            style: GoogleFonts.outfit(
                              color: AppTheme.creamText,
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            'Ticket: ${user?.ticketId ?? "ALLIN-WAN"}',
                            style: GoogleFonts.outfit(
                              color: AppTheme.caramel,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.coffeeDark.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.caramel.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.sports_cricket_rounded, color: AppTheme.caramel, size: 14),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Current Event: India vs Pakistan',
                              style: GoogleFonts.outfit(
                                color: AppTheme.creamText,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on_outlined, color: AppTheme.creamText, size: 14),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Venue: Wankhede Stadium',
                              style: GoogleFonts.outfit(
                                color: AppTheme.creamText.withOpacity(0.85),
                                fontSize: 12,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.caramel,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              user?.assignedBlock ?? 'Block 5',
                              style: GoogleFonts.outfit(
                                color: AppTheme.coffeeDark,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Navigation List Options
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
              children: [
                _buildNavItem(
                  context: context,
                  section: AppSection.myEvent,
                  title: 'MY EVENT',
                  icon: Icons.confirmation_number_outlined,
                  activeIcon: Icons.confirmation_number_rounded,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.myTasks,
                  title: 'MY TASKS',
                  icon: Icons.checklist_rtl_outlined,
                  activeIcon: Icons.checklist_rtl_rounded,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.bookParking,
                  title: 'BOOK PARKING',
                  icon: Icons.local_parking_outlined,
                  activeIcon: Icons.local_parking_rounded,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.orderFood,
                  title: 'ORDER FOOD',
                  icon: Icons.restaurant_outlined,
                  activeIcon: Icons.restaurant_rounded,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.notifications,
                  title: 'NOTIFICATIONS',
                  icon: Icons.notifications_outlined,
                  activeIcon: Icons.notifications_rounded,
                  badgeCount: notifs.unreadCount,
                  hasUrgentAlert: notifs.hasUrgentAlert,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.foundIt,
                  title: 'FOUND IT',
                  icon: Icons.find_in_page_outlined,
                  activeIcon: Icons.find_in_page_rounded,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.areaMap,
                  title: 'AREA MAP',
                  icon: Icons.map_outlined,
                  activeIcon: Icons.map_rounded,
                ),
                _buildNavItem(
                  context: context,
                  section: AppSection.contactUs,
                  title: 'CONTACT US',
                  icon: Icons.support_agent_outlined,
                  activeIcon: Icons.support_agent_rounded,
                ),
              ],
            ),
          ),

          // Drawer Bottom Logout & Branding
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppTheme.creamBorder, width: 1)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextButton.icon(
                    onPressed: () {
                      auth.logout();
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (context) => const LoginScreen()),
                        (route) => false,
                      );
                    },
                    icon: const Icon(Icons.logout_rounded, color: AppTheme.textMedium, size: 20),
                    label: Text(
                      'Sign Out',
                      style: GoogleFonts.outfit(
                        color: AppTheme.textMedium,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      alignment: Alignment.centerLeft,
                    ),
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFBE9),
                        borderRadius: BorderRadius.circular(5),
                        border: Border.all(color: AppTheme.caramel.withOpacity(0.6), width: 0.8),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: Image.asset(
                          'assets/images/app_logo.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'v1.0 • ALLin',
                      style: GoogleFonts.outfit(
                        color: AppTheme.textMuted,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required AppSection section,
    required String title,
    required IconData icon,
    required IconData activeIcon,
    int? badgeCount,
    bool hasUrgentAlert = false,
  }) {
    final isSelected = currentSection == section;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Material(
        color: isSelected ? AppTheme.coffeeBrown : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: ListTile(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        dense: true,
        leading: Icon(
          isSelected ? activeIcon : icon,
          color: isSelected ? AppTheme.creamText : AppTheme.coffeeBrown,
          size: 22,
        ),
        title: Text(
          title,
          style: GoogleFonts.outfit(
            color: isSelected ? AppTheme.creamText : AppTheme.textDark,
            fontSize: 14,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            letterSpacing: 0.3,
          ),
        ),
        trailing: badgeCount != null && badgeCount > 0
            ? Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: hasUrgentAlert ? AppTheme.alertRed : AppTheme.caramel,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$badgeCount',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              )
            : (isSelected
                ? const Icon(
                    Icons.chevron_right_rounded,
                    color: AppTheme.caramel,
                    size: 20,
                  )
                : null),
        onTap: () {
          Navigator.of(context).pop(); // Close drawer
          onSectionSelected(section);
        },
      ),
    ),);
  }
}
