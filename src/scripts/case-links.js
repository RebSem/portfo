// Jump links at the top of a case study. Their targets are sections of the
// page, and some sit in a closed <details>. A fragment cannot open a closed
// details on its own in every browser, so the details that hold the target
// open here, before the browser scrolls to it. The links are internal anchors,
// so nothing is recorded, and without this script they still scroll.

// location.hash and link.hash arrive percent-encoded, and the ids on the page
// are Cyrillic for the Russian headings, so decode before looking the id up.
const elementForHash = (hash) => {
  let id = hash.replace(/^#/, '');
  try {
    id = decodeURIComponent(id);
  } catch {
    // A malformed escape cannot match an id, so look it up exactly as written.
  }
  return id ? document.getElementById(id) : null;
};

const openDetailsFor = (hash) => {
  let details = elementForHash(hash)?.closest('details');
  while (details) {
    details.open = true;
    details = details.parentElement?.closest('details');
  }
};

const init = () => {
  // A shared link with a fragment, or a soft navigation that lands on one.
  openDetailsFor(location.hash);
};

// Bound once per document: the module is evaluated once, and the listeners
// live as long as the page does, through every ClientRouter swap.
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (link) openDetailsFor(link.hash);
});
// Back and forward between two fragments of the same page.
window.addEventListener('hashchange', init);
// astro:page-load fires on the initial load as well as after every swap.
document.addEventListener('astro:page-load', init);
