document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    const response = await fetch('/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    if (response.ok) {
        alert('Verification code sent to your email');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('verifyForm').style.display = 'block';
    }
});

document.getElementById('verifyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Code verified! Proceed to payment.');
});