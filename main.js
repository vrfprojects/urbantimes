document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form-content');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitContactForm();
    });
  }
});

function clearValidationErrors() {
  document.getElementById('global-error').style.display = 'none';
  document.getElementById('global-error').innerHTML = ''; // Clear prev error text
  
  // Reset input border colors
  const fields = ['name', 'email', 'phone', 'province', 'message'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.borderColor = 'var(--color-border)';
  });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.style.borderColor = '#d9534f';
  }
  showError(msg); 
}

function showError(msg) {
  const errDiv = document.getElementById('global-error');
  errDiv.style.display = 'block';
  errDiv.innerHTML += `<div>${msg}</div>`;
}

async function submitContactForm() {
  clearValidationErrors();

  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var province = document.getElementById('province').value;
  var message = document.getElementById('message').value.trim();
  var hasError = false;

  if (!name) { showFieldError('name', 'Please enter your full name.'); hasError = true; }
  if (!email) { showFieldError('email', 'Please enter your email address.'); hasError = true; }
  if (!phone) { showFieldError('phone', 'Please enter your phone number.'); hasError = true; }
  if (!province) { showFieldError('province', 'Please select a province.'); hasError = true; }
  if (!message) { showFieldError('message', 'Please enter your message.'); hasError = true; }

  var emailPattern = /^\S+@\S+\.\S+$/;
  if (email && !emailPattern.test(email)) {
    showFieldError('email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (hasError) {
    document.getElementById('contact-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Append province to the message since the API expects an exact payload schema
  const fullMessage = `Province: ${province}\n\nMessage:\n${message}`;

  var url = 'https://ex.bakerly.co.za/api/Contact';
  var data = {
    name: name,
    emailAddress: email,
    phoneNumber: phone,
    subject: 'UrbanTimes Website Lead',
    message: fullMessage
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(data)
    });

    var responseBody = await response.text();
    if (response.status !== 200) {
      var bodyText = responseBody && responseBody.trim() ? responseBody : '[empty response body]';
      throw new Error('Status ' + response.status + ': ' + bodyText);
    }
    
    // Smooth transition to Success State UI
    document.getElementById('contact-success-name').textContent = name;
    document.getElementById('contact-form-content').style.display = 'none';
    document.getElementById('contact-success-msg').style.display = 'block';
    document.getElementById('contact-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (error) {
    var errorText = error && error.message ? error.message : String(error);
    clearValidationErrors(); 
    showError('An error occurred: ' + errorText + '. Please send an email to kverma@outlook.com.');
    console.error('Contact form submission error:', error);
  } finally {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
}
