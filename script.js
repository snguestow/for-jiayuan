(function () {
  "use strict";

  const STORAGE_KEY = "next-meal-picker-v1";
  const EDITOR_PREVIEW_KEY = "restaurant-editor-preview-v1";
  applyEditorPreview();
  const state = loadState();
  let posterBlob = null;
  let busy = false;

  const $ = (selector) => document.querySelector(selector);
  const pickerScreen = $("#picker-screen");
  const finalScreen = $("#final-screen");
  const resultScreen = $("#result-screen");
  const card = $("#restaurant-card");
  const image = $("#restaurant-image");

  function applyEditorPreview() {
    try {
      const previewData = JSON.parse(localStorage.getItem(EDITOR_PREVIEW_KEY));
      if (Array.isArray(previewData) && previewData.length) {
        RESTAURANTS.splice(0, RESTAURANTS.length, ...previewData);
      }
      RESTAURANTS.forEach((restaurant) => {
        if (!restaurant.image) restaurant.image = `images/covers/${restaurant.id}-cover.jpg`;
        (restaurant.recommendedDishes || []).forEach((dish, index) => {
          if (!dish.image) dish.image = `images/dishes/${restaurant.id}-dish-${String(index + 1).padStart(2, "0")}.jpg`;
        });
      });
    } catch (_) {
      localStorage.removeItem(EDITOR_PREVIEW_KEY);
    }
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.votes) return { index: 0, votes: {}, finished: false, finalChoice: null };
      const validIds = new Set(RESTAURANTS.map((item) => item.id));
      const votes = Object.fromEntries(Object.entries(saved.votes).filter(([id]) => validIds.has(id)));
      const finished = RESTAURANTS.length > 0 && RESTAURANTS.every((item) => votes[item.id]);
      const finalChoice = validIds.has(saved.finalChoice) ? saved.finalChoice : null;
      return { index: finished ? RESTAURANTS.length : Math.min(saved.index || 0, RESTAURANTS.length - 1), votes, finished, finalChoice };
    } catch (_) {
      return { index: 0, votes: {}, finished: false, finalChoice: null };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function renderRestaurant() {
    if (!RESTAURANTS.length) {
      card.innerHTML = '<div class="restaurant-info"><h2>还没有餐厅</h2><p>请在 restaurants.js 中添加餐厅信息。</p></div>';
      $(".decision-area").hidden = true;
      return;
    }

    const restaurant = RESTAURANTS[state.index];
    renderReviewBar();
    $("#progress-text").textContent = `${state.index + 1} / ${RESTAURANTS.length}`;
    $("#progress-bar").style.width = `${((state.index + 1) / RESTAURANTS.length) * 100}%`;
    $("#restaurant-number").textContent = String(state.index + 1).padStart(2, "0");
    $("#restaurant-category").textContent = restaurant.category;
    $("#restaurant-name").textContent = restaurant.name;
    $("#restaurant-location").textContent = restaurant.location;
    renderDishes((restaurant.recommendedDishes || []).slice(0, 4));
    renderDianpingLink(restaurant.dianpingUrl);
    renderRatings(restaurant.scores || {});
    $("#back-button").disabled = state.index === 0;

    image.classList.remove("has-image");
    image.dataset.emoji = restaurant.emoji || "🍽️";
    image.style.backgroundImage = `linear-gradient(145deg, ${restaurant.colors[0]}, ${restaurant.colors[1]})`;
    image.setAttribute("aria-label", `${restaurant.name}的封面图`);
    if (restaurant.image) {
      const loader = new Image();
      loader.onload = () => {
        if (RESTAURANTS[state.index].id !== restaurant.id) return;
        image.classList.add("has-image");
        image.style.backgroundImage = `url("${restaurant.image.replace(/"/g, "\\\"")}")`;
      };
      loader.src = restaurant.image;
    }
  }

  function renderReviewBar() {
    const list = $("#review-list");
    const selected = RESTAURANTS.filter((restaurant) => state.votes[restaurant.id]);
    $("#review-count").textContent = `${selected.length} 项`;
    list.innerHTML = "";

    if (!selected.length) {
      const empty = document.createElement("span");
      empty.className = "review-empty";
      empty.textContent = "选择后会显示在这里";
      list.appendChild(empty);
      return;
    }

    const choiceMarks = { yes: "✓", maybe: "?", no: "×" };
    selected.forEach((restaurant) => {
      const choice = state.votes[restaurant.id];
      const item = document.createElement("span");
      item.className = `review-item ${choice}`;
      item.title = `${restaurant.name}：${choice === "yes" ? "想去" : choice === "maybe" ? "待定" : "不去"}`;

      const mark = document.createElement("span");
      mark.className = "review-mark";
      mark.textContent = choiceMarks[choice];
      const name = document.createElement("span");
      name.className = "review-name";
      name.textContent = restaurant.name;
      item.append(mark, name);
      list.appendChild(item);
    });

    window.requestAnimationFrame(() => {
      list.scrollLeft = list.scrollWidth;
    });
  }

  function renderDishes(dishes) {
    const grid = $("#dish-grid");
    grid.innerHTML = "";
    if (!dishes.length) {
      const empty = document.createElement("p");
      empty.className = "empty-info";
      empty.textContent = "暂未添加推荐菜";
      grid.appendChild(empty);
      return;
    }

    dishes.forEach((dish, index) => {
      const figure = document.createElement("figure");
      figure.className = "dish-item";
      const photo = document.createElement("div");
      photo.className = "dish-photo";
      photo.dataset.emoji = dish.emoji || "🍽️";
      photo.style.setProperty("--dish-tone", `${28 + index * 12}deg`);

      if (dish.image) {
        const img = document.createElement("img");
        img.src = dish.image;
        img.alt = dish.name || "推荐菜图片";
        img.loading = "lazy";
        img.addEventListener("load", () => photo.classList.add("has-image"));
        img.addEventListener("error", () => img.remove());
        photo.appendChild(img);
      }

      const caption = document.createElement("figcaption");
      caption.textContent = dish.name || `推荐菜 ${index + 1}`;
      figure.append(photo, caption);
      grid.appendChild(figure);
    });
  }

  function renderDianpingLink(url) {
    const link = $("#dianping-link");
    const copy = link.querySelector(".dianping-copy");
    if (url && /^https?:\/\//i.test(url)) {
      link.href = url;
      link.classList.remove("is-disabled");
      link.setAttribute("aria-label", "前往大众点评查看餐厅详情");
      copy.querySelector("strong").textContent = "查看餐厅详情";
      copy.querySelector("small").textContent = "菜单、营业时间与真实评价";
    } else {
      link.removeAttribute("href");
      link.classList.add("is-disabled");
      link.setAttribute("aria-label", "暂未添加大众点评链接");
      copy.querySelector("strong").textContent = "暂未添加链接";
      copy.querySelector("small").textContent = "在 restaurants.js 中填写网址";
    }
  }

  function renderRatings(scores) {
    const ratingItems = [
      ["距离评分", scores.distance],
      ["美味评分", scores.taste],
      ["新奇评分", scores.novelty]
    ];
    const container = $("#standard-ratings");
    container.innerHTML = "";
    ratingItems.forEach(([label, rawScore]) => {
      const score = clampScore(rawScore);
      const row = document.createElement("div");
      row.className = "rating-row";
      const labelElement = document.createElement("span");
      labelElement.textContent = label;
      row.append(labelElement, createStars(score));
      container.appendChild(row);
    });

    const ebao = $("#ebao-rating");
    const ebaoScore = clampScore(scores.ebao);
    ebao.innerHTML = "";
    const ebaoLabel = document.createElement("span");
    ebaoLabel.textContent = "E宝评分";
    ebao.append(ebaoLabel, createStars(ebaoScore, true));
  }

  function clampScore(value) {
    const score = Number(value);
    return Number.isFinite(score) ? Math.max(1, Math.min(5, Math.round(score))) : 1;
  }

  function createStars(score, large = false) {
    const stars = document.createElement("div");
    stars.className = large ? "star-rating large" : "star-rating";
    stars.setAttribute("role", "img");
    stars.setAttribute("aria-label", `${score} 颗星，共 5 颗星`);
    for (let index = 1; index <= 5; index += 1) {
      const star = document.createElement("i");
      star.textContent = "★";
      if (index <= score) star.classList.add("is-filled");
      stars.appendChild(star);
    }
    return stars;
  }

  function choose(choice) {
    if (busy) return;
    busy = true;
    const restaurant = RESTAURANTS[state.index];
    state.votes[restaurant.id] = choice;
    card.classList.add(`leave-${choice}`);
    saveState();

    window.setTimeout(() => {
      card.classList.remove(`leave-${choice}`);
      if (state.index >= RESTAURANTS.length - 1) {
        state.finished = true;
        state.index = RESTAURANTS.length;
        saveState();
        continueAfterVotes();
      } else {
        state.index += 1;
        saveState();
        renderRestaurant();
        card.classList.add("enter");
        window.setTimeout(() => card.classList.remove("enter"), 400);
      }
      busy = false;
    }, 360);
  }

  function continueAfterVotes() {
    if (state.finalChoice) {
      showResults();
      return;
    }

    const liked = RESTAURANTS.filter((restaurant) => state.votes[restaurant.id] === "yes");
    const maybe = RESTAURANTS.filter((restaurant) => state.votes[restaurant.id] === "maybe");

    if (liked.length === 1) {
      state.finalChoice = liked[0].id;
      saveState();
      showResults();
      return;
    }

    const candidates = [...liked, ...maybe];
    if (candidates.length === 1) {
      state.finalChoice = candidates[0].id;
      saveState();
      showResults();
    } else if (candidates.length > 1) {
      showFinalSelection(candidates);
    } else {
      showResults();
    }
  }

  function showFinalSelection(candidates) {
    pickerScreen.hidden = true;
    resultScreen.hidden = true;
    finalScreen.hidden = false;
    const container = $("#final-candidates");
    container.innerHTML = "";

    candidates.forEach((restaurant) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "final-candidate";
      button.setAttribute("aria-label", `选择 ${restaurant.name} 作为最终餐厅`);

      const cover = document.createElement("span");
      cover.className = "candidate-cover";
      cover.dataset.emoji = restaurant.emoji || "🍽️";
      cover.style.backgroundImage = `linear-gradient(145deg, ${restaurant.colors[0]}, ${restaurant.colors[1]})`;
      if (restaurant.image) {
        const img = document.createElement("img");
        img.src = restaurant.image;
        img.alt = "";
        img.addEventListener("load", () => cover.classList.add("has-image"));
        img.addEventListener("error", () => img.remove());
        cover.appendChild(img);
      }

      const copy = document.createElement("span");
      copy.className = "candidate-copy";
      const badgeText = state.votes[restaurant.id] === "yes" ? "最想一起去" : "可以再商量";
      copy.innerHTML = `<small>${badgeText}</small><strong>${escapeHtml(restaurant.name)}</strong><span>${escapeHtml(restaurant.category)} · ${escapeHtml(restaurant.location)}</span>`;
      const check = document.createElement("span");
      check.className = "candidate-check";
      check.textContent = "✓";
      button.append(cover, copy, check);
      button.addEventListener("click", () => confirmFinalChoice(restaurant.id, button));
      container.appendChild(button);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmFinalChoice(id, button) {
    if (busy) return;
    busy = true;
    button.classList.add("is-selected");
    state.finalChoice = id;
    saveState();
    window.setTimeout(() => {
      busy = false;
      showResults();
    }, 360);
  }

  function returnToPicker() {
    state.finished = false;
    state.finalChoice = null;
    state.index = Math.max(0, RESTAURANTS.length - 1);
    saveState();
    finalScreen.hidden = true;
    pickerScreen.hidden = false;
    renderRestaurant();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (busy || state.index === 0) return;
    state.index -= 1;
    state.finished = false;
    saveState();
    renderRestaurant();
    card.classList.add("enter");
    window.setTimeout(() => card.classList.remove("enter"), 400);
  }

  async function showResults() {
    pickerScreen.hidden = true;
    finalScreen.hidden = true;
    resultScreen.hidden = false;
    const finalRestaurant = RESTAURANTS.find((item) => item.id === state.finalChoice);
    $("#result-title").textContent = finalRestaurant ? `就去「${finalRestaurant.name}」` : "选择完成";
    window.scrollTo({ top: 0, behavior: "smooth" });
    const dataUrl = await drawPoster();
    const poster = $("#result-poster");
    poster.src = dataUrl;
    poster.hidden = false;
    $("#poster-loading").hidden = true;
    $("#download-button").href = dataUrl;
    posterBlob = await (await fetch(dataUrl)).blob();
  }

  async function drawPoster() {
    const canvas = $("#poster-canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const grouped = { yes: [], maybe: [], no: [] };
    RESTAURANTS.forEach((restaurant) => grouped[state.votes[restaurant.id] || "maybe"].push(restaurant));
    const finalRestaurant = RESTAURANTS.find((restaurant) => restaurant.id === state.finalChoice);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#f8f2e8");
    bg.addColorStop(1, "#e9e0d2");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(180,134,64,.12)";
    ctx.beginPath(); ctx.arc(970, 90, 300, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(62,118,86,.10)";
    ctx.beginPath(); ctx.arc(50, 1780, 360, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#b48640";
    ctx.font = "800 26px Arial, sans-serif";
    ctx.fillText("WHERE TO EAT", 80, 115);
    ctx.fillStyle = "#1e1e1b";
    ctx.font = '700 84px "Microsoft YaHei", sans-serif';
    ctx.fillText("我的餐厅选择", 80, 215);
    ctx.fillStyle = "#777169";
    ctx.font = '32px "Microsoft YaHei", sans-serif';
    ctx.fillText(formatDate(new Date()) + " · 已完成全部选择", 82, 275);

    roundRect(ctx, 80, 320, 920, 145, 30, finalRestaurant ? "#263c31" : "rgba(30,30,27,.08)");
    ctx.fillStyle = finalRestaurant ? "#bfcfbf" : "#777169";
    ctx.font = '700 24px "Microsoft YaHei", sans-serif';
    ctx.fillText("最终选择", 118, 370);
    ctx.fillStyle = finalRestaurant ? "#ffffff" : "#4f4c47";
    ctx.font = '700 48px "Microsoft YaHei", sans-serif';
    ctx.fillText(finalRestaurant ? finalRestaurant.name : "这次还没有最终选择", 118, 430);
    if (finalRestaurant) {
      ctx.fillStyle = "#bfcfbf";
      ctx.font = '24px "Microsoft YaHei", sans-serif';
      ctx.textAlign = "right";
      ctx.fillText(finalRestaurant.category, 955, 406);
      ctx.textAlign = "left";
    }

    const summary = [
      { label: "想去", icon: "✓", color: "#3e7656", count: grouped.yes.length },
      { label: "待定", icon: "?", color: "#b48640", count: grouped.maybe.length },
      { label: "不去", icon: "×", color: "#a44d48", count: grouped.no.length }
    ];
    summary.forEach((item, index) => {
      const x = 80 + index * 320;
      roundRect(ctx, x, 500, 280, 160, 28, "rgba(255,253,248,.82)");
      ctx.fillStyle = item.color;
      ctx.font = "700 42px Arial, sans-serif";
      ctx.fillText(item.icon, x + 28, 557);
      ctx.fillStyle = "#1e1e1b";
      ctx.font = "700 54px Arial, sans-serif";
      ctx.fillText(String(item.count), x + 28, 625);
      ctx.fillStyle = "#777169";
      ctx.font = '26px "Microsoft YaHei", sans-serif';
      ctx.fillText(item.label, x + 95, 621);
    });

    const sections = [
      { key: "yes", title: "最想一起去", mark: "✓", color: "#3e7656" },
      { key: "maybe", title: "可以再商量", mark: "?", color: "#b48640" },
      { key: "no", title: "这次先不了", mark: "×", color: "#a44d48" }
    ];
    let y = 735;
    sections.forEach((section) => {
      const restaurants = grouped[section.key];
      ctx.fillStyle = section.color;
      ctx.font = "700 30px Arial, sans-serif";
      ctx.fillText(section.mark, 82, y + 3);
      ctx.fillStyle = "#1e1e1b";
      ctx.font = '700 34px "Microsoft YaHei", sans-serif';
      ctx.fillText(section.title, 128, y);
      y += 45;

      if (!restaurants.length) {
        ctx.fillStyle = "#8c867e";
        ctx.font = '28px "Microsoft YaHei", sans-serif';
        ctx.fillText("—", 128, y + 25);
        y += 75;
      } else {
        restaurants.slice(0, 5).forEach((restaurant, index) => {
          if (y > 1680) return;
          roundRect(ctx, 80, y, 920, 96, 22, "rgba(255,253,248,.72)");
          ctx.fillStyle = section.color;
          ctx.globalAlpha = .12;
          ctx.beginPath(); ctx.arc(130, y + 48, 29, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#1e1e1b";
          ctx.font = '700 30px "Microsoft YaHei", sans-serif';
          ctx.fillText(restaurant.name, 178, y + 40);
          ctx.fillStyle = "#777169";
          ctx.font = '23px "Microsoft YaHei", sans-serif';
          ctx.fillText(`${restaurant.category} · ${restaurant.location}`, 178, y + 72);
          ctx.fillStyle = "#8c867e";
          ctx.font = "24px Arial, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(String(index + 1).padStart(2, "0"), 952, y + 57);
          ctx.textAlign = "left";
          y += 108;
        });
        if (restaurants.length > 5 && y <= 1730) {
          ctx.fillStyle = "#777169";
          ctx.font = '24px "Microsoft YaHei", sans-serif';
          ctx.fillText(`另有 ${restaurants.length - 5} 家，未在图片中展开`, 128, y + 24);
          y += 55;
        }
      }
      y += 38;
    });

    ctx.strokeStyle = "rgba(30,30,27,.14)";
    ctx.beginPath(); ctx.moveTo(80, 1780); ctx.lineTo(1000, 1780); ctx.stroke();
    ctx.fillStyle = "#1e1e1b";
    ctx.font = '700 30px "Microsoft YaHei", sans-serif';
    ctx.fillText("下一餐", 80, 1845);
    ctx.fillStyle = "#777169";
    ctx.font = '24px "Microsoft YaHei", sans-serif';
    ctx.fillText("这次吃什么，我们一起决定。", 218, 1845);

    return canvas.toDataURL("image/png", 1);
  }

  async function sharePoster() {
    const tip = $("#share-tip");
    if (!posterBlob) return;
    const file = new File([posterBlob], "我的餐厅选择.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ title: "我的餐厅选择", text: "这是我的选择！", files: [file] });
        tip.textContent = "结果图已调出分享面板。";
      } catch (error) {
        if (error.name !== "AbortError") tip.textContent = "分享没有成功，请长按上方图片保存后发送。";
      }
    } else {
      tip.textContent = "当前浏览器不支持直接分享，请长按上方图片保存后发送。";
    }
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    state.index = 0;
    state.votes = {};
    state.finished = false;
    state.finalChoice = null;
    posterBlob = null;
    resultScreen.hidden = true;
    pickerScreen.hidden = false;
    $("#result-poster").removeAttribute("src");
    $("#poster-loading").hidden = false;
    renderRestaurant();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function roundRect(ctx, x, y, width, height, radius, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function formatDate(date) {
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  }

  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => choose(button.dataset.choice));
  });
  $("#back-button").addEventListener("click", goBack);
  $("#return-to-picker").addEventListener("click", returnToPicker);
  $("#share-button").addEventListener("click", sharePoster);
  $("#restart-button").addEventListener("click", restart);

  if (state.finished) continueAfterVotes();
  else renderRestaurant();
})();
