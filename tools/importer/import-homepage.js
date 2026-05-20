/* eslint-disable */
/* global WebImporter */

import carouselProductParser from './parsers/carousel-product.js';
import embedSocialParser from './parsers/embed-social.js';

import rouxbeautyCleanupTransformer from './transformers/rouxbeauty-cleanup.js';
import rouxbeautySectionsTransformer from './transformers/rouxbeauty-sections.js';

const parsers = {
  'carousel-product': carouselProductParser,
  'embed-social': embedSocialParser,
};

const transformers = [
  rouxbeautyCleanupTransformer,
  rouxbeautySectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Roux Beauty homepage featuring brand hero, product categories, featured products, and promotional content',
  urls: ['https://rouxbeauty.com/'],
  blocks: [
    {
      name: 'carousel-product',
      instances: ['#home-slider .et_pb_slider'],
    },
    {
      name: 'embed-social',
      instances: ['#social-feed .cff-wrapper'],
    },
  ],
  sections: [
    {
      id: 'home-slider',
      name: 'Hero Slider',
      selector: '#home-slider',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'social-feed',
      name: 'Social Feed',
      selector: '#social-feed',
      style: null,
      blocks: ['embed-social'],
      defaultContent: ['#social-feed .et_pb_text_0 h2'],
    },
    {
      id: 'weightless-oils-banner',
      name: 'Promotional Banner',
      selector: '#weightless-oils-banner',
      style: null,
      blocks: [],
      defaultContent: ['#weightless-oils-banner .et_pb_image_0 a'],
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
