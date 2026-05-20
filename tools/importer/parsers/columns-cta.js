/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta
 * Two-column CTA layout: Buy In-Store / Buy Online boxes
 * Selector: .et_pb_row with CTA columns containing headings and links
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll(':scope > .et_pb_column');
  if (columns.length < 2) return;

  const cells = [];
  const row = [];

  columns.forEach((col) => {
    const container = document.createElement('div');
    const heading = col.querySelector('h2, h3, h4');
    const link = col.querySelector('a.et_pb_button, a[href]');
    const img = col.querySelector('img');

    if (img) {
      container.append(img.cloneNode(true));
    }

    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      container.append(h);
    }

    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim() || 'LEARN MORE';
      p.append(a);
      container.append(p);
    }

    row.push(container);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
