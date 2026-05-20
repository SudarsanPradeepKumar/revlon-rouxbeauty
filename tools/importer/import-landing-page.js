/* eslint-disable */
/* global WebImporter */

import columnsIntroParser from './parsers/columns-intro.js';
import columnsCtaParser from './parsers/columns-cta.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsCategoryParser from './parsers/cards-category.js';
import accordionTimelineParser from './parsers/accordion-timeline.js';

import rouxbeautyCleanupTransformer from './transformers/rouxbeauty-cleanup.js';

const parsers = {
  'columns-intro': columnsIntroParser,
  'columns-cta': columnsCtaParser,
  'columns-promo': columnsPromoParser,
  'cards-product': cardsProductParser,
  'cards-category': cardsCategoryParser,
  'accordion-timeline': accordionTimelineParser,
};

const transformers = [
  rouxbeautyCleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'landing-page',
  description: 'General landing page with various block combinations',
  urls: [],
  blocks: [
    { name: 'columns-intro', instances: ['.et_pb_section_0 .et_pb_row_0[class*="et_pb_column_1_2"]'] },
    { name: 'cards-product', instances: ['.et_pb_blurb'] },
    { name: 'accordion-timeline', instances: ['#timeline.et_pb_accordion'] },
  ],
  sections: [],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
      },
    }];
  },
};
