
// const postalpincode = [];
// const div = document.querySelector('.container');
// fetch('https://api.postalpincode.in/pincode/226001')
// .then(res => res.json())
// .then(data => {
//    postalpincode = data[0].PostOffice;
//    renderPincode(postalpincode)

// })
// .catch(error => console.log(error))

// function renderPincode(pincodes){
//    div.innerHTML = '';

//    pincodes.forEach(pincode => {
//     div.innerHTML += `
//      <p>${pincode.Pincode}</p>
//     `
//    });
// }



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

pinInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
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
        renderDetails(data) 
        if (data[0].Status === "Success" && data[0].PostOffice) {
            disSts.textContent = "Success";
        } else {
            disSts.textContent = "PinCode not found";
        }
    } catch (error) {
        console.log(error)
    }
    
};

function renderDetails(pincodes){
    page2Success.innerHTML = '';
    
      pincodes.forEach(ele => {
        page2Success.innerHTML += `
        <p>Status: ${ele.Status}</p>
        <p>Name: ${ele.PostOffice[0].Name}</p>
        <p>Division: ${ele.PostOffice[0].Division}</p>
        <p>Pincode: ${ele.PostOffice[0].Pincode}</p>
        <p>Region: ${ele.PostOffice[0].Region}</p>
        <p>State: ${ele.PostOffice[0].State}</p>
        <p>Block: ${ele.PostOffice[0].Block}</p>

        `
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


