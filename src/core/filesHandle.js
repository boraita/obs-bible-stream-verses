
function getBibleData() {
    const input = document.getElementById('bible-version').value;
    switch (input) {
        case 'rvr':
            return rvrBible;
        case 'kadosh':
            return kadoshBible;
        default:
            return rvrBible;
    }
}