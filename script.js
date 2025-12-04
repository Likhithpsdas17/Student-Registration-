

// Implement functionality and local storage

const form = document.getElementById('student-form');
const studentListBody = document.getElementById('student-list');
const nameInput = document.getElementById('student-name');
const idInput = document.getElementById('student-id');
const emailInput = document.getElementById('student-email');
const contactInput = document.getElementById('student-contact');
const submitButton = document.getElementById('submit-button');
const recordTableWrapper = document.getElementById('record-table-wrapper');

let students = [];
let isEditing = false;
let currentEditId = null;

function validateName(name) {
    // Student name accepts only characters (including spaces and hyphens)
    const nameValue = /^[A-Za-z\s-]+$/;
    return nameValue.test(name) && name.trim() !== '';
}

function validateID(id) {
    // Student ID accepts only numbers
    const idValue = /^[0-9]+$/;
    return idValue.test(id) && id.trim() !== '';
}

function validateEmail(email) {
    // Accepts only valid email addresses
    const emailValue = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailValue.test(email) && email.trim() !== '';
}

function validateContact(contact) {
    // Contact number accepts only numbers and at least 10 digits
    const contactValue = /^[0-9]{10,}$/;
    return contactValue.test(contact) && contact.trim() !== '';
}

function setInputError(inputElement, errorElement, message) {
    errorElement.textContent = message;
    inputElement.classList.add('input-error');
}

function clearInputError(inputElement, errorElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('input-error');
}

function validateForm() {
    let isValid = true;
    
    if (!validateName(nameInput.value)) {
        setInputError(nameInput, document.getElementById('name-error'), 'Name must contain only characters.');
        isValid = false;
    } else {
        clearInputError(nameInput, document.getElementById('name-error'));
    }


    if (!validateID(idInput.value)) {
        setInputError(idInput, document.getElementById('id-error'), 'Student ID must contain only numbers.');
        isValid = false;
    } else {
        clearInputError(idInput, document.getElementById('id-error'));
    }

  
    if (!validateEmail(emailInput.value)) {
        setInputError(emailInput, document.getElementById('email-error'), 'Please enter a valid email address.');
        isValid = false;
    } else {
        clearInputError(emailInput, document.getElementById('email-error'));
    }


    if (!validateContact(contactInput.value)) {
        setInputError(contactInput, document.getElementById('contact-error'), 'Contact number must be at least 10 digits and contain only numbers.');
        isValid = false;
    } else {
        clearInputError(contactInput, document.getElementById('contact-error'));
    }
    
    
    if (nameInput.value.trim() === '' || idInput.value.trim() === '' || emailInput.value.trim() === '' || contactInput.value.trim() === '') {
        isValid = false;
    }

    return isValid;
}



function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudents() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
}


function renderStudents() {
    studentListBody.innerHTML = ''; 

    if (students.length === 0) {
        studentListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No student records found.</td></tr>';
    } else {
        students.forEach((student, index) => {
            const row = studentListBody.insertRow();
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
        });
    }
    

    if (studentListBody.scrollHeight > recordTableWrapper.clientHeight) {
         recordTableWrapper.classList.add('dynamic-scroll');
    } else {
         recordTableWrapper.classList.remove('dynamic-scroll');
    }
}


// Handle Add/Edit Submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        alert('Please fix the validation errors before submitting.');
        return;
    }

    const newStudent = {
        name: nameInput.value.trim(),
        id: idInput.value.trim(),
        email: emailInput.value.trim(),
        contact: contactInput.value.trim()
    };
    
    if (isEditing) {
        students[currentEditId] = newStudent;
        isEditing = false;
        currentEditId = null;
        submitButton.textContent = 'Add Record';
    } else {

        students.push(newStudent);
    }
    
    saveStudents();
    renderStudents();
    form.reset(); 
});


studentListBody.addEventListener('click', function(e) {
    const index = e.target.getAttribute('data-index');
    
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this record?')) {
            students.splice(index, 1);
            saveStudents();
            renderStudents();
        }
        
    } else if (e.target.classList.contains('edit-btn')) {
        const studentToEdit = students[index];
        

        nameInput.value = studentToEdit.name;
        idInput.value = studentToEdit.id;
        emailInput.value = studentToEdit.email;
        contactInput.value = studentToEdit.contact;
        
     
        isEditing = true;
        currentEditId = index;
        submitButton.textContent = 'Save Changes';
        
       
        nameInput.focus();
    }
});
loadStudents();
renderStudents();