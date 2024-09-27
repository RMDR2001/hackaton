"use strict";

const { response } = require("express");

const LS_KEY = "trade.skills";

// state to use with local storage
let state = {
  user: {},
};

// load from local storage
function loadState() {
  let getState = localStorage.getItem(LS_KEY);
  if (getState) {
    console.log(getState); //
    state = JSON.parse(getState);
    console.log(state); //
  }
}

// use state from local storage on page load
function pageLoad() {
  console.log("pageLoad");
  let savedState = localStorage.getItem(LS_KEY);
  if (!savedState) {
    return;
  }
  loadState();
}

pageLoad();

// update state in local storage
function updateUserInState(newUser) {
  const newState = { user: newUser };
  let stringify = JSON.stringify(newState);
  localStorage.setItem(LS_KEY, stringify);
  console.log(stringify); //
}

// ---> Aquí deberías empezar tu código propio:

async function handleRegister(fullname, email, phone) {
  const userData = { fullname, email, phone, skills: [] };
  try {
    const response = await fetch("https://localhost:3000/user", {
      method: "POST",
      headers: { "Content-type": "Aplication/json" },
      body: JSON.stringify(userData),
    });
    if (response.redirected) {
      const urlParams = new URL(response.url).searchParams;
      const userId = urlParams.get("id");
      updateUserInState({ _id: userId, fullname, email, phone });
      window.location.href = `auth.html?id=${userId}`;
    } else {
      alert("Error en el registro. Inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error durante el registro:", error);
    alert("Error en el servidor.");
  }
}

async function handleLogin(email) {
  try {
    const response = await fetch(`http://localhost:3000/user?email=${email}`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      updateUserInState(data.user);
      window.location.href = "home.html";
    } else {
      alert("Usuario no encontrado o error en el inicio de sesión.");
    }
  } catch (error) {
    console.error("Error durante el login:", error);
    alert("Error en el servidor.");
  }
}

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  handleRegister(fullname, email, phone);
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  handleLogin(email);
});

pageLoad();
