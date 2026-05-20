/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Roux Beauty site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie consent, widgets, lightbox).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: <div id="onetrust-consent-sdk">)
    // Remove lightbox overlay (found: <div id="cff-lightbox-overlay">)
    // Remove lightbox wrapper (found: <div id="cff-lightbox-wrapper">)
    // Remove accessibility widget elements (found: <access-widget-ui>, .acsb-trigger, .acsb-sr-alert, a.acsb-sr-only)
    // Remove reCAPTCHA badge (found: <div class="grecaptcha-badge">)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#cff-lightbox-overlay',
      '#cff-lightbox-wrapper',
      'access-widget-ui',
      '.acsb-trigger',
      '.acsb-sr-alert',
      'a.acsb-sr-only',
      '.grecaptcha-badge',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header (found: <header id="main-header">)
    // Remove site footer (found: <footer id="main-footer">)
    // Remove iframes (found: reCAPTCHA iframes, empty iframes)
    // Remove noscript elements
    // Remove link elements
    WebImporter.DOMUtils.remove(element, [
      'header#main-header',
      'footer#main-footer',
      'iframe',
      'noscript',
      'link',
    ]);

    // Remove loose image before header inside #page-container
    // Found: <img src="./images/ab7ce8a2f1429324b4be757df3b042a4.png"> directly under #page-container
    const pageContainer = element.querySelector('#page-container');
    if (pageContainer) {
      const looseImg = pageContainer.querySelector(':scope > img');
      if (looseImg) looseImg.remove();
    }
  }
}
