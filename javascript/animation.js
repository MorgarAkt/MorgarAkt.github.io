var skillBars = document.getElementsByClassName("langName");
console.log(skillBars);
console.log(skillBars[0].style.width);

function naber() {
    skillBars[0].animate(resizeAnime("23vw"), timing);
    skillBars[1].animate(resizeAnime("17vw"), timing);
    skillBars[2].animate(resizeAnime("10vw"), timing);
    skillBars[3].animate(resizeAnime("14vw"), timing);
    skillBars[4].animate(resizeAnime("16vw"), timing);

    skillBars[5].animate(resizeAnime("23vw"), timing);
    skillBars[6].animate(resizeAnime("17vw"), timing);
    skillBars[7].animate(resizeAnime("10vw"), timing);
    skillBars[8].animate(resizeAnime("14vw"), timing);
    skillBars[9].animate(resizeAnime("16vw"), timing);
    setTimeout(function () {
        skillBars[0].style.width = "23vw";
        skillBars[1].style.width = "17vw";
        skillBars[2].style.width = "10vw";
        skillBars[3].style.width = "14vw";
        skillBars[4].style.width = "16vw";

        skillBars[5].style.width = "23vw";
        skillBars[6].style.width = "17vw";
        skillBars[7].style.width = "10vw";
        skillBars[8].style.width = "14vw";
        skillBars[9].style.width = "16vw";
    }, 1600);
}

function resizeAnime(size) {
    return { width: size };
}

const timing = {
    duration: 1600,
    iterations: 1,
};
