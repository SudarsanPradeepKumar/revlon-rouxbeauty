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

  // tools/importer/import-product-page.js
  var import_product_page_exports = {};
  __export(import_product_page_exports, {
    default: () => import_product_page_default
  });

  // tools/importer/parsers/columns-product.js
  function parse(element, { document }) {
    const imageDiv = element.querySelector(".image");
    const infoDiv = element.querySelector(".product-info");
    if (!infoDiv) return;
    const imgCol = document.createElement("div");
    if (imageDiv) {
      const firstImg = imageDiv.querySelector("span > img:not(.zoomImg)");
      if (firstImg) {
        imgCol.append(firstImg.cloneNode(true));
      }
    }
    const contentCol = document.createElement("div");
    const title = infoDiv.querySelector("h1");
    if (title) {
      const h1 = document.createElement("h1");
      h1.textContent = title.textContent.trim();
      contentCol.append(h1);
    }
    const desc = infoDiv.querySelector(".description p");
    if (desc) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      contentCol.append(p);
    }
    const swatchHeading = infoDiv.querySelector(".swatches h3");
    if (swatchHeading) {
      const h3 = document.createElement("h3");
      h3.textContent = swatchHeading.textContent.trim();
      contentCol.append(h3);
    }
    const buyBtn = infoDiv.querySelector('.buy-now a, a.buy-now, .price + a, a[href*="sally"]');
    const storeBtn = infoDiv.querySelector('a[href="/stores"]');
    if (buyBtn) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = buyBtn.href;
      a.textContent = buyBtn.textContent.trim() || "BUY NOW";
      p.append(a);
      contentCol.append(p);
    }
    if (storeBtn) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = storeBtn.href;
      a.textContent = storeBtn.textContent.trim() || "FIND A STORE";
      p.append(a);
      contentCol.append(p);
    }
    const cells = [[imgCol, contentCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-product.js
  function parse2(element, { document }) {
    const tabControls = element.querySelectorAll(".et_pb_tabs_controls li");
    const tabPanels = element.querySelectorAll(".et_pb_all_tabs .et_pb_tab");
    const cells = [];
    tabControls.forEach((control, idx) => {
      const label = document.createElement("p");
      const link = control.querySelector("a");
      label.textContent = link ? link.textContent.trim() : control.textContent.trim();
      const content = document.createElement("div");
      const panel = tabPanels[idx];
      if (panel) {
        const list = panel.querySelector("ul");
        if (list) {
          const ul = document.createElement("ul");
          list.querySelectorAll("li").forEach((li) => {
            const newLi = document.createElement("li");
            newLi.textContent = li.textContent.trim();
            ul.append(newLi);
          });
          content.append(ul);
        }
        const paragraphs = panel.querySelectorAll(":scope > p");
        paragraphs.forEach((p) => {
          const newP = document.createElement("p");
          newP.innerHTML = p.innerHTML;
          content.append(newP);
        });
      }
      cells.push([label, content]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-product", cells });
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

  // tools/importer/import-product-page.js
  var parsers = {
    "columns-product": parse,
    "tabs-product": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "product-page",
    description: "Product detail page with image gallery, product info, and tabs",
    urls: [],
    blocks: [
      {
        name: "columns-product",
        instances: [".product.clearfix"]
      },
      {
        name: "tabs-product",
        instances: [".et_pb_tabs"]
      }
    ],
    sections: [
      {
        id: "product-hero",
        name: "Product Hero",
        selector: ".product.clearfix",
        style: null,
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "product-tabs",
        name: "Product Tabs",
        selector: ".et_pb_tabs",
        style: null,
        blocks: ["tabs-product"],
        defaultContent: []
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
  var import_product_page_default = {
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
  return __toCommonJS(import_product_page_exports);
})();
