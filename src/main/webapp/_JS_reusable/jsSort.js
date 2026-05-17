"use strict";

function jsSort(list, propName, sortType) {

    list.sort(function (a, b) {

        let valA = a[propName];
        let valB = b[propName];

        // null / empty values go to top
        if (valA === null || valA === undefined || valA === "") {
            if (valB === null || valB === undefined || valB === "") {
                return 0;
            }
            return -1;
        }
        if (valB === null || valB === undefined || valB === "") {
            return 1;
        }

        if (sortType === "text") {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
            if (valA < valB) {
                return -1;
            }
            if (valA > valB) {
                return 1;
            }
            return 0;
        }

        if (sortType === "number") {
            valA = valA.toString().replace(/[$,]/g, "");
            valB = valB.toString().replace(/[$,]/g, "");
            valA = Number(valA);
            valB = Number(valB);
            return valA - valB;
        }

        if (sortType === "date") {
            let partsA = valA.split("/");
            let partsB = valB.split("/");

            let dateA = new Date(partsA[2], partsA[0] - 1, partsA[1]);
            let dateB = new Date(partsB[2], partsB[0] - 1, partsB[1]);

            return dateA - dateB;
        }

        return 0;
    });
}