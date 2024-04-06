
function getBibleData() {
    const input = document.getElementById('bible-version').value;
    console.log("setting bible data", input);
    switch (input) {
        default:
            return rvrBible;
    }
}