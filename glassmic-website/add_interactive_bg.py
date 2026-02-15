import glob
import os

files = glob.glob("*.html")

bg_html = '        <!-- Interactive Background Logo -->\n        <img src="assets/glassmic.png" alt="" class="interactive-bg">\n'
script_html = '    <script src="background-effect.js"></script>\n</body>'

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()
    
    # Remove old logo-bg if present
    content = content.replace('<img src="assets/logo-bg.png" alt="" class="logo-bg">', '')
    
    # Remove potentially duplicated interactive-bg if re-running
    if 'class="interactive-bg"' in content:
        # Simple removal logic might be tricky, let's just not add it again
        pass
    else:
        # Add new bg
        # Insert after web-container open or after body open if web-container not found (fallback)
        if '<div class="web-container">' in content:
             parts = content.split('<div class="web-container">')
             # Insert after background orbs if possible, or just at top of container
             # Actually, let's look for "<!-- Background Orbs -->" and insert AFTER that block
             if '<!-- Background Orbs -->' in content:
                 # Find end of orb div
                 orb_end = content.find('<div class="orb orb-2"></div>')
                 if orb_end != -1:
                     insert_pos = orb_end + len('<div class="orb orb-2"></div>')
                     content = content[:insert_pos] + '\n' + bg_html + content[insert_pos:]
                 else:
                     # Fallback
                     content = parts[0] + '<div class="web-container">' + bg_html + parts[1]
             else:
                  content = parts[0] + '<div class="web-container">' + bg_html + parts[1]
    
    # Add script before closing body
    if 'src="background-effect.js"' not in content:
        content = content.replace('</body>', script_html)
        
    with open(file_path, "w") as f:
        f.write(content)
    print(f"Updated {file_path}")
