const API_URL = 'http://localhost:3000/products';
let selectedRow = null;

document.getElementById("newBtn").addEventListener("click", function() {
    // Toggle the visibility of the form
    const form = document.querySelector(".form-container form");
    form.classList.toggle("hidden");
});

function onFormSubmit(event) {
    event.preventDefault();
    const formData = readFormData();
    if (selectedRow === null) {
        createRecord(formData);
    } else {
        updateRecord(formData);
    }
    resetForm();
}

function readFormData() {
    const formData = {
        productCode: document.getElementById("productCode").value,
        product: document.getElementById("product").value,
        qty: document.getElementById("qty").value,
        perPrice: document.getElementById("perPrice").value
    };
    return formData;
}

function createRecord(data) {
    const newData = { id: data.id, ...data };
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData) //convert js object to json string
    })
    .then(response => response.json())
    .then(() => {
        getAllRecords(); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getAllRecords() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        data.forEach(record => {
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${record.productCode}</td>
                <td>${record.product}</td>
                <td>${record.qty}</td>
                <td>${record.perPrice}</td>
                <td>
                    <button onClick="onEdit(this, '${record.id}')">Edit</button>
                    <button onClick="onDelete('${record.id}')">Delete</button>
                </td>
            `;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function onEdit(td, id) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("productCode").value = selectedRow.cells[0].innerHTML;
    document.getElementById("product").value = selectedRow.cells[1].innerHTML;
    document.getElementById("qty").value = selectedRow.cells[2].innerHTML;
    document.getElementById("perPrice").value = selectedRow.cells[3].innerHTML;
    selectedRow.id = id;

    // document.getElementById("newBtn").textContent = "Edit Product";
    const newBtn = document.getElementById("newBtn");
    newBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Product';

    const form = document.querySelector(".form-container form");
    form.classList.remove("hidden");
}

function updateRecord(formData) {
    // Get ID from the selectedRow
    const id = selectedRow.id;
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(() => {
        getAllRecords();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function onDelete(id) {
    if (confirm('Do you want to delete this record?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            getAllRecords();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function resetForm() {
    document.getElementById("productCode").value = '';
    document.getElementById("product").value = '';
    document.getElementById("qty").value = '';
    document.getElementById("perPrice").value = '';
    selectedRow = null;

    const form = document.querySelector(".form-container form");
    form.classList.add("hidden");

    document.getElementById("newBtn").innerHTML = '<i class="fas fa-plus"></i> New Product';

}

document.querySelector(".form-container form [type='reset']").addEventListener("click", function() {
    resetForm();
});

window.onload = getAllRecords;
