/* Rendert ein Topografie-Diagramm als SVG-String.
 * Interaktive Flächen bekommen data-term (je nach Stufe) – Flächen ohne
 * Begriff in der aktiven Stufe lassen Klicks durch (pointer-events:none). */

const esc = s => String(s).replace(/"/g, '&quot;');

export function renderDiagram(diagram, level) {
  const uid = diagram.id;
  const defs = Object.entries(diagram.clips || {})
    .map(([k, d]) => `<clipPath id="clip-${uid}-${k}"><path d="${d}"/></clipPath>`)
    .join('');

  const body = diagram.layers.map(l => {
    const isDeco = !!l.deco;
    const d = typeof l.deco === 'string' ? l.deco : l.d;
    const clip = l.clip ? ` clip-path="url(#clip-${uid}-${l.clip})"` : '';
    const cls = l.cls || 'plain';
    if (isDeco) return `<path class="deco ${cls}" d="${d}"${clip}/>`;
    const term = l[level];
    if (!term) return `<path class="fill ${cls}" d="${d}"${clip}/>`;
    const hit = l.hit ? `<path class="hitarea" d="${l.hit}" data-term="${esc(term)}"/>` : '';
    return `<path class="region ${cls}" d="${d}"${clip} data-term="${esc(term)}"/>${hit}`;
  }).join('');

  return `<svg class="topo" viewBox="${diagram.viewBox}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(diagram.title)}">` +
    `<defs>${defs}</defs><g class="layers">${body}</g></svg>`;
}
