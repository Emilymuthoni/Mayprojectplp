document.addEventListener('DOMContentLoaded', function() {
    // Handle form submissions with JavaScript
    const paymentForm = document.getElementById('payment-form');
    const loanForm = document.getElementById('loan-form');

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(paymentForm);
            fetch('/submit_payment', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(text => alert(text))
            .catch(error => console.error('Error:', error));
        });
    }

    if (loanForm) {
        loanForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(loanForm);
            fetch('/submit_loan', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(text => alert(text))
            .catch(error => console.error('Error:', error));
        });
    }
});
