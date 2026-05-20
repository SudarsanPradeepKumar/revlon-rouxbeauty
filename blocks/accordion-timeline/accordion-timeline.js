/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-timeline-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-timeline-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-timeline-item';
    if (index === 0) details.setAttribute('open', '');
    details.append(summary, body);
    row.replaceWith(details);
  });
}
