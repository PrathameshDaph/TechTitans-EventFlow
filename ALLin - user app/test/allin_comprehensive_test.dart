import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:allin/main.dart';
import 'package:allin/screens/login/login_screen.dart';
import 'package:allin/screens/main_shell/main_shell_screen.dart';
import 'package:allin/screens/notifications/notifications_screen.dart';
import 'package:allin/providers/notification_provider.dart';

void main() {
  group('ALLin Mobile App Comprehensive Verification Suite', () {
    setUp(() {
      TestWidgetsFlutterBinding.ensureInitialized();
    });

    testWidgets('1. Startup Splash screen transitions to Login screen', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());

      // Initial frame: Splash Screen with ALLin branding
      expect(find.text('ALLin'), findsWidgets);
      expect(find.text('AUDIENCE & VISITOR COMPANION'), findsOneWidget);

      // Fast-forward animation timer (2.6s) to land on Login Screen
      await tester.pumpAndSettle(const Duration(seconds: 4));

      // Verify Login Screen elements
      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('Visitor Login'), findsOneWidget);
      expect(find.text('ENTER ALLin'), findsOneWidget);
    });

    testWidgets('2. Login validation rejects invalid credentials and accepts valid', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));

      // Attempt invalid login: unknown user
      final userField = find.widgetWithText(TextField, 'Rahul');
      await tester.enterText(userField, 'UnknownUser');
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Error banner should be visible
      expect(find.textContaining('not found in event registry'), findsOneWidget);

      // Attempt valid login using quick chip
      await tester.ensureVisible(find.text('Rahul'));
      await tester.tap(find.text('Rahul'));
      await tester.pumpAndSettle();

      // Tap ENTER ALLin
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Should transition to MainShellScreen
      expect(find.byType(MainShellScreen), findsOneWidget);
      expect(find.text('India vs Pakistan'), findsWidgets);
    });

    testWidgets('3. MY EVENT section displays event details and premium ticket with QR code', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Verify Header branding
      expect(find.text('ALLin'), findsWidgets);

      // Verify Event Information
      expect(find.text('India vs Pakistan'), findsWidgets);
      expect(find.text('Wankhede Stadium'), findsWidgets);
      expect(find.text('5:00 PM – 11:00 PM'), findsWidgets);

      // Verify Ticket Card
      expect(find.text('MY TICKET'), findsOneWidget);
      expect(find.text('Scan at Entry'), findsOneWidget);
      expect(find.textContaining('Block 5'), findsWidgets);
      expect(find.textContaining('Row K'), findsWidgets);
    });

    testWidgets('4. Navigation Drawer opens with user profile and all 7 options', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Open hamburger menu
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();

      // Verify drawer profile
      expect(find.text('Welcome, Rahul'), findsOneWidget);
      expect(find.text('Current Event: India vs Pakistan'), findsOneWidget);
      expect(find.text('Venue: Wankhede Stadium'), findsOneWidget);

      // Verify all 7 menu items exist in drawer
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('MY EVENT')), findsOneWidget);
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('BOOK PARKING')), findsOneWidget);
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('ORDER FOOD')), findsOneWidget);
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('NOTIFICATIONS')), findsOneWidget);
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('FOUND IT')), findsOneWidget);
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('AREA MAP')), findsOneWidget);
      expect(find.descendant(of: find.byType(Drawer), matching: find.text('CONTACT US')), findsOneWidget);

      // Verify Simulate Manager Alert is completely removed from drawer
      expect(find.text('Simulate Manager Alert'), findsNothing);
    });

    testWidgets('5. BOOK PARKING section: Event Parking booking & Rental Parking filtering', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to BOOK PARKING
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('BOOK PARKING')));
      await tester.pumpAndSettle();

      // Verify Event Parking elements
      expect(find.text('EVENT PARKING'), findsOneWidget);
      expect(find.text('RENTAL PARKING'), findsOneWidget);
      expect(find.text('Select Block'), findsOneWidget);
      expect(find.text('Select Vehicle'), findsOneWidget);

      // Verify hourly rate > 200
      expect(find.textContaining('₹250/hour'), findsWidgets);

      // Book event parking
      await tester.ensureVisible(find.text('BOOK EVENT PARKING'));
      await tester.tap(find.text('BOOK EVENT PARKING'));
      await tester.pumpAndSettle();

      // Verify success dialog
      expect(find.text('✓ Parking Booked Successfully'), findsOneWidget);
      await tester.tap(find.text('DONE'));
      await tester.pumpAndSettle();
    });

    testWidgets('6. ORDER FOOD section: BOOK NOW vs QUICK BUY flow and cart checkout', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to ORDER FOOD
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('ORDER FOOD')));
      await tester.pumpAndSettle();

      // Verify Mode Selector
      expect(find.text('BOOK NOW'), findsWidgets);
      expect(find.text('QUICK BUY'), findsWidgets);

      // Add item to cart
      final addBtn = find.text('ADD +').first;
      await tester.tap(addBtn);
      await tester.pumpAndSettle();

      // Verify Bottom Cart Bar appeared
      expect(find.textContaining('1 Item in Cart'), findsOneWidget);

      // Place order
      await tester.tap(find.text('BOOK NOW').last);
      await tester.pumpAndSettle();

      // Verify success dialog
      expect(find.text('✓ Your Order Is Accepted'), findsOneWidget);
      await tester.tap(find.text('DONE'));
      await tester.pumpAndSettle();
    });

    testWidgets('7. NOTIFICATIONS section: Missing child alert, report found, and real alert pipeline', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to NOTIFICATIONS
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('NOTIFICATIONS')));
      await tester.pumpAndSettle();

      // Verify missing child alert
      expect(find.text('URGENT — MISSING CHILD'), findsOneWidget);
      expect(find.text('Kabir'), findsOneWidget);
      expect(find.text('I FOUND THIS CHILD'), findsOneWidget);

      // Verify Simulate Alert button is completely removed
      expect(find.text('+ Simulate Alert'), findsNothing);
      expect(find.text('Simulate Manager Alert'), findsNothing);

      // Tap I FOUND THIS CHILD
      await tester.ensureVisible(find.text('I FOUND THIS CHILD'));
      await tester.tap(find.text('I FOUND THIS CHILD'));
      await tester.pumpAndSettle();

      // Verify form & submit
      expect(find.text('“I found this child.”'), findsOneWidget);
      final phoneInput = find.byType(TextField).first;
      await tester.enterText(phoneInput, '9820123456');
      await tester.tap(find.text('REPORT FOUND'));
      await tester.pumpAndSettle();

      // Confirmation dialog
      expect(find.textContaining('Thank you. Your report has been sent'), findsOneWidget);
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      // Test Live Manager Alert Pipeline via provider
      final notifProv = tester.element(find.byType(NotificationsScreen)).read<NotificationProvider>();
      notifProv.triggerManagerBroadcast(customTitle: 'Gate 3 is crowded — use Gate 6');
      await tester.pumpAndSettle();
      expect(find.text('Gate 3 is crowded — use Gate 6'), findsWidgets);

      // Test user dismiss/delete action with delete sound
      final closeBtn = find.byIcon(Icons.close).first;
      await tester.tap(closeBtn);
      await tester.pumpAndSettle();
    });

    testWidgets('8. FOUND IT section: Report lost item form with real image picker & submission', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to FOUND IT
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('FOUND IT')));
      await tester.pumpAndSettle();

      // Verify form fields
      expect(find.text('Upload Photo'), findsOneWidget);
      expect(find.text('Item Category *'), findsOneWidget);
      expect(find.text('Item Description *'), findsOneWidget);
      expect(find.text('Found At / Block *'), findsOneWidget);
      expect(find.text('Contact Number *'), findsOneWidget);

      // Verify empty upload state
      expect(find.text('Upload Photo of Found Item'), findsOneWidget);

      // Select category chip
      await tester.tap(find.text('Smartphone'));
      await tester.pumpAndSettle();

      // Enter description
      final descField = find.widgetWithText(TextField, '');
      await tester.enterText(descField.first, 'Black Samsung Galaxy S24 in leather flip case');
      await tester.pumpAndSettle();

      // Tap REPORT FOUND ITEM
      await tester.ensureVisible(find.text('REPORT FOUND ITEM'));
      await tester.tap(find.text('REPORT FOUND ITEM'));
      await tester.pumpAndSettle();

      // Verify confirmation dialog
      expect(find.text('Report submitted successfully'), findsOneWidget);
      await tester.tap(find.text('DONE'));
      await tester.pumpAndSettle();

      // Form reset verification: empty upload state returned
      expect(find.text('Upload Photo of Found Item'), findsOneWidget);
    });

    testWidgets('9. AREA MAP section: Left stadium bowl, blocks 1-8, and amenities', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to AREA MAP
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('AREA MAP')));
      await tester.pumpAndSettle();

      // Verify venue site map elements
      expect(find.text('AREA MAP — SITE PLAN'), findsOneWidget);
      expect(find.byType(CustomPaint), findsWidgets);

      // Verify category filter chips & interactive controls
      expect(find.text('Stadium'), findsOneWidget);
      expect(find.text('Food'), findsOneWidget);
      expect(find.text('Parking'), findsOneWidget);
      expect(find.text('Medical'), findsOneWidget);
      expect(find.text('Gates'), findsOneWidget);
    });

    testWidgets('10. CONTACT US section: Event Manager, Block Crew Head, and 3 crew members', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to CONTACT US
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('CONTACT US')));
      await tester.pumpAndSettle();

      // Verify Event Manager
      expect(find.text('EVENT MANAGER'), findsOneWidget);
      expect(find.text('Vikramaditya Singhania'), findsOneWidget);
      expect(find.textContaining('9820154321'), findsOneWidget);

      // Verify Block Crew Head
      expect(find.text('YOUR BLOCK CREW HEAD'), findsOneWidget);
      expect(find.text('Rahul Sharma'), findsOneWidget);
      expect(find.textContaining('9819234567'), findsOneWidget);

      // Verify 3 Crew Members
      expect(find.text('Amit Patil'), findsOneWidget);
      expect(find.text('Sneha More'), findsOneWidget);
      expect(find.text('Rohan Deshmukh'), findsOneWidget);

      // Tap CALL to verify simulated call dialog
      await tester.ensureVisible(find.text('CALL NOW'));
      await tester.tap(find.text('CALL NOW'));
      await tester.pumpAndSettle();
      expect(find.text('Calling Rahul Sharma'), findsOneWidget);
      await tester.tap(find.text('END CALL'));
      await tester.pumpAndSettle();
    });

    testWidgets('11. Sign Out flow clears user session and navigates to LoginScreen', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(420, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Open drawer
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();

      // Verify Sign Out button is present
      expect(find.text('Sign Out'), findsOneWidget);

      // Tap Sign Out
      await tester.tap(find.text('Sign Out'));
      await tester.pumpAndSettle();

      // Must be back on LoginScreen
      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('Visitor Login'), findsOneWidget);

      // Verify authenticated shell is no longer present
      expect(find.byType(MainShellScreen), findsNothing);
    });

    testWidgets('12. Food section: Pickup / Serving Time is displayed with responsive card layout', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(360, 800); // Test on narrow mobile screen width
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(const ALLinApp());
      await tester.pumpAndSettle(const Duration(seconds: 4));
      await tester.ensureVisible(find.text('ENTER ALLin'));
      await tester.tap(find.text('ENTER ALLin'));
      await tester.pumpAndSettle();

      // Navigate to ORDER FOOD
      await tester.tap(find.byIcon(Icons.menu_rounded));
      await tester.pumpAndSettle();
      await tester.tap(find.descendant(of: find.byType(Drawer), matching: find.text('ORDER FOOD')));
      await tester.pumpAndSettle();

      // In Book Now mode (default), verify Pickup / Serving Time card is visible
      expect(find.text('Pickup / Serving Time'), findsOneWidget);
      expect(find.text('Pre-order Slot'), findsOneWidget);

      // Verify dropdown works without overflow
      await tester.tap(find.textContaining('Innings Break'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('8:45 PM (Death Overs Rush)').last);
      await tester.pumpAndSettle();
      expect(find.text('8:45 PM (Death Overs Rush)'), findsOneWidget);
    });
  });
}
