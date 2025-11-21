const openBtn = document.querySelector(".open-pop");
const popUp = document.querySelector(".pop-P");
const closePop = document.querySelector(".close-pop");
const saveBtn = document.querySelector(".saveStaff");
const nom = document.getElementById("inputnom");
const role = document.getElementById("inputrole");
const photo = document.getElementById("inputphoto");
const email = document.getElementById("inputemail");
const telephone = document.getElementById("inputphone");
const xpBtn = document.getElementById("xpBtn");
const divExperience = document.querySelector(".xpdiv");
const staffList = document.querySelector(".les-staff");
const preview = document.getElementById("photo-preview");
const roomButtons = document.querySelectorAll(".place-staff");
const profilePop = document.querySelector(".profile-pop");
const closeProfile = document.getElementById("close-profile");
const assignPop = document.querySelector(".assign-pop");
const assignList = document.querySelector(".assign-list");
const assignRoomName = document.querySelector(".assign-room-name");
const assignEmpty = document.querySelector(".assign-empty");
const closeAssignButtons = document.querySelectorAll(".close-assign");
const defaultAssignEmptyText = assignEmpty ? assignEmpty.textContent : "";
const MAX_ROOM_STAFF = 3;

let allStaffs = [];
let count = 0;
let roomToAssign = null;

init();

function init() {
  setupFormModal();
  setupFormEvents();
  setupRoomButtons();
  setupProfilePopup();
  setupAssignPopup();
  updateRoomColors();
}
function setupFormModal() {
if (openBtn && popUp){
    openBtn.addEventListener('click', ()=> openFormModal());
}
if(closePop){
  closePop.addEventListener('click',  ()=> closeFormModal());
}
if(popUp){
  popUp.addEventListener('click' , (e) => {
    if (e.target === popUp){ 
      closeFormModal();
    }
    });
}
}

function openFormModal() {
  if (!popUp) return;
  popUp.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeFormModal() {
  if (!popUp) return;
  popUp.style.display = "none";
  document.body.style.overflow = "auto";
}

function setupFormEvents() {
  if (xpBtn) {
    xpBtn.addEventListener("click", addExperienceBlock);
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveStaff);
  }
}

function addExperienceBlock() {
  count++;

  if (!divExperience) return;

  const div = document.createElement("div");
  div.className = "exp-form";
  div.innerHTML = `
    <label>Entreprise</label>
    <input id="nom-${count}">
    <label>Role</label>
    <select id="role-${count}">
      <option value="Receptionnistes">Receptionnistes</option>
      <option value="Techniciens IT">Techniciens IT</option>
      <option value="Agents de securite">Agents de securite</option>
      <option value="Manager">Manager</option>
      <option value="Autres roles">Autres roles</option>
      <option value="Nettoyage">Nettoyage</option>
    </select>
    <label>De</label>
    <input type="date" id="date-de-${count}">
    <label>?</label>
    <input type="date" id="date-a-${count}">
    <button type="button" class="remove-exp">X</button>
  `;

  div.querySelector(".remove-exp").onclick = () => div.remove();
  divExperience.appendChild(div);
}

function handleSaveStaff(e) {
  e.preventDefault();

  if (!nom.value.trim() || !role.value || !email.value || !telephone.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const staffMember = {
    id: Date.now(),
    name: nom.value,
    role: role.value,
    photo: photo.value,
    email: email.value,
    phone: telephone.value,
    experiences: collectExperiences(),
    assignedTo: null,
  };

  allStaffs.push(staffMember);
  createStaffCard(staffMember);

  resetForm();
  closeFormModal();
  updateRoomColors();
}

function collectExperiences() {
  if (!divExperience) return [];

  const experiences = [];
  const expBlocks = divExperience.querySelectorAll(".exp-form");

  expBlocks.forEach((block, index) => {
    const ent = block.querySelector(`#nom-${index + 1}`)?.value;
    const r = block.querySelector(`#role-${index + 1}`)?.value;
    const de = block.querySelector(`#date-de-${index + 1}`)?.value;
    const a = block.querySelector(`#date-a-${index + 1}`)?.value;

    if (ent && r && de && a) {
      experiences.push({
        entreprise: ent,
        role: r,
        dateStart: de,
        dateEnd: a,
      });
    }
  });

  return experiences;
}

function setupRoomButtons() {
  roomButtons.forEach((button) => {
    button.addEventListener("click", () => handleRoomButtonClick(button));
  });
}
function setupAssignPopup() {
  closeAssignButtons.forEach((btn) =>
    btn.addEventListener("click", () => closeAssignPopup())
  );

  if (assignPop) {
    assignPop.addEventListener("click", (e) => {
      if (e.target === assignPop) closeAssignPopup();
    });
  }
}
function openAssignPopup(roomBox, eligible, message = "") {
  if (!assignPop || !assignList) return;
  roomToAssign = roomBox;
  if (assignRoomName) {
    const label = roomBox?.querySelector("h3");
    assignRoomName.textContent = label ? label.textContent : "";
  }
  assignList.innerHTML = "";
  const showMessage = eligible.length === 0 || Boolean(message);
  if (showMessage) {
    assignList.style.display = "none";
    if (assignEmpty) {
      assignEmpty.textContent = message || defaultAssignEmptyText;
      assignEmpty.style.display = "block";
    }
  } else {
    assignList.style.display = "flex";
    if (assignEmpty) {
      assignEmpty.textContent = defaultAssignEmptyText;
      assignEmpty.style.display = "none";
    }
    eligible.forEach((staff) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "assign-option";
      btn.innerHTML = `
        <strong>${staff.name}</strong>
        <span>${staff.role}</span>
      `;
      btn.addEventListener("click", () => {
        assignStaffToRoom(staff, roomToAssign);
        closeAssignPopup();
      });
      assignList.appendChild(btn);
    });
  }
  assignPop.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeAssignPopup() {
  if (!assignPop || !assignList) return;
  assignPop.style.display = "none";
  document.body.style.overflow = "auto";
  assignList.innerHTML = "";
  assignList.style.display = "flex";
  if (assignEmpty) {
    assignEmpty.style.display = "none";
    assignEmpty.textContent = defaultAssignEmptyText;
  }
  if (assignRoomName) assignRoomName.textContent = "";
  roomToAssign = null;
}

function handleRoomButtonClick(button) {
  const roomBox = button.closest(".box");
  const roomType = getRoomType(roomBox);
  if (!roomType) return;
  if (isRoomFull(roomBox)) {
    openAssignPopup(
      roomBox,
      [],
      "Cette salle est déjà complète (maximum 3 staff)."
    );
    return;
  }
  const eligible = getEligibleStaff(roomType);
  openAssignPopup(roomBox, eligible);
}

function setupProfilePopup() {
  if (closeProfile) {
    closeProfile.addEventListener("click", () => closeProfilePopup());
  }
}

function createStaffCard(staffMember) {
  const div = document.createElement("div");
  div.className = "staff-card";
  div.dataset.id = staffMember.id;
  div.innerHTML = `
    <img src="${staffMember.photo || "default-avatar.png"}">
    <h3>${staffMember.name}</h3>
    <p>${staffMember.role}</p>
  `;

  div.addEventListener("click", () => openProfile(staffMember));

  staffList.appendChild(div);
}

function resetForm() {
  nom.value = "";
  role.value = "";
  photo.value = "";
  email.value = "";
  telephone.value = "";

  if (divExperience) {
    divExperience.innerHTML = "";
  }

  if (preview) {
    preview.style.display = "none";
    preview.src = "";
  }

  count = 0;
}

function isRoomFull(roomBox) {
  if (!roomBox) return false;
  const slot = roomBox.querySelector(".staff-slot");
  if (!slot) return false;
  return slot.children.length >= MAX_ROOM_STAFF;
}

function getRoomType(roomBox) {
  if (!roomBox) return null;
  if (roomBox.classList.contains("reception")) return "reception";
  if (roomBox.classList.contains("server-room")) return "server";
  if (roomBox.classList.contains("security-room")) return "security";
  if (roomBox.classList.contains("conference-room")) return "conference";
  if (roomBox.classList.contains("personnel-room")) return "personnel";
  if (roomBox.classList.contains("archives-room")) return "archives";
  return null;
}

function isAllowedInRoom(role, roomType) {
  if (role === "Manager") return true;
  if (roomType === "reception") return role === "Receptionnistes";
  if (roomType === "server") return role === "Techniciens IT";
  if (roomType === "security") return role === "Agents de securite";
  if (roomType === "archives") return role !== "Nettoyage";
  if (roomType === "conference" || roomType === "personnel") return true;
  return true;
}

function getEligibleStaff(roomType) {
  return allStaffs.filter(
    (s) => s.assignedTo === null && isAllowedInRoom(s.role, roomType)
  );
}

function assignStaffToRoom(staffMember, roomBox) {
  const roomType = getRoomType(roomBox);
  staffMember.assignedTo = roomType;

  staffList.querySelectorAll(".staff-card").forEach((card) => {
    if (card.dataset.id === String(staffMember.id)) card.remove();
  });

  const slot = roomBox.querySelector(".staff-slot");

  const div = document.createElement("div");
  div.className = "staff-card";
  div.dataset.id = staffMember.id;
  div.innerHTML = `
    <img src="${staffMember.photo || "default-avatar.png"}">
    <h3>${staffMember.name}</h3>
    <p>${staffMember.role}</p>
    <button class="remove-staff">X</button>
  `;

  div.addEventListener("click", () => openProfile(staffMember));

  slot.appendChild(div);

  div.querySelector(".remove-staff").addEventListener("click", () => {
    unassignStaffFromRoom(staffMember, roomBox);
  });

  updateRoomColors();
}

function unassignStaffFromRoom(staffMember, roomBox) {
  staffMember.assignedTo = null;
  const slot = roomBox.querySelector(".staff-slot");
  const card = slot.querySelector(`[data-id="${staffMember.id}"]`);
  if (card) card.remove();

  createStaffCard(staffMember);
  updateRoomColors();
}

function updateRoomColors() {
  const boxes = document.querySelectorAll(".staff-grid .box");

  boxes.forEach((box) => {
    const roomType = getRoomType(box);
    const slot = box.querySelector(".staff-slot");

    if (roomType === "conference" || roomType === "personnel") {
      box.classList.remove("empty");
      return;
    }

    if (slot.children.length === 0) box.classList.add("empty");
    else box.classList.remove("empty");
  });
}

function openProfile(staff) {
  if (!profilePop) return;

  document.getElementById("profile-photo").src =
    staff.photo || "default-avatar.png";
  document.getElementById("profile-name").textContent = staff.name;
  document.getElementById("profile-role").textContent = staff.role;
  document.getElementById("profile-email").textContent = staff.email;
  document.getElementById("profile-phone").textContent = staff.phone;
  document.getElementById("profile-location").textContent = staff.assignedTo
    ? staff.assignedTo
    : "Unassigned";

  const expList = document.getElementById("profile-exp");
  expList.innerHTML = "";

  if (staff.experiences && staff.experiences.length > 0) {
    staff.experiences.forEach((exp) => {
      const li = document.createElement("li");
      li.textContent = `${exp.entreprise} (${exp.dateStart} -- ${exp.dateEnd})`;
      expList.appendChild(li);
    });
  } else {
    expList.innerHTML = "<li>Aucune experience</li>";
  }

  profilePop.style.display = "flex";
}

function closeProfilePopup() {
  if (!profilePop) return;
  profilePop.style.display = "none";
}
