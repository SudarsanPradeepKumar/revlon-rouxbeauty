/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-product
 * Source: https://rouxbeauty.com/hair-color/fanci-full-rinse/
 * Selector: .product.clearfix
 *
 * Extracts product detail two-column layout:
 * Column 1: Product images (first non-zoom image from gallery)
 * Column 2: Title + description + swatches heading + CTA
 */
export default function parse(element, { document }) {
  const imageDiv = element.querySelector('.image');
  const infoDiv = element.querySelector('.product-info');

  if (!infoDiv) return;

  const imgCol = document.createElement('div');
  if (imageDiv) {
    const firstImg = imageDiv.querySelector('span > img:not(.zoomImg)');
    if (firstImg) {
      imgCol.append(firstImg.cloneNode(true));
    }
  }

  const contentCol = document.createElement('div');

  const title = infoDiv.querySelector('h1');
  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title.textContent.trim();
    contentCol.append(h1);
  }

  const desc = infoDiv.querySelector('.description p');
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    contentCol.append(p);
  }

  const swatchHeading = infoDiv.querySelector('.swatches h3');
  if (swatchHeading) {
    const h3 = document.createElement('h3');
    h3.textContent = swatchHeading.textContent.trim();
    contentCol.append(h3);
  }

  const buyBtn = infoDiv.querySelector('.buy-now a, a.buy-now, .price + a, a[href*="sally"]');
  const storeBtn = infoDiv.querySelector('a[href="/stores"]');

  if (buyBtn) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = buyBtn.href;
    a.textContent = buyBtn.textContent.trim() || 'BUY NOW';
    p.append(a);
    contentCol.append(p);
  }

  if (storeBtn) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = storeBtn.href;
    a.textContent = storeBtn.textContent.trim() || 'FIND A STORE';
    p.append(a);
    contentCol.append(p);
  }

  const cells = [[imgCol, contentCol]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product', cells });
  element.replaceWith(block);
}
