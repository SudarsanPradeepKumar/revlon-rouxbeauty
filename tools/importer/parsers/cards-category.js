/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category
 * Source: https://rouxbeauty.com/hair-color/
 * Selector: #color-products
 *
 * Extracts minimal product cards with linked image and linked heading.
 * Produces 2-column table: Col 1 = linked product image, Col 2 = linked heading.
 */
export default function parse(element, { document }) {
  const blurbs = element.querySelectorAll('.et_pb_blurb');
  const cells = [];

  blurbs.forEach((blurb) => {
    const imgLink = blurb.querySelector('.et_pb_main_blurb_image a');
    const img = blurb.querySelector('.et_pb_main_blurb_image img');
    const headingLink = blurb.querySelector('.et_pb_module_header a');

    if (!img && !headingLink) return;

    const imgCol = document.createElement('div');
    if (img && imgLink) {
      const a = document.createElement('a');
      a.href = imgLink.href;
      a.append(img.cloneNode(true));
      imgCol.append(a);
    } else if (img) {
      imgCol.append(img.cloneNode(true));
    }

    const contentCol = document.createElement('div');
    if (headingLink) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.href = headingLink.href;
      a.textContent = headingLink.textContent.trim();
      h.append(a);
      contentCol.append(h);
    }

    cells.push([imgCol, contentCol]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
