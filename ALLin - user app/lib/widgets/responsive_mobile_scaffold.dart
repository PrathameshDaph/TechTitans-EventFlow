import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ResponsiveMobileScaffold extends StatelessWidget {
  final Widget child;

  const ResponsiveMobileScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // If on wide screen (e.g. Chrome / Desktop), center in a mobile container
        if (constraints.maxWidth > 600) {
          return Scaffold(
            backgroundColor: const Color(0xFF1F120A), // Ambient deep coffee background for desktop
            body: Center(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 440, maxHeight: 920),
                decoration: BoxDecoration(
                  color: AppTheme.creamBackground,
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.4),
                      blurRadius: 30,
                      offset: const Offset(0, 10),
                    ),
                  ],
                  border: Border.all(color: const Color(0xFF4A2B18), width: 3),
                ),
                clipBehavior: Clip.antiAlias,
                child: child,
              ),
            ),
          );
        }
        // Direct mobile viewport
        return child;
      },
    );
  }
}
