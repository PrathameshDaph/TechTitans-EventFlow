import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../models/food.dart';
import '../../models/order.dart';
import '../../services/auth_service.dart';
import '../../providers/food_provider.dart';

class FoodScreen extends StatefulWidget {
  const FoodScreen({super.key});

  @override
  State<FoodScreen> createState() => _FoodScreenState();
}

class _FoodScreenState extends State<FoodScreen> {
  int _selectedMode = 0; // 0 = BOOK NOW, 1 = QUICK BUY

  // Quick Buy Inside Stadium status
  bool? _isInsideStadium; // null = unasked, false = outside (blocked), true = inside (allowed)

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Mode Switcher Header
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: AppTheme.creamPill,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppTheme.creamBorder),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _buildModeTab(
                    index: 0,
                    title: 'BOOK NOW',
                    subtitle: 'Pre-Order / Scheduled',
                    icon: Icons.calendar_month_rounded,
                  ),
                ),
                Expanded(
                  child: _buildModeTab(
                    index: 1,
                    title: 'QUICK BUY',
                    subtitle: 'Inside Stadium Only',
                    icon: Icons.bolt_rounded,
                  ),
                ),
              ],
            ),
          ),
        ),

        // Main Body: If Quick Buy and not verified inside, show verification prompt or blocked state
        Expanded(
          child: _selectedMode == 1 && _isInsideStadium != true
              ? _buildQuickBuyVerificationPrompt()
              : _buildFoodMenuLayout(isQuickBuy: _selectedMode == 1),
        ),
      ],
    );
  }

  Widget _buildModeTab({
    required int index,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final isSelected = _selectedMode == index;

    return InkWell(
      onTap: () {
        setState(() {
          _selectedMode = index;
          if (index == 1 && _isInsideStadium == null) {
            // Trigger check prompt
          }
        });
      },
      borderRadius: BorderRadius.circular(10),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.coffeeBrown : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppTheme.coffeeBrown.withOpacity(0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  size: 15,
                  color: isSelected ? AppTheme.caramel : AppTheme.coffeeMedium,
                ),
                const SizedBox(width: 6),
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                    color: isSelected ? AppTheme.creamText : AppTheme.textDark,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
            Text(
              subtitle,
              style: GoogleFonts.outfit(
                fontSize: 10,
                color: isSelected ? AppTheme.caramel : AppTheme.textMuted,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // QUICK BUY STADIUM VERIFICATION PROMPT
  // -------------------------------------------------------------
  Widget _buildQuickBuyVerificationPrompt() {
    if (_isInsideStadium == false) {
      // Disallowed / Blocked Screen
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: AppTheme.warningBg,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.location_off_rounded, color: AppTheme.warningAmber, size: 54),
              ),
              const SizedBox(height: 18),
              Text(
                'Quick Buy Unavailable',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Sorry, Quick Buy is available only for visitors currently inside the stadium.',
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  color: AppTheme.textMedium,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Please use "BOOK NOW" to pre-order food for pickup when you arrive.',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => setState(() => _selectedMode = 0),
                      child: const Text('SWITCH TO BOOK NOW'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _isInsideStadium = true),
                      child: const Text('I AM INSIDE NOW'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

    // Default Ask Question Dialog / Container
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.creamBorder),
            boxShadow: [
              BoxShadow(
                color: AppTheme.coffeeDark.withOpacity(0.06),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.coffeeBrown.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.stadium_rounded, color: AppTheme.coffeeBrown, size: 40),
              ),
              const SizedBox(height: 16),
              Text(
                'Inside Stadium Verification',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                '“Are you currently inside the stadium?”',
                style: GoogleFonts.outfit(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.coffeeBrown,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Quick Buy connects directly to your block kiosk for instant 5-minute counter collection or seat delivery.',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  color: AppTheme.textMedium,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() => _isInsideStadium = false);
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        foregroundColor: AppTheme.alertRed,
                        side: const BorderSide(color: AppTheme.alertRed, width: 1.2),
                      ),
                      child: Text(
                        'NO',
                        style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() => _isInsideStadium = true);
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        backgroundColor: AppTheme.coffeeBrown,
                        foregroundColor: AppTheme.creamText,
                      ),
                      child: Text(
                        'YES',
                        style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // FOOD MENU LAYOUT (FOR BOOK NOW & QUICK BUY)
  // -------------------------------------------------------------
  Widget _buildFoodMenuLayout({required bool isQuickBuy}) {
    final food = context.watch<FoodProvider>();
    final auth = context.watch<AuthService>();
    final userBlock = auth.currentUser?.assignedBlock ?? 'Block 5';

    return Column(
      children: [
        // Filter Controls & Status Strip
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: isQuickBuy
                        ? Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.successBg,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.bolt_rounded, size: 14, color: AppTheme.successGreen),
                                const SizedBox(width: 4),
                                Flexible(
                                  child: Text(
                                    'EXPRESS: $userBlock Kiosk',
                                    style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.successGreen),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : Text(
                            'FOOD TYPE',
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown, letterSpacing: 0.8),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                  ),
                  const SizedBox(width: 6),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildVegChip(label: 'All', isSelected: food.vegFilter == null, onTap: () => food.setVegFilter(null)),
                      const SizedBox(width: 4),
                      _buildVegChip(label: 'Veg', isVeg: true, isSelected: food.vegFilter == true, onTap: () => food.setVegFilter(true)),
                      const SizedBox(width: 4),
                      _buildVegChip(label: 'Non-Veg', isVeg: false, isSelected: food.vegFilter == false, onTap: () => food.setVegFilter(false)),
                    ],
                  ),
                ],
              ),

              // Time Slot Selector for BOOK NOW (Responsive mobile layout)
              if (!isQuickBuy) ...[
                const SizedBox(height: 12),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.schedule_rounded, size: 16, color: AppTheme.coffeeBrown),
                                const SizedBox(width: 6),
                                Flexible(
                                  child: Text(
                                    'Pickup / Serving Time',
                                    style: GoogleFonts.outfit(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.coffeeBrown,
                                      letterSpacing: 0.3,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.warmGold.withOpacity(0.18),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              'Pre-order Slot',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.coffeeBrown,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppTheme.creamBorder),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: food.selectedPickupSlot,
                            isDense: true,
                            isExpanded: true,
                            icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 20, color: AppTheme.coffeeBrown),
                            items: food.pickupSlots.map((s) {
                              return DropdownMenuItem(
                                value: s,
                                child: Text(
                                  s,
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.textDark,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              );
                            }).toList(),
                            onChanged: (val) {
                              if (val != null) food.setSelectedPickupSlot(val);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),

        const Divider(color: AppTheme.creamBorder, height: 1),

        // Food Items List
        Expanded(
          child: food.isLoading
              ? const Center(child: CircularProgressIndicator(color: AppTheme.coffeeBrown))
              : ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.only(left: 16, right: 16, top: 14, bottom: 90),
                  itemCount: food.filteredFoodItems.length,
                  itemBuilder: (context, index) {
                    final item = food.filteredFoodItems[index];
                    return _buildFoodCard(item, food);
                  },
                ),
        ),

        // Bottom Sticky Cart & Order Button
        _buildBottomCartBar(isQuickBuy: isQuickBuy, userBlock: userBlock),
      ],
    );
  }

  Widget _buildVegChip({
    required String label,
    bool? isVeg,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.coffeeBrown : AppTheme.creamBackground,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppTheme.coffeeBrown : AppTheme.creamBorder,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isVeg != null) ...[
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: isVeg ? AppTheme.vegGreen : AppTheme.nonVegRed,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 4),
            ],
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.creamText : AppTheme.textDark,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFoodCard(FoodItem item, FoodProvider food) {
    final qty = food.getItemQuantity(item.id);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.creamBorder),
        boxShadow: [
          BoxShadow(
            color: AppTheme.coffeeDark.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Food Thumbnail Icon Graphic
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppTheme.creamBackground,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.creamBorder),
            ),
            child: Stack(
              children: [
                Center(
                  child: Icon(
                    item.isVeg ? Icons.eco_rounded : Icons.restaurant_rounded,
                    color: item.isVeg ? AppTheme.vegGreen : AppTheme.coffeeBrown,
                    size: 32,
                  ),
                ),
                Positioned(
                  top: 4,
                  left: 4,
                  child: Container(
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      border: Border.all(color: item.isVeg ? AppTheme.vegGreen : AppTheme.nonVegRed, width: 1.5),
                    ),
                    child: Center(
                      child: Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: item.isVeg ? AppTheme.vegGreen : AppTheme.nonVegRed,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 12),

          // Details & Price
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.name,
                        style: GoogleFonts.outfit(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textDark,
                        ),
                      ),
                    ),
                    Text(
                      '₹${item.price.toInt()}',
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.coffeeBrown,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  item.description,
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMedium),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.timer_outlined, size: 12, color: AppTheme.textMuted),
                          const SizedBox(width: 3),
                          Flexible(
                            child: Text(
                              item.availableTime,
                              style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.textMuted),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 6),

                    // Quantity Controller
                    if (qty == 0)
                      SizedBox(
                        height: 30,
                        child: OutlinedButton(
                          onPressed: () => food.addItem(item),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            foregroundColor: AppTheme.coffeeBrown,
                            side: const BorderSide(color: AppTheme.coffeeBrown, width: 1.2),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          child: Text(
                            'ADD +',
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800),
                          ),
                        ),
                      )
                    else
                      Container(
                        height: 32,
                        decoration: BoxDecoration(
                          color: AppTheme.coffeeBrown,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 14, color: AppTheme.creamText),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(minWidth: 28),
                              onPressed: () => food.removeItem(item),
                            ),
                            Text(
                              '$qty',
                              style: GoogleFonts.outfit(fontWeight: FontWeight.w800, color: AppTheme.creamText, fontSize: 13),
                            ),
                            IconButton(
                              icon: const Icon(Icons.add, size: 14, color: AppTheme.creamText),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(minWidth: 28),
                              onPressed: () => food.addItem(item),
                            ),
                          ],
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

  Widget _buildBottomCartBar({required bool isQuickBuy, required String userBlock}) {
    final food = context.watch<FoodProvider>();
    final count = food.totalCartCount;
    final total = food.totalCartPrice;

    if (count == 0) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.coffeeDark.withOpacity(0.12),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$count ${count == 1 ? "Item" : "Items"} in Cart',
                  style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium, fontWeight: FontWeight.w500),
                ),
                Text(
                  '₹${total.toInt()}',
                  style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown),
                ),
              ],
            ),
            const Spacer(),
            SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: () async {
                  final order = await food.placeOrder(
                    orderType: isQuickBuy ? 'QUICK_BUY' : 'BOOK_NOW',
                    userBlock: userBlock,
                  );
                  if (mounted) {
                    _showOrderSuccessDialog(order, isQuickBuy);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.coffeeBrown,
                  foregroundColor: AppTheme.creamText,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Row(
                  children: [
                    Text(
                      isQuickBuy ? 'ORDER QUICK BUY' : 'BOOK NOW',
                      style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_rounded, size: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showOrderSuccessDialog(FoodOrder order, bool isQuickBuy) {
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
                decoration: const BoxDecoration(
                  color: AppTheme.successBg,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppTheme.successGreen, size: 48),
              ),
              const SizedBox(height: 14),
              Text(
                isQuickBuy ? '✓ Quick Buy Order Accepted' : '✓ Your Order Is Accepted',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'Order ID: ${order.orderId}',
                style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.creamBackground,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    ...order.items.map((i) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 2),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  '${i.quantity}x ${i.foodItem.name}',
                                  style: GoogleFonts.outfit(fontSize: 12),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text('₹${i.totalPrice.toInt()}', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700)),
                            ],
                          ),
                        )),
                    const Divider(color: AppTheme.creamBorder, height: 12),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Pickup Time:', style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium)),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            order.pickupServingTime,
                            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                            textAlign: TextAlign.end,
                            maxLines: 2,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Paid:', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600)),
                        Text('₹${order.totalAmount.toInt()}', style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Pickup: ${order.pickupCounter}',
                      style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('DONE'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
