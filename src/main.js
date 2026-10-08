import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './style.css';
import { h, $ } from './lib/util.js';
import { load, save } from './lib/store.js';
import * as arten from './views/arten.js';
import * as topografie from './views/topografie.js';
import * as brutzeit from './views/brutzeit.js';
import * as fragen from './views/fragen.js';
import * as mehr from './views/mehr.js';
import * as bilder from './views/bilder.js';
import * as systematik from './views/systematik.js';

const ROUTES = {
  arten: { label: 'Arten', view: arten, icon: 'M3 14c3 0 5-2 6-5l2-3 3 1 3-2-1 3c0 6-4 9-9 9-3 0-4-1-4-3Zm11-5h0M9 19l-1 3M12 19l1 3' },
  topografie: { label: 'Topografie', view: topografie, icon: 'M20 4C12 4 6 10 6 18l-2 2M9 15h5M11 12h6M14 9h4' },
  brutzeit: { label: 'Brutzeit', view: brutzeit, icon: 'M12 21c3.9 0 7-3.1 7-7 0-5-4-9-7-11-3 2-7 6-7 11 0 3.9 3.1 7 7 7ZM9 13a3 3 0 0 0 3 3' },
  fragen: { label: 'Fragen', view: fragen, icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h0' },
  mehr: { label: 'Mehr', view: mehr, icon: 'M5 12h0M12 12h0M19 12h0' },
};

/* Unterseiten ohne eigenen Tab */
const SUBROUTES = {
  bilder: { view: bilder, tab: 'mehr' },
  systematik: { view: systematik, tab: 'arten' },
};

const LEVELS = [['b', 'Bronze'], ['s', 'Silber'], ['g', 'Gold']];
export const ctx = {
  get level() { return load('level', 'b'); },
  set level(v) { save('level', v); },
};

const app = $('#app');
const main = h('main', { class: 'view', id: 'view' });

function levelSwitch() {
  const wrap = h('div', { class: 'levels', role: 'radiogroup', 'aria-label': 'Prüfungsstufe' });
  LEVELS.forEach(([k, label]) => {
    const b = h('button', {
      class: `lvl lvl-${k}`, role: 'radio', 'aria-checked': String(ctx.level === k),
      onclick: () => { ctx.level = k; wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', String(x === b))); render(); },
    }, h('span', { class: 'medal', 'aria-hidden': 'true' }), label);
    wrap.append(b);
  });
  return wrap;
}

const header = h('header', { class: 'top' },
  h('div', { class: 'brand' }, h('span', { class: 'brand-mark', 'aria-hidden': 'true' }), 'Feldornithologie'),
  levelSwitch(),
);

const nav = h('nav', { class: 'tabs', 'aria-label': 'Bereiche' },
  ...Object.entries(ROUTES).map(([k, r]) =>
    h('a', { href: `#/${k}`, class: 'tab', 'data-route': k },
      h('span', { class: 'tab-icon', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24"><path d="${r.icon}"/></svg>` }),
      h('span', {}, r.label))),
);

app.append(header, main, nav);

let cleanup = null;
function render() {
  const key = (location.hash.replace(/^#\/?/, '') || 'arten').split('/')[0];
  const sub = SUBROUTES[key];
  const route = sub || ROUTES[key] || ROUTES.arten;
  const activeTab = sub ? sub.tab : (ROUTES[key] ? key : 'arten');
  nav.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-current', t.dataset.route === activeTab ? 'page' : 'false'));
  if (cleanup) { try { cleanup(); } catch { /* egal */ } }
  main.innerHTML = '';
  cleanup = route.view.mount(main, ctx) || null;
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);
render();
