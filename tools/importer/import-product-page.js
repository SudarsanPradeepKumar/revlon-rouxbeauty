/* eslint-disable */
/* global WebImporter */

import columnsProductParser from './parsers/columns-product.js';
import tabsProductParser from './parsers/tabs-product.js';

import rouxbeautyCleanupTransformer from './transformers/rouxbeauty-cleanup.js';

const parsers = {
  'columns-product': columnsProductParser,
  'tabs-product': tabsProductParser,
};

const transformers = [
  rouxbeautyCleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'product-page',
  description: 'Product detail page with image gallery, product info, and tabs',
  urls: [],
  blocks: [
    {
      name: 'columns-product',
      instances: ['.product.clearfix'],
    },
    {
      name: 'tabs-product',
      instances: ['.et_pb_tabs'],
    },
  ],
  sections: [
    {
      id: 'product-hero',
      name: 'Product Hero',
      selector: '.product.clearfix',
      style: null,
      blocks: ['columns-product'],
      defaultContent: [],
    },
    {
      id: 'product-tabs',
      name: 'Product Tabs',
      selector: '.et_pb_tabs',
      style: null,
      blocks: ['tabs-product'],
      defaultContent: [],
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
