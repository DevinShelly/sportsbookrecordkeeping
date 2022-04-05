let bets = {};
scrolling = false;

betElements = function()
{
  let elements = Array.from(document.querySelectorAll("div[role='button']"));
  return elements.slice(1, elements.length - 1);
}

saveBets = function()
{
  elements = betElements();
  elements[0].click();
  waitForBetDetailsToLoad(0);
}

waitForBetDetailsToLoad = function(i)
{
  try 
  {
    saveBet(i);
    if(betElements().length-1 == i)
    {
      return;
    }
    betElements()[i+1].click();
    setTimeout(() => {waitForBetDetailsToLoad(i+1)}, 50);
  } 
  catch (e) 
  {
    console.log(e);
    setTimeout(() => {waitForBetDetailsToLoad(i)}, 50);
  }
}


saveBet = function(i)
{
  betElement = betElements()[i];
  betDetails = betElement.children[1];
  leftDetails = betDetails.children[0].children[0].children[0].children[1].children[0];
  rightDetails = betDetails.children[0].children[0].children[0].children[1].children[1];
  bet = {};
  bet.placed = leftDetails.children[3].children[1].textContent.trim();
  id = leftDetails.children[4].children[1].textContent.trim();
  bet.event = leftDetails.children[1].children[1].textContent.trim();
  bet.date = leftDetails.children[2].children[1].textContent.trim();
  bet.side = rightDetails.children[0].children[1].childNodes[0].textContent.split("@")[0].trim();
  bet.betType = rightDetails.children[0].children[1].childNodes[1].textContent.trim();
  bet.result = null;
  bet.wager = rightDetails.children[2].childNodes[1].childNodes[0].textContent.trim();
  bet.paid = rightDetails.children[rightDetails.children.length-1].children[1].childNodes[0].textContent.trim();
  if(bet.paid[0] == "-")
  {
    bet.paid = "$" + (parseFloat(bet.wager.slice(1)) - parseFloat(bet.paid.slice(2))).toFixed(2);
  }
  if(bet.paid == "$0.00")
  {
    bet.outcome = "LOST";
  }
  else if(bet.paid == bet.wager)
  {
    bet.outcome = "PUSH";
  }
  else
  {
    bet.outcome = "WON";
  }
  bet.odds = rightDetails.children[1].children[1].textContent.trim();
  bet.freebet = "$0.00";
  if(rightDetails.textContent.indexOf("Free Bet") != -1)
  {
    bet.freebet = bet.wager;
    bet.wager = "$0.00";
  }
  bets[id] = bet;
  console.log("finished");
}

betsTSV = function()
{
  let tsv = "";
  for (id of Object.keys(bets))
  {
    tsv +=  bets[id].placed + "\t" + "PointsBet" + "\t" + id + "\t" + bets[id].event + "\t" + bets[id].date + "\t" + 
            bets[id].side.replaceAll("\n", " ") + "\t" + bets[id].betType + "\t" + bets[id].result + "\t" + 
            bets[id].outcome + "\t" + bets[id].wager + "\t" + bets[id].freebet + "\t" + bets[id].odds.split("+") + "\t" + 
            bets[id].paid + "\n";
  }
  return tsv;
}

createTSVButton = function()
{
  if(document.getElementById("tsv"))
  {
    clearInterval(createID);
    return;
  }
  h1s = document.getElementsByTagName("h1");
  if(h1s.length > 0 && h1s[0].textContent == "Settled Bets")
  {
    h1 = h1s[0];
    tsv = h1.cloneNode(true);
    tsv.textContent = "Copy to TSV";
    tsv.id = "tsv";
    tsv.onclick = saveBets;
    tsv.style = "cursor: pointer";
    h1.insertAdjacentElement("afterend", tsv);
    
    style="cursor: pointer;"
    clearInterval(createID);
  }
}

createID = setInterval(createTSVButton, 100);




