import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../services/auth_service.dart';
import '../main_shell/main_shell_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController(text: 'Rahul');
  final _passwordController = TextEditingController(text: 'Rahul123');
  bool _obscurePassword = true;
  String? _localError;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _fillMockUser(String name, [String? password]) {
    setState(() {
      _usernameController.text = name;
      _passwordController.text = password ?? '${name}123';
      _localError = null;
    });
  }

  Future<void> _handleLogin() async {
    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();

    if (username.isEmpty) {
      setState(() => _localError = 'Please enter your visitor name.');
      return;
    }

    if (password.isEmpty) {
      setState(() => _localError = 'Please enter your password (<name>123).');
      return;
    }

    setState(() => _localError = null);

    final auth = context.read<AuthService>();
    final success = await auth.login(username, password);

    if (success && mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, anim, secAnim) => const MainShellScreen(),
          transitionsBuilder: (context, anim, secAnim, child) {
            return FadeTransition(opacity: anim, child: child);
          },
        ),
      );
    } else if (mounted) {
      setState(() {
        _localError = auth.errorMessage ?? 'Invalid login. Ensure password is <name>123.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();

    return Scaffold(
      backgroundColor: AppTheme.creamBackground,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 16),

                // Top Branding Header Box
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                  decoration: BoxDecoration(
                    color: AppTheme.coffeeBrown,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.coffeeDark.withOpacity(0.12),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFFBE9),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppTheme.caramel.withOpacity(0.8), width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.coffeeDark.withOpacity(0.35),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.asset(
                            'assets/images/app_logo.png',
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'ALLin',
                        style: GoogleFonts.outfit(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.creamText,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'WANKHEDE STADIUM VISITOR ACCESS',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.caramel,
                          letterSpacing: 1.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'India vs Pakistan • Match Day Experience',
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          color: AppTheme.creamText.withOpacity(0.85),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // Login Form Card
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.creamBorder),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.coffeeDark.withOpacity(0.04),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Visitor Login',
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Enter your name to access your ticket, food pre-order, parking, and stadium amenities.',
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          color: AppTheme.textMedium,
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Error Banner if invalid
                      if (_localError != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.alertBg,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppTheme.alertRed.withOpacity(0.4)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline_rounded, color: AppTheme.alertRed, size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  _localError!,
                                  style: GoogleFonts.outfit(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.alertRed,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Username Field
                      Text(
                        'Visitor Name (Username)',
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textDark,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _usernameController,
                        decoration: InputDecoration(
                          hintText: 'e.g. Rahul',
                          prefixIcon: const Icon(Icons.person_outline_rounded, color: AppTheme.coffeeMedium),
                          suffixIcon: _usernameController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, size: 18),
                                  onPressed: () => _usernameController.clear(),
                                )
                              : null,
                        ),
                        onChanged: (val) {
                          if (_localError != null) setState(() => _localError = null);
                        },
                      ),

                      const SizedBox(height: 16),

                      // Password Field
                      Text(
                        'Password (1234 or <name>123)',
                        style: GoogleFonts.outfit(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textDark,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        decoration: InputDecoration(
                          hintText: 'e.g. 1234 or Rahul123',
                          prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.coffeeMedium),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                              color: AppTheme.coffeeMedium,
                              size: 20,
                            ),
                            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                          ),
                        ),
                        onSubmitted: (_) => _handleLogin(),
                      ),

                      const SizedBox(height: 8),

                      Text(
                        'Password: 1234 for all staff/users, or your name followed by "123" (e.g. Rahul123)',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          color: AppTheme.textMuted,
                          fontStyle: FontStyle.italic,
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Enter Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: auth.isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.coffeeBrown,
                            foregroundColor: AppTheme.creamText,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: auth.isLoading
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'ENTER ALLin',
                                      style: GoogleFonts.outfit(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Icon(Icons.arrow_forward_rounded, size: 18),
                                  ],
                                ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Quick Demo Visitors Selection Chips
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.creamPill,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.touch_app_outlined, size: 16, color: AppTheme.coffeeBrown),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Quick Demo Logins (Tap to fill):',
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.coffeeBrown,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          _buildQuickChip('Rahul', 'Block 5', 'Rahul123'),
                          _buildQuickChip('Priya', 'Block 2', 'Priya123'),
                          _buildQuickChip('Amit', 'Block 7', 'Amit123'),
                          _buildQuickChip('Sneha', 'Block 4', 'Sneha123'),
                          _buildQuickChip('Vikram', 'Block 1', 'Vikram123'),
                          _buildQuickChip('V001', 'Gate 2', '1234'),
                          _buildQuickChip('AAA001', 'Gate A1', '1234'),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Footer Security Note
                Center(
                  child: Text(
                    'Connected to Wankhede Stadium Event Registry System\nReady for EventFlow AI integration',
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      color: AppTheme.textMuted,
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickChip(String name, String block, [String? password]) {
    final isSelected = _usernameController.text.trim().toLowerCase() == name.toLowerCase();

    return InkWell(
      onTap: () => _fillMockUser(name, password),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.coffeeBrown : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppTheme.coffeeBrown : AppTheme.creamBorder,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              name,
              style: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: isSelected ? AppTheme.creamText : AppTheme.textDark,
              ),
            ),
            const SizedBox(width: 4),
            Text(
              '($block)',
              style: GoogleFonts.outfit(
                fontSize: 10,
                color: isSelected ? AppTheme.caramel : AppTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
