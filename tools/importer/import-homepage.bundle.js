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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-product.js
  function parse(element, { document }) {
    if (!element.classList.contains("et_pb_fullwidth_slider_0")) {
      element.remove();
      return;
    }
    const slides = element.querySelectorAll(":scope .et_pb_slide");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".et_pb_slide_image img");
      const ctaLink = slide.querySelector(".et_pb_slide_description .et_pb_button");
      if (img) {
        const col2 = [];
        if (ctaLink) {
          const link = document.createElement("a");
          link.href = ctaLink.href;
          link.textContent = ctaLink.href;
          col2.push(link);
        }
        cells.push([img, col2]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-social.js
  function parse2(element, { document }) {
    const facebookPageUrl = "https://www.facebook.com/RouxBeauty";
    const fbLink = element.querySelector('a[href*="facebook.com"]');
    const url = fbLink ? fbLink.href : facebookPageUrl;
    const link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-social", cells });
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

  // tools/importer/transformers/rouxbeauty-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      if (!payload || !payload.template || !payload.template.sections) return;
      const sections = payload.template.sections;
      if (sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const cells = { style: section.style };
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-product": parse,
    "embed-social": parse2
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Roux Beauty homepage featuring brand hero, product categories, featured products, and promotional content",
    urls: ["https://rouxbeauty.com/"],
    blocks: [
      {
        name: "carousel-product",
        instances: ["#home-slider .et_pb_slider"]
      },
      {
        name: "embed-social",
        instances: ["#social-feed .cff-wrapper"]
      }
    ],
    sections: [
      {
        id: "home-slider",
        name: "Hero Slider",
        selector: "#home-slider",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "social-feed",
        name: "Social Feed",
        selector: "#social-feed",
        style: null,
        blocks: ["embed-social"],
        defaultContent: ["#social-feed .et_pb_text_0 h2"]
      },
      {
        id: "weightless-oils-banner",
        name: "Promotional Banner",
        selector: "#weightless-oils-banner",
        style: null,
        blocks: [],
        defaultContent: ["#weightless-oils-banner .et_pb_image_0 a"]
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
