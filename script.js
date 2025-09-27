document.addEventListener("DOMContentLoaded", function () {
  // Load attendee list from localStorage or start empty
  let attendeeList = [];
  try {
    attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];
  } catch (e) {
    attendeeList = [];
  }
  const attendeeListEl = document.getElementById("attendeeList");

  // Helper to render attendee list
  function renderAttendeeList() {
    attendeeListEl.innerHTML = "";
    attendeeList.forEach(function (att) {
      const li = document.createElement("li");
      li.textContent = att.name;
      const teamSpan = document.createElement("span");
      teamSpan.className = "attendee-team " + att.team;
      teamSpan.textContent = att.teamName;
      li.appendChild(teamSpan);
      attendeeListEl.appendChild(li);
    });
  }
  renderAttendeeList();
  const form = document.getElementById("checkInForm");
  const nameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const attendeeCountSpan = document.getElementById("attendeeCount");

  // Track attendance, load from localStorage if available
  let count = parseInt(localStorage.getItem("attendanceCount")) || 0;
  let waterCount = parseInt(localStorage.getItem("waterCount")) || 0;
  let zeroCount = parseInt(localStorage.getItem("zeroCount")) || 0;
  let powerCount = parseInt(localStorage.getItem("powerCount")) || 0;
  const maxCount = 50;

  // Update UI with loaded values
  attendeeCountSpan.textContent = count;
  document.getElementById("waterCount").textContent = waterCount;
  document.getElementById("zeroCount").textContent = zeroCount;
  document.getElementById("powerCount").textContent = powerCount;
  updateProgressBar(count);

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Get form values
    const name = nameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    // Add attendee to list and save
    attendeeList.push({ name: name, team: team, teamName: teamName });
    localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
    renderAttendeeList();

    // Validate inputs
    console.log(`Name: ${name}, Team: ${team}. Team Name: ${teamName}`);

    // Increment count
    count++;
    console.log(`Current count: ${count}`);

    // Increment team count and save to localStorage
    if (team === "water") {
      waterCount++;
      localStorage.setItem("waterCount", waterCount);
    } else if (team === "zero") {
      zeroCount++;
      localStorage.setItem("zeroCount", zeroCount);
    } else if (team === "power") {
      powerCount++;
      localStorage.setItem("powerCount", powerCount);
    }

    // Save total count
    localStorage.setItem("attendanceCount", count);

    // Update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    console.log(`Progress: ${percentage}`);

    // Update team counter
    // Update team counter display from variable
    if (team === "water") {
      document.getElementById("waterCount").textContent = waterCount;
    } else if (team === "zero") {
      document.getElementById("zeroCount").textContent = zeroCount;
    } else if (team === "power") {
      document.getElementById("powerCount").textContent = powerCount;
    }

    // Show welcome message
    // Show custom styled popup instead of alert
    const customAlert = document.getElementById("customAlert");
    const customAlertMsg = document.getElementById("customAlertMsg");
    const closeAlertBtn = document.getElementById("closeAlertBtn");

    customAlertMsg.textContent = `Welcome, ${name}! You have checked in for ${teamName}!`;
    customAlert.style.display = "block";
    customAlert.classList.add("show");

    closeAlertBtn.onclick = function () {
      customAlert.classList.remove("show");
      setTimeout(function () {
        customAlert.style.display = "none";
      }, 200);
    };

    const message = `Welcome, ${name} from the ${teamName} team!`;
    console.log(message);

    // Reset form
    form.reset();
    // nameInput.focus();

    // Update attendee count and progress bar display
    attendeeCountSpan.textContent = count;
    updateProgressBar(count);

    // Show goal popup if attendance goal is reached
    if (count === maxCount) {
      const goalPopup = document.getElementById("goalPopup");
      const closeGoalBtn = document.getElementById("closeGoalBtn");
      goalPopup.classList.add("show");
      goalPopup.style.display = "block";
      // Optional: auto-close after a few seconds
      // setTimeout(function() { goalPopup.classList.remove('show'); goalPopup.style.display = 'none'; }, 5000);
      closeGoalBtn.onclick = function () {
        goalPopup.classList.remove("show");
        setTimeout(function () {
          goalPopup.style.display = "none";
        }, 200);
      };
    }
  });

  // Update progress bar function
  function updateProgressBar(count) {
    const progressBar = document.getElementById("progressBar");
    // Calculate the percentage
    const percent = (count / maxCount) * 100;
    // Set the width of the progress bar
    progressBar.style.width = `${percent}%`;
  }
});
