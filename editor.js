(function () {
  "use strict";

  const DRAFT_KEY = "restaurant-editor-draft-v1";
  const PREVIEW_KEY = "restaurant-editor-preview-v1";
  let data = loadDraft();
  let saveTimer = null;

  const rows = document.querySelector("#restaurant-rows");
  const status = document.querySelector("#save-status");

  function loadDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
      return Array.isArray(draft) && draft.length ? draft : clone(RESTAURANTS);
    } catch (_) {
      return clone(RESTAURANTS);
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeRestaurant(restaurant, index) {
    const restaurantId = restaurant.id || `r${String(index + 1).padStart(2, "0")}`;
    const dishes = Array.from({ length: 4 }, (_, dishIndex) => {
      const dish = (restaurant.recommendedDishes || [])[dishIndex] || {};
      return {
        name: dish.name || "",
        image: dish.image || `images/dishes/${restaurantId}-dish-${String(dishIndex + 1).padStart(2, "0")}.jpg`,
        emoji: dish.emoji || "🍽️"
      };
    });
    return {
      id: restaurantId,
      name: restaurant.name || "未命名餐厅",
      category: restaurant.category || "",
      location: restaurant.location || "",
      price: restaurant.price || "",
      time: restaurant.time || "",
      description: restaurant.description || "",
      tags: Array.isArray(restaurant.tags) ? restaurant.tags : [],
      recommendedDishes: dishes,
      dianpingUrl: restaurant.dianpingUrl || "",
      scores: {
        distance: clampRating(restaurant.scores?.distance),
        taste: clampRating(restaurant.scores?.taste),
        novelty: clampRating(restaurant.scores?.novelty),
        ebao: clampRating(restaurant.scores?.ebao)
      },
      image: restaurant.image || `images/covers/${restaurantId}-cover.jpg`,
      emoji: restaurant.emoji || "🍽️",
      colors: [restaurant.colors?.[0] || "#566246", restaurant.colors?.[1] || "#b7a071"]
    };
  }

  function clampRating(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(1, Math.min(5, Math.round(number))) : 3;
  }

  function render() {
    rows.innerHTML = "";
    data = data.map(normalizeRestaurant);
    data.forEach((restaurant, index) => rows.appendChild(createRow(restaurant, index)));
  }

  function createRow(restaurant, index) {
    const row = document.createElement("tr");
    row.appendChild(cell(`<span class="row-index">${String(index + 1).padStart(2, "0")}</span>`, "sticky-column"));
    row.appendChild(inputCell(restaurant.name, (value) => restaurant.name = value, "sticky-name", "name-input", "餐厅名称"));
    row.appendChild(inputCell(restaurant.category, (value) => restaurant.category = value, "", "", "餐厅类型"));
    row.appendChild(inputCell(restaurant.location, (value) => restaurant.location = value, "", "", "位置"));
    row.appendChild(inputCell(restaurant.image, (value) => restaurant.image = value, "", "url-input", "图片路径或网址"));
    row.appendChild(inputCell(restaurant.emoji, (value) => restaurant.emoji = value, "", "short-input", "emoji"));
    row.appendChild(colorCell(restaurant.colors[0], (value) => restaurant.colors[0] = value));
    row.appendChild(colorCell(restaurant.colors[1], (value) => restaurant.colors[1] = value));
    row.appendChild(inputCell(restaurant.dianpingUrl, (value) => restaurant.dianpingUrl = value, "", "url-input", "https://..."));
    row.appendChild(ratingCell(restaurant.scores.distance, (value) => restaurant.scores.distance = value));
    row.appendChild(ratingCell(restaurant.scores.taste, (value) => restaurant.scores.taste = value));
    row.appendChild(ratingCell(restaurant.scores.novelty, (value) => restaurant.scores.novelty = value));
    row.appendChild(ratingCell(restaurant.scores.ebao, (value) => restaurant.scores.ebao = value, "ebao-cell"));
    restaurant.recommendedDishes.forEach((dish) => row.appendChild(dishCell(dish)));
    row.appendChild(actionCell(index));
    return row;
  }

  function cell(html, className = "") {
    const td = document.createElement("td");
    td.className = className;
    td.innerHTML = html;
    return td;
  }

  function inputCell(value, onChange, cellClass = "", inputClass = "", placeholder = "") {
    const td = document.createElement("td");
    td.className = cellClass;
    const input = document.createElement("input");
    input.className = `cell-input ${inputClass}`.trim();
    input.value = value || "";
    input.placeholder = placeholder;
    input.addEventListener("input", () => { onChange(input.value); scheduleSave(); });
    td.appendChild(input);
    return td;
  }

  function colorCell(value, onChange) {
    const td = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "color-wrap";
    const picker = document.createElement("input");
    picker.type = "color";
    picker.className = "color-input";
    picker.value = /^#[0-9a-f]{6}$/i.test(value) ? value : "#777777";
    const text = document.createElement("input");
    text.className = "cell-input color-text";
    text.value = value;
    const update = (next) => {
      text.value = next;
      if (/^#[0-9a-f]{6}$/i.test(next)) picker.value = next;
      onChange(next);
      scheduleSave();
    };
    picker.addEventListener("input", () => update(picker.value));
    text.addEventListener("input", () => update(text.value));
    wrap.append(picker, text);
    td.appendChild(wrap);
    return td;
  }

  function ratingCell(value, onChange, className = "") {
    const td = document.createElement("td");
    td.className = className;
    const select = document.querySelector("#rating-template").content.firstElementChild.cloneNode(true);
    select.value = clampRating(value);
    select.addEventListener("change", () => { onChange(Number(select.value)); scheduleSave(); });
    td.appendChild(select);
    return td;
  }

  function dishCell(dish) {
    const td = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "dish-cell";
    const name = createInput(dish.name, "菜名", "", (value) => dish.name = value);
    const emoji = createInput(dish.emoji, "emoji", "dish-emoji", (value) => dish.emoji = value);
    const image = createInput(dish.image, "图片路径或网址", "dish-image", (value) => dish.image = value);
    wrap.append(name, emoji, image);
    td.appendChild(wrap);
    return td;
  }

  function createInput(value, placeholder, className, onChange) {
    const input = document.createElement("input");
    input.className = `cell-input ${className}`.trim();
    input.value = value || "";
    input.placeholder = placeholder;
    input.addEventListener("input", () => { onChange(input.value); scheduleSave(); });
    return input;
  }

  function actionCell(index) {
    const td = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "row-actions";
    const up = actionButton("↑", "上移", index === 0, () => moveRow(index, -1));
    const down = actionButton("↓", "下移", index === data.length - 1, () => moveRow(index, 1));
    const remove = actionButton("删除", "删除餐厅", false, () => removeRow(index), "delete");
    wrap.append(up, down, remove);
    td.appendChild(wrap);
    return td;
  }

  function actionButton(text, label, disabled, handler, extraClass = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `row-action ${extraClass}`.trim();
    button.textContent = text;
    button.title = label;
    button.disabled = disabled;
    button.addEventListener("click", handler);
    return button;
  }

  function moveRow(index, delta) {
    const next = index + delta;
    [data[index], data[next]] = [data[next], data[index]];
    saveDraft();
    render();
  }

  function removeRow(index) {
    if (!window.confirm(`确认删除「${data[index].name}」吗？`)) return;
    data.splice(index, 1);
    saveDraft();
    render();
  }

  function addRow() {
    data.push(normalizeRestaurant({ id: nextId(), name: "新餐厅" }, data.length));
    saveDraft();
    render();
    rows.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function nextId() {
    const used = new Set(data.map((item) => item.id));
    let number = data.length + 1;
    while (used.has(`r${String(number).padStart(2, "0")}`)) number += 1;
    return `r${String(number).padStart(2, "0")}`;
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    setStatus("正在保存草稿…");
    saveTimer = window.setTimeout(saveDraft, 300);
  }

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setStatus("草稿已自动保存", "success");
  }

  function applyPreview() {
    saveDraft();
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(data));
    setStatus("已应用；刷新预览页面即可查看", "success");
  }

  function generateSource() {
    const cleanData = data.map(normalizeRestaurant);
    return `/* 由餐厅信息表生成。可继续在 editor.html 中编辑。 */\nconst RESTAURANTS = ${JSON.stringify(cleanData, null, 2)};\n`;
  }

  async function writeFile() {
    if (!("showOpenFilePicker" in window)) {
      setStatus("当前浏览器不支持直接写回，请使用“下载 JS 文件”", "error");
      return;
    }
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: "JavaScript 文件", accept: { "text/javascript": [".js"] } }],
        multiple: false
      });
      if (handle.name !== "restaurants.js" && !window.confirm(`选择的是 ${handle.name}，仍要覆盖吗？`)) return;
      const writable = await handle.createWritable();
      await writable.write(generateSource());
      await writable.close();
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(PREVIEW_KEY);
      setStatus("已成功写回 restaurants.js", "success");
    } catch (error) {
      if (error.name !== "AbortError") setStatus("写入失败，请改用下载方式", "error");
    }
  }

  function downloadFile() {
    const blob = new Blob([generateSource()], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "restaurants.js";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("已下载新的 restaurants.js", "success");
  }

  function clearDraft() {
    if (!window.confirm("确认放弃表格中的草稿，恢复 restaurants.js 当前内容吗？")) return;
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(PREVIEW_KEY);
    data = clone(RESTAURANTS);
    render();
    setStatus("已恢复 JS 中的数据", "success");
  }

  function setStatus(message, className = "") {
    status.textContent = message;
    status.className = `save-status ${className}`.trim();
  }

  document.querySelector("#add-row").addEventListener("click", addRow);
  document.querySelector("#apply-preview").addEventListener("click", applyPreview);
  document.querySelector("#write-file").addEventListener("click", writeFile);
  document.querySelector("#download-file").addEventListener("click", downloadFile);
  document.querySelector("#clear-draft").addEventListener("click", clearDraft);

  render();
})();
