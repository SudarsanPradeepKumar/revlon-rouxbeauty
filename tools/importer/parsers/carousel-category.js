/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-category
 * Source: https://rouxbeauty.com/hair-color/
 * Selector: #color-slider .et_pb_slider
 *
 * Extracts product slides with image, heading, description, and CTA.
 * Produces 2-column table: Col 1 = product image, Col 2 = heading + text + CTA link.
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.et_pb_slide');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.et_pb_slide_image img');
    const titleEl = slide.querySelector('.et_pb_slide_title');
    const contentEl = slide.querySelector('.et_pb_slide_content p');
    const ctaLink = slide.querySelector('.et_pb_button');

    if (!img) return;

    const contentCol = document.createElement('div');

    if (titleEl) {
      const h = document.createElement('h2');
      h.textContent = titleEl.textContent.trim();
      contentCol.append(h);
    }

    if (contentEl) {
      const p = document.createElement('p');
      p.textContent = contentEl.textContent.replace(/LEARN MORE/i, '').trim();
      contentCol.append(p);
    }

    if (ctaLink) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = 'LEARN MORE';
      linkP.append(a);
      contentCol.append(linkP);
    } else if (titleEl && titleEl.querySelector('a')) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = titleEl.querySelector('a').href;
      a.textContent = 'LEARN MORE';
      linkP.append(a);
      contentCol.append(linkP);
    }

    cells.push([img.cloneNode(true), contentCol]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-category', cells });
  element.replaceWith(block);
}
