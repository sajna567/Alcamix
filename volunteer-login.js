document.getElementById("loginBtn").addEventListener("click", async () => {
  const id = document.getElementById("volunteerId").value.trim();

  if (!id) {
    alert("Please enter Volunteer ID");
    return;
  }

  try {
    const res = await fetch(`/api/volunteers/${id}`);
    const volunteer = await res.json();

    if (!res.ok) {
      alert(volunteer.message || "Volunteer not found");
      return;
    }

    // AFTER fetching volunteer successfully

localStorage.setItem("loggedVolunteerId", volunteer.id);
window.location.href = "volunteer-dashboard.html";

    document.getElementById("dId").textContent = volunteer.id;
    document.getElementById("dName").textContent = volunteer.name;
    document.getElementById("dPhone").textContent = volunteer.phone;
    document.getElementById("dEmail").textContent = volunteer.email;
    document.getElementById("dCity").textContent = volunteer.city;
    document.getElementById("dVehicle").textContent = volunteer.vehicle || "Not provided";
    document.getElementById("dAvailability").textContent =
      volunteer.availability?.join(", ") || "Not provided";

  } catch (err) {
    alert("Something went wrong");
    console.error(err);
  }
});