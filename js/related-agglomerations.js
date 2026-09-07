(function () {
  const PAGES = [
    { name: "Московская", href: "moscow.html", vgp: 62.14 },
    { name: "Сургутская", href: "surgut.html", vgp: 5.41 },
    { name: "Санкт-Петербургская", href: "spb.html", vgp: 15.64 },
    { name: "Набережночелнинская", href: "nabchelny.html", vgp: 2.12 },
    { name: "Южно-Сахалинская", href: "yuzhnosakhalinsk.html", vgp: 1.27 },
    { name: "Пермская", href: "perm.html", vgp: 2.15 },
    { name: "Екатеринбургская", href: "ekaterinburg.html", vgp: 4.0 },
    { name: "Нижегородская", href: "nizhny.html", vgp: 3.0 },
    { name: "Мурманская", href: "murmansk.html", vgp: 0.78 },
    { name: "Казанская", href: "kazan.html", vgp: 3.39 },
    { name: "Альметьевская", href: "almetyevsk.html", vgp: 0.73 },
    { name: "Тульско-Новомосковская", href: "tula.html", vgp: 1.42 },
    { name: "Липецкая", href: "lipetsk.html", vgp: 0.94 },
    { name: "Владивостокская", href: "vladivostok.html", vgp: 1.87 },
    { name: "Иркутская", href: "irkutsk.html", vgp: 1.31 },
    { name: "Нижнетагильская", href: "nizhnitagil.html", vgp: 0.84 },
    { name: "Старооскольская", href: "staryoskol.html", vgp: 0.58 },
    { name: "Хабаровская", href: "khabarovsk.html", vgp: 1.01 },
    { name: "Уфимская", href: "ufa.html", vgp: 2.19 },
    { name: "Самарско-Тольяттинская", href: "samara.html", vgp: 3.61 },
    { name: "Краснодарская", href: "krasnodar.html", vgp: 3.41 },
    { name: "Новокузнецкая", href: "novokuznetsk.html", vgp: 1.05 },
    { name: "Ростовская", href: "rostov.html", vgp: 3.31 },
    { name: "Новосибирская", href: "novosibirsk.html", vgp: 3.21 },
    { name: "Челябинская", href: "chelyabinsk.html", vgp: 2.01 },
    { name: "Ижевская", href: "izhevsk.html", vgp: 1.47 },
    { name: "Оренбургская", href: "orenburg.html", vgp: 1.31 },
    { name: "Тюменская", href: "tyumen.html", vgp: 1.97 },
    { name: "Ярославско-Рыбинская", href: "yaroslavl.html", vgp: 1.11 },
    { name: "Орская", href: "orsk.html", vgp: 0.6 },
    { name: "Рязанская", href: "ryazan.html", vgp: 0.87 },
    { name: "Воронежская", href: "voronezh.html", vgp: 1.58 },
    { name: "Омская", href: "omsk.html", vgp: 1.82 },
    { name: "Красноярская", href: "krasnoyarsk.html", vgp: 2.13 },
    { name: "Кировская", href: "kirov.html", vgp: 0.64 },
    { name: "Волгоградская", href: "volgograd.html", vgp: 1.54 },
    { name: "Кемеровская", href: "kemerovo.html", vgp: 1.06 },
    { name: "Калининградская", href: "kaliningrad.html", vgp: 1.09 },
    { name: "Саратовская", href: "saratov.html", vgp: 1.31 },
    { name: "Ульяновско-Димитровградская", href: "ulyanovsk.html", vgp: 0.95 },
    { name: "Барнаульская", href: "barnaul.html", vgp: 0.94 },
    { name: "Астраханская", href: "astrakhan.html", vgp: 1.1 },
    { name: "Ставропольская", href: "stavropol.html", vgp: 1.48 },
    { name: "Пензенская", href: "penza.html", vgp: 0.88 },
    { name: "Томская", href: "tomsk.html", vgp: 0.94 },
    { name: "Чебоксарская", href: "cheboksary.html", vgp: 0.78 },
    { name: "Махачкалинская", href: "makhachkala.html", vgp: 1.0 },
    { name: "Стерлитамакская", href: "sterlitamak.html", vgp: 0.49 },
    { name: "Кавминводская", href: "kavminvody.html", vgp: 0.84 },
    { name: "Златоустско-Миасская", href: "zlatoust.html", vgp: 0.51 },
    { name: "Улан-Удэнская", href: "ulanude.html", vgp: 0.51 },
    { name: "Абаканская", href: "abakan.html", vgp: 0.33 },
  ];

  function currentFile() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    return last.endsWith(".html") ? last : "";
  }

  function shuffle(items) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function fmtVgp(value) {
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }

  function render() {
    const root = document.getElementById("relatedAggs");
    if (!root) return;
    const me = currentFile();
    const picks = shuffle(PAGES.filter((page) => page.href !== me)).slice(0, 3);
    root.innerHTML =
      '<p class="related-kicker">Другие агломерации</p>' +
      '<div class="related-list">' +
      picks
        .map(function (page) {
          return (
            '<a href="' +
            page.href +
            '"><span class="related-name">' +
            page.name +
            " агломерация</span><span class="related-meta">ВГП " +
            fmtVgp(page.vgp) +
            " трлн руб.</span></a>"
          );
        })
        .join("") +
      "</div>";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
