import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../models/contact.dart';
import '../../services/auth_service.dart';
import '../../services/mock_data_service.dart';

class ContactUsScreen extends StatelessWidget {
  const ContactUsScreen({super.key});

  void _simulateCall(BuildContext context, String name, String phone) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.coffeeBrown.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone_in_talk_rounded, color: AppTheme.coffeeBrown, size: 40),
              ),
              const SizedBox(height: 14),
              Text(
                'Calling $name',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                '+91 $phone',
                style: GoogleFonts.outfit(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.coffeeBrown,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Connected to Wankhede Ground Telecom Exchange. Crew member on duty will pick up momentarily.',
                style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => Navigator.pop(ctx),
                  icon: const Icon(Icons.call_end_rounded, color: Colors.white, size: 18),
                  label: const Text('END CALL'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.alertRed,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _simulateEmail(BuildContext context, String email) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening mail client to: $email'),
        backgroundColor: AppTheme.coffeeBrown,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final userBlock = auth.currentUser?.assignedBlock ?? 'Block 5';

    final manager = MockDataService.eventManager;
    final crewHead = MockDataService.blockCrewHeads[userBlock] ?? MockDataService.blockCrewHeads['Block 5']!;
    final crewList = MockDataService.crewMembers;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Title
          Text(
            'CONTACT US',
            style: GoogleFonts.outfit(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppTheme.textDark,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Reach out directly to stadium event managers and your dedicated block crew for immediate on-ground assistance.',
            style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textMedium),
          ),

          const SizedBox(height: 18),

          // -------------------------------------------------------------
          // 1. EVENT MANAGER
          // -------------------------------------------------------------
          Text(
            'EVENT MANAGER',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppTheme.coffeeBrown,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),

          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppTheme.creamBorder),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.coffeeDark.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.coffeeBrown,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.shield_rounded, color: AppTheme.creamText, size: 26),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            manager.name,
                            style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                          ),
                          Text(
                            manager.role,
                            style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.phone_rounded, size: 16, color: AppTheme.coffeeBrown),
                          const SizedBox(width: 8),
                          Text('Phone:', style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium)),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '+91 ${manager.phone}',
                              style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                            ),
                          ),
                          InkWell(
                            onTap: () => _simulateCall(context, manager.name, manager.phone),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.coffeeBrown,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text('CALL', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.creamText)),
                            ),
                          ),
                        ],
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 8),
                        child: Divider(color: AppTheme.creamBorder, height: 1),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.email_outlined, size: 16, color: AppTheme.coffeeBrown),
                          const SizedBox(width: 8),
                          Text('Email:', style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium)),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              manager.email ?? 'operations@wankhede.in',
                              style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textDark),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          InkWell(
                            onTap: () => _simulateEmail(context, manager.email ?? 'operations@wankhede.in'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.creamPill,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.creamBorder),
                              ),
                              child: Text('EMAIL', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown)),
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

          const SizedBox(height: 22),

          // -------------------------------------------------------------
          // 2. YOUR BLOCK CREW HEAD
          // -------------------------------------------------------------
          Row(
            children: [
              Expanded(
                child: Text(
                  'YOUR BLOCK CREW HEAD',
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.coffeeBrown,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.caramel.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Assigned to $userBlock',
                  style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.coffeeDark),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppTheme.coffeeBrown.withOpacity(0.3), width: 1.3),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.coffeeBrown.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.caramel.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person_pin_rounded, color: AppTheme.coffeeBrown, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        crewHead.name,
                        style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                      ),
                      Text(
                        crewHead.role,
                        style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '+91 ${crewHead.phone}',
                        style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () => _simulateCall(context, crewHead.name, crewHead.phone),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.coffeeBrown,
                    foregroundColor: AppTheme.creamText,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('CALL NOW'),
                ),
              ],
            ),
          ),

          const SizedBox(height: 22),

          // -------------------------------------------------------------
          // 3. CREW MEMBERS (3 Crew Members)
          // -------------------------------------------------------------
          Text(
            'CREW MEMBERS',
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppTheme.coffeeBrown,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),

          ...crewList.map((crew) => _buildCrewMemberCard(context, crew)),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildCrewMemberCard(BuildContext context, ContactPerson crew) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.creamBorder),
        boxShadow: [
          BoxShadow(
            color: AppTheme.coffeeDark.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.creamBackground,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.support_agent_rounded, color: AppTheme.coffeeBrown, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  crew.name,
                  style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                ),
                Text(
                  crew.role,
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMedium),
                ),
                const SizedBox(height: 2),
                Text(
                  '+91 ${crew.phone}',
                  style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.coffeeBrown),
                ),
              ],
            ),
          ),
          OutlinedButton(
            onPressed: () => _simulateCall(context, crew.name, crew.phone),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              foregroundColor: AppTheme.coffeeBrown,
              side: const BorderSide(color: AppTheme.coffeeBrown, width: 1.2),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('CALL'),
          ),
        ],
      ),
    );
  }
}
