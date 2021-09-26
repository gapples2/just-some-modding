if(!data.timeSinceUpdate)data.timeSinceUpdate = Date.now()
function fixAllDestabHeights(){
    let d = document.getElementsByClassName("destabilizer")
    for(let x=0;x<d.length;x++){
        d[x].style.height = "90px"
    }
}
function updateHTML(){
    //halfPoints displays
    document.getElementById("halfPointDisplay").innerHTML = `You have ${format(data.halfPoints)} Half Points`
    document.getElementById("halfPointGainDisplay").innerHTML = `You are gaining ${format(data.halfPointGain)} every second`
    //producer displays
    let numWords = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven"]
    for(let x=0;x<4;x++){
        document.getElementById("destab"+numWords[x]).innerHTML = `Destabilizer ${x+1}<br>Cost: ${format(data.destabCosts[x])}<br>Produces ${format(data.destabIncreases[x])} ${x==0?`Half Point${data.destabIncreases[x].eq(1)?"":"s"}`:`Destabilizer ${x}`}<br>Currently producing ${format(data.destabProductions[x])}<br>Amount: ${format(data.destabAmounts[x])}`
      if(data.hasUpgrade[x])document.getElementById("upgrade"+numWords[x]).style.color = `gold`
    }
    //energizer display
    document.getElementById("upgradesTopText").innerHTML = "Use these Energizers' great power to your advantage.<br>Unlocking any Energizer will reset your Destabilizers."
    //halfJump display
    if (data.canHalfJump) document.getElementById("halfJump").innerHTML = "Half Jump."
    else document.getElementById("halfJump").innerHTML = "1e21 Half Points and Destabilizing IV are required to unlock Half Jump"
    //misc displays
    document.getElementById("versionText").innerHTML = `[Beta v${data.updateIDs[0]}.${data.updateIDs[1]}.${data.updateIDs[2]}]`

    showAndHideStuff()
}
function showAndHideStuff(){
    let numWords = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven"]
    //destabilizers tab
    let destabilizers = document.getElementsByClassName("destabilizer")
    for (let i = 0; i < destabilizers.length; i++) {
        destabilizers[i].style.display = data.currentTab===1 ? 'flex' : 'none'
    }
    //upgrades tab
    let upgrades = document.getElementsByClassName("upgrade")
    let upText = document.getElementById("upgradesText")
    let upText2 = document.getElementById("upgradesTopText")
    for (let i = 0; i < upgrades.length; i++) {
        upgrades[i].style.display = data.currentTab===3 ? 'flex' : 'none'
    }
    upText.style.display = data.currentTab===3 ? 'flex' : 'none'
    upText2.style.display = data.currentTab===3 ? 'flex' : 'none'
    // half jump
    let halfJumpElements = document.getElementsByClassName("halfJumpThings")
    for (let i=0; i<halfJumpElements.length; i++){
        halfJumpElements[i].style.display = data.currentTab===4 ? 'flex' : 'none'
    }
    //settings
    let settingsElements = document.getElementsByClassName("settingsElement")
    for (let i=0; i<settingsElements.length; i++){
        settingsElements[i].style.display = data.currentTab===2 ? 'flex' : 'none'
    }
    //nav buttons
    document.getElementById("halfJumpNav").style.display = data.timesHalfJumped.gte(1)||data.canHalfJump ? 'flex' : 'none'
    document.getElementById("upgradesNav").style.display = data.destabAmounts[3].gte(1)||data.hasUpgrade[0]||data.timesHalfJumped.gte(1)
    for(let x=0;x<11;x++){
        document.getElementById("upgrade"+numWords[x]).style.display=(x==0||data.hasUpgrade[x-1])&&data.currentTab==3?'flex':'none'
    }
}
function upgradeEffects(){
    for (let i=0; i<4; i++){
        if (data.destabAmounts[3].gte(1)){
            data.upgradeEffects[i] = data.destabAmounts[3].log(1.1).plus(1.3)
        }
        else data.upgradeEffects[i] = new Decimal(2)
    }
}
function mainLoop(){
    let diff = (Date.now()-data.timeSinceUpdate)/1000
    calculateProductions()
    data.halfPointGain = data.destabProductions[0]
    numberIncrease(data.halfPointGain.times(diff))
    produceDestabs(diff)
    upgradeEffects()
    canHalfJump()

    data.timeSinceUpdate = Date.now()
}
function produceDestabs(diff){
    for (let a = 0; a < data.destabProductions.length-1; a++) {
        data.destabProductions[a] = data.destabProductions[a].plus(data.destabProductions[a+1].times(diff).times(100))
    }
}
function calculateProductions(){
    for (let i=0; i<data.destabIncreases.length; i++){
        if (data.hasUpgrade[i]) data.destabIncreases[i] = new Decimal(1).times(data.upgradeEffects[i])
        else data.destabIncreases[i] = new Decimal(1)
    }
    for(let i=0; i<data.destabProductions.length; i++){
        data.destabProductions[i] = data.destabAmounts[i].times(data.destabIncreases[i])
    }
}
