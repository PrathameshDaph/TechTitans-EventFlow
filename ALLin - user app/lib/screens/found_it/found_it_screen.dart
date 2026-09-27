import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../models/lost_found_item.dart';
import '../../providers/lost_found_provider.dart';
import '../../services/auth_service.dart';

class FoundItScreen extends StatefulWidget {
  const FoundItScreen({super.key});

  @override
  State<FoundItScreen> createState() => _FoundItScreenState();
}

class _FoundItScreenState extends State<FoundItScreen> {
  final _descriptionController = TextEditingController();
  final _contactController = TextEditingController();
  final _additionalController = TextEditingController();

  XFile? _selectedImage;
  String _selectedCategory = 'Wallet / Purse';
  String _selectedBlock = 'Block 5';

  final List<String> _blocks = [
    'Block 1',
    'Block 2',
    'Block 3',
    'Block 4',
    'Block 5',
    'Block 6',
    'Block 7',
    'Block 8',
    'Other / Concourse',
  ];

  final List<String> _categories = [
    'Wallet / Purse',
    'Smartphone',
    'Keychain / Keys',
    'Eyeglasses',
    'Backpack / Bag',
    'Other Item',
  ];

  final Map<String, String> _categoryPresetKeys = {
    'Wallet / Purse': 'wallet',
    'Smartphone': 'phone',
    'Keychain / Keys': 'keys',
    'Eyeglasses': 'glasses',
    'Backpack / Bag': 'bag',
    'Other Item': 'general',
  };

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthService>().currentUser;
    if (user != null) {
      _contactController.text = user.phone;
      _selectedBlock = user.assignedBlock;
    }
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _contactController.dispose();
    _additionalController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );
      if (picked != null) {
        setState(() {
          _selectedImage = picked;
        });
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to access image. Please check camera/gallery permissions and try again.'),
            backgroundColor: AppTheme.alertRed,
          ),
        );
      }
    }
  }

  void _showImageSourceModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.creamBorder,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Select Photo Source',
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.coffeeBrown,
                  ),
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.creamBackground,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.photo_library_rounded, color: AppTheme.coffeeBrown),
                  ),
                  title: Text(
                    'Choose from Gallery',
                    style: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: AppTheme.textDark),
                  ),
                  subtitle: Text(
                    'Select existing photo from device storage',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  onTap: () {
                    Navigator.pop(ctx);
                    _pickImage(ImageSource.gallery);
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.creamBackground,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.camera_alt_rounded, color: AppTheme.coffeeBrown),
                  ),
                  title: Text(
                    'Take a Photo',
                    style: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: AppTheme.textDark),
                  ),
                  subtitle: Text(
                    'Capture real photo using phone camera',
                    style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  onTap: () {
                    Navigator.pop(ctx);
                    _pickImage(ImageSource.camera);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _submitFoundReport() async {
    final desc = _descriptionController.text.trim();
    final contact = _contactController.text.trim();

    if (desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter an item description.'),
          backgroundColor: AppTheme.alertRed,
        ),
      );
      return;
    }

    // Contact number validation: Exactly 10 digits for Indian mobile numbers
    final digitsOnly = contact.replaceAll(RegExp(r'\D'), '');
    if (digitsOnly.length != 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid 10-digit Indian contact number.'),
          backgroundColor: AppTheme.alertRed,
        ),
      );
      return;
    }

    if (!RegExp(r'^[6-9]\d{9}$').hasMatch(digitsOnly)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid 10-digit Indian number starting with 6, 7, 8, or 9.'),
          backgroundColor: AppTheme.alertRed,
        ),
      );
      return;
    }

    final provider = context.read<LostFoundProvider>();
    final auth = context.read<AuthService>();
    final currentUser = auth.currentUser;

    try {
      final item = await provider.reportItem(
        category: _selectedCategory,
        description: desc,
        block: _selectedBlock,
        contactNumber: digitsOnly,
        additionalDetails: _additionalController.text.trim(),
        photoAsset: _categoryPresetKeys[_selectedCategory] ?? 'general',
        photoPath: _selectedImage?.path,
        photoName: _selectedImage?.name,
        finderUserId: currentUser?.id,
        finderName: currentUser?.name,
        eventName: 'India vs Pakistan — Wankhede Stadium',
      );

      // Reset form to its initial empty state ONLY on success
      setState(() {
        _selectedImage = null;
        _selectedCategory = 'Wallet / Purse';
        _selectedBlock = 'Block 5';
        _descriptionController.clear();
        _contactController.clear();
        _additionalController.clear();
      });

      if (mounted) {
        _showReportSuccessDialog(item);
      }
    } catch (_) {
      // Retain form data on error so the user can retry without re-entering
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to upload report. Please check your connection and try again.'),
            backgroundColor: AppTheme.alertRed,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LostFoundProvider>();

    return SafeArea(
      top: false,
      bottom: true,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Title & Subtitle
            Text(
              'FOUND IT',
              style: GoogleFonts.outfit(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AppTheme.textDark,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Report any lost item found inside Wankhede Stadium so event management can reconnect it with its rightful owner.',
              style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.textMedium),
            ),
            const SizedBox(height: 16),

            // Found Item Form Card
            Container(
              padding: const EdgeInsets.all(18),
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
                  // Upload Photo Section Header
                  Row(
                    children: [
                      Text(
                        'Upload Photo',
                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                      ),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          '(Gallery / Camera)',
                          style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Real Image Picker / Preview Container
                  _buildPhotoUploadSection(),

                  const SizedBox(height: 16),

                  // Item Category Selector Chips
                  Text(
                    'Item Category *',
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: _categories.map((cat) {
                      final isSel = _selectedCategory == cat;
                      return ChoiceChip(
                        label: Text(cat),
                        selected: isSel,
                        onSelected: (_) => setState(() => _selectedCategory = cat),
                        selectedColor: AppTheme.coffeeBrown,
                        backgroundColor: AppTheme.creamBackground,
                        labelStyle: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                          color: isSel ? AppTheme.creamText : AppTheme.textDark,
                        ),
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 16),

                  // Item Description
                  Text(
                    'Item Description *',
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _descriptionController,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Black leather wallet with Mumbai metro card and car keys',
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Found At / Block
                  Text(
                    'Found At / Block *',
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.creamBorder),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedBlock,
                        isExpanded: true,
                        icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.coffeeBrown),
                        items: _blocks.map((b) {
                          return DropdownMenuItem(
                            value: b,
                            child: Text(b, style: GoogleFonts.outfit(fontSize: 14, color: AppTheme.textDark)),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedBlock = val);
                        },
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Contact Number (10 digits)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          'Contact Number *',
                          style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${_contactController.text.length}/10 Digits',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: _contactController.text.length == 10 ? AppTheme.successGreen : AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _contactController,
                    keyboardType: TextInputType.phone,
                    maxLength: 10,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    onChanged: (_) => setState(() {}),
                    decoration: const InputDecoration(
                      hintText: '9820123456',
                      prefixText: '+91 ',
                      prefixIcon: Icon(Icons.phone_outlined, color: AppTheme.coffeeMedium),
                      counterText: '',
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Additional Details (Optional)
                  Text(
                    'Additional Details (Optional)',
                    style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _additionalController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Found on floor near aisle 4 staircase after the 10th over.',
                    ),
                  ),

                  const SizedBox(height: 22),

                  // Submit Report Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: provider.isSubmitting ? null : _submitFoundReport,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.coffeeBrown,
                        foregroundColor: AppTheme.creamText,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: provider.isSubmitting
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                            )
                          : Text(
                              'REPORT FOUND ITEM',
                              style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                            ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 26),

            // Submitted Reports History
            Text(
              'Your Submitted Reports',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textDark),
            ),
            const SizedBox(height: 10),

            ...provider.reportedItems.map((item) => _buildReportedItemCard(item)),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // REAL PHOTO UPLOAD / PREVIEW COMPONENT
  // -------------------------------------------------------------
  Widget _buildPhotoUploadSection() {
    if (_selectedImage != null) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppTheme.creamBackground,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.warmGold.withOpacity(0.5)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: SizedBox(
                width: double.infinity,
                height: 160,
                child: kIsWeb
                    ? Image.network(
                        _selectedImage!.path,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => _buildFallbackImagePreview(),
                      )
                    : Image.file(
                        File(_selectedImage!.path),
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => _buildFallbackImagePreview(),
                      ),
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: AppTheme.successGreen, size: 16),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    _selectedImage!.name,
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textDark,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                TextButton.icon(
                  onPressed: _showImageSourceModal,
                  icon: const Icon(Icons.refresh_rounded, size: 14, color: AppTheme.coffeeBrown),
                  label: Text(
                    'Replace',
                    style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
                  ),
                  style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8)),
                ),
                IconButton(
                  onPressed: () => setState(() => _selectedImage = null),
                  icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppTheme.alertRed),
                  tooltip: 'Remove photo',
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(minWidth: 32),
                ),
              ],
            ),
          ],
        ),
      );
    }

    return InkWell(
      onTap: _showImageSourceModal,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 16),
        decoration: BoxDecoration(
          color: AppTheme.creamBackground,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.creamBorder, style: BorderStyle.solid),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.add_a_photo_outlined, size: 28, color: AppTheme.coffeeBrown),
            ),
            const SizedBox(height: 10),
            Text(
              'Upload Photo of Found Item',
              style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
            ),
            const SizedBox(height: 4),
            Text(
              'Tap to select from Gallery or capture with Camera',
              style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFallbackImagePreview() {
    return Container(
      color: AppTheme.coffeeDark,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.image_rounded, size: 36, color: AppTheme.creamText),
            const SizedBox(height: 6),
            Text(
              'Image Attached (${_selectedImage?.name})',
              style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.creamText),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // REPORTED ITEM CARD IN HISTORY
  // -------------------------------------------------------------
  Widget _buildReportedItemCard(LostFoundItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.creamBorder),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.creamBackground,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(_getIconForPreset(item.photoAsset), color: AppTheme.coffeeBrown, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.description,
                        style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 14),
                      ),
                    ),
                    Text(
                      item.reportId,
                      style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.coffeeBrown),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  'Category: ${item.category} • Found at: ${item.block}',
                  style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium),
                ),
                Text(
                  'Contact: +91 ${item.contactNumber}',
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted),
                ),
                if (item.photoName != null) ...[
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.attachment_rounded, size: 12, color: AppTheme.coffeeMedium),
                      const SizedBox(width: 4),
                      Text(
                        item.photoName!,
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.coffeeMedium, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ],
                if (item.additionalDetails.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    item.additionalDetails,
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                  ),
                ],
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.successBg,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    item.status,
                    style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.successGreen),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // SUCCESS CONFIRMATION DIALOG
  // -------------------------------------------------------------
  void _showReportSuccessDialog(LostFoundItem item) {
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
                decoration: const BoxDecoration(color: AppTheme.successBg, shape: BoxShape.circle),
                child: const Icon(Icons.check_circle_rounded, color: AppTheme.successGreen, size: 48),
              ),
              const SizedBox(height: 14),
              Text(
                'Report submitted successfully',
                style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.creamBackground,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.creamBorder),
                ),
                child: Column(
                  children: [
                    _buildRow('Report ID', item.reportId),
                    const SizedBox(height: 4),
                    _buildRow('Category', item.category),
                    const SizedBox(height: 4),
                    _buildRow('Description', item.description),
                    const SizedBox(height: 4),
                    _buildRow('Location', item.block),
                    const SizedBox(height: 4),
                    _buildRow('Contact', '+91 ${item.contactNumber}'),
                    const SizedBox(height: 4),
                    _buildRow('Status', item.status),
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
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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

  Widget _buildRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.textMedium)),
        Flexible(
          child: Text(
            value,
            style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textDark),
            textAlign: TextAlign.right,
          ),
        ),
      ],
    );
  }

  IconData _getIconForPreset(String preset) {
    switch (preset) {
      case 'wallet':
        return Icons.account_balance_wallet_rounded;
      case 'phone':
        return Icons.smartphone_rounded;
      case 'keys':
        return Icons.vpn_key_rounded;
      case 'glasses':
        return Icons.visibility_rounded;
      case 'bag':
        return Icons.backpack_rounded;
      default:
        return Icons.category_rounded;
    }
  }
}
