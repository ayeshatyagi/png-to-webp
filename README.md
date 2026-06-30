# PNG to WebP

CLI tool to convert PNG images to WebP format.

## Setup

```bash
npm install
```

## Usage

```bash
# Single file
node index.js image.png

# Multiple files
node index.js a.png b.png c.png

# Entire directory (recursive)
node index.js ./images

# Custom quality (1-100, default 80)
node index.js -q 90 image.png

# Output to different directory
node index.js -o ./output ./images
```

## Options

| Option | Description |
|--------|-------------|
| `-q` / `--quality` | WebP quality 1-100 (default: 80) |
| `-o` / `--output` | Output directory (default: same as input) |
