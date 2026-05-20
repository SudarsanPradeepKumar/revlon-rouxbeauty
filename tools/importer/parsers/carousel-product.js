/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product
 * Base block: carousel
 * Source: https://rouxbeauty.com/
 * Selector: #home-slider .et_pb_slider
 * Generated: 2026-05-20
 *
 * Extracts slides from the first fullwidth slider (et_pb_fullwidth_slider_0).
 * Each slide has an image (.et_pb_slide_image img) and a CTA link
 * (.et_pb_slide_description .et_pb_button). Produces a 2-column table:
 * Column 1 = image, Column 2 = CTA link.
 */
export default function parse(element, { document }) {
  // Only parse the first/desktop slider (et_pb_fullwidth_slider_0).
  // There are 3 duplicate sliders for responsive breakpoints; remove others.
  if (!element.classList.contains('et_pb_fullwidth_slider_0')) {
    element.remove();
    return;
  }

  // Select all slides - each .et_pb_slide represents one carousel item
  const slides = element.querySelectorAll(':scope .et_pb_slide');

  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.et_pb_slide_image img');
    const ctaLink = slide.querySelector('.et_pb_slide_description .et_pb_button');

    if (img) {
      const col2 = [];
      if (ctaLink) {
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.textContent = ctaLink.href;
        col2.push(link);
      }
      cells.push([img, col2]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
