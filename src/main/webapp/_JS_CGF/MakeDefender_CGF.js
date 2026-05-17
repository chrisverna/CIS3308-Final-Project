"use strict";

function MakeDefender_CGF() {

    let container = document.createElement("div");
    container.classList.add("defenderContainer");

    container.appendChild(MakeDefender({
        name: "Brandon Graham",
        position: "Defensive End",
        sacks: 73,
        tackles: 350,
        interceptions: 1,
        imgUrl: "https://static.clubs.nfl.com/image/upload/t_editorial_landscape_6_desktop_2x/f_png/eagles/i9jwezzqh0bsgeo7ouby.png"
    }));

    container.appendChild(MakeDefender({
        name: "Darius Slay",
        position: "Cornerback",
        sacks: 3,
        tackles: 500,
        interceptions: 28,
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Darius_Slay_On_January_1_2017_%28cropped%29.jpg/500px-Darius_Slay_On_January_1_2017_%28cropped%29.jpg"
    }));

    container.appendChild(MakeDefender({}));

    return container;
}