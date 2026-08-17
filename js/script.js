// ==========================================
// 1. DATA STRUCTURES & INTERACTIVE FEATURE
// ==========================================

// Array of objects representing the subject choices
const supportCategories = [
    { id: 'services', label: 'Services', description: 'Exploring tailored service packages and options.' },
    { id: 'general', label: 'General Question', description: 'General inquiries about background, hours, or operations.' },
    { id: 'support', label: 'Customer Support', description: 'Technical assistance or help with an active issue.' },
    { id: 'other', label: 'Other', description: 'Custom proposals or alternative inquiries.' }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorageMemory();
    setupInteractiveFeature();
    setupFormValidation();
});

// Interactive Feature: Responds to user selection, updates page dynamically, and saves via localStorage
function setupInteractiveFeature() {
    const subjectDropdown = document.getElementById('subject');
    if (!subjectDropdown) return;

    // Create a dynamic display container below the dropdown
    let dynamicDisplay = document.getElementById('subject-description-box');
    if (!dynamicDisplay) {
        dynamicDisplay = document.createElement('p');
        dynamicDisplay.id = 'subject-description-box';
        dynamicDisplay.style.fontSize = '0.9rem';
        dynamicDisplay.style.color = '#333';
        dynamicDisplay.style.marginTop = '6px';
        subjectDropdown.parentNode.appendChild(dynamicDisplay);
    }

    subjectDropdown.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        const matchedCategory = supportCategories.find(cat => cat.id === selectedValue);

        if (matchedCategory) {
            dynamicDisplay.textContent = `Focus Details: ${matchedCategory.description}`;
            // Save data using localStorage (Client-Side Storage requirement)
            localStorage.setItem('preferredSubject', selectedValue);
        } else {
            dynamicDisplay.textContent = '';
            localStorage.removeItem('preferredSubject');
        }
    });
}

// Load stored data when the page opens to improve user experience
function initializeLocalStorageMemory() {
    const subjectDropdown = document.getElementById('subject');
    const savedSubject = localStorage.getItem('preferredSubject');

    if (savedSubject && subjectDropdown) {
        subjectDropdown.value = savedSubject;
        // Trigger the change event programmatically to populate the description box
        subjectDropdown.dispatchEvent(new Event('change'));
    }
}


// ==========================================
// 2. FORM VALIDATION & ERROR HANDLING
// ==========================================

function setupFormValidation() {
    const contactForm = document.querySelector('form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
        let isFormValid = true;

        // Clear any old error notifications before checking
        clearExistingErrors();

        // Check 1: Required Field Validation (First Name)
        const firstNameInput = document.getElementById('first-name');
        if (firstNameInput && firstNameInput.value.trim() === '') {
            displayFieldError(firstNameInput, 'First name is a required field.');
            isFormValid = false;
        }

        // Check 2: Email Format Validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            const emailValue = emailInput.value.trim();
            const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailValue === '') {
                displayFieldError(emailInput, 'Email address is required.');
                isFormValid = false;
            } else if (!emailRegexPattern.test(emailValue)) {
                displayFieldError(emailInput, 'Please provide a valid email format (e.g., name@domain.com).');
                isFormValid = false;
            }
        }

        // Check 3: Minimum Length Check (Message field)
        const messageInput = document.getElementById('message');
        if (messageInput && messageInput.value.trim().length < 10) {
            displayFieldError(messageInput, 'Your message must contain at least 10 characters.');
            isFormValid = false;
        }

        // Prevent final submission if any validation check fails
        if (!isFormValid) {
            event.preventDefault();
        }
    });
}

// Helper function to display clear feedback near the problematic field
function displayFieldError(inputElement, errorMessage) {
    inputElement.style.borderColor = 'red';

    const errorNotification = document.createElement('span');
    errorNotification.className = 'js-inline-error';
    errorNotification.style.color = 'red';
    errorNotification.style.fontSize = '0.85rem';
    errorNotification.style.display = 'block';
    errorNotification.style.marginTop = '4px';
    errorNotification.textContent = errorMessage;

    // Append error message right under the input field's paragraph container
    inputElement.parentNode.appendChild(errorNotification);
}

// Helper function to wipe out old errors and reset borders
function clearExistingErrors() {
    const errorElements = document.querySelectorAll('.js-inline-error');
    errorElements.forEach(el => el.remove());

    const allFormFields = document.querySelectorAll('input, select, textarea');
    allFormFields.forEach(field => {
        field.style.borderColor = '';
    });
}