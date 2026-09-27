import '../models/user.dart';
import '../models/event.dart';
import '../models/ticket.dart';
import '../models/parking.dart';
import '../models/food.dart';
import '../models/notification_item.dart';
import '../models/contact.dart';

class MockDataService {
  static final List<User> mockUsers = [
    const User(
      id: 'usr_001',
      name: 'Rahul',
      username: 'Rahul',
      phone: '9820123456',
      email: 'rahul.sharma@example.com',
      assignedBlock: 'Block 5',
      seatNumber: 'Row K • Seat 42',
      ticketId: 'ALLIN-WAN-2026-9842',
    ),
    const User(
      id: 'usr_002',
      name: 'Priya',
      username: 'Priya',
      phone: '9819234567',
      email: 'priya.patel@example.com',
      assignedBlock: 'Block 2',
      seatNumber: 'Row C • Seat 18',
      ticketId: 'ALLIN-WAN-2026-4412',
    ),
    const User(
      id: 'usr_003',
      name: 'Amit',
      username: 'Amit',
      phone: '9833456789',
      email: 'amit.verma@example.com',
      assignedBlock: 'Block 7',
      seatNumber: 'Row M • Seat 09',
      ticketId: 'ALLIN-WAN-2026-7781',
    ),
    const User(
      id: 'usr_004',
      name: 'Sneha',
      username: 'Sneha',
      phone: '9819876543',
      email: 'sneha.deshmukh@example.com',
      assignedBlock: 'Block 4',
      seatNumber: 'Row F • Seat 25',
      ticketId: 'ALLIN-WAN-2026-3190',
    ),
    const User(
      id: 'usr_005',
      name: 'Vikram',
      username: 'Vikram',
      phone: '9820345678',
      email: 'vikram.joshi@example.com',
      assignedBlock: 'Block 1',
      seatNumber: 'Row A • Seat 12',
      ticketId: 'ALLIN-WAN-2026-1055',
    ),
  ];

  static const Event currentEvent = Event(
    id: 'evt_wan_01',
    title: 'India vs Pakistan',
    subtitle: 'ICC Cricket Championship Special • Match Day',
    stadiumName: 'Wankhede Stadium',
    locationAddress: 'D Road, Churchgate, Mumbai, Maharashtra 400020',
    timing: '5:00 PM – 11:00 PM',
    date: 'Saturday, 26 September 2026',
    gatesOpen: '3:30 PM',
    tossTime: '4:30 PM',
    status: 'Gates Open • Crowd Entry Active',
    weather: '28°C • Breezy & Clear Evening',
  );

  static Ticket getTicketForUser(User user) {
    return Ticket(
      ticketId: user.ticketId,
      eventTitle: currentEvent.title,
      stadiumName: currentEvent.stadiumName,
      visitorName: user.name,
      block: user.assignedBlock,
      row: user.seatNumber.split('•').first.trim(),
      seat: user.seatNumber.split('•').last.trim(),
      gate: _getGateForBlock(user.assignedBlock),
      dateTime: '${currentEvent.date} • ${currentEvent.timing}',
      qrPayload: 'ALLIN-ENTRY-PASS:${user.ticketId}:${user.name}:${user.assignedBlock}:WANKHEDE',
      isScanned: false,
      category: 'North Stand Level 2 — Premium Pavilion',
    );
  }

  static String _getGateForBlock(String block) {
    switch (block) {
      case 'Block 1':
        return 'Gate 1 (West Pavilion)';
      case 'Block 2':
        return 'Gate 2 (North Concourse)';
      case 'Block 3':
        return 'Gate 3 (Garware Stand)';
      case 'Block 4':
        return 'Gate 4 (East Concourse)';
      case 'Block 5':
        return 'Gate 5 (North Stand East)';
      case 'Block 6':
        return 'Gate 6 (Vijay Merchant Stand)';
      case 'Block 7':
        return 'Gate 7 (Sunil Gavaskar Pavilion)';
      case 'Block 8':
      default:
        return 'Gate 3 (South Concourse)';
    }
  }

  // Official Event Parking Pricing (Strictly ABOVE ₹200/hr)
  static final Map<String, double> eventParkingRates = {
    'Bike': 250.0,
    'Car Cruiser': 350.0,
    'Car XYZ': 450.0,
    'Premium SUV': 500.0,
  };

  static final List<String> stadiumBlocks = [
    'Block 1',
    'Block 2',
    'Block 3',
    'Block 4',
    'Block 5',
    'Block 6',
    'Block 7',
    'Block 8',
  ];

  // Rental Parking listings (Prices: Bike ₹120–₹200/hr, Cars ₹250–₹550/hr)
  static final List<RentalParking> rentalParkings = [
    const RentalParking(
      id: 'rpk_01',
      name: 'Marine Drive Plaza Parking',
      address: 'Near Sundar Mahal, Marine Drive, Mumbai',
      owner: 'Marine Drive Commercial Assoc.',
      vehicleType: 'Bike',
      pricePerHour: 120.0,
      availableSlots: 14,
      totalSlots: 30,
      distanceMeters: 450,
      description: 'Shaded 2-wheeler bays with CCTV security and quick pedestrian route to Gate 5.',
      features: 'CCTV • Paved Surface • 24x7 Guard',
    ),
    const RentalParking(
      id: 'rpk_02',
      name: 'Churchgate West Station Deck',
      address: 'Opposite Churchgate Terminus, Mumbai',
      owner: 'Western Commuter Hub',
      vehicleType: 'Bike',
      pricePerHour: 160.0,
      availableSlots: 22,
      totalSlots: 50,
      distanceMeters: 250,
      description: 'Closest parking to Wankhede Stadium. Direct 3-minute walking distance.',
      features: 'Immediate Gate 1 Access • Covered Area',
    ),
    const RentalParking(
      id: 'rpk_03',
      name: 'Eros Cinema Lane Parking',
      address: 'Cambata Building, Jamshedji Tata Rd',
      owner: 'Eros Commercial Valet',
      vehicleType: 'Bike',
      pricePerHour: 190.0,
      availableSlots: 9,
      totalSlots: 25,
      distanceMeters: 380,
      description: 'Designated two-wheeler security enclosure with dedicated entry/exit lanes.',
      features: 'Valet Assistance • Fast Check-out',
    ),
    const RentalParking(
      id: 'rpk_04',
      name: 'Brabourne Club Reserved Lot',
      address: 'Veer Nariman Rd, Churchgate',
      owner: 'CCI Hospitality Management',
      vehicleType: 'Car',
      pricePerHour: 280.0,
      availableSlots: 11,
      totalSlots: 40,
      distanceMeters: 600,
      description: 'Spacious secured car parking bays inside club compound. Hassle-free ingress.',
      features: 'Boom Barrier • Wide Stalls • Security',
    ),
    const RentalParking(
      id: 'rpk_05',
      name: 'Oval Maidan Secure Parking',
      address: 'Maharshi Karve Rd, Mantralaya Side',
      owner: 'Mumbai Heritage Parking Corp.',
      vehicleType: 'Car',
      pricePerHour: 340.0,
      availableSlots: 18,
      totalSlots: 60,
      distanceMeters: 520,
      description: 'Well-lit gated compound right adjacent to Oval Maidan with dedicated guards.',
      features: 'Multi-lane Ingress • CCTV Monitoring',
    ),
    const RentalParking(
      id: 'rpk_06',
      name: 'Express Towers Basement Bay',
      address: 'Barrister Rajni Patel Marg, Nariman Point',
      owner: 'Nariman Infra Properties',
      vehicleType: 'Car',
      pricePerHour: 430.0,
      availableSlots: 8,
      totalSlots: 35,
      distanceMeters: 750,
      description: 'Air-conditioned underground multistory bay. Ideal for high-end cruisers and SUVs.',
      features: 'Covered Basement • Valet On Demand',
    ),
    const RentalParking(
      id: 'rpk_07',
      name: 'Cooperage Sports Complex Lot',
      address: 'Maharshi Karve Rd, Cooperage, Mumbai',
      owner: 'Sports Hub Mumbai',
      vehicleType: 'Car',
      pricePerHour: 510.0,
      availableSlots: 15,
      totalSlots: 50,
      distanceMeters: 850,
      description: 'Premium VIP open-ground reserved bays with wide maneuvering lanes.',
      features: 'EV Charging • Dedicated Guards',
    ),
  ];

  // Food Menu Items (Vegetarian & Non-Vegetarian)
  static final List<FoodItem> foodItems = [
    const FoodItem(
      id: 'fd_veg_01',
      name: 'Paneer Wrap',
      description: 'Soft whole-wheat wrap stuffed with spiced cottage cheese, crunchy onions, and fresh mint chutney.',
      isVeg: true,
      price: 180.0,
      availableTime: 'Ready in 10-12 mins',
      category: 'Wraps & Rolls',
    ),
    const FoodItem(
      id: 'fd_veg_02',
      name: 'Veg Burger',
      description: 'Crispy herb potato patty topped with melted cheddar, fresh tomato slice, and tangy stadium sauce.',
      isVeg: true,
      price: 150.0,
      availableTime: 'Ready in 8-10 mins',
      category: 'Burgers',
    ),
    const FoodItem(
      id: 'fd_veg_03',
      name: 'Masala Dosa',
      description: 'Classic crisp golden rice crepe stuffed with spiced potato masala, served with piping sambar and coconut chutney.',
      isVeg: true,
      price: 160.0,
      availableTime: 'Ready in 12-15 mins',
      category: 'South Indian Specials',
    ),
    const FoodItem(
      id: 'fd_veg_04',
      name: 'Veg Biryani',
      description: 'Fragrant basmati rice slow-cooked with garden vegetables, saffron milk, and aromatic whole spices.',
      isVeg: true,
      price: 220.0,
      availableTime: 'Ready in 10 mins',
      category: 'Meals & Bowls',
    ),
    const FoodItem(
      id: 'fd_veg_05',
      name: 'French Fries',
      description: 'Crispy golden potato fries lightly seasoned with sea salt and peri-peri seasoning, served with creamy dip.',
      isVeg: true,
      price: 120.0,
      availableTime: 'Ready in 5-7 mins',
      category: 'Quick Bites',
    ),
    const FoodItem(
      id: 'fd_nv_01',
      name: 'Chicken Burger',
      description: 'Grilled spiced chicken fillet with garlic emulsion, crunchy iceberg lettuce, and melted cheese in sesame bun.',
      isVeg: false,
      price: 220.0,
      availableTime: 'Ready in 10 mins',
      category: 'Burgers',
    ),
    const FoodItem(
      id: 'fd_nv_02',
      name: 'Chicken Biryani',
      description: 'Authentic Mumbai-style dum biryani with tender chicken pieces, aromatic spices, and cooling cucumber raita.',
      isVeg: false,
      price: 280.0,
      availableTime: 'Ready in 10-15 mins',
      category: 'Meals & Bowls',
    ),
    const FoodItem(
      id: 'fd_nv_03',
      name: 'Chicken Wrap',
      description: 'Juicy shredded chicken tikka rolled in artisan flatbread with spiced bell peppers and chipotle dressing.',
      isVeg: false,
      price: 210.0,
      availableTime: 'Ready in 10 mins',
      category: 'Wraps & Rolls',
    ),
    const FoodItem(
      id: 'fd_nv_04',
      name: 'Chicken Tikka',
      description: 'Tender chicken boneless cubes marinated in Kashmiri yogurt masala and charbroiled to smoky perfection.',
      isVeg: false,
      price: 260.0,
      availableTime: 'Ready in 12-15 mins',
      category: 'Tandoor & Starters',
    ),
  ];

  static final List<String> pickupTimeSlots = [
    '5:30 PM (Pre-Match Early Snack)',
    '6:30 PM (Powerplay Overs)',
    '7:45 PM (Innings Break)',
    '8:45 PM (Death Overs Rush)',
    '9:30 PM (Post-Match Refreshment)',
  ];

  // Initial Notifications with Missing Child alert and Manager alerts
  static final List<NotificationItem> initialNotifications = [
    const NotificationItem(
      id: 'notif_001',
      title: 'URGENT — MISSING CHILD',
      message: 'Missing Child Alert: Kabir (Age 6) last seen near Gate 2 Food Concourse. Wearing yellow t-shirt and blue denim shorts.',
      timeAgo: '5 mins ago',
      type: NotificationType.missingChild,
      isRead: false,
      relatedBlock: 'Block 5',
      relatedGate: 'Gate 2',
      isManagerAlert: true,
      isMissingChild: true,
      childName: 'Kabir',
      childAge: '6 years',
      childLastSeen: 'Gate 2 Food Concourse',
      childReportedBlock: 'Block 5',
      childDescription: 'Yellow T-shirt, blue denim shorts, white velcro sneakers.',
      parentContact: '9820112345',
      recommendedAction: 'If spotted, keep child accompanied and tap I Found This Child immediately.',
    ),
    const NotificationItem(
      id: 'notif_002',
      title: 'Gate 3 is crowded — use Gate 6',
      message: 'Gate 3 experiencing high entry queue density. Visitors for Blocks 3, 4, and 5 are strongly advised to use Gate 6 for 2-minute express entry.',
      timeAgo: '12 mins ago',
      type: NotificationType.gateUpdate,
      isRead: false,
      relatedBlock: 'Block 3',
      relatedGate: 'Gate 3',
      recommendedAction: 'Head 40 meters north towards Gate 6 for faster clearance.',
      isManagerAlert: true,
    ),
    const NotificationItem(
      id: 'notif_003',
      title: 'Parking Block 4 is full',
      message: 'Official Parking Block 4 is at 100% capacity. Newly arriving vehicles are being directed to Block 5 and nearby Marine Drive Plaza lot.',
      timeAgo: '20 mins ago',
      type: NotificationType.parkingUpdate,
      isRead: false,
      relatedBlock: 'Block 4',
      recommendedAction: 'Select Block 5 or Reserve Rental Parking at Marine Drive Plaza.',
      isManagerAlert: true,
    ),
    const NotificationItem(
      id: 'notif_004',
      title: 'Traffic Advisory: Marine Drive Route',
      message: 'Veer Nariman Road bottleneck detected. Traffic police recommending incoming visitors to take the Marine Drive promenade route.',
      timeAgo: '35 mins ago',
      type: NotificationType.trafficAlert,
      isRead: true,
      recommendedAction: 'Take Marine Drive promenade flyover for smooth access.',
      isManagerAlert: true,
    ),
    const NotificationItem(
      id: 'notif_005',
      title: 'Toss Update & National Anthem',
      message: 'Toss will take place at 4:30 PM. All spectators are requested to be seated by 4:45 PM for the pre-match ceremony and National Anthem.',
      timeAgo: '45 mins ago',
      type: NotificationType.announcement,
      isRead: true,
    ),
    const NotificationItem(
      id: 'notif_006',
      title: 'Food Concourse Innings Pre-Order Open',
      message: 'Avoid mid-game queues. Pre-order your meals now using BOOK NOW to have food ready at your block food counter during Innings break.',
      timeAgo: '1 hour ago',
      type: NotificationType.venueInfo,
      isRead: true,
    ),
  ];

  // Contact Persons
  static const ContactPerson eventManager = ContactPerson(
    id: 'cnt_mgr',
    name: 'Vikramaditya Singhania',
    role: 'Chief Stadium Operations Director',
    phone: '9820154321',
    email: 'operations.wankhede@allin-events.in',
    type: ContactType.eventManager,
  );

  static final Map<String, ContactPerson> blockCrewHeads = {
    'Block 1': const ContactPerson(
      id: 'ch_1',
      name: 'Rajesh Kadam',
      role: 'Block 1 Pavilion Crew Lead',
      phone: '9820199881',
      type: ContactType.blockCrewHead,
      block: 'Block 1',
    ),
    'Block 2': const ContactPerson(
      id: 'ch_2',
      name: 'Pooja Salunkhe',
      role: 'Block 2 North Stand Crew Lead',
      phone: '9819288772',
      type: ContactType.blockCrewHead,
      block: 'Block 2',
    ),
    'Block 3': const ContactPerson(
      id: 'ch_3',
      name: 'Sandeep Shinde',
      role: 'Block 3 Garware Stand Crew Lead',
      phone: '9833477663',
      type: ContactType.blockCrewHead,
      block: 'Block 3',
    ),
    'Block 4': const ContactPerson(
      id: 'ch_4',
      name: 'Deepak Sawant',
      role: 'Block 4 East Stand Crew Lead',
      phone: '9819866554',
      type: ContactType.blockCrewHead,
      block: 'Block 4',
    ),
    'Block 5': const ContactPerson(
      id: 'ch_5',
      name: 'Rahul Sharma',
      role: 'Block 5 North Stand Crew Lead',
      phone: '9819234567',
      type: ContactType.blockCrewHead,
      block: 'Block 5',
    ),
    'Block 6': const ContactPerson(
      id: 'ch_6',
      name: 'Mahesh Gokhale',
      role: 'Block 6 Merchant Stand Crew Lead',
      phone: '9820355446',
      type: ContactType.blockCrewHead,
      block: 'Block 6',
    ),
    'Block 7': const ContactPerson(
      id: 'ch_7',
      name: 'Nitin Mane',
      role: 'Block 7 Gavaskar Stand Crew Lead',
      phone: '9833244337',
      type: ContactType.blockCrewHead,
      block: 'Block 7',
    ),
    'Block 8': const ContactPerson(
      id: 'ch_8',
      name: 'Sunil Jadhav',
      role: 'Block 8 South Stand Crew Lead',
      phone: '9819133228',
      type: ContactType.blockCrewHead,
      block: 'Block 8',
    ),
  };

  static final List<ContactPerson> crewMembers = [
    const ContactPerson(
      id: 'cm_01',
      name: 'Amit Patil',
      role: 'Crowd Control & Aisle Usher',
      phone: '9820345678',
      type: ContactType.crewMember,
    ),
    const ContactPerson(
      id: 'cm_02',
      name: 'Sneha More',
      role: 'Gate Support & Ticket Assistance',
      phone: '9833456789',
      type: ContactType.crewMember,
    ),
    const ContactPerson(
      id: 'cm_03',
      name: 'Rohan Deshmukh',
      role: 'Visitor Assistance & Medical Liaison',
      phone: '9819876543',
      type: ContactType.crewMember,
    ),
  ];
}
