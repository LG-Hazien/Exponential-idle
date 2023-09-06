import { ui } from ".../api/ui/UI";

var id = "OuO";
var name = "Castle deck simulator";
var description = "No theory description :("
var authors = "JojoGames";
var version = "v1.0.0";

const PLAYS = BigNumber.ZERO;
const DECKS = BigNumber.ZERO;

fuction fuct(value){
  if (value == 1) {
    DECKS += BigNumber.ONE
  }
}

var getMainPanel = () => {
    if (Antimatter >= bf('1.79e308')) {
        return ui.createButton({text:"Big Crunch", fontSize: 30, onClicked: BigCrunch})
    }
    let btns = (name, row, onc) => {
        return ui.createButton({text:name,row:row,fontSize:20,onClicked:()=>{fuct(onc); reloadUI(); Sound.playClick(); }});
    }
    return ui.createStackLayout({children:[ui.createScrollView({
        children: [
            ui.createGrid({
                rowDefinitions: ["1*","1*","1*","4","1*","4","1*"],
                children: [
                    btns("New Deck",0,1),
                ]
            })
        ]
    })]})
}

var getPrimaryEquation = () => {
    let r = `\\text{You published ${DECKS} Decks.}`
    if (count.inf > bf(0)) r += `\\\\ \\text{You have ${InfinityPoint.toString(0)} Infinity Points.}`
    return r
}
