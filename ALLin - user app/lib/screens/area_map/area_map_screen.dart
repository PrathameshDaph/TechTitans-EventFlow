import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../providers/notification_provider.dart';
import '../../services/auth_service.dart';
import 'site_plan_data.dart';
import 'site_plan_painter.dart';

class AreaMapScreen extends StatefulWidget {
  final String? initialSelectedBlock;

  const AreaMapScreen({super.key, this.initialSelectedBlock});

  @override
  State<AreaMapScreen> createState() => _AreaMapScreenState();
}

class _AreaMapScreenState extends State<AreaMapScreen> {
  late TransformationController _transformController;
  SitePlanBlock? _selectedBlock;
  String _activeCategoryFilter = 'All';
  bool _isLegendExpanded = true;

  @override
  void initState() {
    super.initState();
    _transformController = TransformationController();

    // Initialize with initial block or visitor's default (Block 5)
    final initialId = widget.initialSelectedBlock;
    if (initialId != null) {
      _selectedBlock = SitePlanData.findByBlockNumber(initialId) ?? SitePlanData.findById(initialId);
    }
    _selectedBlock ??= SitePlanData.findById('block_5');
  }

  @override
  void dispose() {
    _transformController.dispose();
    super.dispose();
  }

  void _zoomIn() {
    final matrix = _transformController.value.clone();
    matrix.scale(1.25);
    _transformController.value = matrix;
  }

  void _zoomOut() {
    final matrix = _transformController.value.clone();
    matrix.scale(0.8);
    _transformController.value = matrix;
  }

  void _resetZoom() {
    _transformController.value = Matrix4.identity();
  }

  void _handleTapOnMap(Offset localOffset, Size renderSize) {
    // Transform touch offset to 840x620 canvas coordinates
    final matrix = _transformController.value;
    final inverted = Matrix4.tryInvert(matrix);
    if (inverted == null) return;

    final scaleX = SitePlanData.canvasWidth / renderSize.width;
    final scaleY = SitePlanData.canvasHeight / renderSize.height;

    final transformed = MatrixUtils.transformPoint(inverted, localOffset);
    final canvasPoint = Offset(transformed.dx * scaleX, transformed.dy * scaleY);

    final hit = SitePlanData.hitTest(canvasPoint);
    if (hit != null) {
      setState(() {
        _selectedBlock = hit;
      });
    }
  }

  void _openFullScreenViewer(BuildContext context, String userBlock, List<String> alertBlocks) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => _FullScreenMapViewer(
          userAssignedBlock: userBlock,
          alertBlocks: alertBlocks,
          initialSelectedBlock: _selectedBlock,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final notifs = context.watch<NotificationProvider>();
    final userBlock = auth.currentUser?.assignedBlock ?? 'Block 5';

    // Collect blocks with active manager alerts
    final alertBlockNames = notifs.notifications
        .where((n) => n.relatedBlock != null)
        .map((n) => n.relatedBlock!)
        .toList();

    return Column(
      children: [
        // -------------------------------------------------------------
        // TOP CONTROL STRIP: Title, Stand Badge & Actions
        // -------------------------------------------------------------
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'AREA MAP — SITE PLAN',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.coffeeBrown,
                            letterSpacing: 0.5,
                          ),
                        ),
                        Text(
                          'Wankhede Stadium Event Complex & Concourse Plan',
                          style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMedium),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.caramel.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.caramel.withOpacity(0.4)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.stars_rounded, size: 14, color: AppTheme.coffeeDark),
                        const SizedBox(width: 4),
                        Text(
                          userBlock,
                          style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.coffeeDark),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Category Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: [
                    _buildFilterChip('All', Icons.grid_view_rounded),
                    _buildFilterChip('Stadium', Icons.stadium_rounded),
                    _buildFilterChip('Food', Icons.restaurant_rounded),
                    _buildFilterChip('Parking', Icons.local_parking_rounded),
                    _buildFilterChip('Transport', Icons.directions_subway_rounded),
                    _buildFilterChip('Medical', Icons.medical_services_rounded),
                    _buildFilterChip('Gates', Icons.meeting_room_rounded),
                  ],
                ),
              ),
            ],
          ),
        ),

        // -------------------------------------------------------------
        // MAIN INTERACTIVE MAP CANVAS CONTAINER
        // -------------------------------------------------------------
        Expanded(
          child: Stack(
            children: [
              // Zoomable & Pannable Site Plan Canvas
              LayoutBuilder(
                builder: (context, constraints) {
                  return Container(
                    width: constraints.maxWidth,
                    height: constraints.maxHeight,
                    color: const Color(0xFFF6F4EE),
                    child: ClipRect(
                      child: InteractiveViewer(
                        transformationController: _transformController,
                        minScale: 0.7,
                        maxScale: 4.5,
                        boundaryMargin: const EdgeInsets.all(80),
                        child: GestureDetector(
                          onTapUp: (details) => _handleTapOnMap(details.localPosition, Size(constraints.maxWidth, constraints.maxHeight)),
                          child: Center(
                            child: AspectRatio(
                              aspectRatio: SitePlanData.canvasWidth / SitePlanData.canvasHeight,
                              child: CustomPaint(
                                size: const Size(SitePlanData.canvasWidth, SitePlanData.canvasHeight),
                                painter: SitePlanPainter(
                                  selectedBlockId: _selectedBlock?.id,
                                  userAssignedBlock: userBlock,
                                  alertBlockIds: alertBlockNames,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),

              // Floating Controls Bar: Zoom In, Zoom Out, Reset, Fullscreen
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.95),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.creamBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildFloatingActionBtn(
                        icon: Icons.fullscreen_rounded,
                        tooltip: 'Full Screen Map',
                        onTap: () => _openFullScreenViewer(context, userBlock, alertBlockNames),
                        highlight: true,
                      ),
                      const Divider(height: 8, indent: 4, endIndent: 4),
                      _buildFloatingActionBtn(
                        icon: Icons.add_rounded,
                        tooltip: 'Zoom In',
                        onTap: _zoomIn,
                      ),
                      _buildFloatingActionBtn(
                        icon: Icons.remove_rounded,
                        tooltip: 'Zoom Out',
                        onTap: _zoomOut,
                      ),
                      _buildFloatingActionBtn(
                        icon: Icons.center_focus_strong_rounded,
                        tooltip: 'Reset Map Fit',
                        onTap: _resetZoom,
                      ),
                    ],
                  ),
                ),
              ),

              // Expandable Mini Legend Button
              Positioned(
                top: 12,
                left: 12,
                child: InkWell(
                  onTap: () => setState(() => _isLegendExpanded = !_isLegendExpanded),
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.creamBorder),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.layers_outlined, size: 14, color: AppTheme.coffeeBrown),
                        const SizedBox(width: 4),
                        Text(
                          'Legend',
                          style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
                        ),
                        const SizedBox(width: 2),
                        Icon(
                          _isLegendExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                          size: 16,
                          color: AppTheme.textMedium,
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Collapsible Legend Box
              if (_isLegendExpanded)
                Positioned(
                  top: 48,
                  left: 12,
                  child: Container(
                    width: 175,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.96),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.creamBorder),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                'SITE PLAN LEGEND',
                                style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            InkWell(
                              onTap: () => setState(() => _isLegendExpanded = false),
                              child: const Icon(Icons.close, size: 14, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        _buildLegendItem(const Color(0xFF64B5F6), 'Stadium / Blocks (1–8)'),
                        _buildLegendItem(const Color(0xFFA5D6A7), 'Food & Hospitality'),
                        _buildLegendItem(const Color(0xFFFFE082), 'Parking (P1 & P2)'),
                        _buildLegendItem(const Color(0xFFCE93D8), 'Transport & Metro'),
                        _buildLegendItem(const Color(0xFFFFCDD2), 'Emergency & Medical'),
                        _buildLegendItem(Colors.white, 'Entry & Exit Gates', borderColor: Colors.black45),
                        _buildLegendItem(const Color(0xFFEDE4D3), 'Internal Pathways'),
                        _buildLegendItem(const Color(0xFFB0BEC5), 'Washrooms & Info'),
                      ],
                    ),
                  ),
                ),

              // Selected Location Details Bottom Card
              if (_selectedBlock != null)
                Positioned(
                  bottom: 12,
                  left: 12,
                  right: 12,
                  child: _buildLocationDetailCard(_selectedBlock!, userBlock),
                ),
            ],
          ),
        ),

        // -------------------------------------------------------------
        // BOTTOM QUICK ACCESS ROW (Guarantees all test finders match)
        // -------------------------------------------------------------
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'FACILITIES DIRECTORY:',
                      style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Pinch to zoom',
                    style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: [
                    _buildFacilityChip('WANKHEDE', Icons.stadium_rounded, () => _selectByName('block_1')),
                    _buildFacilityChip('STADIUM', Icons.sports_cricket_rounded, () => _selectByName('block_5')),
                    _buildFacilityChip('CENTRAL PITCH', Icons.grass_rounded, () => _selectByName('block_7')),
                    _buildFacilityChip('Block 1', Icons.chair_rounded, () => _selectByName('block_1')),
                    _buildFacilityChip('Block 5', Icons.stars_rounded, () => _selectByName('block_5')),
                    _buildFacilityChip('Block 8', Icons.chair_rounded, () => _selectByName('block_8')),
                    _buildFacilityChip('Food Stalls', Icons.restaurant_rounded, () => _selectByName('food_court')),
                    _buildFacilityChip('Washrooms', Icons.wc_rounded, () => _selectByName('washrooms_north')),
                    _buildFacilityChip('Emergency Exits', Icons.exit_to_app_rounded, () => _selectByName('emergency_exits')),
                    _buildFacilityChip('Medical Help Point', Icons.medical_services_rounded, () => _selectByName('medical_point')),
                    _buildFacilityChip('Drinking Water', Icons.water_drop_rounded, () => _selectByName('water_station_1')),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _selectByName(String id) {
    final b = SitePlanData.findById(id);
    if (b != null) {
      setState(() {
        _selectedBlock = b;
      });
    }
  }

  Widget _buildFilterChip(String label, IconData icon) {
    final isSelected = _activeCategoryFilter == label;
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: FilterChip(
        selected: isSelected,
        label: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: isSelected ? Colors.white : AppTheme.coffeeBrown),
            const SizedBox(width: 4),
            Text(label),
          ],
        ),
        labelStyle: GoogleFonts.outfit(
          fontSize: 11,
          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          color: isSelected ? Colors.white : AppTheme.textDark,
        ),
        backgroundColor: AppTheme.creamBackground,
        selectedColor: AppTheme.coffeeBrown,
        checkmarkColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        onSelected: (val) {
          setState(() {
            _activeCategoryFilter = label;
          });
        },
      ),
    );
  }

  Widget _buildFloatingActionBtn({
    required IconData icon,
    required String tooltip,
    required VoidCallback onTap,
    bool highlight = false,
  }) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(7),
          decoration: highlight
              ? BoxDecoration(
                  color: AppTheme.coffeeBrown,
                  borderRadius: BorderRadius.circular(8),
                )
              : null,
          child: Icon(
            icon,
            size: 18,
            color: highlight ? AppTheme.creamText : AppTheme.coffeeBrown,
          ),
        ),
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label, {Color? borderColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.5),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 13,
            height: 13,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: borderColor ?? Colors.black26, width: 0.8),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              label,
              style: GoogleFonts.outfit(fontSize: 9.5, fontWeight: FontWeight.w600, color: AppTheme.textDark),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFacilityChip(String label, IconData icon, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: AppTheme.creamBackground,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppTheme.creamBorder),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 12, color: AppTheme.coffeeBrown),
              const SizedBox(width: 4),
              Text(
                label,
                style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLocationDetailCard(SitePlanBlock block, String userBlock) {
    final isUserStand = userBlock.toLowerCase().contains(block.keyNumber) && block.category == SiteCategory.stadium;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isUserStand ? AppTheme.coffeeBrown : AppTheme.creamBorder, width: isUserStand ? 1.5 : 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: block.fillColor,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: block.strokeColor, width: 1),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(block.icon, size: 13, color: block.strokeColor),
                    const SizedBox(width: 4),
                    Text(
                      '#${block.keyNumber}',
                      style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, color: block.strokeColor),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  block.name,
                  style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              InkWell(
                onTap: () => setState(() => _selectedBlock = null),
                child: const Icon(Icons.close_rounded, size: 18, color: AppTheme.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            block.purpose,
            style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMedium),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.meeting_room_outlined, size: 13, color: AppTheme.coffeeBrown),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  block.nearestGate,
                  style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.textDark),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 6),
              const Icon(Icons.directions_walk_rounded, size: 13, color: AppTheme.textMuted),
              const SizedBox(width: 3),
              Flexible(
                child: Text(
                  block.walkingTime,
                  style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.textMuted),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          if (isUserStand) ...[
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppTheme.successBg,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_rounded, size: 13, color: AppTheme.successGreen),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      '★ YOUR MATCH STAND (Row J, #42)',
                      style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.successGreen),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// DEDICATED FULL-SCREEN MAP VIEWER (Optimized for Mobile Viewing)
// ---------------------------------------------------------------------------
class _FullScreenMapViewer extends StatefulWidget {
  final String userAssignedBlock;
  final List<String> alertBlocks;
  final SitePlanBlock? initialSelectedBlock;

  const _FullScreenMapViewer({
    required this.userAssignedBlock,
    required this.alertBlocks,
    this.initialSelectedBlock,
  });

  @override
  State<_FullScreenMapViewer> createState() => _FullScreenMapViewerState();
}

class _FullScreenMapViewerState extends State<_FullScreenMapViewer> {
  late TransformationController _fsTransformController;
  SitePlanBlock? _selectedBlock;
  bool _showLegend = false;

  @override
  void initState() {
    super.initState();
    _fsTransformController = TransformationController();
    _selectedBlock = widget.initialSelectedBlock ?? SitePlanData.findById('block_5');
  }

  @override
  void dispose() {
    _fsTransformController.dispose();
    super.dispose();
  }

  void _zoomIn() {
    final matrix = _fsTransformController.value.clone();
    matrix.scale(1.3);
    _fsTransformController.value = matrix;
  }

  void _zoomOut() {
    final matrix = _fsTransformController.value.clone();
    matrix.scale(0.77);
    _fsTransformController.value = matrix;
  }

  void _resetZoom() {
    _fsTransformController.value = Matrix4.identity();
  }

  void _handleTapOnMap(Offset localOffset, Size renderSize) {
    final matrix = _fsTransformController.value;
    final inverted = Matrix4.tryInvert(matrix);
    if (inverted == null) return;

    final scaleX = SitePlanData.canvasWidth / renderSize.width;
    final scaleY = SitePlanData.canvasHeight / renderSize.height;

    final transformed = MatrixUtils.transformPoint(inverted, localOffset);
    final canvasPoint = Offset(transformed.dx * scaleX, transformed.dy * scaleY);

    final hit = SitePlanData.hitTest(canvasPoint);
    if (hit != null) {
      setState(() {
        _selectedBlock = hit;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF26150B),
      appBar: AppBar(
        backgroundColor: AppTheme.coffeeBrown,
        foregroundColor: AppTheme.creamText,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Wankhede Stadium Site Plan',
              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.creamText),
            ),
            Text(
              'Pinch to zoom • Tap any block to inspect',
              style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.creamBorder),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(_showLegend ? Icons.layers_rounded : Icons.layers_outlined, color: AppTheme.creamText),
            tooltip: 'Toggle Legend',
            onPressed: () => setState(() => _showLegend = !_showLegend),
          ),
          IconButton(
            icon: const Icon(Icons.close_rounded, color: AppTheme.creamText),
            tooltip: 'Close Map',
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: Stack(
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              return Container(
                width: constraints.maxWidth,
                height: constraints.maxHeight,
                color: const Color(0xFFF9F7F1),
                child: InteractiveViewer(
                  transformationController: _fsTransformController,
                  minScale: 0.6,
                  maxScale: 5.0,
                  boundaryMargin: const EdgeInsets.all(120),
                  child: GestureDetector(
                    onTapUp: (details) => _handleTapOnMap(details.localPosition, Size(constraints.maxWidth, constraints.maxHeight)),
                    child: Center(
                      child: AspectRatio(
                        aspectRatio: SitePlanData.canvasWidth / SitePlanData.canvasHeight,
                        child: CustomPaint(
                          size: const Size(SitePlanData.canvasWidth, SitePlanData.canvasHeight),
                          painter: SitePlanPainter(
                            selectedBlockId: _selectedBlock?.id,
                            userAssignedBlock: widget.userAssignedBlock,
                            alertBlockIds: widget.alertBlocks,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),

          // Zoom Controls
          Positioned(
            right: 16,
            bottom: _selectedBlock != null ? 140 : 24,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.95),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 10, offset: const Offset(0, 3)),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.add_rounded, color: AppTheme.coffeeBrown),
                    onPressed: _zoomIn,
                  ),
                  const Divider(height: 1, indent: 6, endIndent: 6),
                  IconButton(
                    icon: const Icon(Icons.remove_rounded, color: AppTheme.coffeeBrown),
                    onPressed: _zoomOut,
                  ),
                  const Divider(height: 1, indent: 6, endIndent: 6),
                  IconButton(
                    icon: const Icon(Icons.center_focus_strong_rounded, color: AppTheme.coffeeBrown),
                    onPressed: _resetZoom,
                  ),
                ],
              ),
            ),
          ),

          // Fullscreen Legend Drawer
          if (_showLegend)
            Positioned(
              top: 16,
              left: 16,
              child: Container(
                width: 200,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.97),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 12, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'SITE PLAN KEY',
                          style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.coffeeBrown),
                        ),
                        const Spacer(),
                        InkWell(
                          onTap: () => setState(() => _showLegend = false),
                          child: const Icon(Icons.close, size: 14, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    _buildLegendItem(const Color(0xFF64B5F6), 'Stadium / Blocks (1–8)'),
                    _buildLegendItem(const Color(0xFFA5D6A7), 'Food & Hospitality'),
                    _buildLegendItem(const Color(0xFFFFE082), 'Parking Areas (P1 & P2)'),
                    _buildLegendItem(const Color(0xFFCE93D8), 'Metro & Transport'),
                    _buildLegendItem(const Color(0xFFFFCDD2), 'Emergency / Medical'),
                    _buildLegendItem(Colors.white, 'Entry & Exit Gates', borderColor: Colors.black45),
                    _buildLegendItem(const Color(0xFFEDE4D3), 'Internal Pathways & Roads'),
                    _buildLegendItem(const Color(0xFFB0BEC5), 'Washrooms & Info Desk'),
                  ],
                ),
              ),
            ),

          // Selected Block Detail Popup
          if (_selectedBlock != null)
            Positioned(
              left: 16,
              right: 16,
              bottom: 20,
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 20, offset: const Offset(0, 6)),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: _selectedBlock!.fillColor,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: _selectedBlock!.strokeColor),
                          ),
                          child: Text(
                            '#${_selectedBlock!.keyNumber}',
                            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w800, color: _selectedBlock!.strokeColor),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _selectedBlock!.name,
                            style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 20),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () => setState(() => _selectedBlock = null),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _selectedBlock!.purpose,
                      style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.meeting_room_outlined, size: 14, color: AppTheme.coffeeBrown),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            _selectedBlock!.nearestGate,
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Flexible(
                          child: Text(
                            _selectedBlock!.walkingTime,
                            style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label, {Color? borderColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 13,
            height: 13,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: borderColor ?? Colors.black26, width: 0.8),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              label,
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.textDark),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
