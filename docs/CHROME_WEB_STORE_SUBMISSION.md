# Chrome Web Store Submission Guide

This document records the Chrome Web Store release process and contains submission-ready copy for Copy Clean URL And Title.

## Links

- Chrome Web Store: https://chromewebstore.google.com/detail/copy-clean-url-and-title/ffalcgkhcnaggflhbegaonflfnomgbjh
- GitHub repository: https://github.com/from2001/CopyUrlAndTitle
- Support: https://github.com/from2001/CopyUrlAndTitle/issues
- Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Store item ID: `ffalcgkhcnaggflhbegaonflfnomgbjh`

The public Store page was reachable and displayed version `1.1.0` on August 21, 2026. Confirm the live Store version and the dashboard state again before preparing an update.

## Store listing

The canonical listing copy is also kept in `store-assets/LISTING.md`. Update both files together when the product behavior changes.

### Product name

Copy Clean URL And Title

### Summary

Copy the current page title and a clean URL without common tracking parameters.

### Detailed description

Copy a page's title and a clean, share-ready URL in one click.

Copy Clean URL And Title removes common tracking parameters (`utm_*` and `fbclid`) and URL fragments while preserving unrelated query parameters. It also shortens supported Amazon product URLs to canonical `/dp/ASIN` links.

Features:

- Preview the current page title and processed URL before copying
- Copy both values in a simple two-line format: title, then URL
- Remove common tracking parameters and URL fragments
- Normalize supported Amazon product links
- Sanitize titles by removing control characters and replacing characters that are awkward in file names
- Work entirely on the device without sending data to a server

The extension contains no ads, analytics, remote code, or account system.

### Category

Workflow & Planning

### Language

English

## Privacy tab declarations

Re-check these declarations against the packaged source before every submission. If the extension later adds analytics, a server connection, storage, additional permissions, or other data handling, update the declarations and determine whether a public privacy policy is required before uploading the package.

### Single purpose

Copy the current tab's title and a cleaned, share-ready version of its URL to the clipboard.

### Permission justification

`activeTab`

> The extension uses activeTab only when the user opens its toolbar popup, so it can read the active tab's title and URL for local preview, cleanup, and copying. It does not access other tabs or retain or transmit this data.

### Remote code

Select **No, I am not using remote code**.

> All JavaScript and other executable code is included in the extension package. The extension does not load or evaluate remote code.

### Data use

> The extension does not collect or transmit user data. The current tab's title and URL are processed locally only after the user opens the extension.

Confirm the dashboard statements that user data is not sold, used for advertising or creditworthiness, or transferred to third parties. Do not select a collected-data category unless the packaged behavior requires it. Reading and processing the active tab locally must remain consistent with the single-purpose and permission declarations above.

### Privacy policy URL

The current implementation does not collect or transmit personal or sensitive user data, and no privacy-policy URL is recorded in the current local submission materials. If future behavior handles such data, create a dedicated public HTTPS privacy-policy page, verify it in a signed-out browser, and enter that URL in the dashboard before submission. A GitHub repository file page should not be treated as a substitute for a public policy page.

## Store and repository links

- Set the Store Listing **Homepage URL** to `https://github.com/from2001/CopyUrlAndTitle`.
- Set the Store Listing **Support URL** to `https://github.com/from2001/CopyUrlAndTitle/issues`.
- Keep `homepage_url` in `manifest.json` set to the same GitHub repository URL.
- Keep the Chrome Web Store installation link near the top of `README.md`.
- Set the GitHub repository **Website** field to the Chrome Web Store URL.

## Required and recommended visual assets

- Store icon: the packaged `images/Icon128.png` file, which is 128 x 128 pixels.
- Store screenshot: `store-assets/screenshot-1280x800.png`, which is a 1280 x 800 non-alpha PNG.
- Provide at least one 1280 x 800 screenshot, with up to five screenshots total.
- Prepare a YouTube demonstration video if the dashboard requests or benefits from one.
- Prepare a 440 x 280 PNG or JPEG small promotional tile if the dashboard requests or benefits from one.
- A 1400 x 560 PNG or JPEG marquee promotional tile is optional.

Capture screenshots on a non-confidential page. Do not expose personal data, private browser tabs, account details, or other confidential content.

## Test instructions for reviewers

> 1. Install the extension and open a normal HTTP or HTTPS page whose URL contains a removable parameter, such as `https://example.com/article?id=42&utm_source=test#section`.
> 2. Click the extension's toolbar icon to open the popup.
> 3. Confirm that the page title and processed URL appear in the preview.
> 4. Confirm that `utm_source` and the URL fragment are removed, the unrelated `id=42` parameter remains, and the **Cleaned** badge is visible.
> 5. Click **Copy to clipboard** and confirm that the clipboard contains the sanitized title on the first line and the processed URL on the second line.
> 6. Optionally open a supported Amazon product page and confirm that its URL is normalized to the `/dp/ASIN` form.
>
> The extension processes the active tab's title and URL locally. It does not require an account, paid service, or test credential, and it does not transmit the data to a server. Restricted pages such as `chrome://` pages and the Chrome Web Store may not expose a normal tab URL to extensions.

## Package contents

The release ZIP should contain only the runtime files required by the extension:

```text
manifest.json
popup.html
popup.js
css.css
images/Icon16.png
images/Icon48.png
images/Icon128.png
```

Do not include `.git`, `dist`, `store-assets`, `docs`, source design files, screenshots, or other development-only files. `manifest.json` must be at the root of the ZIP, not inside a containing directory.

## Release procedure

1. Confirm that `main` contains only the changes intended for the release and that the working tree is clean.
2. Compare the dashboard's published version with `manifest.json`. Increment `manifest.json` to a version greater than every version previously uploaded. Version `1.1.0` is already published, so the next normal patch release would be `1.1.1`.
3. Update this document, `store-assets/LISTING.md`, and `README.md` when features, permissions, URLs, screenshots, or data handling have changed.
4. Run the source and asset checks:

   ```sh
   node --check popup.js
   python3 -m json.tool manifest.json >/dev/null
   sips -g pixelWidth -g pixelHeight -g hasAlpha images/Icon128.png store-assets/screenshot-1280x800.png
   git diff --check
   ```

5. Test the unpacked extension from the repository directory in `chrome://extensions/`. Verify title sanitization, tracking-parameter removal, fragment removal, preservation of unrelated query parameters, Amazon URL normalization, the conditional **Cleaned** badge, the button copy action, and the keyboard shortcut.
6. Commit the exact release source. Then create the minimal package from the committed files:

   ```sh
   VERSION="$(node -p 'JSON.parse(require("fs").readFileSync("manifest.json", "utf8")).version')"
   mkdir -p dist
   git archive --format=zip \
     --output="dist/Copy-Clean-URL-And-Title-${VERSION}.zip" \
     HEAD -- \
     manifest.json popup.html popup.js css.css \
     images/Icon16.png images/Icon48.png images/Icon128.png
   unzip -t "dist/Copy-Clean-URL-And-Title-${VERSION}.zip"
   unzip -Z1 "dist/Copy-Clean-URL-And-Title-${VERSION}.zip"
   ```

7. Extract the generated ZIP into a temporary directory, load that extracted directory from `chrome://extensions/`, and repeat the reviewer test. Do not load the ZIP itself as an unpacked extension.
8. Open the Developer Dashboard, select item ID `ffalcgkhcnaggflhbegaonflfnomgbjh`, and confirm the published version, draft version, outstanding review, rejection, or staged-publication state. Do not create a duplicate item.
9. In **Package**, upload `dist/Copy-Clean-URL-And-Title-<version>.zip`. Uploading a package does not submit it for review.
10. In **Store Listing**, reconcile the product name, summary, description, category, language, screenshot, Homepage URL, and Support URL with the packaged behavior.
11. In **Privacy**, reconcile the single purpose, `activeTab` justification, remote-code declaration, and data-use statements with the packaged source.
12. In **Distribution**, confirm the intended visibility and regions. Existing updates use the item's current distribution channel unless it is deliberately changed.
13. Save the draft and resolve every blocking dashboard warning. Record the draft version and ZIP filename.
14. Before selecting **Submit for review**, present the final package version, filename, item ID, listing changes, privacy declarations, distribution, and publishing mode for explicit approval.
15. Use staged/manual publishing by default by disabling automatic publishing. Submission for review and public release are separate external actions.
16. After approval from Chrome, obtain explicit publication approval before selecting **Publish**. If automatic publishing was explicitly authorized for that release, verify that the item actually becomes public after review.
17. Verify the public Store page in a signed-out browser: HTTP availability, product name, version, description, screenshot, GitHub link, support link, and **Add to Chrome** flow.

Record the submitted version, ZIP filename, submission date, review state, publishing mode, approval date, and final publication result in the pull request or release notes. A dashboard state of **Pending review** is not proof that the update is published.

## Submission history

| Version | Package | Submitted | Result | Publishing mode |
| --- | --- | --- | --- | --- |
| 1.1.0 | `dist/Copy-Clean-URL-And-Title-1.1.0.zip` | August 13, 2026 | Published; public page verified on August 21, 2026 | Automatic after approval |

## Official references

- [Update your Chrome Web Store item](https://developer.chrome.com/docs/webstore/update/)
- [Complete your listing information](https://developer.chrome.com/docs/webstore/cws-dashboard-listing/)
- [Prepare to publish: set up distribution](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution/)
- [Chrome Web Store review process](https://developer.chrome.com/docs/webstore/review-process/)
- [User Data Policy FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq/)
- [Manifest `homepage_url`](https://developer.chrome.com/docs/extensions/reference/manifest/homepage-url/)
