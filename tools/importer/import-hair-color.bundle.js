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

  // tools/importer/import-hair-color.js
  var import_hair_color_exports = {};
  __export(import_hair_color_exports, {
    default: () => import_hair_color_default
  });

  // tools/importer/parsers/carousel-category.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".et_pb_slide");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".et_pb_slide_image img");
      const titleEl = slide.querySelector(".et_pb_slide_title");
      const contentEl = slide.querySelector(".et_pb_slide_content p");
      const ctaLink = slide.querySelector(".et_pb_button");
      if (!img) return;
      const contentCol = document.createElement("div");
      if (titleEl) {
        const h = document.createElement("h2");
        h.textContent = titleEl.textContent.trim();
        contentCol.append(h);
      }
      if (contentEl) {
        const p = document.createElement("p");
        p.textContent = contentEl.textContent.replace(/LEARN MORE/i, "").trim();
        contentCol.append(p);
      }
      if (ctaLink) {
        const linkP = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = "LEARN MORE";
        linkP.append(a);
        contentCol.append(linkP);
      } else if (titleEl && titleEl.querySelector("a")) {
        const linkP = document.createElement("p");
        const a = document.createElement("a");
        a.href = titleEl.querySelector("a").href;
        a.textContent = "LEARN MORE";
        linkP.append(a);
        contentCol.append(linkP);
      }
      cells.push([img.cloneNode(true), contentCol]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse2(element, { document }) {
    const blurbs = element.querySelectorAll(".et_pb_blurb");
    const cells = [];
    blurbs.forEach((blurb) => {
      const imgLink = blurb.querySelector(".et_pb_main_blurb_image a");
      const img = blurb.querySelector(".et_pb_main_blurb_image img");
      const headingLink = blurb.querySelector(".et_pb_module_header a");
      if (!img && !headingLink) return;
      const imgCol = document.createElement("div");
      if (img && imgLink) {
        const a = document.createElement("a");
        a.href = imgLink.href;
        a.append(img.cloneNode(true));
        imgCol.append(a);
      } else if (img) {
        imgCol.append(img.cloneNode(true));
      }
      const contentCol = document.createElement("div");
      if (headingLink) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = headingLink.href;
        a.textContent = headingLink.textContent.trim();
        h.append(a);
        contentCol.append(h);
      }
      cells.push([imgCol, contentCol]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
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

  // tools/importer/import-hair-color.js
  var parsers = {
    "carousel-category": parse,
    "cards-category": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "hair-color",
    description: "Hair Color category page with product carousel and category cards",
    urls: ["https://rouxbeauty.com/hair-color/"],
    blocks: [
      {
        name: "carousel-category",
        instances: ["#color-slider .et_pb_slider"]
      },
      {
        name: "cards-category",
        instances: ["#color-products"]
      }
    ],
    sections: [
      {
        id: "color-slider",
        name: "Product Slider",
        selector: "#color-slider",
        style: null,
        blocks: ["carousel-category"],
        defaultContent: []
      },
      {
        id: "color-products",
        name: "Product Grid",
        selector: "#color-products",
        style: null,
        blocks: ["cards-category"],
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
  var import_hair_color_default = {
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
  return __toCommonJS(import_hair_color_exports);
})();
