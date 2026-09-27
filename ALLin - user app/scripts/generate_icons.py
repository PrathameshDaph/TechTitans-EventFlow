import os
from PIL import Image, ImageDraw

def generate_all_icons():
    source_path = r"C:\Users\aadit\.gemini\antigravity-ide\brain\823b3ba7-737a-41e1-8926-cd87017da54c\.user_uploaded\media_1790453920724.png"
    project_root = r"c:\Users\aadit\OneDrive\Desktop\ALLin"

    if not os.path.exists(source_path):
        raise FileNotFoundError(f"Source image not found at {source_path}")

    # Open source image (1024x1012)
    src_img = Image.open(source_path).convert("RGBA")
    src_w, src_h = src_img.size

    # Background color sampled from top edge
    bg_color = (255, 251, 233, 255) # #FFFBE9

    # 1. Create perfect 1024x1024 square master
    master_1024 = Image.new("RGBA", (1024, 1024), bg_color)
    offset_y = (1024 - src_h) // 2
    offset_x = (1024 - src_w) // 2
    master_1024.paste(src_img, (offset_x, offset_y), src_img)

    # Ensure output directories exist
    os.makedirs(os.path.join(project_root, "assets", "images"), exist_ok=True)
    os.makedirs(os.path.join(project_root, "assets", "icon"), exist_ok=True)

    # Save Flutter app assets
    logo_path = os.path.join(project_root, "assets", "images", "app_logo.png")
    icon_path = os.path.join(project_root, "assets", "icon", "app_icon.png")
    master_1024.save(logo_path, "PNG", optimize=True)
    master_1024.save(icon_path, "PNG", optimize=True)
    print(f"Saved master logo: {logo_path}")

    # 2. Create round icon master (with circular anti-aliased mask)
    round_mask = Image.new("L", (1024 * 4, 1024 * 4), 0)
    draw_round = ImageDraw.Draw(round_mask)
    draw_round.ellipse((0, 0, 1024 * 4, 1024 * 4), fill=255)
    round_mask = round_mask.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    round_master = master_1024.copy()
    round_master.putalpha(round_mask)
    round_path = os.path.join(project_root, "assets", "icon", "app_icon_round.png")
    round_master.save(round_path, "PNG", optimize=True)

    # 3. Create adaptive foreground (108dp canvas with safe zone)
    # The inner safe zone is 72/108 = 66.7%.
    # Scaling the logo to ~76% places the ribbons completely within the safe zone.
    adaptive_fg = Image.new("RGBA", (1024, 1024), bg_color)
    fg_scaled_size = int(1024 * 0.78)
    fg_scaled = master_1024.resize((fg_scaled_size, fg_scaled_size), Image.Resampling.LANCZOS)
    fg_offset = (1024 - fg_scaled_size) // 2
    adaptive_fg.paste(fg_scaled, (fg_offset, fg_offset), fg_scaled)
    fg_path = os.path.join(project_root, "assets", "icon", "app_icon_foreground.png")
    adaptive_fg.save(fg_path, "PNG", optimize=True)

    # 4. Generate Android mipmap icons
    res_dir = os.path.join(project_root, "android", "app", "src", "main", "res")

    legacy_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }

    adaptive_sizes = {
        "mipmap-mdpi": 108,
        "mipmap-hdpi": 162,
        "mipmap-xhdpi": 216,
        "mipmap-xxhdpi": 324,
        "mipmap-xxxhdpi": 432,
    }

    for folder, size in legacy_sizes.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)

        # Standard icon
        icon_out = master_1024.resize((size, size), Image.Resampling.LANCZOS)
        icon_out.save(os.path.join(folder_path, "ic_launcher.png"), "PNG", optimize=True)

        # Round icon
        round_out = round_master.resize((size, size), Image.Resampling.LANCZOS)
        round_out.save(os.path.join(folder_path, "ic_launcher_round.png"), "PNG", optimize=True)

    for folder, size in adaptive_sizes.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)

        # Adaptive foreground
        fg_out = adaptive_fg.resize((size, size), Image.Resampling.LANCZOS)
        fg_out.save(os.path.join(folder_path, "ic_launcher_foreground.png"), "PNG", optimize=True)

    # 5. Create Android adaptive XMLs in mipmap-anydpi-v26
    anydpi_dir = os.path.join(res_dir, "mipmap-anydpi-v26")
    os.makedirs(anydpi_dir, exist_ok=True)

    ic_launcher_xml = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"""
    with open(os.path.join(anydpi_dir, "ic_launcher.xml"), "w", encoding="utf-8") as f:
        f.write(ic_launcher_xml)

    with open(os.path.join(anydpi_dir, "ic_launcher_round.xml"), "w", encoding="utf-8") as f:
        f.write(ic_launcher_xml)

    # 6. Create / update values/colors.xml for ic_launcher_background
    values_dir = os.path.join(res_dir, "values")
    os.makedirs(values_dir, exist_ok=True)
    colors_xml = """<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFBE9</color>
</resources>
"""
    with open(os.path.join(values_dir, "colors.xml"), "w", encoding="utf-8") as f:
        f.write(colors_xml)

    # 7. Update Web icons if web directory exists
    web_dir = os.path.join(project_root, "web")
    if os.path.exists(web_dir):
        web_icons_dir = os.path.join(web_dir, "icons")
        os.makedirs(web_icons_dir, exist_ok=True)

        favicon = master_1024.resize((32, 32), Image.Resampling.LANCZOS)
        favicon.save(os.path.join(web_dir, "favicon.png"), "PNG", optimize=True)

        icon192 = master_1024.resize((192, 192), Image.Resampling.LANCZOS)
        icon192.save(os.path.join(web_icons_dir, "Icon-192.png"), "PNG", optimize=True)
        icon192.save(os.path.join(web_icons_dir, "Icon-maskable-192.png"), "PNG", optimize=True)

        icon512 = master_1024.resize((512, 512), Image.Resampling.LANCZOS)
        icon512.save(os.path.join(web_icons_dir, "Icon-512.png"), "PNG", optimize=True)
        icon512.save(os.path.join(web_icons_dir, "Icon-maskable-512.png"), "PNG", optimize=True)

    print("All icons successfully generated across Android mipmaps, Web, and Flutter assets!")

if __name__ == "__main__":
    generate_all_icons()
