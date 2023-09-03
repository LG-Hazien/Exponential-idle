import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "classic_machine";
var name = "Classic Machine Theory";
var description = "The Classic Machine Theory";
var authors = "JojoGames320";
var version = 1;

var time = 0;

var currency, currency2;

var init = () => {
    currency = theory.createCurrency();
    currency2 = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e18);
    theory.createBuyAllUpgrade(1, currency, 1e21);
    theory.createAutoBuyerUpgrade(2, currency2, 1000);
    
    /////////////////
    //// Achievements                                        
  
    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    {
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        logTerm = theory.createMilestoneUpgrade(1, 1);
        logTerm.description = Localization.getUpgradeMultCustomDesc("c_1", "1+\\frac{ln(\\rho_{n})}{100}");
        logTerm.info = Localization.getUpgradeMultCustomInfo("c_1", "1+\\frac{\\ln(\\rho_{n})}{100}");
        logTerm.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c3Term = theory.createMilestoneUpgrade(2, 1);
        c3Term.description = Localization.getUpgradeAddTermDesc("\\rho_{n-1}^{0.2}");
        c3Term.info = Localization.getUpgradeAddTermInfo("\\rho_{n-1}^{0.2}");
        c3Term.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        c3Term.canBeRefunded = (_) => c4Term.level == 0;
    }

    {
        c4Term = theory.createMilestoneUpgrade(3, 1);
        c4Term.description = Localization.getUpgradeAddTermDesc("\\rho_{n-2}^{0.3}");
        c4Term.info = Localization.getUpgradeAddTermInfo("\\rho_{n-2}^{0.3}");
        c4Term.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        c4Term.isAvailable = false;
    }

    updateAvailability();
}

var updateAvailability = () => {
    c3.isAvailable = c3Term.level > 0;
    c4.isAvailable = c4Term.level > 0;
    c4Term.isAvailable = c3Term.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let tickspeed = getTickspeed();

    if (tickspeed.isZero)
        return;

    let timeLimit = 1 / tickspeed.Min(BigNumber.TEN).toNumber();
    time += elapsedTime;

    if (time >= timeLimit - 1e-8) {
        let tickPower = tickspeed * BigNumber.from(time * multiplier);

        let bonus = theory.publicationMultiplier;
        let vc1 = getC1(c1.level).pow(getC1Exponent(c1Exp.level));
        let vc2 = getC2(c2.level);
        let vc3 = getC3(c3.level);
        let vc4 = getC4(c4.level);
        let term1 = vc1 * vc2 * (logTerm.level > 0 ? BigNumber.ONE + rhoN.Max(BigNumber.ONE).log() / BigNumber.HUNDRED : BigNumber.ONE);
        let term2 = c3Term.level > 0 ? (vc3 * rhoNm1.pow(0.2)) : BigNumber.ZERO;
        let term3 = c4Term.level > 0 ? (vc4 * rhoNm2.pow(0.3)) : BigNumber.ZERO;

        currency.value = rhoN + bonus * tickPower * (term1 + term2 + term3) + epsilon;

        time = 0;
    }
}

var getInternalState = () => `${rhoN} ${rhoNm1} ${rhoNm2} ${time}`

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) rhoN = parseBigNumber(values[0]);
    if (values.length > 1) rhoNm1 = parseBigNumber(values[1]);
    if (values.length > 2) rhoNm2 = parseBigNumber(values[2]);
    if (values.length > 3) time = parseFloat(values[3]);
}

var getPrimaryEquation = () => {
    let result = "\\rho_{n+1} = \\rho_{n}+c_1";

    if (c1Exp.level > 0)
        result += "^{" + getC1Exponent(c1Exp.level).toString(2) + "}";

    result += "c_2";

    if (logTerm.level > 0)
        result += "\\left(1+\\frac{\\ln(\\rho_n)}{100}\\right)";

    if (c3Term.level > 0)
        result += "+c_3\\rho_{n-1}^{0.2}";

    if (c4Term.level > 0)
        result += "+c_4\\rho_{n-2}^{0.3}";

    if (logTerm.level > 0 && c3Term.level > 0 && c4Term.level > 0)
        theory.primaryEquationScale = 0.85;
    else
        theory.primaryEquationScale = 1;
 
    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getTertiaryEquation = () => Localization.format(stringTickspeed, getTickspeed().toString(0));

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var postPublish = () => {
    time = 0;
    rhoN = BigNumber.ZERO;
    rhoNm1 = BigNumber.ZERO;
    rhoNm2 = BigNumber.ZERO;
    theory.invalidateTertiaryEquation();
}

var getQ1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getQ2 = (level) => BigNumber.TWO.pow(level);
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC3 = (level) => BigNumber.TEN.pow(level);
var getC4 = (level) => BigNumber.TEN.pow(level);
var getTickspeed = () => getQ1(q1.level) * getQ2(q2.level);

init();
