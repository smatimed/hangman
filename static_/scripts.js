colorDifficulty();

function colorDifficulty() {
    let elementSelect = document.getElementById('difficulty');
    let elementColor = document.getElementById('difficulty-color');
    let elementHint = document.getElementById('hint');

    if (elementSelect.value == 'H') {
        elementColor.style.backgroundColor = "red";
        // console.log('elementHint.value=',elementHint.value, (elementHint.value == ''));
        if (elementHint.value == '') {elementHint.value = '*';};
        // console.log('remove required');
    } else {
        if (elementSelect.value == 'N') {
            elementColor.style.backgroundColor = "orange";
        } else {
            elementColor.style.backgroundColor = "green";
        };
        // elementHint.setAttribute('required','true');
        // console.log('set required');
    };
};

function premiereLettreMajuscule(element) {
    element.value = element.value.charAt(0).toUpperCase() + element.value.slice(1);
}