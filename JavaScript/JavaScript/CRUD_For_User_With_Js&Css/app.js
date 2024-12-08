document.addEventListener("DOMContentLoaded", function() {
    const newUserBtn = document.getElementById("newUserBtn");
    const userForm = document.getElementById("userForm");
    const cancelBtn = document.querySelector(".cancelBtn");
    const dataTable = document.getElementById("dataTable").querySelector("tbody");
    let userId = 1;

    newUserBtn.addEventListener("click", function() {
        userForm.classList.remove("hidden");
    });

    cancelBtn.addEventListener("click", function() {
        userForm.reset();
        userForm.classList.add("hidden");
    });

    userForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const city = document.getElementById("city").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const post = document.getElementById("post").value;
        const sDate = document.getElementById("sDate").value;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${userId}</td>
            <td>${name}</td>
            <td>${age}</td>
            <td>${city}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${post}</td>
            <td>${sDate}</td>
            <td>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </td>
        `;
        dataTable.appendChild(newRow);
        userId++;
        userForm.reset();
        userForm.classList.add("hidden");
    });

    dataTable.addEventListener("click", function(event) {
        const target = event.target;
        if (target.classList.contains("editBtn")) {
            const row = target.closest("tr");
            const cells = row.children;
            document.getElementById("name").value = cells[1].textContent;
            document.getElementById("age").value = cells[2].textContent;
            document.getElementById("city").value = cells[3].textContent;
            document.getElementById("email").value = cells[4].textContent;
            document.getElementById("phone").value = cells[5].textContent;
            document.getElementById("post").value = cells[6].textContent;
            document.getElementById("sDate").value = cells[7].textContent;
            dataTable.removeChild(row);
            userId--;
            userForm.classList.remove("hidden");
        } else if (target.classList.contains("deleteBtn")) {
            const row = target.closest("tr");
            dataTable.removeChild(row);
            userId--;
        }
    });
});
