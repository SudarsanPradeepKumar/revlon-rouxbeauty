/* eslint-disable */
/* global WebImporter */

import columnsPromoParser from './parsers/columns-promo.js';
import cardsProductParser from './parsers/cards-product.js';

import rouxbeautyCleanupTransformer from './transformers/rouxbeauty-cleanup.js';

const parsers = {
  'columns-promo': columnsPromoParser,
  'cards-product': cardsProductParser,
};

const transformers = [
  rouxbeautyCleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'top-sellers',
  description: 'Top sellers page with promotional columns and product cards',
  urls: ['https://rouxbeauty.com/top-sellers/'],
  blocks: [
    {
      name: 'columns-promo',
      instances: ['#whats-new'],
    },
    {
      name: 'cards-product',
      instances: ['#fab-four'],
    },
  ],
  sections: [
    {
      id: 'whats-new',
      name: 'Whats New',
      selector: '.et_pb_section_0',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: ['.et_pb_section_0 .et_pb_text_0 h1'],
    },
    {
      id: 'fab-three',
      name: 'Our Fab Three',
      selector: '#fab-four',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['#fab-four .et_pb_text_2 h2'],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

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
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
