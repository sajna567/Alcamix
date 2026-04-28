// volunteer.js — backend connected

const hb = document.getElementById("hamburger");
const nl = document.getElementById("navLinks");

if (hb && nl) {
  hb.addEventListener("click", () => nl.classList.toggle("open"));
}

const btn = document.getElementById("volSubmitBtn");

if (btn) {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

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

      const volunteerData = {
        name,
        phone,
        email,
        city,
        vehicle: document.getElementById("vVehicle")?.value || "",
        availability,
        motivation: document.getElementById("vMotivation")?.value.trim() || ""
      };

      const res = await fetch("http://localhost:3000/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(volunteerData)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Could not register volunteer");
      }

      alert("Volunteer joined successfully!");

      if (document.getElementById("volId")) {
        document.getElementById("volId").textContent = result.volunteer?.id || result.id;

      document.getElementById("joinFormCard")?.classList.add("hidden");
      document.getElementById("volSuccess")?.classList.remove("hidden");

      document.getElementById("volSuccess")?.scrollIntoView({
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

const cards = document.querySelectorAll(".vol-how-card, .perk-card");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity .5s ease, transform .5s ease";
    io.observe(el);
  });
}