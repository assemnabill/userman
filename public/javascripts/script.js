"use strict";
// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen....
// import axios, {AxiosResponse} from 'axios';
const out = document.getElementById("out");
const createForm = document.getElementById('createForm');
const usersTable = document.getElementById("usersTable");
let editSection = document.getElementById("editSection");
let createTab = document.getElementById("pills-create-tab");
let users = [];
let user = {
    firstName: "",
    lastName: "",
    email: "",
    id: 0,
};
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    createForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createUser();
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
    createTab.addEventListener("click", (event) => {
        event.preventDefault();
        editSection.innerHTML = " ";
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
            notify("Something went wrong. " + reason, true);
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
    const oldPassword = document.getElementById("oldPassword").value.trim();
    const newPassword = document.getElementById("password2").value.trim();
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (email && user.email != email) {
        user.email = email;
    }
    if (newPassword && newPassword.length > 1) {
        if (oldPassword !== newPassword) {
            user.newPassword = newPassword;
            user.oldPassword = oldPassword;
        }
        else {
            notify("Please enter a different password than the current one.", true);
            return;
        }
    }
    axios.patch("users/" + user.id, user)
        .then((value) => {
        createForm.reset();
        notify("Successfully updated user: " + user.firstName + " " + user.lastName);
        loadUsers();
    })
        .catch((reason) => {
        notify("Something went wrong. " + reason, true);
    });
    editSection.innerHTML = " ";
}
function deleteUser(index) {
    if (editSection) {
        editSection.innerHTML = " ";
    }
    axios.delete("users/" + index)
        .then((value) => {
        notify("Successfully deleted user: " + users[index].firstName + " " + users[index].lastName);
        loadUsers();
    }).catch((reason) => {
        notify("Something went wrong. " + reason, true);
    });
}
function loadUsers() {
    axios.get("/users")
        .then((value) => {
        users = value.data;
        renderChanges();
    }).catch((reason) => {
        notify("Something went wrong. " + reason, true);
    });
}
function renderEditSection() {
    editSection.innerHTML = " ";
    editSection.innerHTML += `
          <form id="editForm" action="/newaccount" method=post
              oninput='password2.setCustomValidity(password2.value !== password1.value ? "Passwords do not match." : "")'>
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
          
          <div onclick="return false;">
            <div id="accordion">
              <div class="card">
                <div class="card-header" id="headingOne">
                  <h5 class="mb-0">
                    <button class="btn btn-link" data-toggle="collapse" data-target="#passwordCollapse" 
                            aria-expanded="true" aria-controls="passwordCollapse" style="padding: 0px;">
                      Change Password
                    </button>
                  </h5>
                </div>
            
                <div id="passwordCollapse" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                  <div class="card-body">
                      <div class="form-group">
                        <label for="oldPassword">Old Password:</label>
                        <input id="oldPassword" class="form-control" type="password" name="oldPassword">
                      </div>
                      <div class="form-group">
                        <label for="password1">New Password:</label>
                        <input id="password1" class="form-control" type=password name="password1">
                      </div>
                      <div class="form-group">
                        <label for="password2">Confirm password:</label>
                        <input id="password2" class="form-control" type=password name="password2">
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group text-center">
            <button id="saveBtn" type="submit" class="btn btn-primary" style="margin-top: 10px;">
            Save Changes
            </button>
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
    const editForm = document.getElementById('editForm');
    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateUser();
    });
}
function renderChanges() {
    let table = document.getElementById("usersTable");
    table.innerHTML = " ";
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        table.innerHTML += `
            <tr>
            <th scope="row">
                <button class="btn btn-primary" style="background-color: #f54153;">
                <i class="fas fa-trash" data-index="${i}" id="del_${i}"></i>
                </button>
                <button class="btn btn-primary" >
                <i class="fas fa-pen" data-index="${i}" id="edit_${i}"></i>
                </button>
            </th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
          </tr>
            </td>`;
    }
}
function setUser(index) {
    user = users[index];
    user.id = index;
}
function notify(msg, error = false) {
    out.innerHTML = "";
    if (error) {
        out.className = "alert alert-danger alert-dismissible fade show";
    }
    else {
        out.className = "alert alert-success alert-dismissible fade show";
    }
    out.innerText = msg;
    const closBtn = document.createElement("div");
    closBtn.innerHTML = `
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>`;
    out.appendChild(closBtn);
}
