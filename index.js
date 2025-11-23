let btnOpenForm = document.querySelector(".open-pop");
let formPopup = document.querySelector(".pop-P");
let btnCloseForm = document.querySelector(".close-pop");
let btnSave = document.querySelector(".saveStaff");
let fieldName = document.getElementById("inputnom");
let fieldRole = document.getElementById("inputrole");
let fieldPhoto = document.getElementById("inputphoto");
let fieldEmail = document.getElementById("inputemail");
let fieldPhone = document.getElementById("inputphone");
let btnAddXp = document.getElementById("xpBtn");
let xpContainer = document.querySelector(".xpdiv");
let staffContainer = document.querySelector(".les-staff");
let photoPreview = document.getElementById("photo-preview");
let roomButtons = document.querySelectorAll(".place-staff");
let profilePopup = document.querySelector(".profile-pop");
let btnCloseProfile = document.getElementById("close-profile");
let assignPopup = document.querySelector(".assign-pop");
let assignList = document.querySelector(".assign-list");
let assignRoomTitle = document.querySelector(".assign-room-name");
let assignEmptyText = document.querySelector(".assign-empty");
let btnCloseAssignList = document.querySelectorAll(".close-assign");
const formPatterns = {
  name: /^[A-Za-z ]{3,25}$/,
  role: /^.+$/,
  email: /^.+@.+\..+$/,
  phone: /^[0-9]{7,12}$/,
  photo: /^https?:\/\//i
};
const formErrors = {
  name: document.querySelector("[data-error='name']"),
  role: document.querySelector("[data-error='role']"),
  email: document.querySelector("[data-error='email']"),
  phone: document.querySelector("[data-error='phone']"),
  photo: document.querySelector("[data-error='photo']")
};

let defaultAssignMessage = "";
if (assignEmptyText) {
  defaultAssignMessage = assignEmptyText.textContent;
}

let MAX_IN_ROOM = 3;

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
  if (btnAddXp) {
    btnAddXp.addEventListener("click", addExperienceBlock);
  }
  if (btnSave) {
    btnSave.addEventListener("click", saveStaff);
  }
}

function addExperienceBlock() {
  xpIndex = xpIndex + 1;

  let block = document.createElement("div");
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

  let removeBtn = block.querySelector(".remove-exp");
  removeBtn.onclick = function () {
    block.remove();
  };

  xpContainer.appendChild(block);
}

function saveStaff(e) {
  e.preventDefault();

  const formData = validateFormFields();
  if (!formData) {
    return;
  }

  let staff = {
    id: Date.now(),
    name: formData.name,
    role: formData.role,
    photo: formData.photo,
    email: formData.email,
    phone: formData.phone,
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
  let list = [];
  let blocks = xpContainer.querySelectorAll(".exp-form");

  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];

    let entInput = block.querySelector("#nom-" + (i + 1));
    let roleInput = block.querySelector("#role-" + (i + 1));
    let d1Input = block.querySelector("#date-de-" + (i + 1));
    let d2Input = block.querySelector("#date-a-" + (i + 1));

    let ent = "";
    let r = "";
    let d1 = "";
    let d2 = "";

    if (entInput) {
      ent = entInput.value;
    }
    if (roleInput) {
      r = roleInput.value;
    }
    if (d1Input) {
      d1 = d1Input.value;
    }
    if (d2Input) {
      d2 = d2Input.value;
    }

    if (ent && r && d1 && d2) {
      list.push({
        entreprise: ent,
        role: r,
        dateStart: d1,
        dateEnd: d2
      });
    }
  }

  return list;
}

function setupRoomSelection() {
  for (let i = 0; i < roomButtons.length; i++) {
    let btn = roomButtons[i];
    btn.addEventListener("click", function () {
      selectRoom(btn);
    });
  }
}

function setupAssignPopup() {
  for (let i = 0; i < btnCloseAssignList.length; i++) {
    let btn = btnCloseAssignList[i];
    btn.addEventListener("click", closeAssignPopup);
  }

  if (assignPopup) {
    assignPopup.addEventListener("click", function (e) {
      if (e.target === assignPopup) {
        closeAssignPopup();
      }
    });
  }
}

function openAssignPopup(room, eligible, msg) {
  if (msg === undefined) {
    msg = "";
  }

  currentRoom = room;

  let title = room.querySelector("h3");
  if (title) {
    assignRoomTitle.textContent = title.textContent;
  } else {
    assignRoomTitle.textContent = "";
  }

  assignList.innerHTML = "";

  let showMsg = (eligible.length === 0) || (msg !== "");
  if (showMsg) {
    assignList.style.display = "none";
    if (msg !== "") {
      assignEmptyText.textContent = msg;
    } else {
      assignEmptyText.textContent = defaultAssignMessage;
    }
    assignEmptyText.style.display = "block";
  } else {
    assignList.style.display = "flex";
    assignEmptyText.style.display = "none";

    for (let i = 0; i < eligible.length; i++) {
      let s = eligible[i];
      let btn = document.createElement("button");
      btn.type = "button";
      btn.className = "assign-option";
      btn.innerHTML = "<strong>" + s.name + "</strong><span>" + s.role + "</span>";
      btn.addEventListener("click", function () {
        assignStaff(s, currentRoom);
        closeAssignPopup();
      });
      assignList.appendChild(btn);
    }
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
  let room = btn.closest(".box");
  let type = roomType(room);

  if (!type) {
    return;
  }

  if (isRoomFull(room)) {
    openAssignPopup(room, [], "Cette salle est dÃ©jÃ  complÃ¨te (maximum 3 staff).");
    return;
  }

  let eligible = getEligibleStaff(type);
  openAssignPopup(room, eligible);
}

function setupProfilePopup() {
  if (btnCloseProfile) {
    btnCloseProfile.addEventListener("click", closeProfile);
  }
}

function renderStaffCard(staff) {
  let div = document.createElement("div");
  div.className = "staff-card";
  div.dataset.id = staff.id;

  div.innerHTML = `
    <img src="${staff.photo || "default-avatar.png"}">
    <h3 class='staff-name'>${staff.name}</h3>
    <p>${staff.role}</p>
  `;

  div.addEventListener("click", function () {
    openProfile(staff);
  });

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

function validateFormFields() {
  let nameValue = fieldName.value;
  let roleValue = fieldRole.value;
  let emailValue = fieldEmail.value;
  let phoneValue = fieldPhone.value;
  let photoValue = fieldPhoto.value;

  if (!nameValue.match(formPatterns.name)) {
    alert("Nom invalide (lettres + espaces, 3 a 25).");
    return null;
  }

  if (!roleValue.match(formPatterns.role)) {
    alert("Role invalide.");
    return null;
  }

  if (!emailValue.match(formPatterns.email)) {
    alert("Email invalide.");
    return null;
  }

  if (!phoneValue.match(formPatterns.phone)) {
    alert("Telephone invalide (7 a 12 chiffres).");
    return null;
  }

  if (photoValue && !photoValue.match(formPatterns.photo)) {
    alert("URL photo invalide.");
    return null;
  }

  return {
    name: nameValue,
    role: roleValue,
    email: emailValue,
    phone: phoneValue,
    photo: photoValue
  };
}

function isRoomFull(room) {
  let slot = room.querySelector(".staff-slot");
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
  let result = [];
  for (let i = 0; i < staffData.length; i++) {
    let s = staffData[i];
    if (s.assignedTo === null && canEnterRoom(s.role, type)) {
      result.push(s);
    }
  }
  return result;
}

function assignStaff(staff, room) {
  let type = roomType(room);
  staff.assignedTo = type;

  let cards = staffContainer.querySelectorAll(".staff-card");
  for (let i = 0; i < cards.length; i++) {
    let c = cards[i];
    if (c.dataset.id === String(staff.id)) {
      c.remove();
    }
  }

  let slot = room.querySelector(".staff-slot");

  let card = document.createElement("div");
  card.className = "staff-card";
  card.dataset.id = staff.id;

  card.innerHTML = `
    <img src="${staff.photo || "default-avatar.png"}">
    <h3>${staff.name}</h3>
    <p>${staff.role}</p>
    <button class="remove-staff">X</button>
  `;

  card.addEventListener("click", function () {
    openProfile(staff);
  });

  slot.appendChild(card);

  let removeBtn = card.querySelector(".remove-staff");
  removeBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    removeFromRoom(staff, room);
  });

  refreshRoomState();
}

function removeFromRoom(staff, room) {
  staff.assignedTo = null;
  let slot = room.querySelector(".staff-slot");
  let card = slot.querySelector('[data-id="' + staff.id + '"]');

  if (card) {
    card.remove();
  }

  renderStaffCard(staff);
  refreshRoomState();
}

function refreshRoomState() {
  let rooms = document.querySelectorAll(".staff-grid .box");

  for (let i = 0; i < rooms.length; i++) {
    let room = rooms[i];
    let type = roomType(room);
    let slot = room.querySelector(".staff-slot");

    if (type === "conference" || type === "personnel") {
      room.classList.remove("empty");
    } else {
      if (slot.children.length === 0) {
        room.classList.add("empty");
      } else {
        room.classList.remove("empty");
      }
    }
  }
}

function openProfile(staff) {
  let profilePhoto = document.getElementById("profile-photo");
  let profileName = document.getElementById("profile-name");
  let profileRole = document.getElementById("profile-role");
  let profileEmail = document.getElementById("profile-email");
  let profilePhone = document.getElementById("profile-phone");
  let profileLocation = document.getElementById("profile-location");

  profilePhoto.src = staff.photo || "default-avatar.png";
  profileName.textContent = staff.name;
  profileRole.textContent = staff.role;
  profileEmail.textContent = staff.email;
  profilePhone.textContent = staff.phone;

  if (staff.assignedTo) {
    profileLocation.textContent = staff.assignedTo;
  } else {
    profileLocation.textContent = "Unassigned";
  }

  let xpList = document.getElementById("profile-exp");
  xpList.innerHTML = "";

  if (staff.experiences.length > 0) {
    for (let i = 0; i < staff.experiences.length; i++) {
      let xp = staff.experiences[i];
      let li = document.createElement("li");
      li.textContent = xp.entreprise + xp.dateStart + "--" + xp.dateEnd;
      xpList.appendChild(li);
    }
  } else {
    xpList.innerHTML = "<li>Aucune experience</li>";
  }

  profilePopup.style.display = "flex";
}

function closeProfile() {
  profilePopup.style.display = "none";
}

