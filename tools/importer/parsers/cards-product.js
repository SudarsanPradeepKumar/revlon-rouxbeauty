/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product
 * Source: https://rouxbeauty.com/top-sellers/
 * Selector: #fab-four
 *
 * Extracts product cards from the "Our Fab Three" section.
 * Each product has an image, title, description, and CTA link.
 * Produces 2-column table: Col 1 = product image, Col 2 = title + description + CTA.
 */
export default function parse(element, { document }) {
  const rows = element.querySelectorAll('.et_pb_row');
  const cells = [];

  rows.forEach((row) => {
    const columns = row.querySelectorAll('.et_pb_column');

    columns.forEach((col) => {
      if (col.classList.contains('et_pb_column_empty')) return;

      const productImg = col.querySelector('.product img, .et_pb_image img');
      const textInner = col.querySelector('.et_pb_text_inner');

      if (!textInner) return;

      const heading = textInner.querySelector('h3');
      const description = textInner.querySelector('p');
      const ctaLink = textInner.querySelector('a.et_pb_button');

      const imgCol = document.createElement('div');
      if (productImg) {
        imgCol.append(productImg.cloneNode(true));
      }

      const contentCol = document.createElement('div');
      if (heading) {
        const h = document.createElement('h3');
        h.textContent = heading.textContent.trim();
        contentCol.append(h);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        contentCol.append(p);
      }
      if (ctaLink) {
        const linkP = document.createElement('p');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        linkP.append(a);
        contentCol.append(linkP);
      }

      if (heading || productImg) {
        cells.push([imgCol, contentCol]);
      }
    });
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
