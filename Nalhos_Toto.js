import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "nalhos_toto";
var name = "Nalhos Toto";
var description = "Welcome to Nalhos Toto Theory!";
var authors = "Skyhigh173";
var version = "1.0.0";


var currency;
var j1;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // j1
    {
        let getDesc = (level) => "j_1=" + getJ1(level).toString(0);
        j1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(20, 1.2));
        j1.getDescription = (_) => Utils.getMath(getDesc(k.level));
        j1.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + 1));
    }
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getJ1(j1.level)
}

var getPrimaryEquation = () => {
    let result = "j_1";

    return result;
}

init();
