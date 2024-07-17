'use strict';
const formContainer = document.querySelector('.details');
const form = document.querySelector('.form');
const inputName = document.querySelector('.form__input-name');
const inputNumber = document.querySelector('.form__input-number');
const inputMonth = document.querySelector('.form__input-month');
const inputYear = document.querySelector('.form__input-year');
const inputCvc = document.querySelector('.form__input-cvc');
const successBtn = document.querySelector('.success__btn');
const successMessage = document.querySelector('.success');
/////////////////////////////////////

const selectInputLabelErr = input =>
    input.closest('.form__control').querySelector('.form__label--error');

form.addEventListener('input', e => {
    const input = e.target;
    // Remove input error state
    selectInputLabelErr(input).classList.add('hidden');
    input.classList.remove('form__input--error');

    const inputLabelCard = document.querySelector(`.${input.dataset.addTo}`);
    if (input === inputNumber) {
        // REGEX
        const formatRegex = /(\w{4})(?=\w)/g;
        const formattedInput = input.value
            .replace(formatRegex, '$1 ')
            .toUpperCase();
        input.value = formattedInput;
    }

    if (input === inputMonth || input === inputYear) {
        inputLabelCard.textContent = input.value.padStart(2, '0');
    } else {
        inputLabelCard.textContent = input.value;
    }

    if(!input.value) {
        inputLabelCard.textContent = inputLabelCard.dataset.default;
    }
});

form.addEventListener('submit', e => {
    e.preventDefault();
    ////////////// VALIDATE INPUTS ////////////////
    let validated = true;
    // Check for non-16 digit number for card number
    // REGEX
    const regex = /^\d{16}$/;
    if (!regex.test(inputNumber.value.replaceAll(' ', ''))) {
        const inputErrLabel = selectInputLabelErr(inputNumber);
        inputErrLabel.textContent = 'Wrong format, numbers only';
        inputErrLabel.classList.remove('hidden');
        inputNumber.classList.add('form__input--error');
        validated = false;
    }
    if (inputNumber.value.length < 19) {
        const inputErrLabel = selectInputLabelErr(inputNumber);
        inputErrLabel.textContent = 'Invalid number';
        inputErrLabel.classList.remove('hidden');
        inputNumber.classList.add('form__input--error');
        validated = false;
    }

    // Check for invalid exp date
    const currentYear = +`${new Date().getFullYear()}`.slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    if (
        +inputMonth.value > 12 ||
        +inputMonth.value < 1 ||
        !Number.isFinite(+inputMonth.value)
    ) {
        const inputErrLabel = selectInputLabelErr(inputMonth);
        inputErrLabel.textContent = 'Wrong format';
        inputErrLabel.classList.remove('hidden');
        inputMonth.classList.add('form__input--error');
        validated = false;
    }
    if (+inputYear.value < 1 || !Number.isFinite(+inputYear.value)) {
        const inputErrLabel = selectInputLabelErr(inputYear);
        inputErrLabel.textContent = 'Wrong format';
        inputErrLabel.classList.remove('hidden');
        inputYear.classList.add('form__input--error');
        validated = false;
    }
    if (+inputYear.value < currentYear) {
        const inputErrLabel = selectInputLabelErr(inputYear);
        inputErrLabel.textContent = 'Expired input date';
        inputErrLabel.classList.remove('hidden');
        inputYear.classList.add('form__input--error');
        validated = false;
    }
    if (+inputYear.value === currentYear && +inputMonth.value < currentMonth) {
        const inputErrLabel = selectInputLabelErr(inputMonth);
        inputErrLabel.textContent = 'Expired input date';
        inputErrLabel.classList.remove('hidden');
        inputMonth.classList.add('form__input--error');
        validated = false;
    }

    // Check for invalid cvc number
    if (inputCvc.value.length < 3 || !Number.isFinite(+inputCvc.value)) {
        const inputErrLabel = selectInputLabelErr(inputCvc);
        inputErrLabel.textContent = 'Must be a 3 digit number';
        inputErrLabel.classList.remove('hidden');
        inputCvc.classList.add('form__input--error');
        validated = false;
    }

    // Check for empty inputs
    Array.from(form.querySelectorAll('input')).forEach(input => {
        if (!input.value) {
            const inputErrLabel = selectInputLabelErr(input);
            inputErrLabel.textContent = "Can't be blank";
            inputErrLabel.classList.remove('hidden');
            input.classList.add('form__input--error');
            validated = false;
        }
    });

    if (!validated) return;
    form.classList.add('hidden');
    successMessage.classList.remove('hidden');
});

successBtn.addEventListener('click', () => location.reload());