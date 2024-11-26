const cargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "В пути",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "Ожидает отправки",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
];

const table = document.getElementById("cargoTable");
const filterStatus = document.getElementById("filterStatus");
const cargoForm = document.getElementById("cargoForm");
const alertsContainer = document.getElementById("alertsContainer");

function renderTable() {
  const filter = filterStatus.value;
  table.innerHTML = "";
  cargoList
    .filter(cargo => !filter || cargo.status === filter)
    .forEach((cargo, index) => {
      const row = document.createElement("tr");
      row.classList.add(
        cargo.status === "Ожидает отправки" ? "status-pending" :
        cargo.status === "В пути" ? "status-in-transit" : "status-delivered"
      );
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${cargo.name}</td>
        <td>
          <select class="form-select" onchange="updateStatus('${cargo.id}', this.value)">
            <option value="Ожидает отправки" ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
            <option value="В пути" ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
            <option value="Доставлен" ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
          </select>
        </td>
        <td>${cargo.origin}</td>
        <td>${cargo.destination}</td>
        <td>${cargo.departureDate}</td>
      `;
      table.appendChild(row);
    });
}

function updateStatus(id, newStatus) {
  const cargo = cargoList.find(c => c.id === id);
  const currentDate = new Date().toISOString().split("T")[0];
  if (newStatus === "Доставлен" && cargo.departureDate > currentDate) {
    showAlert("Ошибка: Невозможно установить статус 'Доставлен', если дата отправления в будущем.", "danger");
    renderTable();
    return;
  }
  cargo.status = newStatus;
  showAlert(`Статус груза ${cargo.name} обновлен на "${newStatus}".`, "success");
  renderTable();
}

function showAlert(message, type) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
  `;
  alertsContainer.appendChild(alert);
  setTimeout(() => {
    alert.classList.remove("show");
    alert.addEventListener("transitionend", () => alert.remove());
  }, 5000);
}

cargoForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("cargoName").value;
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const departureDate = document.getElementById("departureDate").value;

  if (!name || !origin || !destination || !departureDate) {
    showAlert("Пожалуйста, заполните все поля.", "warning");
    return;
  }

  const newCargo = {
    id: `CARGO${String(cargoList.length + 1).padStart(3, "0")}`,
    name,
    status: "Ожидает отправки",
    origin,
    destination,
    departureDate,
  };

  cargoList.push(newCargo);
  cargoForm.reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById("addCargoModal"));
  modal.hide();
  showAlert("Новый груз успешно добавлен!", "success");
  renderTable();
});

filterStatus.addEventListener("change", renderTable);

renderTable();