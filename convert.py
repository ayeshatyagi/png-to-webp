#!/usr/bin/env python3
"""Convert PNG images to WebP format."""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    sys.exit(1)


def convert_file(path: Path, out_dir: Path, quality: int) -> Path:
    out_path = out_dir / f"{path.stem}.webp"
    img = Image.open(path).convert("RGBA")
    img.save(out_path, "WEBP", quality=quality, method=6)
    return out_path


def collect_pngs(path: Path):
    if path.is_file():
        return [path] if path.suffix.lower() == ".png" else []
    return [p for p in path.rglob("*.png") if p.is_file()]


def main():
    ap = argparse.ArgumentParser(description="Convert PNG to WebP")
    ap.add_argument("paths", nargs="+", help="File(s) or directory")
    ap.add_argument("-q", "--quality", type=int, default=80, help="WebP quality 1-100")
    ap.add_argument("-o", "--output", help="Output directory")
    args = ap.parse_args()

    pngs = []
    for p in args.paths:
        path = Path(p)
        if not path.exists():
            print(f"Not found: {path}", file=sys.stderr)
            continue
        pngs.extend(collect_pngs(path))

    if not pngs:
        print("No PNG files found.", file=sys.stderr)
        sys.exit(1)

    for p in pngs:
        out_dir = Path(args.output) if args.output else p.parent
        out_dir.mkdir(parents=True, exist_ok=True)
        out = convert_file(p, out_dir, args.quality)
        print(f"{p} -> {out}")


if __name__ == "__main__":
    main()
