//создание таблицы с текущим пользователем
fetch('/api/v1/users/user').then(
    res => {
        res.json().then(
            data => {
                console.log(data)
                let temp = "";
                temp += "<td>" + data.id + "</td>";
                temp += "<td>" + data.firstName + "</td>";
                temp += "<td>" + data.lastName + "</td>";
                temp += "<td>" + data.age + "</td>";
                temp += "<td>" + data.email + "</td>";
                let rolesStr = "<td>";
                data.roles.forEach(r => {
                    rolesStr += r.name.replace("ROLE_", "") + " ";
                })
                temp += rolesStr + "</td>" + "</tr>";
                document.getElementById("tableUserBody").innerHTML = temp;
            }
        )
    }
)