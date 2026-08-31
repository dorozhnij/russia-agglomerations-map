(function (global) {
  'use strict';

  var MED_SCALE = 0.26;
  var MED_EFF = 0.34;
  var CLUSTER_COLORS = {
    anchors: '#FE6643',
    large: '#B7E7FC',
    dense: '#FFD3F0',
    weak: '#F5C700'
  };
  var DEFAULT_CLUSTER_LABELS = {
    anchors: 'Экономические якоря',
    large: 'Крупные низкоинтенсивные',
    dense: 'Высокоинтенсивные узлы',
    weak: 'Слабо вовлеченные'
  };
  var CLUSTER_OVERRIDE = {
    'Уфимская': 'large',
    'Ижевская': 'large',
    'Оренбургская': 'large',
    'Владивостокская': 'dense',
    'Тульско-Новомосковская': 'dense',
    'Иркутская': 'dense'
  };

  function formatNum(n, digits) {
    if (typeof digits !== 'number') digits = 2;
    var fixed = Number(n).toFixed(digits);
    var zeros = '.' + new Array(digits + 1).join('0');
    if (fixed.slice(-zeros.length) === zeros) {
      return fixed.slice(0, -zeros.length);
    }
    return fixed.replace('.', ',');
  }

  function scoreBar(value, maxW) {
    maxW = maxW || 110;
    var w = Math.max(4, Math.round(Math.max(0, Math.min(1, value)) * maxW));
    return '<span class="score-bar" style="width:' + w + 'px"></span>';
  }

  function prepareData(data) {
    data.forEach(function (d) {
      d.vgpPerCapita = parseFloat((d.vgp / d.population).toFixed(2));
    });
    var byIntegral50 = data.slice().sort(function (a, b) { return b.integral50 - a.integral50; });
    byIntegral50.forEach(function (d, i) { d.rank = i + 1; });
    var byEfficiency = data.slice().sort(function (a, b) { return b.efficiency - a.efficiency; });
    byEfficiency.forEach(function (d, i) { d.effRank = i + 1; });
    return { byIntegral50: byIntegral50, byEfficiency: byEfficiency };
  }

  function sortItems(base, key, dir) {
    var items = base.slice();
    if (key === 'rank' || key === 'effRank') {
      items.sort(function (a, b) {
        var av = a[key], bv = b[key];
        return dir === 'asc' ? av - bv : bv - av;
      });
    } else if (key === 'name') {
      items.sort(function (a, b) {
        var cmp = a.name.localeCompare(b.name, 'ru');
        return dir === 'asc' ? cmp : -cmp;
      });
    } else {
      items.sort(function (a, b) {
        return dir === 'asc' ? a[key] - b[key] : b[key] - a[key];
      });
    }
    return items;
  }

  function updateSortHeaders(tableId, activeKey, dir) {
    document.querySelectorAll('th[data-table="' + tableId + '"]').forEach(function (th) {
      var key = th.dataset.sort;
      var icon = th.querySelector('.sort-icon');
      if (key === activeKey) {
        th.classList.add('active');
        th.dataset.dir = dir;
        if (icon) icon.textContent = dir === 'asc' ? '▲' : '▼';
      } else {
        th.classList.remove('active');
        th.dataset.dir = '';
        if (icon) icon.textContent = '▼';
      }
    });
  }

  function scorePoints(value) {
    return Math.round(Number(value) * 100);
  }

  function renderRatingTable(body, items, opts) {
    opts = opts || {};
    body.innerHTML = '';
    items.forEach(function (d, i) {
      var rankClass = 'rank';
      if (d.rank === 1) rankClass += ' rank-1';
      else if (d.rank === 2) rankClass += ' rank-2';
      else if (d.rank === 3) rankClass += ' rank-3';
      var scoreLabel = opts.scoreAsPoints ? String(scorePoints(d.integral50)) : formatNum(d.integral50);
      var tr = document.createElement('tr');
      if (i % 2 === 1) tr.style.background = '#F9F9F9';
      var html =
        '<td class="' + rankClass + '">' + d.rank + '</td>' +
        '<td class="agglo-name">' + d.name + '</td>' +
        '<td><span class="score-cell">' + scoreBar(d.integral50) + '<span class="score-text">' + scoreLabel + '</span></span></td>';
      if (!opts.compact) {
        html +=
          '<td class="num">' + formatNum(d.scale) + '</td>' +
          '<td class="num">' + formatNum(d.efficiency) + '</td>';
      }
      tr.innerHTML = html;
      body.appendChild(tr);
    });
  }

  function bindRatingSort(tableId, body, baseItems, opts) {
    opts = opts || {};
    var ratingKey = 'rank';
    var ratingDir = 'asc';
    renderRatingTable(body, sortItems(baseItems, 'rank', 'asc'), opts);
    updateSortHeaders(tableId, 'rank', 'asc');
    document.querySelectorAll('th[data-table="' + tableId + '"]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = this.dataset.sort;
        var dir = (ratingKey === key) ? (ratingDir === 'asc' ? 'desc' : 'asc') : ((key === 'name' || key === 'rank') ? 'asc' : 'desc');
        ratingKey = key;
        ratingDir = dir;
        updateSortHeaders(tableId, key, dir);
        renderRatingTable(body, sortItems(baseItems, key, dir), opts);
      });
    });
  }

  function renderEffTable(body, items) {
    if (!body) return;
    body.innerHTML = '';
    items.forEach(function (d, i) {
      var rankClass = 'rank';
      if (d.effRank === 1) rankClass += ' rank-1';
      else if (d.effRank === 2) rankClass += ' rank-2';
      else if (d.effRank === 3) rankClass += ' rank-3';
      var tr = document.createElement('tr');
      if (i % 2 === 1) tr.style.background = '#F9F9F9';
      tr.innerHTML =
        '<td class="' + rankClass + '">' + d.effRank + '</td>' +
        '<td class="agglo-name">' + d.name + '</td>' +
        '<td><span class="score-cell">' + scoreBar(d.efficiency) + '<span class="score-text">' + formatNum(d.efficiency) + '</span></span></td>' +
        '<td class="num">' + formatNum(d.shipmentsPc, 1) + '</td>' +
        '<td class="num">' + formatNum(d.investmentsPc, 1) + '</td>' +
        '<td class="num">' + formatNum(d.employmentRate, 1) + '</td>';
      body.appendChild(tr);
    });
  }

  function bindEfficiencySort(tableId, body, baseItems) {
    if (!body) return;
    var effKey = 'effRank';
    var effDir = 'asc';
    renderEffTable(body, sortItems(baseItems, 'effRank', 'asc'));
    updateSortHeaders(tableId, 'effRank', 'asc');
    document.querySelectorAll('th[data-table="' + tableId + '"]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = this.dataset.sort;
        var dir = (effKey === key) ? (effDir === 'asc' ? 'desc' : 'asc') : ((key === 'name' || key === 'effRank') ? 'asc' : 'desc');
        effKey = key;
        effDir = dir;
        updateSortHeaders(tableId, key, dir);
        renderEffTable(body, sortItems(baseItems, key, dir));
      });
    });
  }

  function clusterKey(d) {
    if (CLUSTER_OVERRIDE[d.name]) return CLUSTER_OVERRIDE[d.name];
    var hiS = d.scale >= MED_SCALE;
    var hiE = d.efficiency >= MED_EFF;
    if (hiS && hiE) return 'anchors';
    if (hiS && !hiE) return 'large';
    if (!hiS && hiE) return 'dense';
    return 'weak';
  }

  function shortAggloName(name) {
    return name
      .replace(/ско-/g, '-')
      .replace(/ская$/, '')
      .replace(/ая$/, '');
  }

  function renderBubbleChart(opts) {
    var wrap = document.getElementById(opts.containerId);
    var tooltip = document.getElementById(opts.tooltipId);
    var items = opts.items;
    var labels = opts.labels || DEFAULT_CLUSTER_LABELS;
    var yAxisTitle = opts.yAxisTitle || 'эффективность →';
    var xAxisTitle = opts.xAxisTitle || 'масштаб →';
    var asPoints = !!opts.scoreAsPoints;
    if (!wrap || !tooltip) return;

    var width = wrap.clientWidth || 1000;
    var height = wrap.clientHeight || 560;
    var margin = { top: 18, right: 28, bottom: 48, left: asPoints ? 62 : 54 };
    var plotW = Math.max(120, width - margin.left - margin.right);
    var plotH = Math.max(120, height - margin.top - margin.bottom);

    var maxVgp = Math.max.apply(null, items.map(function (d) { return d.vgp; }));
    var maxR = Math.min(plotW, plotH) * 0.085;
    var minR = 5;
    var pad = maxR + 6;

    function xOf(v) {
      return margin.left + pad + v * (plotW - 2 * pad);
    }
    function yOf(v) {
      return margin.top + pad + (1 - v) * (plotH - 2 * pad);
    }
    function rOf(vgp) {
      return Math.max(minR, Math.sqrt(vgp / maxVgp) * maxR);
    }

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    function el(name, attrs) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', name);
      Object.keys(attrs || {}).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
      return node;
    }

    svg.appendChild(el('rect', {
      class: 'plot-bg',
      x: margin.left,
      y: margin.top,
      width: plotW,
      height: plotH,
      rx: 8
    }));

    var ticks = [0, 0.25, 0.5, 0.75, 1];
    ticks.forEach(function (t) {
      var x = xOf(t);
      var y = yOf(t);
      if (t > 0 && t < 1) {
        svg.appendChild(el('line', {
          class: 'grid-line',
          x1: x, y1: margin.top, x2: x, y2: margin.top + plotH
        }));
        svg.appendChild(el('line', {
          class: 'grid-line',
          x1: margin.left, y1: y, x2: margin.left + plotW, y2: y
        }));
      }
      var xLabel = el('text', {
        class: 'tick-label',
        x: x,
        y: margin.top + plotH + 18,
        'text-anchor': 'middle'
      });
      xLabel.textContent = asPoints ? String(Math.round(t * 100)) : String(t).replace('.', ',');
      svg.appendChild(xLabel);

      var yLabel = el('text', {
        class: 'tick-label',
        x: margin.left - 10,
        y: y + 4,
        'text-anchor': 'end'
      });
      yLabel.textContent = asPoints ? String(Math.round(t * 100)) : String(t).replace('.', ',');
      svg.appendChild(yLabel);
    });

    svg.appendChild(el('line', {
      class: 'axis-line',
      x1: margin.left, y1: margin.top + plotH,
      x2: margin.left + plotW, y2: margin.top + plotH
    }));
    svg.appendChild(el('line', {
      class: 'axis-line',
      x1: margin.left, y1: margin.top,
      x2: margin.left, y2: margin.top + plotH
    }));

    svg.appendChild(el('line', {
      class: 'median-line',
      x1: xOf(MED_SCALE), y1: margin.top,
      x2: xOf(MED_SCALE), y2: margin.top + plotH
    }));
    svg.appendChild(el('line', {
      class: 'median-line',
      x1: margin.left, y1: yOf(MED_EFF),
      x2: margin.left + plotW, y2: yOf(MED_EFF)
    }));

    var xTitle = el('text', {
      class: 'axis-title',
      x: margin.left + plotW / 2,
      y: height - 8,
      'text-anchor': 'middle'
    });
    xTitle.textContent = xAxisTitle;
    svg.appendChild(xTitle);

    var yTitle = el('text', {
      class: 'axis-title',
      x: 16,
      y: margin.top + plotH / 2,
      'text-anchor': 'middle',
      transform: 'rotate(-90 16 ' + (margin.top + plotH / 2) + ')'
    });
    yTitle.textContent = yAxisTitle;
    svg.appendChild(yTitle);

    var nodes = items.map(function (d) {
      return {
        data: d,
        x: xOf(d.scale),
        y: yOf(d.efficiency),
        r: rOf(d.vgp)
      };
    }).sort(function (a, b) { return b.r - a.r; });

    var bubblesLayer = el('g', { class: 'bubbles' });
    var labelsLayer = el('g', { class: 'labels' });
    var activeCircle = null;
    var pinned = false;

    function hideTooltip() {
      if (pinned) return;
      if (activeCircle) activeCircle.classList.remove('is-active');
      activeCircle = null;
      tooltip.hidden = true;
    }

    function showTooltip(n, circle, evt) {
      if (activeCircle && activeCircle !== circle) {
        activeCircle.classList.remove('is-active');
      }
      activeCircle = circle;
      circle.classList.add('is-active');
      var d = n.data;
      tooltip.innerHTML =
        '<strong>' + d.name + '</strong>' +
        '<div class="row"><span>Масштаб</span><span>' + (asPoints ? scorePoints(d.scale) : formatNum(d.scale)) + '</span></div>' +
        '<div class="row"><span>' + (opts.intensityLabel || 'Эффективность') + '</span><span>' + (asPoints ? scorePoints(d.efficiency) : formatNum(d.efficiency)) + '</span></div>' +
        '<div class="row"><span>ВГП</span><span>' + formatNum(d.vgp) + ' трлн ₽</span></div>' +
        '<div class="row"><span>Место в рейтинге</span><span>' + d.rank + '</span></div>' +
        '<div class="row"><span>Группа</span><span>' + labels[clusterKey(d)] + '</span></div>' +
        '<div class="muted">Площадь круга ∝ ВГП</div>';
      tooltip.hidden = false;
      positionTooltip(evt);
    }

    function positionTooltip(e) {
      var host = wrap.parentElement;
      var rect = host.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var tipW = tooltip.offsetWidth || 200;
      x = Math.max(tipW / 2 + 8, Math.min(rect.width - tipW / 2 - 8, x));
      y = Math.max(12, y);
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }

    nodes.forEach(function (n) {
      var cKey = clusterKey(n.data);
      var circle = el('circle', {
        class: 'bubble',
        cx: n.x.toFixed(2),
        cy: n.y.toFixed(2),
        r: n.r.toFixed(2),
        fill: CLUSTER_COLORS[cKey]
      });

      circle.addEventListener('mouseenter', function (e) {
        if (pinned) return;
        showTooltip(n, circle, e);
      });
      circle.addEventListener('mousemove', function (e) {
        if (tooltip.hidden) return;
        if (pinned && activeCircle !== circle) return;
        positionTooltip(e);
      });
      circle.addEventListener('mouseleave', function () {
        if (!pinned) hideTooltip();
      });
      circle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (pinned && activeCircle === circle) {
          pinned = false;
          hideTooltip();
          return;
        }
        pinned = true;
        showTooltip(n, circle, e);
      });

      bubblesLayer.appendChild(circle);
    });

    svg.appendChild(bubblesLayer);

    var labelCandidates = nodes
      .filter(function (n) { return n.r >= 10 || n.data.efficiency >= 0.9 || n.data.scale >= 0.9; })
      .slice()
      .sort(function (a, b) {
        return (b.data.integral50 || 0) - (a.data.integral50 || 0);
      })
      .slice(0, 12);

    labelCandidates.forEach(function (n) {
      var name = shortAggloName(n.data.name);
      if (name.length > 14) name = name.slice(0, 13) + '…';
      var lx = n.x + n.r + 6;
      var ly = n.y;
      var anchor = 'start';
      if (lx + name.length * 6.5 > margin.left + plotW - 4) {
        lx = n.x - n.r - 6;
        anchor = 'end';
      }
      var label = el('text', {
        class: 'bubble-label',
        x: lx.toFixed(1),
        y: ly.toFixed(1),
        'text-anchor': anchor
      });
      label.textContent = name;
      labelsLayer.appendChild(label);
    });

    svg.appendChild(labelsLayer);
    wrap.innerHTML = '';
    wrap.appendChild(svg);

    svg.addEventListener('click', function () {
      if (!pinned) return;
      pinned = false;
      hideTooltip();
    });
  }

  function toCsv(items, opts) {
    opts = opts || {};
    var header = opts.compact
      ? ['Место', 'Агломерация', 'Интегральный индекс, баллов']
      : ['Место', 'Агломерация', 'Интегральный индекс', 'Масштаб', 'Интенсивность', 'ВГП, трлн руб.', 'Население, млн'];
    var lines = [header.join(';')];
    items.slice().sort(function (a, b) { return a.rank - b.rank; }).forEach(function (d) {
      var score = opts.scoreAsPoints ? String(scorePoints(d.integral50)) : formatNum(d.integral50);
      var row = [d.rank, d.name, score];
      if (!opts.compact) {
        row.push(formatNum(d.scale), formatNum(d.efficiency), formatNum(d.vgp), formatNum(d.population));
      }
      lines.push(row.join(';'));
    });
    return lines.join('\n');
  }

  global.UrbanicaWidgets = {
    formatNum: formatNum,
    scorePoints: scorePoints,
    prepareData: prepareData,
    sortItems: sortItems,
    bindRatingSort: bindRatingSort,
    bindEfficiencySort: bindEfficiencySort,
    renderBubbleChart: renderBubbleChart,
    clusterKey: clusterKey,
    toCsv: toCsv,
    MED_SCALE: MED_SCALE,
    MED_EFF: MED_EFF,
    CLUSTER_COLORS: CLUSTER_COLORS,
    DEFAULT_CLUSTER_LABELS: DEFAULT_CLUSTER_LABELS
  };
})(window);
