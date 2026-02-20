const state = window.__portfolioBlogState ?? {
  localeListenerBound: false,
};

window.__portfolioBlogState = state;

let activeLocale = document.documentElement.lang === 'ru' ? 'ru' : 'en';

const resolveLocale = () => {
  activeLocale = document.documentElement.lang === 'ru' ? 'ru' : 'en';
};

const formatDate = (isoDate) => {
  const formatter = new Intl.DateTimeFormat(activeLocale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return formatter.format(new Date(`${isoDate}T00:00:00.000Z`));
};

const localizeDates = () => {
  const nodes = document.querySelectorAll('.blog-date[data-published]');
  nodes.forEach((node) => {
    const isoDate = node.dataset.published;
    if (!isoDate) return;
    node.textContent = formatDate(isoDate);
  });
};

const filterCardsByLocale = () => {
  const cards = document.querySelectorAll('.blog-card[data-lang]');
  let visibleCount = 0;

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    const lang = card.dataset.lang;
    const matchesLocale = lang === activeLocale;
    card.hidden = !matchesLocale;

    if (matchesLocale) {
      visibleCount += 1;
    }
  });

  const emptyNode = document.getElementById('blog-empty');
  if (emptyNode) {
    emptyNode.hidden = visibleCount > 0;
  }
};

const syncBlogPage = () => {
  resolveLocale();
  localizeDates();
  filterCardsByLocale();
};

const onLocaleChange = () => {
  if (!document.getElementById('blog-list')) return;
  syncBlogPage();
};

const initBlog = () => {
  if (!document.getElementById('blog-list')) {
    return;
  }

  if (!state.localeListenerBound) {
    window.addEventListener('portfolio:locale-change', onLocaleChange);
    state.localeListenerBound = true;
  }

  syncBlogPage();
};

document.addEventListener('astro:page-load', initBlog);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlog, { once: true });
} else {
  initBlog();
}
