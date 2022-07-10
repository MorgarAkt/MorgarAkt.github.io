function preventScroll(e){
    e.preventDefault();
    e.stopPropagation();

    return false;
}

preventScroll