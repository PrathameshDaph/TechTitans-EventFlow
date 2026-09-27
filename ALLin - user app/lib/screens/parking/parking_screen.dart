import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../models/parking.dart';
import '../../providers/parking_provider.dart';

class ParkingScreen extends StatefulWidget {
  const ParkingScreen({super.key});

  @override
  State<ParkingScreen> createState() => _ParkingScreenState();
}

class _ParkingScreenState extends State<ParkingScreen> {
  int _selectedTab = 0; // 0 = Event Parking, 1 = Rental Parking

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Top Switcher Tabs
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
                  child: _buildTabButton(
                    index: 0,
                    title: 'EVENT PARKING',
                    icon: Icons.stadium_rounded,
                  ),
                ),
                Expanded(
                  child: _buildTabButton(
                    index: 1,
                    title: 'RENTAL PARKING',
                    icon: Icons.local_parking_rounded,
                  ),
                ),
              ],
            ),
          ),
        ),

        // Main Content Area
        Expanded(
          child: _selectedTab == 0 ? _buildEventParkingTab() : _buildRentalParkingTab(),
        ),
      ],
    );
  }

  Widget _buildTabButton({
    required int index,
    required String title,
    required IconData icon,
  }) {
    final isSelected = _selectedTab == index;

    return InkWell(
      onTap: () => setState(() => _selectedTab = index),
      borderRadius: BorderRadius.circular(10),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10),
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
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 15,
              color: isSelected ? AppTheme.creamText : AppTheme.textMedium,
            ),
            const SizedBox(width: 5),
            Flexible(
              child: Text(
                title,
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? AppTheme.creamText : AppTheme.textDark,
                  letterSpacing: 0.3,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // TAB A: EVENT PARKING (Official Stadium Parking)
  // -------------------------------------------------------------
  Widget _buildEventParkingTab() {
    final parking = context.watch<ParkingProvider>();
    final blocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6', 'Block 7', 'Block 8'];
    final vehicles = ['Bike', 'Car Cruiser', 'Car XYZ', 'Premium SUV'];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Official Event Badge
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.creamBorder),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.coffeeBrown.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.verified_user_rounded, color: AppTheme.coffeeBrown, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Official Stadium Event Parking',
                        style: GoogleFonts.outfit(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textDark,
                        ),
                      ),
                      Text(
                        'Secured bays inside Wankhede Perimeter with direct concourse turnstiles.',
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: AppTheme.textMedium,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Booking Form Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.creamBorder),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.coffeeDark.withOpacity(0.05),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Select Block',
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: parking.selectedBlock,
                      isExpanded: true,
                      icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.coffeeBrown),
                      items: blocks.map((b) {
                        return DropdownMenuItem<String>(
                          value: b,
                          child: Row(
                            children: [
                              const Icon(Icons.stadium_outlined, size: 18, color: AppTheme.coffeeMedium),
                              const SizedBox(width: 10),
                              Text(
                                b,
                                style: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: AppTheme.textDark),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) parking.setSelectedBlock(val);
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                Text(
                  'Select Vehicle',
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: parking.selectedVehicle,
                      isExpanded: true,
                      icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.coffeeBrown),
                      items: vehicles.map((v) {
                        final rate = v == 'Bike'
                            ? 250.0
                            : v == 'Car Cruiser'
                                ? 350.0
                                : v == 'Car XYZ'
                                    ? 450.0
                                    : 500.0;
                        return DropdownMenuItem<String>(
                          value: v,
                          child: Row(
                            children: [
                              Icon(
                                v == 'Bike' ? Icons.two_wheeler_rounded : Icons.directions_car_rounded,
                                size: 18,
                                color: AppTheme.coffeeMedium,
                              ),
                              const SizedBox(width: 10),
                              Text(
                                v,
                                style: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: AppTheme.textDark),
                              ),
                              const Spacer(),
                              Text(
                                '₹${rate.toInt()}/hour',
                                style: GoogleFonts.outfit(
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.coffeeBrown,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) parking.setSelectedVehicle(val);
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                // Duration Selector
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Parking Duration',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textDark,
                      ),
                    ),
                    Text(
                      '${parking.eventHours} Hours',
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.coffeeBrown,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [2, 4, 6, 8].map((h) {
                    final isSel = parking.eventHours == h;
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: InkWell(
                          onTap: () => parking.setEventHours(h),
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: isSel ? AppTheme.coffeeBrown : AppTheme.creamBackground,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: isSel ? AppTheme.coffeeBrown : AppTheme.creamBorder,
                              ),
                            ),
                            child: Center(
                              child: Text(
                                '${h}h',
                                style: GoogleFonts.outfit(
                                  fontWeight: FontWeight.w700,
                                  color: isSel ? AppTheme.creamText : AppTheme.textDark,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 20),

                // Price Summary Breakdown Box
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.creamBackground,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.creamBorder),
                  ),
                  child: Column(
                    children: [
                      _buildSummaryRow('Selected Block', parking.selectedBlock),
                      const SizedBox(height: 6),
                      _buildSummaryRow('Vehicle Type', parking.selectedVehicle),
                      const SizedBox(height: 6),
                      _buildSummaryRow('Hourly Rate', '₹${parking.eventRatePerHour.toInt()}/hour'),
                      const SizedBox(height: 6),
                      _buildSummaryRow('Duration', '${parking.eventHours} Hours'),
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 8),
                        child: Divider(color: AppTheme.creamBorder, height: 1),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total Amount',
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                            ),
                          ),
                          Text(
                            '₹${parking.eventTotalAmount.toInt()}',
                            style: GoogleFonts.outfit(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.coffeeBrown,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // BOOK EVENT PARKING Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: parking.isBookingEvent
                        ? null
                        : () async {
                            final booking = await parking.bookEventParking();
                            if (mounted) {
                              _showEventBookingSuccessDialog(booking);
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.coffeeBrown,
                      foregroundColor: AppTheme.creamText,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: parking.isBookingEvent
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Text(
                            'BOOK EVENT PARKING',
                            style: GoogleFonts.outfit(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Active Bookings if any
          if (parking.eventBookings.isNotEmpty) ...[
            Text(
              'Your Active Event Parking Passes',
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),
            ...parking.eventBookings.map((b) => _buildEventBookingCard(b)),
          ],
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // TAB B: RENTAL PARKING (Nearby Verified Spots with Real Filters)
  // -------------------------------------------------------------
  Widget _buildRentalParkingTab() {
    final parking = context.watch<ParkingProvider>();
    final vehicleFilters = ['All', 'Bike', 'Car'];
    final priceFilters = ['All', '₹100–₹200', '₹200–₹350', '₹350–₹550'];

    return Column(
      children: [
        // FILTER Bar at the top
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.filter_list_rounded, size: 15, color: AppTheme.coffeeBrown),
                  const SizedBox(width: 5),
                  Expanded(
                    child: Text(
                      'FILTER RENTAL PARKING',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.coffeeBrown,
                        letterSpacing: 0.8,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${parking.rentalParkings.length} spots found',
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      color: AppTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Vehicle Filter Chips
              Row(
                children: [
                  Text(
                    'Vehicle:',
                    style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMedium),
                  ),
                  const SizedBox(width: 8),
                  ...vehicleFilters.map((vf) {
                    final isSel = parking.rentalVehicleFilter == vf;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text(vf),
                        selected: isSel,
                        onSelected: (_) => parking.setRentalVehicleFilter(vf),
                        selectedColor: AppTheme.coffeeBrown,
                        backgroundColor: AppTheme.creamBackground,
                        labelStyle: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                          color: isSel ? AppTheme.creamText : AppTheme.textDark,
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    );
                  }),
                ],
              ),

              const SizedBox(height: 6),

              // Price Range Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    Text(
                      'Price/hr:',
                      style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMedium),
                    ),
                    const SizedBox(width: 8),
                    ...priceFilters.map((pf) {
                      final isSel = parking.rentalPriceFilter == pf;
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ChoiceChip(
                          label: Text(pf),
                          selected: isSel,
                          onSelected: (_) => parking.setRentalPriceFilter(pf),
                          selectedColor: AppTheme.coffeeBrown,
                          backgroundColor: AppTheme.creamBackground,
                          labelStyle: GoogleFonts.outfit(
                            fontSize: 11,
                            fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                            color: isSel ? AppTheme.creamText : AppTheme.textDark,
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ],
          ),
        ),

        const Divider(color: AppTheme.creamBorder, height: 1),

        // Rental Parking Card List
        Expanded(
          child: parking.isLoadingRentals
              ? const Center(child: CircularProgressIndicator(color: AppTheme.coffeeBrown))
              : parking.rentalParkings.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.search_off_rounded, size: 48, color: AppTheme.textMuted),
                          const SizedBox(height: 10),
                          Text(
                            'No parking spots match your filters.',
                            style: GoogleFonts.outfit(color: AppTheme.textMedium, fontSize: 14),
                          ),
                          TextButton(
                            onPressed: () {
                              parking.setRentalVehicleFilter('All');
                              parking.setRentalPriceFilter('All');
                            },
                            child: const Text('Reset Filters'),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.all(16),
                      itemCount: parking.rentalParkings.length,
                      itemBuilder: (context, index) {
                        final spot = parking.rentalParkings[index];
                        return _buildRentalParkingCard(spot);
                      },
                    ),
        ),
      ],
    );
  }

  Widget _buildRentalParkingCard(RentalParking spot) {
    final isBike = spot.vehicleType == 'Bike';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
          // Card Header Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppTheme.creamBackground,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(17),
                topRight: Radius.circular(17),
              ),
              border: const Border(bottom: BorderSide(color: AppTheme.creamBorder)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isBike ? AppTheme.caramel.withOpacity(0.2) : AppTheme.coffeeBrown.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isBike ? Icons.two_wheeler_rounded : Icons.directions_car_rounded,
                        size: 14,
                        color: isBike ? AppTheme.coffeeDark : AppTheme.coffeeBrown,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        spot.vehicleType.toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.coffeeDark,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${spot.distanceMeters}m from Wankhede',
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      color: AppTheme.textMedium,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '₹${spot.pricePerHour.toInt()}/hr',
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.coffeeBrown,
                  ),
                ),
              ],
            ),
          ),

          // Details Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  spot.name,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 14, color: AppTheme.textMuted),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        spot.address,
                        style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.person_outline_rounded, size: 14, color: AppTheme.textMuted),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        'Owner: ${spot.owner}',
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMedium),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                // Features & Availability
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.successBg,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '${spot.availableSlots} of ${spot.totalSlots} Slots Free',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.successGreen,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        spot.features,
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Action Button: [ VIEW / BOOK ]
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => _showRentalBookingModal(spot),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.coffeeBrown,
                      foregroundColor: AppTheme.creamText,
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(
                      'VIEW / BOOK',
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showRentalBookingModal(RentalParking spot) {
    int duration = 4;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final total = spot.pricePerHour * duration;

            return Container(
              padding: const EdgeInsets.all(22),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          spot.name,
                          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  Text(
                    '${spot.address} • ${spot.distanceMeters}m from Wankhede',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                  ),

                  const SizedBox(height: 16),

                  Text(
                    'Select Duration:',
                    style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [2, 3, 4, 6].map((hrs) {
                      final isSel = duration == hrs;
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: InkWell(
                            onTap: () => setSheetState(() => duration = hrs),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: isSel ? AppTheme.coffeeBrown : AppTheme.creamBackground,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: isSel ? AppTheme.coffeeBrown : AppTheme.creamBorder),
                              ),
                              child: Center(
                                child: Text(
                                  '$hrs hrs',
                                  style: GoogleFonts.outfit(
                                    fontWeight: FontWeight.w700,
                                    color: isSel ? AppTheme.creamText : AppTheme.textDark,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 18),

                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.creamBackground,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Amount to Pay:', style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600)),
                        Text('₹${total.toInt()}', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown)),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () async {
                        Navigator.pop(ctx);
                        final booking = await context.read<ParkingProvider>().bookRentalParking(spot, duration);
                        _showRentalBookingSuccessDialog(booking);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.coffeeBrown,
                        foregroundColor: AppTheme.creamText,
                      ),
                      child: Text(
                        'CONFIRM RENTAL BOOKING',
                        style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showEventBookingSuccessDialog(EventParkingBooking booking) {
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
                '✓ Parking Booked Successfully',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'Official Stadium Event Parking',
                style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.creamBackground,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.creamBorder),
                ),
                child: Column(
                  children: [
                    _buildSummaryRow('Block', booking.block),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Vehicle', booking.vehicleType),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Duration', '${booking.durationHours} Hours'),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Amount', '₹${booking.totalAmount.toInt()}'),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Reference', booking.bookingRef),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Assigned Bay', booking.allocatedSlot),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.coffeeBrown,
                    foregroundColor: AppTheme.creamText,
                  ),
                  child: const Text('DONE'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showRentalBookingSuccessDialog(RentalParkingBooking booking) {
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
                '✓ Rental Parking Confirmed',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.creamBackground,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    _buildSummaryRow('Location', booking.rentalSpotName),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Vehicle', booking.vehicleType),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Duration', '${booking.durationHours} Hours'),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Amount Paid', '₹${booking.totalAmount.toInt()}'),
                    const SizedBox(height: 4),
                    _buildSummaryRow('Booking Ref', booking.bookingRef),
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

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textDark),
            textAlign: TextAlign.end,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildEventBookingCard(EventParkingBooking b) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.creamBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.coffeeBrown,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.qr_code_rounded, color: AppTheme.creamText, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${b.block} • ${b.allocatedSlot}',
                  style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 14),
                ),
                Text(
                  'Ref: ${b.bookingRef} • ${b.vehicleType}',
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMedium),
                ),
              ],
            ),
          ),
          Text(
            '₹${b.totalAmount.toInt()}',
            style: GoogleFonts.outfit(fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown, fontSize: 15),
          ),
        ],
      ),
    );
  }
}
