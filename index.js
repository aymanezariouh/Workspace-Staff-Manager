const btnOpenForm = document.querySelector(".open-pop");
const formPopup = document.querySelector(".pop-P");
const btnCloseForm = document.querySelector(".close-pop");
const btnSave = document.querySelector(".saveStaff");

const fieldName = document.getElementById("inputnom");
const fieldRole = document.getElementById("inputrole");
const fieldPhoto = document.getElementById("inputphoto");
const fieldEmail = document.getElementById("inputemail");
const fieldPhone = document.getElementById("inputphone");

const btnAddXp = document.getElementById("xpBtn");
const xpContainer = document.querySelector(".xpdiv");

const staffContainer = document.querySelector(".les-staff");
const photoPreview = document.getElementById("photo-preview");

const roomButtons = document.querySelectorAll(".place-staff");

const profilePopup = document.querySelector(".profile-pop");
const btnCloseProfile = document.getElementById("close-profile");

const assignPopup = document.querySelector(".assign-pop");
const assignList = document.querySelector(".assign-list");
const assignRoomTitle = document.querySelector(".assign-room-name");
const assignEmptyText = document.querySelector(".assign-empty");

const btnCloseAssignList = document.querySelectorAll(".close-assign");
const defaultAssignMessage = assignEmptyText ? assignEmptyText.textContent : "";

const MAX_IN_ROOM = 3;

let staffData = [];
let xpIndex = 0;
let currentRoom = null;

init();

function init() {
  setupFormPopup();
  setupFormEvents();
  setupRoomSelection();
  setupProfilePopup();
  setupAssignPopup();
  refreshRoomState();
}

function setupFormPopup() {
  if (btnOpenForm && formPopup) {
    btnOpenForm.addEventListener("click", openForm);
  }
  if (btnCloseForm) {
    btnCloseForm.addEventListener("click", closeForm);
  }
  if (formPopup) {
    formPopup.addEventListener("click", (e) => {
      if (e.target === formPopup) closeForm();
    });
  }
}

function openForm() {
  formPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeForm() {
  formPopup.style.display = "none";
  document.body.style.overflow = "auto";
}

function setupFormEvents() {
  if (btnAddXp) btnAddXp.addEventListener("click", addExperienceBlock);
  if (btnSave) btnSave.addEventListener("click", saveStaff);
}

function addExperienceBlock() {
  xpIndex++;

  const block = document.createElement("div");
  block.className = "exp-form";

  block.innerHTML = `
    <label>Entreprise</label>
    <input id="nom-${xpIndex}">
    <label>Role</label>
    <select id="role-${xpIndex}">
      <option value="Receptionnistes">Receptionnistes</option>
      <option value="Techniciens IT">Techniciens IT</option>
      <option value="Agents de securite">Agents de securite</option>
      <option value="Manager">Manager</option>
      <option value="Autres roles">Autres roles</option>
      <option value="Nettoyage">Nettoyage</option>
    </select>
    <label>De</label>
    <input type="date" id="date-de-${xpIndex}">
    <label>?</label>
    <input type="date" id="date-a-${xpIndex}">
    <button type="button" class="remove-exp">X</button>
  `;

  block.querySelector(".remove-exp").onclick = () => block.remove();
  xpContainer.appendChild(block);
}

function saveStaff(e) {
  e.preventDefault();

  if (!fieldName.value.trim() || !fieldRole.value || !fieldEmail.value || !fieldPhone.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const staff = {
    id: Date.now(),
    name: fieldName.value,
    role: fieldRole.value,
    photo: fieldPhoto.value,
    email: fieldEmail.value,
    phone: fieldPhone.value,
    experiences: collectExperiences(),
    assignedTo: null
  };

  staffData.push(staff);
  renderStaffCard(staff);

  resetForm();
  closeForm();
  refreshRoomState();
}

function collectExperiences() {
  const list = [];
  const blocks = xpContainer.querySelectorAll(".exp-form");

  blocks.forEach((block, i) => {
    const ent = block.querySelector(`#nom-${i + 1}`)?.value;
    const r = block.querySelector(`#role-${i + 1}`)?.value;
    const d1 = block.querySelector(`#date-de-${i + 1}`)?.value;
    const d2 = block.querySelector(`#date-a-${i + 1}`)?.value;

    if (ent && r && d1 && d2) {
      list.push({
        entreprise: ent,
        role: r,
        dateStart: d1,
        dateEnd: d2
      });
    }
  });

  return list;
}

function setupRoomSelection() {
  roomButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectRoom(btn));
  });
}

function setupAssignPopup() {
  btnCloseAssignList.forEach((btn) => btn.addEventListener("click", closeAssignPopup));

  if (assignPopup) {
    assignPopup.addEventListener("click", (e) => {
      if (e.target === assignPopup) closeAssignPopup();
    });
  }
}

function openAssignPopup(room, eligible, msg = "") {
  currentRoom = room;

  const title = room.querySelector("h3");
  assignRoomTitle.textContent = title ? title.textContent : "";

  assignList.innerHTML = "";

  const showMsg = eligible.length === 0 || msg !== "";
  if (showMsg) {
    assignList.style.display = "none";
    assignEmptyText.textContent = msg || defaultAssignMessage;
    assignEmptyText.style.display = "block";
  } else {
    assignList.style.display = "flex";
    assignEmptyText.style.display = "none";

    eligible.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "assign-option";
      btn.innerHTML = `<strong>${s.name}</strong><span>${s.role}</span>`;
      btn.addEventListener("click", () => {
        assignStaff(s, currentRoom);
        closeAssignPopup();
      });
      assignList.appendChild(btn);
    });
  }

  assignPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeAssignPopup() {
  assignPopup.style.display = "none";
  document.body.style.overflow = "auto";
  assignList.innerHTML = "";
  assignList.style.display = "flex";
  assignEmptyText.style.display = "none";
  assignEmptyText.textContent = defaultAssignMessage;
  assignRoomTitle.textContent = "";
  currentRoom = null;
}

function selectRoom(btn) {
  const room = btn.closest(".box");
  const type = roomType(room);
  if (!type) return;

  if (isRoomFull(room)) {
    openAssignPopup(room, [], "Cette salle est déjà complète (maximum 3 staff).");
    return;
  }

  const eligible = getEligibleStaff(type);
  openAssignPopup(room, eligible);
}

function setupProfilePopup() {
  if (btnCloseProfile) {
    btnCloseProfile.addEventListener("click", closeProfile);
  }
}

function renderStaffCard(staff) {
  const div = document.createElement("div");
  div.className = "staff-card";
  div.dataset.id = staff.id;

  div.innerHTML = `
    <img src="${staff.photo || "default-avatar.png"}">
    <h3>${staff.name}</h3>
    <p>${staff.role}</p>
  `;

  div.addEventListener("click", () => openProfile(staff));
  staffContainer.appendChild(div);
}

function resetForm() {
  fieldName.value = "";
  fieldRole.value = "";
  fieldPhoto.value = "";
  fieldEmail.value = "";
  fieldPhone.value = "";

  xpContainer.innerHTML = "";
  xpIndex = 0;

  photoPreview.style.display = "none";
  photoPreview.src = "";
}

function isRoomFull(room) {
  const slot = room.querySelector(".staff-slot");
  return slot.children.length >= MAX_IN_ROOM;
}

function roomType(room) {
  if (room.classList.contains("reception")) return "reception";
  if (room.classList.contains("server-room")) return "server";
  if (room.classList.contains("security-room")) return "security";
  if (room.classList.contains("conference-room")) return "conference";
  if (room.classList.contains("personnel-room")) return "personnel";
  if (room.classList.contains("archives-room")) return "archives";
  return null;
}

function canEnterRoom(role, type) {
  if (role === "Manager") return true;
  if (type === "reception") return role === "Receptionnistes";
  if (type === "server") return role === "Techniciens IT";
  if (type === "security") return role === "Agents de securite";
  if (type === "archives") return role !== "Nettoyage";
  return true;
}

function getEligibleStaff(type) {
  return staffData.filter((s) => s.assignedTo === null && canEnterRoom(s.role, type));
}

function assignStaff(staff, room) {
  const type = roomType(room);
  staff.assignedTo = type;

  staffContainer.querySelectorAll(".staff-card").forEach((c) => {
    if (c.dataset.id === String(staff.id)) c.remove();
  });

  const slot = room.querySelector(".staff-slot");

  const card = document.createElement("div");
  card.className = "staff-card";
  card.dataset.id = staff.id;

  card.innerHTML = `
    <img src="${staff.photo || "default-avatar.png"}">
    <h3>${staff.name}</h3>
    <p>${staff.role}</p>
    <button class="remove-staff">X</button>
  `;

  card.addEventListener("click", () => openProfile(staff));
  slot.appendChild(card);

  card.querySelector(".remove-staff").addEventListener("click", () => {
    removeFromRoom(staff, room);
  });

  refreshRoomState();
}

function removeFromRoom(staff, room) {
  staff.assignedTo = null;
  const slot = room.querySelector(".staff-slot");
  const card = slot.querySelector(`[data-id="${staff.id}"]`);

  if (card) card.remove();

  renderStaffCard(staff);
  refreshRoomState();
}

function refreshRoomState() {
  const rooms = document.querySelectorAll(".staff-grid .box");

  rooms.forEach((room) => {
    const type = roomType(room);
    const slot = room.querySelector(".staff-slot");

    if (type === "conference" || type === "personnel") {
      room.classList.remove("empty");
      return;
    }

    if (slot.children.length === 0) room.classList.add("empty");
    else room.classList.remove("empty");
  });
}

function openProfile(staff) {
  document.getElementById("profile-photo").src = staff.photo || "default-avatar.png";
  document.getElementById("profile-name").textContent = staff.name;
  document.getElementById("profile-role").textContent = staff.role;
  document.getElementById("profile-email").textContent = staff.email;
  document.getElementById("profile-phone").textContent = staff.phone;
  document.getElementById("profile-location").textContent = staff.assignedTo || "Unassigned";

  const xpList = document.getElementById("profile-exp");
  xpList.innerHTML = "";

  if (staff.experiences.length > 0) {
    staff.experiences.forEach((xp) => {
      const li = document.createElement("li");
      li.textContent = `${xp.entreprise} (${xp.dateStart} -- ${xp.dateEnd})`;
      xpList.appendChild(li);
    });
  } else {
    xpList.innerHTML = "<li>Aucune experience</li>";
  }

  profilePopup.style.display = "flex";
}

function closeProfile() {
  profilePopup.style.display = "none";
}
