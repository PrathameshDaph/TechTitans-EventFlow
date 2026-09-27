import 'package:flutter/material.dart';

enum SiteCategory {
  stadium,
  food,
  parking,
  transport,
  emergency,
  gate,
  facility,
  pathway,
}

class SitePlanBlock {
  final String id;
  final String keyNumber;
  final String name;
  final String shortLabel;
  final SiteCategory category;
  final Color fillColor;
  final Color strokeColor;
  final Rect bounds;
  final String purpose;
  final String nearestGate;
  final String walkingTime;
  final IconData icon;

  const SitePlanBlock({
    required this.id,
    required this.keyNumber,
    required this.name,
    required this.shortLabel,
    required this.category,
    required this.fillColor,
    required this.strokeColor,
    required this.bounds,
    required this.purpose,
    required this.nearestGate,
    required this.walkingTime,
    required this.icon,
  });
}

class SitePlanData {
  static const double canvasWidth = 840.0;
  static const double canvasHeight = 620.0;

  static const Color roadColor = Color(0xFFD6D3CD);
  static const Color boundaryColor = Color(0xFF8D6E63);
  static const Color pathwayColor = Color(0xFFEFE8DC);
  static const Color pitchGreen = Color(0xFF7CB342);
  static const Color pitchTurf = Color(0xFFD7CCC8);

  static final List<SitePlanBlock> blocks = [
    // -------------------------------------------------------------------------
    // STADIUM SEATING BLOCKS (1 to 8)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'block_1',
      keyNumber: '1',
      name: 'Block 1 — Sunil Gavaskar Stand (North)',
      shortLabel: 'Block 1',
      category: SiteCategory.stadium,
      fillColor: Color(0xFF90CAF9),
      strokeColor: Color(0xFF1565C0),
      bounds: Rect.fromLTWH(210, 150, 100, 48),
      purpose: 'North premium seating stand overlooking bowler run-up.',
      nearestGate: 'Gate 2 (North Gate)',
      walkingTime: '2 mins from North Concourse',
      icon: Icons.stadium_rounded,
    ),
    const SitePlanBlock(
      id: 'block_2',
      keyNumber: '2',
      name: 'Block 2 — North-East Upper & Lower Tier',
      shortLabel: 'Block 2',
      category: SiteCategory.stadium,
      fillColor: Color(0xFFBBDEFB),
      strokeColor: Color(0xFF1976D2),
      bounds: Rect.fromLTWH(305, 175, 75, 52),
      purpose: 'North-East grandstand seating with concourse access.',
      nearestGate: 'Gate 2 & Gate 3',
      walkingTime: '3 mins from Food Court',
      icon: Icons.stadium_rounded,
    ),
    const SitePlanBlock(
      id: 'block_3',
      keyNumber: '3',
      name: 'Block 3 — Sachin Tendulkar Stand (East)',
      shortLabel: 'Block 3',
      category: SiteCategory.stadium,
      fillColor: Color(0xFF64B5F6),
      strokeColor: Color(0xFF0D47A1),
      bounds: Rect.fromLTWH(345, 235, 65, 80),
      purpose: 'East pavilion stand dedicated to legend Sachin Tendulkar.',
      nearestGate: 'Gate 3 (East Gate)',
      walkingTime: '1 min from Gate 3 Concourse',
      icon: Icons.stadium_rounded,
    ),
    const SitePlanBlock(
      id: 'block_4',
      keyNumber: '4',
      name: 'Block 4 — South-East Stand',
      shortLabel: 'Block 4',
      category: SiteCategory.stadium,
      fillColor: Color(0xFF90CAF9),
      strokeColor: Color(0xFF1565C0),
      bounds: Rect.fromLTWH(305, 325, 75, 52),
      purpose: 'South-East stand adjacent to player tunnel and media box.',
      nearestGate: 'Gate 3 & Gate 4',
      walkingTime: '3 mins from Event Parking P1',
      icon: Icons.stadium_rounded,
    ),
    const SitePlanBlock(
      id: 'block_5',
      keyNumber: '5',
      name: 'Block 5 — South Stand Pavilion (Your Stand)',
      shortLabel: 'Block 5',
      category: SiteCategory.stadium,
      fillColor: Color(0xFF42A5F5),
      strokeColor: Color(0xFF0D47A1),
      bounds: Rect.fromLTWH(210, 375, 100, 50),
      purpose: 'Main Pavilion South Stand. Your ticketed seats are in Row J.',
      nearestGate: 'Gate 4 (South Marine Drive Gate)',
      walkingTime: 'Direct access via South Concourse',
      icon: Icons.stars_rounded,
    ),
    const SitePlanBlock(
      id: 'block_6',
      keyNumber: '6',
      name: 'Block 6 — South-West Stand',
      shortLabel: 'Block 6',
      category: SiteCategory.stadium,
      fillColor: Color(0xFFBBDEFB),
      strokeColor: Color(0xFF1976D2),
      bounds: Rect.fromLTWH(140, 325, 75, 52),
      purpose: 'South-West stand with sweeping views of the entire field.',
      nearestGate: 'Gate 1 & Gate 4',
      walkingTime: '2 mins from Marine Drive entrance',
      icon: Icons.stadium_rounded,
    ),
    const SitePlanBlock(
      id: 'block_7',
      keyNumber: '7',
      name: 'Block 7 — Vijay Merchant Stand (West)',
      shortLabel: 'Block 7',
      category: SiteCategory.stadium,
      fillColor: Color(0xFF64B5F6),
      strokeColor: Color(0xFF0D47A1),
      bounds: Rect.fromLTWH(110, 235, 65, 80),
      purpose: 'Historic West Pavilion named after Vijay Merchant.',
      nearestGate: 'Gate 1 (Main Marine Drive Gate)',
      walkingTime: '1 min from Gate 1',
      icon: Icons.stadium_rounded,
    ),
    const SitePlanBlock(
      id: 'block_8',
      keyNumber: '8',
      name: 'Block 8 — North-West Stand',
      shortLabel: 'Block 8',
      category: SiteCategory.stadium,
      fillColor: Color(0xFF90CAF9),
      strokeColor: Color(0xFF1565C0),
      bounds: Rect.fromLTWH(140, 175, 75, 52),
      purpose: 'North-West general audience stand with wide sightlines.',
      nearestGate: 'Gate 1 & Gate 2',
      walkingTime: '2 mins from VIP Concourse',
      icon: Icons.stadium_rounded,
    ),

    // -------------------------------------------------------------------------
    // FOOD & HOSPITALITY (Green tones)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'food_court',
      keyNumber: '11',
      name: 'Main Food Court & Concessions',
      shortLabel: 'Food Stalls',
      category: SiteCategory.food,
      fillColor: Color(0xFFA5D6A7),
      strokeColor: Color(0xFF2E7D32),
      bounds: Rect.fromLTWH(445, 160, 115, 75),
      purpose: '18 Food stalls, wraps, biryani, burgers, dosas & refreshments.',
      nearestGate: 'Gate 3 (East Gate)',
      walkingTime: '3 mins from Block 5 South Stand',
      icon: Icons.restaurant_rounded,
    ),
    const SitePlanBlock(
      id: 'snack_kiosks',
      keyNumber: '12',
      name: 'Express Beverage & Snack Kiosks',
      shortLabel: 'Snack Kiosks',
      category: SiteCategory.food,
      fillColor: Color(0xFFC8E6C9),
      strokeColor: Color(0xFF388E3C),
      bounds: Rect.fromLTWH(570, 160, 75, 55),
      purpose: 'Quick buy tea, coffee, cold drinks, water bottles and popcorn.',
      nearestGate: 'Gate 3 Concourse',
      walkingTime: '4 mins from Block 3 & 4',
      icon: Icons.local_cafe_rounded,
    ),

    // -------------------------------------------------------------------------
    // PARKING (Yellow & Amber tones)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'event_parking_p1',
      keyNumber: '13',
      name: 'Official Event Parking Area P1',
      shortLabel: 'Event Parking P1',
      category: SiteCategory.parking,
      fillColor: Color(0xFFFFE082),
      strokeColor: Color(0xFFF57F17),
      bounds: Rect.fromLTWH(445, 345, 120, 85),
      purpose: 'Official secured stadium parking. Valid parking pass required.',
      nearestGate: 'Gate 4 (South Concourse Access)',
      walkingTime: '3 mins walk to Stadium Gate 4',
      icon: Icons.local_parking_rounded,
    ),
    const SitePlanBlock(
      id: 'rental_parking_p2',
      keyNumber: '14',
      name: 'Rental & Public Parking Area P2',
      shortLabel: 'Rental Parking P2',
      category: SiteCategory.parking,
      fillColor: Color(0xFFFFF59D),
      strokeColor: Color(0xFFFBC02D),
      bounds: Rect.fromLTWH(575, 345, 135, 85),
      purpose: 'Nearby commercial & rental parking spaces for bikes & cars.',
      nearestGate: 'E Road Concourse Link',
      walkingTime: '5 mins walk via E Road',
      icon: Icons.drive_eta_rounded,
    ),

    // -------------------------------------------------------------------------
    // TRANSPORT (Purple tones)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'metro_station',
      keyNumber: '15',
      name: 'Churchgate Metro & Rail Hub',
      shortLabel: 'Metro/Transport Point',
      category: SiteCategory.transport,
      fillColor: Color(0xFFCE93D8),
      strokeColor: Color(0xFF6A1B9A),
      bounds: Rect.fromLTWH(655, 105, 80, 105),
      purpose: 'High-frequency Mumbai Metro Line 3 & Western Railway terminus.',
      nearestGate: 'North-East Exit & H Road',
      walkingTime: '4 mins walk from North Gate',
      icon: Icons.directions_subway_rounded,
    ),
    const SitePlanBlock(
      id: 'shuttle_taxi',
      keyNumber: '16',
      name: 'Shuttle Bus & Taxi Drop-off Zone',
      shortLabel: 'Taxi Stand',
      category: SiteCategory.transport,
      fillColor: Color(0xFFE1BEE7),
      strokeColor: Color(0xFF7B1FA2),
      bounds: Rect.fromLTWH(655, 220, 80, 75),
      purpose: 'Designated app cabs (Uber/Ola), Kaali Peeli taxis and feeder buses.',
      nearestGate: 'East Pedestrian Link',
      walkingTime: '4 mins walk from East Gate 3',
      icon: Icons.local_taxi_rounded,
    ),

    // -------------------------------------------------------------------------
    // EMERGENCY & MEDICAL (Red tones)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'medical_point',
      keyNumber: '17',
      name: 'First Aid / Medical Help Point',
      shortLabel: 'Medical Help Point',
      category: SiteCategory.emergency,
      fillColor: Color(0xFFFFCDD2),
      strokeColor: Color(0xFFC62828),
      bounds: Rect.fromLTWH(445, 260, 95, 60),
      purpose: '24/7 Paramedics, emergency trauma doctors and ambulance post.',
      nearestGate: 'Gate 3 Central Concourse',
      walkingTime: 'Immediate medical assistance',
      icon: Icons.medical_services_rounded,
    ),
    const SitePlanBlock(
      id: 'assembly_point',
      keyNumber: '18',
      name: 'Emergency Assembly Point',
      shortLabel: 'Assembly Area',
      category: SiteCategory.emergency,
      fillColor: Color(0xFFFFAB91),
      strokeColor: Color(0xFFD84315),
      bounds: Rect.fromLTWH(655, 445, 80, 80),
      purpose: 'Designated wide open safe ground for evacuation and crowd assembly.',
      nearestGate: 'South-East Emergency Exit E3',
      walkingTime: 'Open courtyard zone',
      icon: Icons.emergency_share_rounded,
    ),

    // -------------------------------------------------------------------------
    // FACILITIES & RESTROOMS (Slate & Blue tones)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'washrooms_north',
      keyNumber: '21',
      name: 'Washrooms & Restrooms (North Concourse)',
      shortLabel: 'Washrooms',
      category: SiteCategory.facility,
      fillColor: Color(0xFFB0BEC5),
      strokeColor: Color(0xFF37474F),
      bounds: Rect.fromLTWH(445, 105, 80, 42),
      purpose: 'Hygienic Male, Female and Specially-Abled Restrooms.',
      nearestGate: 'Gate 2 Concourse',
      walkingTime: '1 min from Block 1 & 2',
      icon: Icons.wc_rounded,
    ),
    const SitePlanBlock(
      id: 'washrooms_south',
      keyNumber: '22',
      name: 'Washrooms & Restrooms (South Concourse)',
      shortLabel: 'Washrooms (S)',
      category: SiteCategory.facility,
      fillColor: Color(0xFFCFD8DC),
      strokeColor: Color(0xFF455A64),
      bounds: Rect.fromLTWH(445, 445, 80, 50),
      purpose: 'South Concourse Restroom facilities with water purification.',
      nearestGate: 'Gate 4 Concourse',
      walkingTime: '1 min from Block 5 South Stand',
      icon: Icons.wc_rounded,
    ),
    const SitePlanBlock(
      id: 'info_desk',
      keyNumber: '24',
      name: 'Information & Help Desk / Lost Property',
      shortLabel: 'Info Desk',
      category: SiteCategory.facility,
      fillColor: Color(0xFF9FA8DA),
      strokeColor: Color(0xFF283593),
      bounds: Rect.fromLTWH(535, 105, 105, 42),
      purpose: 'Visitor inquiries, accessibility passes, lost & found claim counter.',
      nearestGate: 'Gate 3 Central Concourse',
      walkingTime: '2 mins from Main Concourse',
      icon: Icons.info_rounded,
    ),
    const SitePlanBlock(
      id: 'crew_hub',
      keyNumber: '25',
      name: 'Crew & Staff Operations Hub',
      shortLabel: 'Crew/Staff Area',
      category: SiteCategory.facility,
      fillColor: Color(0xFF90A4AE),
      strokeColor: Color(0xFF263238),
      bounds: Rect.fromLTWH(550, 260, 95, 60),
      purpose: 'EventFlow command post, security operations & steward briefing center.',
      nearestGate: 'Internal Staff Entrance',
      walkingTime: 'Authorized event crew only',
      icon: Icons.badge_rounded,
    ),
    const SitePlanBlock(
      id: 'rest_lounge',
      keyNumber: '23',
      name: 'Shaded Visitor Lounge & Rest Area',
      shortLabel: 'Rest Area',
      category: SiteCategory.facility,
      fillColor: Color(0xFF80CBC4),
      strokeColor: Color(0xFF00695C),
      bounds: Rect.fromLTWH(535, 445, 110, 50),
      purpose: 'Covered seating benches, mobile charging docks and quiet rest zone.',
      nearestGate: 'Gate 4 Link',
      walkingTime: '2 mins from South Stand',
      icon: Icons.weekend_rounded,
    ),
    const SitePlanBlock(
      id: 'water_station_1',
      keyNumber: 'W',
      name: 'Drinking Water Station (Free Filtered)',
      shortLabel: 'Drinking Water',
      category: SiteCategory.facility,
      fillColor: Color(0xFF80DEEA),
      strokeColor: Color(0xFF00838F),
      bounds: Rect.fromLTWH(385, 110, 50, 36),
      purpose: 'Free RO-filtered chilled drinking water refill stations.',
      nearestGate: 'North-East Concourse',
      walkingTime: 'Available across all concourses',
      icon: Icons.water_drop_rounded,
    ),

    // -------------------------------------------------------------------------
    // ENTRY & EXIT GATES (White / Light Slate)
    // -------------------------------------------------------------------------
    const SitePlanBlock(
      id: 'gate_1',
      keyNumber: 'G1',
      name: 'Main Public Gate 1 (Marine Drive / D Road)',
      shortLabel: 'Entry Gate 1',
      category: SiteCategory.gate,
      fillColor: Colors.white,
      strokeColor: Color(0xFF424242),
      bounds: Rect.fromLTWH(55, 255, 48, 45),
      purpose: 'Primary West audience entry for Blocks 6, 7 and 8.',
      nearestGate: 'Marine Drive Concourse',
      walkingTime: 'Direct entry via D Road',
      icon: Icons.meeting_room_rounded,
    ),
    const SitePlanBlock(
      id: 'gate_2',
      keyNumber: 'G2',
      name: 'Gate 2 (North Churchgate Link)',
      shortLabel: 'Entry Gate 2',
      category: SiteCategory.gate,
      fillColor: Colors.white,
      strokeColor: Color(0xFF424242),
      bounds: Rect.fromLTWH(235, 60, 50, 38),
      purpose: 'North audience entry for Blocks 1, 2 and Metro arrivals.',
      nearestGate: 'Churchgate Metro Walkway',
      walkingTime: 'Direct from H Road',
      icon: Icons.meeting_room_rounded,
    ),
    const SitePlanBlock(
      id: 'gate_3',
      keyNumber: 'G3',
      name: 'Gate 3 (East Gate — E Road)',
      shortLabel: 'Entry Gate 3',
      category: SiteCategory.gate,
      fillColor: Colors.white,
      strokeColor: Color(0xFF424242),
      bounds: Rect.fromLTWH(408, 255, 34, 45),
      purpose: 'East gate for Sachin Tendulkar Stand, Food Court & Medical Center.',
      nearestGate: 'E Road Concourse',
      walkingTime: 'Direct access from E Road',
      icon: Icons.meeting_room_rounded,
    ),
    const SitePlanBlock(
      id: 'gate_4',
      keyNumber: 'G4',
      name: 'Gate 4 (South Pavilion Marine Drive Gate)',
      shortLabel: 'Entry Gate 4',
      category: SiteCategory.gate,
      fillColor: Colors.white,
      strokeColor: Color(0xFF424242),
      bounds: Rect.fromLTWH(235, 490, 50, 38),
      purpose: 'Primary access gate for Block 5 Pavilion & South Stand.',
      nearestGate: 'South Marine Drive Link',
      walkingTime: 'Direct access to Block 5',
      icon: Icons.meeting_room_rounded,
    ),
    const SitePlanBlock(
      id: 'emergency_exits',
      keyNumber: 'EX',
      name: 'Emergency Exits & Evacuation Gates',
      shortLabel: 'Emergency Exits',
      category: SiteCategory.gate,
      fillColor: Color(0xFFFFEBEE),
      strokeColor: Color(0xFFD32F2F),
      bounds: Rect.fromLTWH(60, 485, 52, 42),
      purpose: 'High-throughput emergency exits leading directly to open ring roads.',
      nearestGate: 'West Perimeter Wall',
      walkingTime: 'Fast emergency egress',
      icon: Icons.exit_to_app_rounded,
    ),
  ];

  static SitePlanBlock? findById(String id) {
    try {
      return blocks.firstWhere((b) => b.id == id);
    } catch (_) {
      return null;
    }
  }

  static SitePlanBlock? findByBlockNumber(String blockNumber) {
    final clean = blockNumber.replaceAll(RegExp(r'[^0-9]'), '');
    try {
      return blocks.firstWhere((b) => b.keyNumber == clean && b.category == SiteCategory.stadium);
    } catch (_) {
      return null;
    }
  }

  static SitePlanBlock? hitTest(Offset point) {
    for (final b in blocks) {
      if (b.bounds.contains(point)) {
        return b;
      }
    }
    return null;
  }
}
