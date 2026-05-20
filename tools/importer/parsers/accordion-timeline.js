/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-timeline
 * Base block: accordion
 * Source: https://rouxbeauty.com/about-roux/
 * Selector: #timeline.et_pb_accordion
 *
 * Extracts accordion items from a Divi accordion module.
 * Each item has a title (.et_pb_toggle_title) and content (.et_pb_toggle_content).
 * Produces a 2-column table: Column 1 = title, Column 2 = rich content (images + text).
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.et_pb_accordion_item');

  const cells = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('.et_pb_toggle_title');
    const contentEl = item.querySelector('.et_pb_toggle_content');

    if (!titleEl) return;

    const title = document.createElement('p');
    title.textContent = titleEl.textContent.trim();

    const contentContainer = document.createElement('div');

    if (contentEl) {
      const images = contentEl.querySelectorAll('img');
      const headings = contentEl.querySelectorAll('h2, h3');
      const paragraphs = contentEl.querySelectorAll('p');

      headings.forEach((h) => {
        const heading = document.createElement('h3');
        heading.textContent = h.textContent.trim();
        contentContainer.append(heading);
      });

      paragraphs.forEach((p) => {
        const img = p.querySelector('img');
        if (img) {
          contentContainer.append(img.cloneNode(true));
        } else if (p.textContent.trim()) {
          const para = document.createElement('p');
          para.textContent = p.textContent.trim();
          contentContainer.append(para);
        }
      });

      const mainImage = contentEl.querySelector('.image img');
      if (mainImage) {
        const imgClone = mainImage.cloneNode(true);
        contentContainer.prepend(imgClone);
      }
    }

    cells.push([title, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-timeline', cells });
  element.replaceWith(block);
}
