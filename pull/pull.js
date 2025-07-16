/*
TODO: capturing radiance
*/

const CharProb = (pity) => pity <= 73 ? 0.006 : 0.006 + (1-0.006) * (pity-73) / (90-73);
const WeaponProb = (pity) => pity <= 62 ? 0.007 : 0.007 + (1-0.007) * (pity-62) / (80-62);

let WeaponCache = [];
let CharCache = [];
const Chance = (fates, charPity = 0, charGuarantee = false, charNeeded = 1, weaponPity = 0, weaponGuarantee = false, weaponNeeded = 1, _resetCache = true) => {
    // guarantees
    if (charNeeded <= 0 && weaponNeeded <= 0) {return 1;}
    if (fates < charNeeded + weaponNeeded) { return 0; }
    if (fates + (charNeeded ? charPity + charGuarantee * 90 : 0) + (weaponNeeded ? weaponPity + weaponGuarantee * 80 : 0) >= 180 * charNeeded + 160 * weaponNeeded) { return 1; }

    if (_resetCache) { CharCache = []; WeaponCache = []; }

    if (charNeeded) { // character banner
        // cache
        CharCache[+charGuarantee] ??= [];                                       
        CharCache[+charGuarantee][charNeeded] ??= [];
        CharCache[+charGuarantee][charNeeded][charPity] ??= [];
        if (CharCache[+charGuarantee][charNeeded][charPity][fates] != undefined) { return CharCache[+charGuarantee][charNeeded][charPity][fates]; }
        // recursive solving
        let prob = CharProb(charPity) * ( charGuarantee ? Chance(fates - 1, 0, false, charNeeded-1, weaponPity, weaponGuarantee, weaponNeeded, false)
                                                        : Chance(fates - 1, 0, false, charNeeded-1, weaponPity, weaponGuarantee, weaponNeeded, false) * 0.5 +
                                                          Chance(fates - 1, 0, true , charNeeded  , weaponPity, weaponGuarantee, weaponNeeded, false) * 0.5 ) +
            (charPity == 90 ? 0 : (1-CharProb(charPity)) *Chance(fates - 1, charPity + 1, charGuarantee, charNeeded, weaponPity, weaponGuarantee, weaponNeeded, false));
        CharCache[+charGuarantee][charNeeded][charPity][fates] ??= prob;
        return prob;
    } else { // weapon banner
        //cache
        WeaponCache[+weaponGuarantee] ??= [];                                       
        WeaponCache[+weaponGuarantee][weaponNeeded] ??= [];
        WeaponCache[+weaponGuarantee][weaponNeeded][weaponPity] ??= [];
        if (WeaponCache[+weaponGuarantee][weaponNeeded][weaponPity][fates] != undefined) { return WeaponCache[+weaponGuarantee][weaponNeeded][weaponPity][fates]; }
        // recursive solving
        let prob = WeaponProb(weaponPity) * ( weaponGuarantee ? Chance(fates - 1, 0, charGuarantee, charNeeded, 0, false, weaponNeeded-1, false)
                                                              : Chance(fates - 1, 0, charGuarantee, charNeeded, 0, false, weaponNeeded-1, false) * 3/8 +
                                                                Chance(fates - 1, 0, charGuarantee, charNeeded, 0, true , weaponNeeded, false) * 5/8 ) +
            (weaponPity == 80 ? 0 : (1-WeaponProb(weaponPity)) *Chance(fates - 1, 0, charGuarantee, charNeeded, weaponPity+1, weaponGuarantee, weaponNeeded, false));
        WeaponCache[+weaponGuarantee][weaponNeeded][weaponPity][fates] ??= prob;
        return prob;
    }

}


const updateTable = () => {
    let fates = +document.getElementById("pulls").value;
    let charPity = +document.getElementById("cpity").value;
    let charGuarantee = document.querySelector('.cguarantee:checked')?.value == 'on';
    let weaponPity = +document.getElementById("wpity").value;
    let weaponGuarantee = document.querySelector('.wguarantee:checked')?.value == 'on';

    let text = "<tr> <th></th> <th>--</th> <th>C0</th> <th>C1</th> <th>C2</th> <th>C3</th> <th>C4</th> <th>C5</th> <th>C6</th> </tr>"
    for (let R = 0; R < 6; R++) {
        text += `<tr> <th>${R==0?'--':'R'+R}</th>`
        for (let C = 0; C < 8; C++) {
            let chance = Chance(fates, charPity, charGuarantee, C, weaponPity, weaponGuarantee, R, false);
            text += `<td>${(chance*100).toFixed(3)}%</td>`;
        }
        text += "</tr>";
        CharCache = [];
    }
    WeaponCache = [];
    document.getElementById("results").innerHTML=text;
    
}