from PIL import Image
import os

# Load the master icon
master_icon = Image.open('/home/ubuntu/icon_master.png')

# Define all required sizes
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Base path for output
base_path = '/home/ubuntu/asphalt_paving_maps/app/public'

# Resize and save each size
for size in sizes:
    resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
    output_path = os.path.join(base_path, f'icon-{size}x{size}.png')
    resized.save(output_path, 'PNG', optimize=True)
    print(f'Created: {output_path}')

print('\nAll icons created successfully!')
