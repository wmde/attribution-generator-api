/* eslint-disable no-param-reassign */
/* We allow param-reassigning in helper functions in this file, as eslint
 * fails to detect we clone each input-node and only work on the cloned node.
 * So, we're already doing what eslint intends us to do.
 */

const { JSDOM: JSDom } = require('jsdom');

function convertToNode(html) {
  const dom = new JSDom(`<div>${html.trim()}</div>`);
  return dom.window.document.body.children[0];
}

function sanitizeUrls(node) {
  const container = node.cloneNode(true);

  [].slice.call(container.getElementsByTagName('a')).forEach(link => {
    if (link.href.indexOf('/w/index.php?title=User:') >= 0) {
      link.href = link.href.replace(
        /^.*?\/w\/index\.php\?title=([^&]+).*$/,
        'https://commons.wikimedia.org/wiki/$1'
      );
    } else if (link.href.indexOf('/wiki/User:') === 0) {
      link.href = `https://commons.wikimedia.org${link.href}`;
    } else if (link.href.indexOf('//') === 0) {
      link.href = `https:${link.href}`;
    }

    const linkAttributes = link.attributes;
    for (let i = linkAttributes.length - 1; i >= 0; i -= 1) {
      if (linkAttributes[i].name !== 'href') {
        linkAttributes.removeNamedItem(linkAttributes[i].name);
      }
    }
  });

  return container;
}

function flattenVcardDivs(node) {
  const container = node.cloneNode(true);

  [].slice.call(container.querySelectorAll('div.vcard')).forEach(vcard => {
    const creator = vcard.querySelector('span#creator');
    if (creator) {
      vcard.innerHTML = creator.innerHTML;
    }
  });

  return container;
}

function removeUselessWrappingNodes(node) {
  const container = node.cloneNode(true);

  if (container.childNodes.length === 1) {
    const child = container.childNodes[0];

    if (child.nodeName !== 'A' && child.nodeName !== '#text') {
      return child;
    }
  }

  return container;
}

function removeTalkLink(node) {
  const container = node.cloneNode(true);
  const childNodes = [].slice.call(container.childNodes);
  const talkLinkIndex = childNodes.findIndex(
    child => child.nodeName === 'A' && child.text === 'talk'
  );
  if (talkLinkIndex >= 1 && talkLinkIndex < container.childNodes.length - 1) {
    container.removeChild(childNodes[talkLinkIndex - 1]);
    container.removeChild(childNodes[talkLinkIndex]);
    container.removeChild(childNodes[talkLinkIndex + 1]);
  }
  return container;
}

function removeUnwantedHtmlTags(node) {
  const container = node.cloneNode(true);

  // leaves links and textNodes intact
  // replaces all other elements with their innerHTML content
  const childHtml = [].slice.call(container.childNodes).map(child => {
    if (child.nodeName === 'A') {
      return child.outerHTML;
    }
    if (child.nodeName === '#text') {
      return child.textContent;
    }
    return child.innerHTML;
  });

  container.innerHTML = childHtml.join('');
  return container;
}

function removeUnwantedWhiteSpace(node) {
  const container = node.cloneNode(true);
  container.innerHTML = container.innerHTML
    .replace('&nbsp;', ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return container;
}

// This file follows the original Lizenshinweisgenerator `_scrapeSummaryField`
// HTML sanitization strategy.
// Takes a HTML string and returns a sanitized HTML string.
class HtmlSanitizer {
  constructor(html) {
    this.html = html;
  }

  sanitize() {
    let node = convertToNode(this.html);

    node = sanitizeUrls(node);
    node = flattenVcardDivs(node);
    node = removeUselessWrappingNodes(node);
    node = removeTalkLink(node);
    node = removeUnwantedHtmlTags(node);
    node = removeUnwantedWhiteSpace(node);

    return node.innerHTML;
  }
}

module.exports = HtmlSanitizer;
