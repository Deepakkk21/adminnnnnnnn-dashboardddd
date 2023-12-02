let userData = [];

let currentPage = 1;
const usersPerPage = 10;

// Fetch data from API
fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
    .then(response => response.json())
    .then(data => {
        // Process data and build table
        userData = data;
        buildTable(userData);
    });

// Function to build the table
function buildTable(data) {
    // Access the table body
    const tableBody = document.querySelector('#userTable tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';


    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const usersToDisplay = data.slice(startIndex, endIndex);

    // Loop through data and append rows to the table
    usersToDisplay.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-checkbox"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>

            <!-- Add other properties as needed -->
            <td>
                <button class="edit" onclick="editRow(this)">Edit</button>
                <button class="delete" onclick="deleteRow(this)">Delete</button>
            </td>
         `;
           row.addEventListener('click', () => toggleRowSelection(row));
            tableBody.appendChild(row);

        });

    updatePagination();

}


function search() {
    // Get the search input value
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    // Filter the userData array based on the search input
    const filteredData = userData.filter(user =>
        user.name.toLowerCase().includes(searchInput) ||
        user.email.toLowerCase().includes(searchInput) ||
        user.role.toLowerCase().includes(searchInput)
    );

    // Rebuild the table with the filtered data
    buildTable(filteredData);
}

document.getElementById('searchInput').addEventListener('input', search);


function selectAll() {
    // Implement select all functionality
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.select-checkbox');
    checkboxes.forEach(checkbox => (checkbox.checked = selectAllCheckbox.checked));
}

function toggleRowSelection(row) {
    row.classList.toggle('selected');
}

function editRow(button) {
    // Implement edit row functionality
    const row = button.closest('tr');
    const cells = row.cells;

    // Save the current values before making the row editable
    const originalValues = {
        name: cells[1].innerText,
        email: cells[2].innerText,
        role: cells[3].innerText
    };

    // Replace the row content with input fields
    cells[1].innerHTML = `<input type="text" value="${originalValues.name}" id="editName">`;
    cells[2].innerHTML = `<input type="email" value="${originalValues.email}" id="editEmail">`;
    cells[3].innerHTML = `<input type="text" value="${originalValues.role}" id="editRole">`;

    // Replace the "Edit" button with "Save" and "Cancel" buttons
    cells[4].innerHTML = `
        <button class="save" onclick="saveEdit(this)">Save changes</button>
    `;
}

function saveEdit(button) {
    const row = button.closest('tr');
    const cells = row.cells;

    // Get the updated values from the input fields
    const newName = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;
    const newRole = document.getElementById('editRole').value;

    // Update the row with the new values
    cells[1].innerText = newName;
    cells[2].innerText = newEmail;
    cells[3].innerText = newRole;

    // Restore the "Edit" button
    cells[4].innerHTML = `
        <button class="edit" onclick="editRow(this)">Edit</button>
        <button class="delete" onclick="deleteRow(this)">Delete</button>
    `;
}


function deleteRow(button) {
    const row = button.closest('tr');
    const userId = row.querySelector('td:nth-child(2)').innerText; // Assuming the ID is in the second column
    // Implement your delete logic using the userId

    const userIndex = userData.findIndex(user => user.name === userId);

    if (userIndex !== -1) {
        // Remove the user from the userData array
        userData.splice(userIndex, 1);

        // Rebuild the table with the updated data
        buildTable(userData);
    }
    row.remove(); // Remove the row from the table
}


function nextPage() {
    // Implement next page functionality
    currentPage++;
    buildTable(userData);

}

function prevPage() {
    // Implement previous page functionality
    currentPage = Math.max(currentPage - 1, 1);
    buildTable(userData);
}

function gotoPage(page) {
    // Implement go to page functionality
    currentPage = page;
    buildTable(userData);

}

function updatePagination() {
    const totalPages = Math.ceil(userData.length / usersPerPage);
    const paginationContainer = document.querySelector('.pagination');

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button onclick="gotoPage(${i})">${i}</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}


function deleteSelected() {
    // Implement delete selected functionality
    const checkboxes = document.querySelectorAll('.select-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const userId = row.querySelector('td:nth-child(2)').innerText; // Assuming the ID is in the second column
        // Implement your delete logic using the userId
        row.remove(); // Remove the row from the table
    });
}
