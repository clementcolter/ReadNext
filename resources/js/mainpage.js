function mainpageNav(event){
    event.preventDefault();

    // Navigate to the specified href
    window.location.href = event.target.getAttribute('href');
}