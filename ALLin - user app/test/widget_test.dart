import 'package:flutter_test/flutter_test.dart';
import 'package:allin/main.dart';

void main() {
  testWidgets('ALLin smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ALLinApp());
    // Splash screen animation timer advance
    await tester.pumpAndSettle(const Duration(seconds: 4));
    // Verify reaching login or ALLin branding
    expect(find.text('ALLin'), findsWidgets);
  });
}
