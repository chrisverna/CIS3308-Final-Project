"use strict";

function MakeDefender({
    name = "Unknown Player",
    position = "Unknown Position",
    sacks = 0,
    tackles = 0,
    interceptions = 0,
    imgUrl = ""
}) {

    let defenderObj = {
        name: name,
        position: position,
        sacks: Number(sacks),
        tackles: Number(tackles),
        interceptions: Number(interceptions),
        imgUrl: imgUrl
    };

    let defenderDiv = document.createElement("div");
    defenderDiv.classList.add("defender");

    function display() {
        defenderDiv.innerHTML = `
            <img src="${defenderObj.imgUrl}" />
            <h2>${defenderObj.name}</h2>
            <p>Position: ${defenderObj.position}</p>
            <p>Total Sacks: ${defenderObj.sacks}</p>
            <p>Total Tackles: ${defenderObj.tackles}</p>
            <p>Total Interceptions: ${defenderObj.interceptions}</p>

            <p class="defenderInstructions">
                Enter a number to ADD to total tackles.
            </p>

            <input class="tackleInput" type="text" />
            <button class="tackleBtn">Add Tackles</button>
            <div class="errorMsg"></div>

            <p class="defenderInstructions">
                Change position using dropdown (event-based modifier).
            </p>

            <select class="positionSelect">
                <option value="Defensive End">Defensive End</option>
                <option value="Linebacker">Linebacker</option>
                <option value="Cornerback">Cornerback</option>
                <option value="Safety">Safety</option>
            </select>
        `;

        let tackleBtn = defenderDiv.getElementsByClassName("tackleBtn")[0];
        let tackleInput = defenderDiv.getElementsByClassName("tackleInput")[0];
        let errorMsg = defenderDiv.getElementsByClassName("errorMsg")[0];
        let positionSelect = defenderDiv.getElementsByClassName("positionSelect")[0];

        tackleBtn.onclick = function () {
            let val = Number(tackleInput.value);

            if (isNaN(val)) {
                errorMsg.innerHTML = "Error: Please enter a valid number.";
            } else {
                defenderObj.tackles += val;
                errorMsg.innerHTML = "";
                display();
            }
        };

        positionSelect.onchange = function () {
            defenderObj.position = positionSelect.value;
            display();
        };
    }

    display();

    return defenderDiv;
}