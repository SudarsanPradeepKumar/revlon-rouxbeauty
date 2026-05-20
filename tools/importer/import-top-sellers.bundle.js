/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-top-sellers.js
  var import_top_sellers_exports = {};
  __export(import_top_sellers_exports, {
    default: () => import_top_sellers_default
  });

  // tools/importer/parsers/columns-promo.js
  function parse(element, { document }) {
    const columns = element.querySelectorAll(":scope > .et_pb_column");
    const cells = [];
    const row = [];
    columns.forEach((col) => {
      const container = document.createElement("div");
      const images = col.querySelectorAll("img");
      images.forEach((img) => {
        container.append(img.cloneNode(true));
      });
      const textInner = col.querySelector(".et_pb_text_inner");
      if (textInner) {
        const p = document.createElement("p");
        p.textContent = textInner.textContent.trim();
        container.append(p);
      }
      const ctaLink = col.querySelector(".et_pb_button");
      if (ctaLink) {
        const link = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        link.append(a);
        container.append(link);
      }
      row.push(container);
    });
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const rows = element.querySelectorAll(".et_pb_row");
    const cells = [];
    rows.forEach((row) => {
      const columns = row.querySelectorAll(".et_pb_column");
      columns.forEach((col) => {
        if (col.classList.contains("et_pb_column_empty")) return;
        const productImg = col.querySelector(".product img, .et_pb_image img");
        const textInner = col.querySelector(".et_pb_text_inner");
        if (!textInner) return;
        const heading = textInner.querySelector("h3");
        const description = textInner.querySelector("p");
        const ctaLink = textInner.querySelector("a.et_pb_button");
        const imgCol = document.createElement("div");
        if (productImg) {
          imgCol.append(productImg.cloneNode(true));
        }
        const contentCol = document.createElement("div");
        if (heading) {
          const h = document.createElement("h3");
          h.textContent = heading.textContent.trim();
          contentCol.append(h);
        }
        if (description) {
          const p = document.createElement("p");
          p.textContent = description.textContent.trim();
          contentCol.append(p);
        }
        if (ctaLink) {
          const linkP = document.createElement("p");
          const a = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rouxbeauty-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#cff-lightbox-overlay",
        "#cff-lightbox-wrapper",
        "access-widget-ui",
        ".acsb-trigger",
        ".acsb-sr-alert",
        "a.acsb-sr-only",
        ".grecaptcha-badge"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#main-header",
        "footer#main-footer",
        "iframe",
        "noscript",
        "link"
      ]);
      const pageContainer = element.querySelector("#page-container");
      if (pageContainer) {
        const looseImg = pageContainer.querySelector(":scope > img");
        if (looseImg) looseImg.remove();
      }
    }
  }

  // tools/importer/import-top-sellers.js
  var parsers = {
    "columns-promo": parse,
    "cards-product": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "top-sellers",
    description: "Top sellers page with promotional columns and product cards",
    urls: ["https://rouxbeauty.com/top-sellers/"],
    blocks: [
      {
        name: "columns-promo",
        instances: ["#whats-new"]
      },
      {
        name: "cards-product",
        instances: ["#fab-four"]
      }
    ],
    sections: [
      {
        id: "whats-new",
        name: "Whats New",
        selector: ".et_pb_section_0",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: [".et_pb_section_0 .et_pb_text_0 h1"]
      },
      {
        id: "fab-three",
        name: "Our Fab Three",
        selector: "#fab-four",
        style: null,
        blocks: ["cards-product"],
        defaultContent: ["#fab-four .et_pb_text_2 h2"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_top_sellers_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_top_sellers_exports);
})();
