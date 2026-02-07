# CopyCleanUrlAndTitle

A Chrome extension that copies the current page's title and URL to the clipboard with automatic cleaning and sanitization.

## Features

- **One-click copy** -- Copies the page title and cleaned URL to the clipboard in `title\nurl` format
- **Tracking parameter removal** -- Strips `fbclid`, `utm_*` parameters, and URL hash fragments
- **Amazon URL normalization** -- Converts various Amazon product URL formats into a canonical `/dp/ASIN` form
- **Title sanitization** -- Normalizes Unicode (NFC), removes control characters, and replaces filesystem-unsafe characters (`:`, `[`, `]`, `|`) with full-width equivalents
- **Clipboard fallback** -- Uses the modern Clipboard API when available, with a `document.execCommand("copy")` fallback for older environments

## Installation

1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project directory

## Usage

1. Navigate to any webpage
2. Click the extension icon in the toolbar
3. The popup displays the cleaned title and URL
4. Click **Copy to Clipboard** to copy them

## Permissions

- `activeTab` -- Access to the current tab's URL and title only when the extension is activated

## License

[MIT](LICENSE) -- Copyright (c) 2023 Masahiro Yamaguchi
