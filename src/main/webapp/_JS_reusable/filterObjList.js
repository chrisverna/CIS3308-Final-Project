"use strict";

function filterObjList(objList, userInput) {

    let searchVal = userInput.trim().toLowerCase();

    if (searchVal.length === 0) {
        return JSON.parse(JSON.stringify(objList));
    }

    let newList = objList.filter(function (obj) {

        for (let prop in obj) {

            if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
                continue;
            }

            // ignore image fields when filtering
            let propLower = prop.toLowerCase();
            if (propLower.includes("image")) {
                continue;
            }

            let val = obj[prop];

            if (val === null || val === undefined) {
                continue;
            }

            let valStr = val.toString().toLowerCase();

            if (valStr.indexOf(searchVal) > -1) {
                return true;
            }
        }

        return false;
    });

    return newList;
}