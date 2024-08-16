// scripts.js

document.addEventListener("DOMContentLoaded", function() {

    // Validate Loan Application Form
    const loanForm = document.querySelector('form[action="submit_loan.html"]');
    if (loanForm) {
        loanForm.addEventListener('submit', function(event) {
            const name = document.getElementById('name').value.trim();
            const cows = document.getElementById('cows').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const county = document.getElementById('county').value.trim();

            if (!name || !cows || !phone || !county) {
                alert("Please fill in all fields before submitting the form.");
                event.preventDefault();
            }
        });
    }

    // Validate Payment Form
    const paymentForm = document.querySelector('form[action="submit_payment.html"]');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            const name = document.getElementById('name').value.trim();
            const amount = document.getElementById('amount').value.trim();
            const card = document.getElementById('card').value.trim();
            const expiry = document.getElementById('expiry').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!name || !amount || !card || !expiry || !cvv) {
                alert("Please fill in all fields before submitting the form.");
                event.preventDefault();
            } else if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                event.preventDefault();
            } else if (isNaN(card) || card.length !== 16) {
                alert("Please enter a valid 16-digit card number.");
                event.preventDefault();
            } else if (isNaN(cvv) || cvv.length !== 3) {
                alert("Please enter a valid 3-digit CVV.");
                event.preventDefault();
            }
        });
    }
});
