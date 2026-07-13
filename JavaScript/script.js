// Waiting for the paynent form to get submitted
document.getElementById("paymentForm").addEventListener("submit", function(e) {
    e.preventDefault();
    // Stores values entered by the person
    let card = document.getElementById("cardNumber").value;
    let month = document.getElementById("expMonth").value;
    let year = document.getElementById("expYear").value;
    let cvv = document.getElementById("cvv").value;

    let error = document.getElementById("error");

    //Regex
    // Must start with numbers between 51-55 and contain 16 digits
    let cardRegex = /^(51|52|53|54|55)\d{14}$/;
    // Must contain 3-4 digits
    let cvvRegex = /^\d{3,4}$/;

    
    // Checks if card number is valid
    if (!cardRegex.test(card)) {
        error.innerText = "Invalid Mastercard number";
        return;
    }
    // Checks if cvv is valid
    if (!cvvRegex.test(cvv)) {
        error.innerText = "Invalid CVV";
        return;
    }
    // Gets current date
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    //Check if card is expired
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
        error.innerText = "Card expired";
        return;
    }
    //Sends the payment details to the server using POST request
    fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },
        //Convert javascript to json format
        body: JSON.stringify({

            master_card: Number(card),
            exp_year: Number(year),
            exp_month: Number(month),
            cvv_code: cvv
        })

    })

    .then(res => res.json())
    //Runs if payment is successful
    .then(data => {
        //Store last 4 digit of card no
        sessionStorage.setItem("last4", card.slice(-4));
        //Sends to success page
        window.location.href = "success.html";

    })

    .catch(() => {
        //Displays error message
        error.innerText = "Payment failed";

    });
})