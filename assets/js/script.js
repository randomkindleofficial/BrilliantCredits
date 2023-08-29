
function convertMillisecondsToDate(milliseconds) {
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate;
}



function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Use 'auto' for instant scrolling without animation
    });
}
scrollToTop()