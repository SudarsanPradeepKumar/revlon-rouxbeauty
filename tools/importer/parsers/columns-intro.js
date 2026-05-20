/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-intro
 * Two-column intro layout: text content (heading + paragraph) on left, image on right.
 * Selector: .et_pb_row with 2 columns where one has text and other has image
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll(':scope > .et_pb_column');
  if (columns.length < 2) return;

  const cells = [];
  const row = [];

  columns.forEach((col) => {
    const container = document.createElement('div');
    const heading = col.querySelector('h1, h2, h3');
    const paragraphs = col.querySelectorAll('.et_pb_text_inner p');
    const img = col.querySelector('img');

    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      container.append(h);
    }

    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        container.append(para);
      }
    });

    if (img && !heading) {
      container.append(img.cloneNode(true));
    }

    row.push(container);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
