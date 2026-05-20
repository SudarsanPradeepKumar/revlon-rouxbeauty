/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-product
 * Source: https://rouxbeauty.com/hair-color/fanci-full-rinse/
 * Selector: .et_pb_tabs
 *
 * Extracts tabbed content (Details, Ingredients, How To Use).
 * Produces 2-column table: Col 1 = tab label, Col 2 = tab content.
 */
export default function parse(element, { document }) {
  const tabControls = element.querySelectorAll('.et_pb_tabs_controls li');
  const tabPanels = element.querySelectorAll('.et_pb_all_tabs .et_pb_tab');

  const cells = [];

  tabControls.forEach((control, idx) => {
    const label = document.createElement('p');
    const link = control.querySelector('a');
    label.textContent = link ? link.textContent.trim() : control.textContent.trim();

    const content = document.createElement('div');
    const panel = tabPanels[idx];

    if (panel) {
      const list = panel.querySelector('ul');
      if (list) {
        const ul = document.createElement('ul');
        list.querySelectorAll('li').forEach((li) => {
          const newLi = document.createElement('li');
          newLi.textContent = li.textContent.trim();
          ul.append(newLi);
        });
        content.append(ul);
      }

      const paragraphs = panel.querySelectorAll(':scope > p');
      paragraphs.forEach((p) => {
        const newP = document.createElement('p');
        newP.innerHTML = p.innerHTML;
        content.append(newP);
      });
    }

    cells.push([label, content]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-product', cells });
  element.replaceWith(block);
}
