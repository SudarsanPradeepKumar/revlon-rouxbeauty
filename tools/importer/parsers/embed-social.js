/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-social
 * Base block: embed
 * Source: https://rouxbeauty.com/
 * Selector: #social-feed .cff-wrapper
 * Generated: 2026-05-20
 *
 * Extracts Facebook social feed embed from the Custom Facebook Feed (CFF)
 * widget and produces an Embed (social) block with the page URL.
 */
export default function parse(element, { document }) {
  // The CFF widget renders a Facebook feed dynamically via JavaScript.
  // The source HTML contains a .cff-wrapper with a #cff element inside.
  // We extract the Facebook page URL which is the known source for this feed.
  const facebookPageUrl = 'https://www.facebook.com/RouxBeauty';

  // Try to find any explicit link to Facebook within the widget as a fallback
  const fbLink = element.querySelector('a[href*="facebook.com"]');
  const url = fbLink ? fbLink.href : facebookPageUrl;

  // Create a link element for the URL cell
  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;

  // Build cells: single row with the Facebook page URL
  // Structure per library-example.md:
  // | Embed (social) |
  // |----------------|
  // | https://www.facebook.com/RouxBeauty |
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-social', cells });
  element.replaceWith(block);
}
