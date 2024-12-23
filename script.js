


let postalpincode = [];

const pinInputs = document.querySelectorAll('.pin-input-container .pin-input');
const hiddenPinInputs = document.querySelectorAll('.pin-input-container-hidden .pin-input');
const submitBtn = document.getElementById('submitBtn');
const pinStatus = document.querySelector('.pin_status')
const page1 = document.querySelector('.page1');
const page2 = document.querySelector('.page2');
const page2Success = document.querySelector('.success');
const disSts = document.querySelector('.status')
const noPin = document.querySelector('.noPin')

function moveFocus(inputs, index) {
    const currentInput = inputs[index];
    if (currentInput.value.length === 1) {
        const nextInput = inputs[index + 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
}

function validateInput(input) {
    if (input.value.length > 1) {
        input.value = input.value.slice(0, 1); // Keep only the first character
    }
}


pinInputs.forEach((input, index) => {
    input.setAttribute('maxlength', '1');
    input.addEventListener('input', () => {
        validateInput(input);
        moveFocus(pinInputs, index);
        checkPinMatch();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '') {
            const previousInput = pinInputs[index - 1];
            if (previousInput) {
                previousInput.focus();
            }
        }
    });
});

hiddenPinInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        moveFocus(hiddenPinInputs, index);
        checkPinMatch();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '') {
            const previousInput = hiddenPinInputs[index - 1];
            if (previousInput) {
                previousInput.focus();
            }
        }
    });

});


function checkPinMatch() {
    const pin = Array.from(pinInputs).map(input => input.value).join('');
    const hiddenPin = Array.from(hiddenPinInputs).map(input => input.value).join('');

    if (pin.length === 6 && hiddenPin.length === 6) {
        if (pin === hiddenPin) {
            pinStatus.innerHTML = 'Your PIN codes are the same';
            pinStatus.style.color = 'green';
        } else {
            pinStatus.innerHTML = 'PINs do not match!';
            pinStatus.style.color = 'red';
        }
    } else {
        pinStatus.innerHTML = '';
    }
}



async function fetchPinDetails(pin) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();
        renderDetails(data) ;
    } catch (error) {
        console.log(error);
    }
    
};

function renderDetails(pincodes) {
    page2Success.innerHTML = '';

    pincodes.forEach(ele => {
        if (ele.Status === "Success" && ele.PostOffice) {
            disSts.innerHTML = `<h2>${ele.Status}<h3>`;
            const postOffice = ele.PostOffice[0];
            page2Success.innerHTML += `
                <p>Status: ${ele.Status}</p>
                <p>Name: ${postOffice.Name}</p>
                <p>Division: ${postOffice.Division}</p>
                <p>Pincode: ${postOffice.Pincode}</p>
                <p>Region: ${postOffice.Region}</p>
                <p>State: ${postOffice.State}</p>
                <p>Block: ${postOffice.Block}</p>
            `;
        } else {
            disSts.innerHTML += `
            <h2>Status: ${ele.Status}<h3>
            <p>No data found for the provided pincode.</p>`;
        }
    });
}



submitBtn.addEventListener('click', (e) => {

    const pin = Array.from(pinInputs).map(input => input.value).join('');

    if (pin.length === 6) {
        console.log("PINs match! Fetching details...");
        fetchPinDetails(pin);

        page1.classList.add('hidden');
        page2.classList.remove('hidden');
        page2.classList.add('fade-in');

    } else {
        noPin.innerHTML = 'Please Enter pin code';
        console.log("Please Enter pin code");
    }


});


