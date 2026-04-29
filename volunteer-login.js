const loginBtn = document.getElementById("loginBtn");
const volunteerIdInput = document.getElementById("volunteerId");

loginBtn.addEventListener("click", loginVolunteer);

volunteerIdInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    loginVolunteer();
  }
});

async function loginVolunteer() {
  const id = volunteerIdInput.value.trim();

  if (!id) {
    alert("Please enter your Volunteer ID");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Checking...";

  try {
    const res = await fetch(`/api/volunteers/${id}`);
    const volunteer = await res.json();

    if (!res.ok) {
      alert(volunteer.message || "Volunteer not found");
      return;
    }

    localStorage.setItem("loggedVolunteerId", volunteer.id);
    window.location.href = "volunteer-dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Make sure server is running.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login to Dashboard";
  }
}