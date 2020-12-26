// Importiert die statische Variable "axios" und den Typ "AxiosResponse"
// Bitte vor dem Ausführen auskommentieren und nur während dem Programmieren drinnen lassen....
// import axios, {AxiosResponse} from "axios";


class User {
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    password: string = "";
}


const out: HTMLElement = <HTMLElement>document.getElementById("out");
const createForm: HTMLFormElement = document.getElementById('createForm') as HTMLFormElement;
const usersTable: HTMLFormElement = document.getElementById("usersTable") as HTMLFormElement;
let editSection: HTMLElement = <HTMLElement>document.getElementById("editSection");

let users: User[] = [];
let user: User;


function setUser(index: number) {
    user = users[index];
}

document.addEventListener("DOMContentLoaded", () => {

    loadUsers();

    createForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        createUser();
    });

    editSection.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        const target: HTMLElement = event.target as HTMLElement;
        const userindex: number = Number(target.dataset.index);
        updateUser(userindex);
    });

    usersTable.addEventListener("click", (event: Event) => {
        event.preventDefault();
        const target: HTMLElement = event.target as HTMLElement;
        const index: number = Number(target.dataset.index);
        if (target.matches(".fa-trash")) {
            deleteUser(index);
        } else {
            setUser(index);
            renderEditSection();
        }
    });


});


function createUser() {
    const firstName: string = (document.getElementById("inputName") as HTMLInputElement).value.trim();
    const lastName: string = (document.getElementById("inputSurname") as HTMLInputElement).value.trim();
    const email: string = (document.getElementById("inputEmail1") as HTMLInputElement).value.trim();
    const password: string = (document.getElementById("inputPassword1") as HTMLInputElement).value.trim();

    let user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;

    if (users.every(user => user.email != email)) {
        axios.post("https://jsonplaceholder.typicode.com/users", user)
            .then((value: AxiosResponse) => {
                console.log(value);
                users.push(user);
                notify("Successfully created user: " + user.firstName + " " + user.lastName);
                renderChanges();
                createForm.reset();
            })
            .catch((reason: any) => {
                notify("Something went wrong. Error: " + reason, true);
            });
    } else {
        notify("This email already exists.", true);
    }
}


function updateUser(userindex: number) {
    const firstName: string = (document.getElementById("editName") as HTMLInputElement).value.trim();
    const lastName: string = (document.getElementById("editSurname") as HTMLInputElement).value.trim();
    const email: string = (document.getElementById("editEmail1") as HTMLInputElement).value.trim();

    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (email && user.email != email) {
        user.email = email;
    }
    axios.patch("https://jsonplaceholder.typicode.com/users/" + userindex, user)
        .then((value: AxiosResponse) => {
            console.log(value);
            notify("Successfully updated user: " + user.firstName + " " + user.lastName);
            renderChanges();
            createForm.reset();
        })
        .catch((reason: any) => {
            notify("Something went wrong. Error: " + reason, true);
        });
    editSection.innerHTML = " ";
}


function deleteUser(index: number) {
    axios.delete("https://jsonplaceholder.typicode.com/users/" + index)
        .then((value: AxiosResponse) => {
            notify("Successfully deleted user: " + users[index].firstName + " " + users[index].lastName);
            users.splice(index, 1);
            renderChanges();
        }).catch((reason: any) => {
        notify("Something went wrong. Error: " + reason, true);
    });
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

    let nameField = <HTMLElement>document.getElementById("editName");
    // @ts-ignore
    nameField.value = user.firstName;
    let surnameField = <HTMLElement>document.getElementById("editSurname");
    // @ts-ignore
    surnameField.value = user.lastName;
    let emailField = <HTMLElement>document.getElementById("editEmail1");
    // @ts-ignore
    emailField.value = user.email;
}


function loadUsers(): void {

    axios.get("https://jsonplaceholder.typicode.com/users")
        .then((value: AxiosResponse) => {
            for (let i: number = 0; i < value.data.length; i++) {
                let user: User = new User();
                const name = value.data[i].name;
                const names = name.split(' ');

                user.firstName = names[0];
                user.lastName = names[1];
                user.email = value.data[i].email;
                users.push(user);
            }
            renderChanges();
        }).catch((reason: any) => {
        notify("Something went wrong. Error: " + reason, true);
    });
    console.log(users);
}


function renderChanges() {
    let table: HTMLElement = <HTMLElement>document.getElementById("usersTable");
    table.innerHTML = " ";
    for (let i: number = 0; i < users.length; i++) {
        const user: User = users[i];
        const row: HTMLElement = document.createElement("tr");
        table.innerHTML += `
            <tr>
            <th scope="row">
                <button class="btn btn-primary">
                <i class="fas fa-trash" data-index="${i}"></i>
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


function notify(msg: string, error: boolean = false) {
    if (error) {
        out.className = "alert alert-danger";
    } else {
        out.className = "alert alert-success";
    }
    out.innerText = msg;
}

