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

  // tools/importer/import-about-page.js
  var import_about_page_exports = {};
  __export(import_about_page_exports, {
    default: () => import_about_page_default
  });

  // tools/importer/parsers/accordion-timeline.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".et_pb_accordion_item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".et_pb_toggle_title");
      const contentEl = item.querySelector(".et_pb_toggle_content");
      if (!titleEl) return;
      const title = document.createElement("p");
      title.textContent = titleEl.textContent.trim();
      const contentContainer = document.createElement("div");
      if (contentEl) {
        const images = contentEl.querySelectorAll("img");
        const headings = contentEl.querySelectorAll("h2, h3");
        const paragraphs = contentEl.querySelectorAll("p");
        headings.forEach((h) => {
          const heading = document.createElement("h3");
          heading.textContent = h.textContent.trim();
          contentContainer.append(heading);
        });
        paragraphs.forEach((p) => {
          const img = p.querySelector("img");
          if (img) {
            contentContainer.append(img.cloneNode(true));
          } else if (p.textContent.trim()) {
            const para = document.createElement("p");
            para.textContent = p.textContent.trim();
            contentContainer.append(para);
          }
        });
        const mainImage = contentEl.querySelector(".image img");
        if (mainImage) {
          const imgClone = mainImage.cloneNode(true);
          contentContainer.prepend(imgClone);
        }
      }
      cells.push([title, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-timeline", cells });
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

  // tools/importer/import-about-page.js
  var parsers = {
    "accordion-timeline": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "about-page",
    description: "About Roux brand history page with timeline accordion",
    urls: ["https://rouxbeauty.com/about-roux/"],
    blocks: [
      {
        name: "accordion-timeline",
        instances: ["#timeline.et_pb_accordion"]
      }
    ],
    sections: [
      {
        id: "about-content",
        name: "About Content",
        selector: ".entry-content .et_pb_section",
        style: null,
        blocks: ["accordion-timeline"],
        defaultContent: [".entry-content .et_pb_text_0 h1", ".entry-content .et_pb_text_0 p"]
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
  var import_about_page_default = {
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
  return __toCommonJS(import_about_page_exports);
})();
