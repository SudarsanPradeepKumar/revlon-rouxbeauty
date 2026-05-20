/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo
 * Source: https://rouxbeauty.com/top-sellers/
 * Selector: #whats-new
 *
 * Extracts a two-column promotional layout.
 * Column 1: product image. Column 2: logo image + tagline + CTA link.
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll(':scope > .et_pb_column');

  const cells = [];
  const row = [];

  columns.forEach((col) => {
    const container = document.createElement('div');

    const images = col.querySelectorAll('img');
    images.forEach((img) => {
      container.append(img.cloneNode(true));
    });

    const textInner = col.querySelector('.et_pb_text_inner');
    if (textInner) {
      const p = document.createElement('p');
      p.textContent = textInner.textContent.trim();
      container.append(p);
    }

    const ctaLink = col.querySelector('.et_pb_button');
    if (ctaLink) {
      const link = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      link.append(a);
      container.append(link);
    }

    row.push(container);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
