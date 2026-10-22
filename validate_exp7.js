// Experiment 7: validate E-mail and Phone Number
function validateEmail() {
  var email = document.getElementById('email').value.trim();
  var err = document.getElementById('emailErr');
  var pattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
  if (!pattern.test(email)) { err.textContent = 'Enter a valid e-mail like name@domain.com.'; return false; }
  err.textContent = ''; return true;
}
function validatePhone() {
  var phone = document.getElementById('phone').value.trim();
  var err = document.getElementById('phoneErr');
  if (!/^[0-9]{10}$/.test(phone)) { err.textContent = 'Phone number must contain exactly 10 digits.'; return false; }
  err.textContent = ''; return true;
}
