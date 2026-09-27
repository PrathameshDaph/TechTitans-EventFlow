import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/app_header.dart';
import '../../widgets/navigation_drawer.dart';
import '../../widgets/responsive_mobile_scaffold.dart';
import '../my_event/my_event_screen.dart';
import '../parking/parking_screen.dart';
import '../food/food_screen.dart';
import '../notifications/notifications_screen.dart';
import '../found_it/found_it_screen.dart';
import '../area_map/area_map_screen.dart';
import '../contact_us/contact_us_screen.dart';
import '../tasks/my_tasks_screen.dart';

class MainShellScreen extends StatefulWidget {
  final AppSection initialSection;

  const MainShellScreen({
    super.key,
    this.initialSection = AppSection.myEvent,
  });

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late AppSection _currentSection;
  String? _mapTargetBlock;

  @override
  void initState() {
    super.initState();
    _currentSection = widget.initialSection;
  }

  void _navigateToSection(AppSection section, {String? targetBlock}) {
    setState(() {
      _currentSection = section;
      if (targetBlock != null) {
        _mapTargetBlock = targetBlock;
      }
    });
  }

  String _getSectionTitle(AppSection section) {
    switch (section) {
      case AppSection.myEvent:
        return 'Match Day & Ticket';
      case AppSection.myTasks:
        return 'Volunteer Operational Tasks';
      case AppSection.bookParking:
        return 'Event & Rental Parking';
      case AppSection.orderFood:
        return 'Concourse Food & Quick Buy';
      case AppSection.notifications:
        return 'Alerts & Live Broadcasts';
      case AppSection.foundIt:
        return 'Lost & Found Reporting';
      case AppSection.areaMap:
        return 'Wankhede Stadium Map';
      case AppSection.contactUs:
        return 'Event Crew & Contacts';
    }
  }

  Widget _buildCurrentScreen() {
    switch (_currentSection) {
      case AppSection.myEvent:
        return MyEventScreen(
          onNavigateToMap: () => _navigateToSection(AppSection.areaMap),
          onNavigateToParking: () => _navigateToSection(AppSection.bookParking),
          onNavigateToFood: () => _navigateToSection(AppSection.orderFood),
        );
      case AppSection.myTasks:
        return const MyTasksScreen();
      case AppSection.bookParking:
        return const ParkingScreen();
      case AppSection.orderFood:
        return const FoodScreen();
      case AppSection.notifications:
        return NotificationsScreen(
          onNavigateToMapWithBlock: (block) {
            _navigateToSection(AppSection.areaMap, targetBlock: block);
          },
        );
      case AppSection.foundIt:
        return const FoundItScreen();
      case AppSection.areaMap:
        return AreaMapScreen(
          key: ValueKey(_mapTargetBlock ?? 'default_map'),
          initialSelectedBlock: _mapTargetBlock,
        );
      case AppSection.contactUs:
        return const ContactUsScreen();
    }
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveMobileScaffold(
      child: Scaffold(
        key: _scaffoldKey,
        backgroundColor: AppTheme.creamBackground,
        drawer: AppNavigationDrawer(
          currentSection: _currentSection,
          onSectionSelected: (section) => _navigateToSection(section),
        ),
        appBar: AppHeader(
          sectionSubtitle: _getSectionTitle(_currentSection),
          onMenuPressed: () {
            _scaffoldKey.currentState?.openDrawer();
          },
          onNotificationPressed: () {
            _navigateToSection(AppSection.notifications);
          },
        ),
        body: _buildCurrentScreen(),
      ),
    );
  }
}
