async function loadDashboard() {
  const id = localStorage.getItem("loggedVolunteerId");

  if (!id) {
    window.location.href = "volunteer-login.html";
    return;
  }

  try {
    const res = await fetch(`/api/volunteers/${id}`);
    const volunteer = await res.json();

    if (!res.ok) {
      alert("Volunteer not found. Please login again.");
      localStorage.removeItem("loggedVolunteerId");
      window.location.href = "volunteer-login.html";
      return;
    }

    document.getElementById("welcomeName").textContent = volunteer.name || "Volunteer";

    document.getElementById("dId").textContent = volunteer.id || "Not provided";
    document.getElementById("dName").textContent = volunteer.name || "Not provided";
    document.getElementById("dPhone").textContent = volunteer.phone || "Not provided";
    document.getElementById("dEmail").textContent = volunteer.email || "Not provided";
    document.getElementById("dCity").textContent = volunteer.city || "Not provided";
    document.getElementById("dVehicle").textContent = volunteer.vehicle || "Not provided";

    document.getElementById("dAvailability").textContent =
      volunteer.availability?.join(", ") || "Not provided";

    document.getElementById("dMotivation").textContent =
      volunteer.motivation || "Not provided";

    document.getElementById("dJoined").textContent =
      volunteer.joinedAt ? new Date(volunteer.joinedAt).toLocaleString() : "Not provided";

  } catch (error) {
    console.error(error);
    alert("Something went wrong while loading dashboard.");
  }
}

function logout() {
  localStorage.removeItem("loggedVolunteerId");
  window.location.href = "volunteer-login.html";
}

loadDashboard();