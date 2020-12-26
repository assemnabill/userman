"use strict";
// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen....
// import axios, {AxiosResponse} from 'axios';
const out = document.getElementById("out");
const createForm = document.getElementById('createForm');
const usersTable = document.getElementById("usersTable");
let editSection = document.getElementById("editSection");
let users = [];
let user;
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    createForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createUser();
    });
    editSection.addEventListener('submit', (event) => {
        event.preventDefault();
        updateUser();
    });
    usersTable.addEventListener("click", (event) => {
        event.preventDefault();
        const target = event.target;
        const index = Number(target.dataset.index);
        setUser(index);
        if (target.matches(".fa-trash")) {
            deleteUser(index);
        }
        else if (target.matches(".fa-pen")) {
            renderEditSection();
        }
    });
});
function createUser() {
    const firstName = document.getElementById("inputName").value.trim();
    const lastName = document.getElementById("inputSurname").value.trim();
    const email = document.getElementById("inputEmail1").value.trim();
    const password = document.getElementById("inputPassword1").value.trim();
    let user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    };
    if (users.every(user => user.email != email)) {
        axios.post("/users", user)
            .then((value) => {
            notify("Successfully created user: " + user.firstName + " " + user.lastName);
            createForm.reset();
            loadUsers();
        })
            .catch((reason) => {
            notify("Something went wrong. Error: " + reason, true);
        });
    }
    else {
        notify("This email already exists.", true);
    }
}
function updateUser() {
    const firstName = document.getElementById("editName").value.trim();
    const lastName = document.getElementById("editSurname").value.trim();
    const email = document.getElementById("editEmail1").value.trim();
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (email && user.email != email) {
        user.email = email;
    }
    axios.patch("users/" + user.id, user)
        .then((value) => {
        console.log(value);
        createForm.reset();
        notify("Successfully updated user: " + user.firstName + " " + user.lastName);
        loadUsers();
    })
        .catch((reason) => {
        notify("Something went wrong. Error: " + reason, true);
    });
    editSection.innerHTML = " ";
}
function deleteUser(index) {
    if (createForm) {
        createForm.innerHTML = " ";
    }
    axios.delete("users/" + index)
        .then((value) => {
        notify("Successfully deleted user: " + users[index].firstName + " " + users[index].lastName);
        loadUsers();
    }).catch((reason) => {
        notify("Something went wrong. Error: " + reason, true);
    });
}
function loadUsers() {
    axios.get("/users")
        .then((value) => {
        users = value.data;
        renderChanges();
    }).catch((reason) => {
        notify("Something went wrong. Error: " + reason, true);
    });
    console.log(users);
}
function renderEditSection() {
    editSection.innerHTML = " ";
    editSection.innerHTML += `
           <form id="editForm">
          <div class="form-group">
            <label for="editName">First Name</label>
            <input type="text" class="form-control" id="editName" name="firstName" required>
          </div>
          <div class="form-group">
            <label for="editSurname">Last Name</label>
            <input type="text" class="form-control" id="editSurname" name="lastName" required>
          </div>
          <div class="form-group">
            <label for="editEmail1">Email address</label>
            <input type="email" class="form-control" id="editEmail1" name="email" required>
          </div>

          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>`;
    let nameField = document.getElementById("editName");
    // @ts-ignore
    nameField.value = user.firstName;
    let surnameField = document.getElementById("editSurname");
    // @ts-ignore
    surnameField.value = user.lastName;
    let emailField = document.getElementById("editEmail1");
    // @ts-ignore
    emailField.value = user.email;
}
function renderChanges() {
    let table = document.getElementById("usersTable");
    table.innerHTML = " ";
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const row = document.createElement("tr");
        table.innerHTML += `
            <tr>
            <th scope="row">
                <button class="btn btn-primary">
                <i class="fas fa-trash" data-index="${i}" id="del_${i}"></i>
                </button>
                <button class="btn btn-primary" >
                <i class="fas fa-pen" data-index="${i}"></i>
                </button>
            </th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
          </tr>
            </td>`;
        table.appendChild(row);
    }
}
function setUser(index) {
    user = users[index];
    user.id = index;
}
function notify(msg, error = false) {
    if (error) {
        out.className = "alert alert-danger";
    }
    else {
        out.className = "alert alert-success";
    }
    out.innerText = msg;
}
