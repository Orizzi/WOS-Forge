"""
Script to add nested div wrappers to all charm-inputs in charms.html
This fixes the label/select overlapping issue by implementing vertical layout
"""

import re

# Read the HTML file
with open('../src/charms.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Add opening <div> after charm-inputs opening
# Match: <div class="charm-inputs">\n        <label data-i18n="from"
# Replace with: <div class="charm-inputs">\n        <div>\n          <label data-i18n="from"
pattern1 = r'(<div class="charm-inputs">)\n(\s+)(<label data-i18n="from")'
replacement1 = r'\1\n\2<div>\n\2  \3'
content = re.sub(pattern1, replacement1, content)

# Pattern 2: Add </div><div> between first select and second label
# Match: </select>\n        <label data-i18n="to"
# Replace with: </select>\n        </div>\n        <div>\n          <label data-i18n="to"
pattern2 = r'(</select>)\n(\s+)(<label data-i18n="to")'
replacement2 = r'\1\n\2</div>\n\2<div>\n\2  \3'
content = re.sub(pattern2, replacement2, content)

# Pattern 3: Add closing </div> after TO select and before charm-inputs closing
# Match: </select>\n      </div>\n    </div>\n\n    <!-- Charm
# Replace with: </select>\n        </div>\n      </div>\n    </div>\n\n    <!-- Charm
pattern3 = r'(</select>)\n(      </div>)\n(    </div>)\n\n(    <!-- Charm)'
replacement3 = r'\1\n        </div>\n\2\n\3\n\n\4'
content = re.sub(pattern3, replacement3, content)

# Pattern 4: Handle end of section cases (before </section>)
# Match: </select>\n      </div>\n    </div>\n  </section>
# Replace with: </select>\n        </div>\n      </div>\n    </div>\n  </section>
pattern4 = r'(</select>)\n(      </div>)\n(    </div>)\n(  </section>)'
replacement4 = r'\1\n        </div>\n\2\n\3\n\4'
content = re.sub(pattern4, replacement4, content)

# Write back
with open('../src/charms.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed all charm-inputs with nested div wrappers")
print("Patterns applied:")
print("  1. Added opening <div> after charm-inputs")
print("  2. Added </div><div> separator between FROM and TO selects")
print("  3. Added closing </div> before charm-inputs closing tag")
print("  4. Handled end-of-section cases")

