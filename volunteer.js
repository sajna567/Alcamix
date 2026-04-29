const hb = document.getElementById("hamburger");
const nl = document.getElementById("navLinks");

if (hb && nl) {
  hb.addEventListener("click", () => nl.classList.toggle("open"));
}

const btn = document.getElementById("volSubmitBtn");

if (btn) {
  btn.addEventListener("click", async () => {
    const name = document.getElementById("vName")?.value.trim();
    const phone = document.getElementById("vPhone")?.value.trim();
    const email = document.getElementById("vEmail")?.value.trim();
    const city = document.getElementById("vCity")?.value.trim();

    if (!name || !phone || !email || !city) {
      alert("Please fill all required fields (*)");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Joining...";

    try {
      const availability = [];

      if (document.getElementById("avMorn")?.checked) availability.push("Morning");
      if (document.getElementById("avAfter")?.checked) availability.push("Afternoon");
      if (document.getElementById("avEve")?.checked) availability.push("Evening");
      if (document.getElementById("avWknd")?.checked) availability.push("Weekends");

      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          city,
          vehicle: document.getElementById("vVehicle")?.value || "",
          availability,
          motivation: document.getElementById("vMotivation")?.value.trim() || ""
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Could not register volunteer");
      }

      const volunteerId = result.volunteer?.id || result.id;

alert(`🎉 Volunteer joined successfully!\n\nYour Volunteer ID is: ${volunteerId}`);

document.getElementById("volId").textContent = volunteerId;

      document.getElementById("joinFormCard").classList.add("hidden");
      document.getElementById("volSuccess").classList.remove("hidden");

      document.getElementById("volSuccess").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = "🚀 Join the Network";
    }
  });
}