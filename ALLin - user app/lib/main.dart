import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'theme/app_theme.dart';
import 'repositories/user_repository.dart';
import 'repositories/event_repository.dart';
import 'repositories/parking_repository.dart';
import 'repositories/food_repository.dart';
import 'repositories/notification_repository.dart';
import 'repositories/lost_found_repository.dart';
import 'repositories/contact_repository.dart';

import 'services/auth_service.dart';
import 'services/websocket_service.dart';
import 'providers/parking_provider.dart';
import 'providers/food_provider.dart';
import 'providers/notification_provider.dart';
import 'providers/lost_found_provider.dart';
import 'providers/task_provider.dart';

import 'screens/splash/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Set system navigation overlay styling for coffee-brown theme
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppTheme.coffeeBrown,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Initialize real-time WebSocket connection to central Node.js backend
  WebSocketService().connect();

  runApp(const ALLinApp());
}

class ALLinApp extends StatelessWidget {
  const ALLinApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Instantiate real backend connected repositories
    final userRepository = ApiUserRepository();
    final eventRepository = MockEventRepository();
    final parkingRepository = MockParkingRepository();
    final foodRepository = MockFoodRepository();
    final notificationRepository = ApiNotificationRepository();
    final lostFoundRepository = ApiLostFoundRepository();
    final contactRepository = MockContactRepository();
    final taskProvider = TaskProvider();

    // Hook WebSocket real-time events to TaskProvider & NotificationRepository
    WebSocketService().addListener((data) {
      taskProvider.handleWebSocketEvent(data);
      notificationRepository.handleRealtimeNotification(data);
    });

    return MultiProvider(
      providers: [
        // Repositories
        Provider<UserRepository>.value(value: userRepository),
        Provider<EventRepository>.value(value: eventRepository),
        Provider<ParkingRepository>.value(value: parkingRepository),
        Provider<FoodRepository>.value(value: foodRepository),
        Provider<NotificationRepository>.value(value: notificationRepository),
        Provider<LostFoundRepository>.value(value: lostFoundRepository),
        Provider<ContactRepository>.value(value: contactRepository),

        // State Providers
        ChangeNotifierProvider<AuthService>(
          create: (_) => AuthService(userRepository: userRepository),
        ),
        ChangeNotifierProvider<TaskProvider>.value(
          value: taskProvider,
        ),
        ChangeNotifierProvider<NotificationProvider>(
          create: (_) => NotificationProvider(repository: notificationRepository),
        ),
        ChangeNotifierProvider<ParkingProvider>(
          create: (_) => ParkingProvider(repository: parkingRepository),
        ),
        ChangeNotifierProvider<FoodProvider>(
          create: (_) => FoodProvider(repository: foodRepository),
        ),
        ChangeNotifierProvider<LostFoundProvider>(
          create: (_) => LostFoundProvider(repository: lostFoundRepository),
        ),
      ],
      child: MaterialApp(
        title: 'ALLin - Wankhede Stadium Visitor Experience',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const SplashScreen(),
      ),
    );
  }
}
