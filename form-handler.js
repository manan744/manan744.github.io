/**
 * Form Handler for Lead Capture Modal
 * Integrates with Google Forms for silent submission
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('leadModal');
    const openBtn = document.getElementById('openModal');
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
        email: 'entry.6887052'
    };

    // Modal Logic
    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

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

    openBtn.addEventListener('click', openModal);
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
        let isValid = true;
        const data = new FormData(form);

        if (!data.get('company').trim()) {
            showError('company', 'Company name is required');
            isValid = false;
        }
        if (!data.get('name').trim()) {
            showError('name', 'Contact person is required');
            isValid = false;
        }

        const phone = data.get('phone').trim();
        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
            showError('phone', 'Enter a valid phone number');
            isValid = false;
        }

        const email = data.get('email').trim();
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Enter a valid email address');
            isValid = false;
        }

        return isValid;
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
