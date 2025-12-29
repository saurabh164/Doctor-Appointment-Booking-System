// Load navbar.html into all pages
fetch("navbar.html")
  .then(res => res.text())
  .then(html => { document.getElementById("navbar").innerHTML = html; });

// Registration
document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registerForm");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = regForm.regName.value;
      const email = regForm.regEmail.value;
      const password = regForm.regPassword.value;
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find(u => u.email === email)) return alert("Email already registered!");
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! You can login now.");
      window.location.href = "login.html";
    });
  }

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.loginEmail.value;
      const password = loginForm.loginPassword.value;
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) return alert("Invalid email or password!");
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Login successful!");
      window.location.href = "appointment.html";
    });
  }

  // Appointment
  const appForm = document.getElementById("appointmentForm");
  const listDiv = document.getElementById("appointmentsList");
  if (appForm) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please login first!");
      window.location.href = "login.html";
      return;
    }

    const loadAppointments = () => {
      const data = JSON.parse(localStorage.getItem("appointments") || "[]");
      listDiv.innerHTML = "";
      const myApps = data.filter(a => a.user === user.email);
      myApps.forEach(a => {
        const div = document.createElement("div");
        div.className = "appointment-item";
        div.innerHTML = `<strong>${a.patientName}</strong><br>${a.doctor}<br>${a.date} at ${a.time}<br>${a.reason}`;
        listDiv.appendChild(div);
      });
    };

    loadAppointments();

    appForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = {
        user: user.email,
        patientName: appForm.patientName.value,
        doctor: appForm.doctor.value,
        date: appForm.date.value,
        time: appForm.time.value,
        reason: appForm.reason.value,
      };
      const all = JSON.parse(localStorage.getItem("appointments") || "[]");
      all.push(a);
      localStorage.setItem("appointments", JSON.stringify(all));
      alert("Appointment booked!");
      appForm.reset();
      loadAppointments();
    });
  }
});

// ===== Doctor Registration =====
document.addEventListener("DOMContentLoaded", () => {
  const docRegForm = document.getElementById("doctorRegisterForm");
  if (docRegForm) {
    docRegForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = docRegForm.docName.value;
      const email = docRegForm.docEmail.value;
      const password = docRegForm.docPassword.value;
      const specialty = docRegForm.docSpecialty.value;
      const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      if (doctors.find(d => d.email === email)) return alert("Doctor already registered!");
      doctors.push({ name, email, password, specialty });
      localStorage.setItem("doctors", JSON.stringify(doctors));
      alert("Doctor registered successfully!");
      window.location.href = "doctor-login.html";
    });
  }

  // ===== Doctor Login =====
  const docLoginForm = document.getElementById("doctorLoginForm");
  if (docLoginForm) {
    docLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = docLoginForm.docLoginEmail.value;
      const password = docLoginForm.docLoginPassword.value;
      const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      const doc = doctors.find(d => d.email === email && d.password === password);
      if (!doc) return alert("Invalid email or password!");
      localStorage.setItem("loggedInDoctor", JSON.stringify(doc));
      alert("Login successful!");
      window.location.href = "doctor-dashboard.html";
    });
  }

  // ===== Doctor Dashboard =====
  const doctorDashboard = document.getElementById("doctorAppointments");
  if (doctorDashboard) {
    const doctor = JSON.parse(localStorage.getItem("loggedInDoctor"));
    if (!doctor) {
      alert("Please login as a doctor first!");
      window.location.href = "doctor-login.html";
      return;
    }
    const all = JSON.parse(localStorage.getItem("appointments") || "[]");
    const myApps = all.filter(a => a.doctor.includes(doctor.name));
    if (myApps.length === 0) {
      doctorDashboard.innerHTML = "<p>No appointments yet.</p>";
    } else {
      myApps.forEach(a => {
        const div = document.createElement("div");
        div.className = "appointment-item";
        div.innerHTML = `<strong>${a.patientName}</strong><br>${a.date} at ${a.time}<br>${a.reason}`;
        doctorDashboard.appendChild(div);
      });
    }
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("loggedInDoctor");
      window.location.href = "index.html";
    });
  }
});
