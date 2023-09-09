import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "ClassicMachine";
var name = "CMT";
var description = "The Classic Machine Theory\nCMT = Classic Machine Theory";
var authors = "JojoGames320";
var version = "1.0.0";

var currency, currency2;
var s1;

var init = () => {
    currency = theory.createCurrency("M", "M");
    currency2 = theory.createCurrency("N", "N");

    ///////////////////
    // Regular Upgrades

    // s1
    {
        let getDesc = (level) => "s_1=" + getS1.toString(0);
        s1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(800, 1.44)));
        s1.getDescription = (_) => Utils.getMath(getDesc(s1.level));
        s1.getInfo = (amount) => Utils.getMathTo(getInfo(s1.level), getInfo(s1.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e18);
    theory.createBuyAllUpgrade(1, currency, 1e21);
    theory.createAutoBuyerUpgrade(2, currency2, 1e48);
    
    /////////////////
    //// Achievements   

    ac1 = theory.createAchievementCategory(0, "Classic Machines");
    theory.createAchievement(0, ac1, "Started", "Reach 1 Classic Machine", () => currency.value > 0)
  
    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(1e20, 1e10));
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    let s1 = getS1(s1.level);

    currency.value += bonus * q1 * time * dt;
    currency2.value += BigNumber.from("0.03333333333333")
}

var getPrimaryEquation = () => {
    let result = "s_1";
 
    return result;
}

var getPublicationMultiplier = (tau) => BigNumber.ONE + (((currency.value.log10() - 18) * 3333.33));
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.1}}";
var getTau = () => currency.value;
var get2DGraphValue = () => BigNumber.ZERO;

var postPublish = () => {
    currency.value = BigNumber.ZERO;
}

var getS1 = (level) => level;

init();
