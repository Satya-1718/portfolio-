// Experiment 6: validate Name and Password
function validateName() {
  var name = document.getElementById('name').value.trim();
  var err = document.getElementById('nameErr');
  if (!/^[A-Za-z ]+$/.test(name)) { err.textContent = 'Name must contain alphabets only.'; return false; }
  if (name.length < 6) { err.textContent = 'Name must be at least 6 characters long.'; return false; }
  err.textContent = ''; return true;
}
function validatePassword() {
  var pw = document.getElementById('password').value;
  var err = document.getElementById('pwErr');
  if (pw.length < 6) { err.textContent = 'Password must be at least 6 characters long.'; return false; }
  err.textContent = ''; return true;
}
