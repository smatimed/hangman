colorDifficulty();

function colorDifficulty() {
    let elementSelect = document.getElementById('difficulty');
    let elementColor = document.getElementById('difficulty-color');
    if (elementSelect.value == 'H') {
        elementColor.style.backgroundColor = "red";
    } else {
        if (elementSelect.value == 'N') {
            elementColor.style.backgroundColor = "orange";
        } else {
            elementColor.style.backgroundColor = "green";
        };
    };
};

function premiereLettreMajuscule(element) {
    element.value = element.value.charAt(0).toUpperCase() + element.value.slice(1);
}