/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Roux Beauty section breaks.
 * Inserts <hr> between sections defined in page-templates.json.
 * Sections: #home-slider, #social-feed, #weightless-oils-banner
 * No section-metadata blocks needed (all styles are null).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    if (!payload || !payload.template || !payload.template.sections) return;
    const sections = payload.template.sections;
    if (sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid index shifting
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const cells = { style: section.style };
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells,
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
