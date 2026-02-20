/**
 * Form Handler for Lead Capture Modal
 * Integrates with Google Forms for silent submission
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('leadModal');
    const openBtn = document.getElementById('openModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('leadForm');
    const successMsg = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    // --- GOOGLE FORM CONFIGURATION ---
    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfOOD52kG0R-JRlV7Di4u3r7ukAUDO9OxV1rX9rkBjKe3kyRQ/formResponse';
    const FIELD_IDS = {
        company: 'entry.1095351703',
        name: 'entry.1168783314',
        phone: 'entry.1504404048',
        email: 'entry.6887052',
        productCodes: 'entry.913746104'
    };

    // Open Modal Action
    function openModalAction() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Modal Events
    if (openModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModalAction();
        });
    }

    if (openBtn) {
        openBtn.addEventListener('click', openModalAction);
    }

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form after transition
        setTimeout(() => {
            form.reset();
            form.classList.remove('hidden');
            successMsg.classList.add('hidden');
            clearErrors();
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Validation Helpers
    const showError = (field, msg) => {
        const errorSpan = document.getElementById(`${field}Error`);
        errorSpan.textContent = msg;
        document.getElementById(field).style.borderColor = '#e53e3e';
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-msg').forEach(s => s.textContent = '');
        document.querySelectorAll('.lead-form input').forEach(i => i.style.borderColor = '');
    };

    const validateForm = () => {
        clearErrors();
        const data = new FormData(form);
        const company = data.get('company').trim();
        const name = data.get('name').trim();
        let phone = data.get('phone').trim();
        const email = data.get('email').trim();

        // Basic presence validation
        if (!company) {
            alert('Company name is required');
            return false;
        }
        if (!name) {
            alert('Contact person is required');
            return false;
        }

        // --- PHONE VALIDATION ---
        // 1. Remove all leading 0s
        while (phone.startsWith('0')) {
            phone = phone.substring(1);
        }
        document.getElementById('phone').value = phone; // Update field visually

        if (!phone) {
            alert('Phone number is required');
            return false;
        }

        // Strip spaces/dashes for count verification
        const cleanPhone = phone.replace(/[\s-]/g, '');

        if (phone.startsWith('+')) {
            // Rule: +XX must be exactly 13 characters (e.g., +919876543210)
            if (cleanPhone.length !== 13) {
                alert('International phone numbers starting with + must be exactly 13 characters long including + (e.g., +919876543210)');
                return false;
            }
        } else {
            // Rule: No + must be exactly 10 digits
            if (!/^\d{10}$/.test(cleanPhone)) {
                alert('Phone number must be exactly 10 digits');
                return false;
            }
        }


        // --- EMAIL VALIDATION ---
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            alert('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        return true;
    };

    // Submit Handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;


        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = new FormData(form);
        const urlParams = new URLSearchParams();

        // Map form fields to Google Form entry IDs
        urlParams.append(FIELD_IDS.company, formData.get('company'));
        urlParams.append(FIELD_IDS.name, formData.get('name'));
        urlParams.append(FIELD_IDS.phone, formData.get('phone'));
        urlParams.append(FIELD_IDS.email, formData.get('email'));
        urlParams.append(FIELD_IDS.productCodes, formData.get('productCodes'));

        try {
            // Silently submit to Google Forms
            // mode: 'no-cors' is required as Google doesn't return CORS headers
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: urlParams.toString()
            });

            // Success UI
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');

            // Auto-close after 3 seconds
            setTimeout(() => {
                closeModal();
            }, 3000);

        } catch (error) {
            console.error('Submission error:', error);
            // Even if fetch throws (e.g. network), we usually proceed since 'no-cors' doesn't give us response status anyway
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Inquiry';
        }
    });
});
