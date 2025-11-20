const openBtn = document.querySelector(".open-pop");
const popUp = document.querySelector(".pop-P");
const closePop = document.querySelector(".close-pop");
const saveBtn = document.querySelector(".saveStaff");

if (openBtn) {
  openBtn.onclick = () => {
    popUp.style.display = "flex";
    document.body.style.overflow = "hidden";
  };
}

if (closePop) {
  closePop.onclick = () => {
    popUp.style.display = "none";
    document.body.style.overflow = "auto";
  };
}

popUp.addEventListener("click", (e) => {
  if (e.target === popUp) {
    popUp.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

const nom = document.getElementById("inputnom");
const role = document.getElementById("inputrole");
const photo = document.getElementById("inputphoto");
const email = document.getElementById("inputemail");
const telephone = document.getElementById("inputphone");
const xpBtn = document.getElementById("xpBtn");
const divExperience = document.querySelector(".xpdiv");
const staffList = document.querySelector(".les-staff");
const preview = document.getElementById("photo-preview");

let allStaffs = [];
let count = 0;

photo.oninput = () => {
  if (!preview) return;
  preview.src = photo.value;
  preview.style.display = photo.value ? "block" : "none";
};

xpBtn.onclick = () => {
  count++;
  const div = document.createElement("div");
  div.className = "exp-form";
  div.innerHTML = `
    <label>Entreprise</label>
    <input id="nom-${count}">
    <label>Rôle</label>
    <select id="role-${count}">
      <option value="Receptionnistes">Receptionnistes</option>
      <option value="Techniciens IT">Techniciens IT</option>
      <option value="Agents de securite">Agents de securite</option>
      <option value="Manager">Manager</option>
      <option value="Autres roles">Autres rôles</option>
      <option value="Nettoyage">Nettoyage</option>
    </select>
    <label>De</label>
    <input type="date" id="date-de-${count}">
    <label>À</label>
    <input type="date" id="date-a-${count}">
    <button type="button" class="remove-exp">X</button>
  `;
  div.querySelector(".remove-exp").onclick = () => div.remove();
  divExperience.appendChild(div);
};

saveBtn.onclick = (e) => {
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
    experiences: [],
    assignedTo: null
  };

  const expBlocks = divExperience.querySelectorAll(".exp-form");

  expBlocks.forEach((block, index) => {
    const ent = block.querySelector(`#nom-${index + 1}`).value;
    const r = block.querySelector(`#role-${index + 1}`).value;
    const de = block.querySelector(`#date-de-${index + 1}`).value;
    const a = block.querySelector(`#date-a-${index + 1}`).value;

    if (ent && r && de && a) {
      staffMember.experiences.push({
        entreprise: ent,
        role: r,
        dateStart: de,
        dateEnd: a
      });
    }
  });

  allStaffs.push(staffMember);
  createStaffCard(staffMember);

  resetForm();
  popUp.style.display = "none";
  document.body.style.overflow = "auto";
  updateRoomColors();
};

function createStaffCard(staffMember) {
  const div = document.createElement("div");
  div.className = "staff-card";
  div.dataset.id = staffMember.id;

  div.innerHTML = `
    <img src="${staffMember.photo || 'default-avatar.png'}">
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
  divExperience.innerHTML = "";
  if (preview) {
    preview.style.display = "none";
    preview.src = "";
  }
  count = 0;
}

const roomButtons = document.querySelectorAll(".place-staff");

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const roomBox = button.closest(".box");
    const roomType = getRoomType(roomBox);
    if (!roomType) return;

    const eligible = getEligibleStaff(roomType);

    if (eligible.length === 0) {
      alert("Aucun employé éligible n'est disponible pour cette zone.");
      return;
    }

    let message = "Choisissez un employé :\n";
    eligible.forEach((e, i) => {
      message += `${i + 1} - ${e.name} (${e.role})\n`;
    });

    const choix = prompt(message);
    const index = parseInt(choix, 10);

    if (isNaN(index) || index < 1 || index > eligible.length) return;

    assignStaffToRoom(eligible[index - 1], roomBox);
  });
});

function getRoomType(roomBox) {
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
    <img src="${staffMember.photo || 'default-avatar.png'}">
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

updateRoomColors();

const profilePop = document.querySelector(".profile-pop");
const closeProfile = document.getElementById("close-profile");

function openProfile(staff) {
  document.getElementById("profile-photo").src = staff.photo || "default-avatar.png";
  document.getElementById("profile-name").textContent = staff.name;
  document.getElementById("profile-role").textContent = staff.role;
  document.getElementById("profile-email").textContent = staff.email;
  document.getElementById("profile-phone").textContent = staff.phone;
  document.getElementById("profile-location").textContent =
    staff.assignedTo ? staff.assignedTo : "Unassigned";

  const expList = document.getElementById("profile-exp");
  expList.innerHTML = "";

  if (staff.experiences && staff.experiences.length > 0) {
    staff.experiences.forEach((exp) => {
      const li = document.createElement("li");
      li.textContent = `${exp.entreprise} (${exp.dateStart} → ${exp.dateEnd})`;
      expList.appendChild(li);
    });
  } else {
    expList.innerHTML = "<li>Aucune expérience</li>";
  }

  profilePop.style.display = "flex";
}

closeProfile.onclick = () => {
  profilePop.style.display = "none";
};
