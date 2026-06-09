const typeLabels = {
  walk: "走讀",
  craft: "工藝",
  food: "食農",
};

const regionLabels = {
  east: "東部",
  south: "南部",
  mountain: "山線",
};

const artColors = ["#dfece4", "#f1e0d6", "#dfe8f1", "#f3ecd5", "#e4e7d8"];

let routes = [
  { id: 1, title: "沿海記憶走讀", host: "Ari / 部落青年", region: "east", type: "walk", price: 980, seats: 8, booked: 5, color: "#dfe8f1" },
  { id: 2, title: "月桃編織半日課", host: "Nacu / 工藝主理人", region: "south", type: "craft", price: 1280, seats: 10, booked: 6, color: "#e4e7d8" },
  { id: 3, title: "山線採集與風味餐", host: "Lawa / 食農團隊", region: "mountain", type: "food", price: 1680, seats: 12, booked: 7, color: "#f3ecd5" },
  { id: 4, title: "老路徑故事地圖", host: "Ipay / 文化導覽", region: "east", type: "walk", price: 880, seats: 9, booked: 4, color: "#dfece4" },
];

let bookings = [];

const routeList = document.querySelector("#routeList");
const search = document.querySelector("#search");
const regionFilter = document.querySelector("#regionFilter");
const typeFilter = document.querySelector("#typeFilter");
const routeCount = document.querySelector("#routeCount");
const bookingList = document.querySelector("#bookingList");
const revenue = document.querySelector("#revenue");
const hostForm = document.querySelector("#hostForm");
const confirm = document.querySelector("#confirm");

function money(value) {
  return `NT$${Number(value).toLocaleString("zh-TW")}`;
}

function filteredRoutes() {
  const query = search.value.trim().toLowerCase();
  const region = regionFilter.value;
  const type = typeFilter.value;
  return routes.filter((route) => {
    const hay = `${route.title} ${route.host} ${regionLabels[route.region]} ${typeLabels[route.type]}`.toLowerCase();
    return (!query || hay.includes(query))
      && (region === "all" || route.region === region)
      && (type === "all" || route.type === type);
  });
}

function renderRoutes() {
  const list = filteredRoutes();
  routeCount.textContent = `${list.length} 條`;
  revenue.textContent = money(routes.reduce((sum, route) => sum + route.price * route.booked, 0));
  routeList.innerHTML = list.map((route) => `
    <article class="route-card">
      <div class="route-art" style="background: ${route.color}"></div>
      <div class="route-top">
        <h3>${route.title}</h3>
        <span class="badge">${typeLabels[route.type]}</span>
      </div>
      <p>${route.host} / ${regionLabels[route.region]} / 已預約 ${route.booked}/${route.seats} 位</p>
      <div class="route-bottom">
        <span class="price">${money(route.price)}</span>
        <button type="button" data-id="${route.id}">加入預約</button>
      </div>
    </article>
  `).join("");

  routeList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => addBooking(Number(button.dataset.id)));
  });
}

function renderBookings() {
  if (!bookings.length) {
    bookingList.className = "empty";
    bookingList.textContent = "尚未選擇路線。";
    return;
  }

  bookingList.className = "booking-items";
  bookingList.innerHTML = bookings.map((route) => `
    <div class="booking-item">
      <span>${route.title}</span>
      <strong>${money(route.price)}</strong>
    </div>
  `).join("");
}

function addBooking(id) {
  const route = routes.find((item) => item.id === id);
  if (route && !bookings.some((item) => item.id === id)) bookings.push(route);
  renderBookings();
}

hostForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(hostForm);
  routes.unshift({
    id: Date.now(),
    title: data.get("title"),
    host: "新的主理人",
    region: "east",
    type: data.get("type"),
    price: Number(data.get("price")),
    seats: 8,
    booked: 0,
    color: artColors[routes.length % artColors.length],
  });
  hostForm.reset();
  renderRoutes();
});

confirm.addEventListener("click", () => {
  if (!bookings.length) return;
  const total = bookings.reduce((sum, route) => sum + route.price, 0);
  alert(`預約草稿已建立：${bookings.length} 條路線，總額 ${money(total)}。下一步可加入日期、集合點與主理人確認流程。`);
});

[search, regionFilter, typeFilter].forEach((el) => el.addEventListener("input", renderRoutes));

renderRoutes();
renderBookings();
