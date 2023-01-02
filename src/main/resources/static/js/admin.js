let allUsers;
let allRoles;
//получение списка всех ролей
fetch('/api/v1/users/roles').then(
    res => {
        res.json().then(
            roles => {
                allRoles = roles;
            }
        )
    }
)
//получение списка пользователей
fetch('/api/v1/users').then(
    res => {
        res.json().then(
            data => {
                allUsers = data;
                createTable(allUsers);
            }
        )
    }
)
//создание таблицы пользователей
function createTable(data) {
    let temp = "";
    data.forEach(u => {
        temp += "<tr id=\"" + u.id + "\">";
        temp += "<td>" + u.id + "</td>";
        temp += "<td>" + u.firstName + "</td>";
        temp += "<td>" + u.lastName + "</td>";
        temp += "<td>" + u.age + "</td>";
        temp += "<td>" + u.email + "</td>";
        let rolesStr = "<td>";
        u.roles.forEach(r => {
            rolesStr += r.name.replace("ROLE_", "") + " ";
        })
        temp += rolesStr + "</td>";
        temp += "<td><button class=\"btn btn-info\" onclick=\"fEdit(this)\" id=\"editBtn" + u.id + "\">Edit</button></td>";
        temp += "<td><button class=\"btn btn-danger\" onclick=\"fDel(this)\" id=\"deleteBtn" + u.id + "\">Delete</button></td>" + "</tr>";
    })
    document.getElementById("usersTableBody").innerHTML = temp;
}
//получение ролей для мультиселекта в форме создания нового пользователя
fetch('/api/v1/users/roles').then(
    res => {
        res.json().then(
            roles => {
                let temp = "";
                console.log(roles)
                document.getElementById("multipleSelectRoles").size = roles.length;
                roles.forEach(r => {
                    temp += "<option>" + r.name + "</option>";
                })
                document.getElementById("multipleSelectRoles").innerHTML = temp;
            }
        )
    }
)
//действие кнопки добавления нового пользователя
$('#addUserBtn').click(function () {
    event.preventDefault()
    let newUser = {
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        password: "",
        roles: []
    };
    newUser.email = document.getElementById("eMail").value;
    newUser.firstName = document.getElementById("firstName").value;
    newUser.lastName = document.getElementById("lastName").value;
    newUser.age = document.getElementById("age").value;
    newUser.password = document.getElementById("password").value;
    newUser.roles = [];
    [].slice.call(document.getElementById("multipleSelectRoles")).forEach(op => {
        if (op.selected) {
            allRoles.forEach(r => {
                if (r.name === op.text) {
                    newUser.roles.push(r);
                }
            })
        }
    })
    fetch('/api/v1/users/newUser', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {'Content-Type': 'application/json'}
    }).then(res1 => {
        if (res1.ok) {
            res1.json().then(u => {
                allUsers.push(u);
                createTable(allUsers);
                document.getElementById("home-tab").click();
            })
            document.getElementById("firstName").value = "";
            document.getElementById("lastName").value = "";
            document.getElementById("age").value = "";
            document.getElementById("eMail").value = "";
            document.getElementById("password").value = "";
            document.getElementById("multipleSelectRoles").selectedIndex = -1;
        } else {
            alert("Не удалось добавить: " + res1.status);
        }
    })
})
//получение пользователя по id из ранее полученного списка с пользователями
function getUserById(id) {
    let t = null;
    allUsers.forEach(u => {
        if (u.id === id) {
            t = u;
        }
    })
    return t;
}
//действие кнопки редактирования в модальном окне редактирования пользователя
$('#editUserBtn').click(function () {
    event.preventDefault()
    let id = document.getElementById("idEditModal").value;
    let edit = {
        id: -1,
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        password: "",
        roles: []
    };
    $('#editModal').modal('hide');
    edit.id = document.getElementById("idEditModal").value;
    edit.age = document.getElementById("ageEditModal").value;
    edit.firstName = document.getElementById("firstNameEditModal").value;
    edit.lastName = document.getElementById("lastnameEditModal").value;
    edit.email = document.getElementById("eMailEditModal").value;
    edit.password = document.getElementById("passwordEditModal").value;
    edit.roles = [];
    [].slice.call(document.getElementById("rolesEditModal")).forEach(op => {
        if (op.selected) {
            allRoles.forEach(r => {
                if (r.name === op.text) {
                    edit.roles.push(r);
                }
            })
        }
    })
    console.log(edit)
    fetch('/api/v1/users/' + id + '/edit', {
        method: 'PUT',
        body: JSON.stringify(edit),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => {
            if (res.ok) {
                allUsers.forEach(u => {
                    if (u.id == edit.id) {
                        u.firstName = edit.firstName;
                        u.lastName = edit.lastName;
                        u.age = edit.age;
                        u.email = edit.email;
                        if (edit.password !== "") {
                            u.password = edit.password;
                        }
                        u.roles = edit.roles;
                    }
                })
                createTable(allUsers);
            }
        });
})
//действие кнопки удаления в модальном окне удаления пользователя
$('#delUserBtn').click(function () {
    event.preventDefault()
    let id = document.getElementById("idDelModal").value;
    $('#deleteModal').modal('hide');

    fetch('/api/v1/users/' + id + '/delete', {method: 'DELETE'})
        .then(res => {
            if (res.ok) {
                document.getElementById(id).remove();
                let u = getUserById(id);
                let i = allUsers.indexOf(u);
                delete allUsers[i];
            }
        });
})
//подготовка модального окна редактирования пользователя перед открытием
function fEdit(el) {
    let id = el.id.slice(7);
    console.log(id)
    console.log(allUsers)
    allUsers.forEach(u => {
        if (u.id == id) {
            document.getElementById("idEditModal").value = u.id;
            document.getElementById("firstNameEditModal").value = u.firstName;
            document.getElementById("lastnameEditModal").value = u.lastName;
            document.getElementById("ageEditModal").value = u.age;
            document.getElementById("eMailEditModal").value = u.email;
            document.getElementById("passwordEditModal").value = u.password;
            document.getElementById("rolesEditModal").size = allRoles.length;
            let temp = "";
            allRoles.forEach(r => {
                let select = "";
                u.roles.forEach(rUser => {
                    if (rUser.id === r.id) {
                        select = " selected";
                    }
                })
                temp += "<option" + select + ">" + r.name + "</option>";
            })
            document.getElementById("rolesEditModal").innerHTML = temp;
        }
    });
    $('#editModal').modal('show');
}
//подготовка модального окна удаления пользователя перед открытием
function fDel(el) {
    let id = el.id.slice(9);
    allUsers.forEach(u => {
        if (u.id == id) {
            document.getElementById("idDelModal").value = u.id;
            document.getElementById("firsNameDelModal").value = u.firstName;
            document.getElementById("lastNameDelModal").value = u.lastName;
            document.getElementById("ageDelModal").value = u.age;
            document.getElementById("eMailDelModal").value = u.email;
            document.getElementById("passwordDelModal").value = u.password;
            document.getElementById("rolesDelModal").size = allRoles.length;
            let temp = "";
            allRoles.forEach(r => {
                let select = "";
                u.roles.forEach(rUser => {
                    if (rUser.id === r.id) {
                        select = " selected";
                    }
                })
                temp += "<option" + select + ">" + r.name + "</option>";
            })
            document.getElementById("rolesDelModal").innerHTML = temp;
        }
    });
    $('#deleteModal').modal('show');
}