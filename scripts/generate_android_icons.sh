#!/bin/bash

# Script to generate Android app icons from assets/icon.png
# Generates all required sizes and copies them to the appropriate mipmap folders

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ICON_SOURCE="$PROJECT_ROOT/assets/icon.png"
ANDROID_RES_DIR="$PROJECT_ROOT/android/app/src/main/res"

# Check if source icon exists
if [ ! -f "$ICON_SOURCE" ]; then
    echo "Error: Icon source not found at $ICON_SOURCE"
    exit 1
fi

# Check if sips is available (macOS built-in tool)
if ! command -v sips &> /dev/null; then
    echo "Error: sips command not found. This script requires macOS."
    exit 1
fi

echo "Generating Android icons from $ICON_SOURCE..."

# Create temporary directory for generated icons
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Define icon sizes for each density (compatible with bash 3.2+)
DENSITIES="mdpi hdpi xhdpi xxhdpi xxxhdpi"
MDPI_SIZE=48
HDPI_SIZE=72
XHDPI_SIZE=96
XXHDPI_SIZE=144
XXXHDPI_SIZE=192

# Generate icons for each density
for density in $DENSITIES; do
    case $density in
        mdpi) size=$MDPI_SIZE ;;
        hdpi) size=$HDPI_SIZE ;;
        xhdpi) size=$XHDPI_SIZE ;;
        xxhdpi) size=$XXHDPI_SIZE ;;
        xxxhdpi) size=$XXXHDPI_SIZE ;;
    esac
    
    output_file="$TEMP_DIR/ic_launcher_${density}.png"
    
    echo "  Generating ${density} (${size}x${size})..."
    sips -z "$size" "$size" "$ICON_SOURCE" --out "$output_file" > /dev/null
done

# Copy icons to mipmap folders
for density in $DENSITIES; do
    mipmap_dir="$ANDROID_RES_DIR/mipmap-${density}"
    
    # Create mipmap directory if it doesn't exist
    if [ ! -d "$mipmap_dir" ]; then
        echo "  Creating mipmap-${density} directory..."
        mkdir -p "$mipmap_dir"
    fi
    
    icon_file="$TEMP_DIR/ic_launcher_${density}.png"
    
    echo "  Copying to mipmap-${density}..."
    cp "$icon_file" "$mipmap_dir/ic_launcher.png"
    cp "$icon_file" "$mipmap_dir/ic_launcher_round.png"
done

echo "✓ Android icons generated successfully!"
echo "  Rebuild your app to see the new icon: npm run android"

