document.addEventListener('DOMContentLoaded', () => {
    const loadCustomersButton = document.getElementById('load-customers');
    const loadLoansButton = document.getElementById('load-loans');
    const loadPaymentsButton = document.getElementById('load-payments');

    const customerList = document.getElementById('customer-list');
    const loanList = document.getElementById('loan-list');
    const paymentList = document.getElementById('payment-list');

    loadCustomersButton.addEventListener('click', () => {
        fetch('/admin/customers')
            .then(response => response.json())
            .then(data => {
                customerList.innerHTML = '<h3>Customers</h3><ul>' + data.map(customer => 
                    `<li>${customer.name} - ${customer.id_number}</li>`
                ).join('') + '</ul>';
            })
            .catch(error => console.error('Error fetching customers:', error));
    });

    loadLoansButton.addEventListener('click', () => {
        fetch('/admin/loans')
            .then(response => response.json())
            .then(data => {
                loanList.innerHTML = '<h3>Loans</h3><ul>' + data.map(loan => 
                    `<li>Loan ID: ${loan.id}, Amount: ${loan.loan_amount}</li>`
                ).join('') + '</ul>';
            })
            .catch(error => console.error('Error fetching loans:', error));
    });

    loadPaymentsButton.addEventListener('click', () => {
        fetch('/admin/payments')
            .then(response => response.json())
            .then(data => {
                paymentList.innerHTML = '<h3>Payments</h3><ul>' + data.map(payment => 
                    `<li>Payment ID: ${payment.id}, Amount: ${payment.amount}</li>`
                ).join('') + '</ul>';
            })
            .catch(error => console.error('Error fetching payments:', error));
    });
});
