bets = {};
scrolling = false;

saveBets = function()
{
  if(!scrolling)
  {
    return;
  }
  
  betDivs = document.querySelector(".ReactVirtualized__Grid__innerScrollContainer").querySelectorAll(".sportsbook-expandable-shell__wrapper");
  for(betDiv of betDivs)
  {
    if(betDiv.querySelector(".bet-outcome-cell__details") == null)
    {
      betDiv.querySelector(".bet-history-card__collapse-arrow").click();
      continue;
    }
    
    if(!betDiv.querySelectorAll("h3")[1])
    {
      console.log(betDiv);
      scrolling = false;
    }
    
    //Single Wager
    if(betDiv.querySelectorAll(".bet-outcome-cell").length == 1)
    {
      bet = {
        side: betDiv.querySelector("h3").textContent,
        betType: betDiv.querySelectorAll("h3")[1].textContent,
        wager: betDiv.querySelector(".bet-wager__label").nextSibling.textContent.replace("FREE", "$0"),
        paid: betDiv.querySelector(".bet-to-pay__value") ? betDiv.querySelector(".bet-to-pay__value").textContent : "$0",
        outcome: betDiv.querySelector(".bet-status").textContent,
        odds: betDiv.querySelector(".sportsbook-odds").textContent,
        event: betDiv.querySelector(".bet-event__name").textContent.split(" (")[0],
        result: betDiv.querySelector(".bet-outcome-cell__details-result").textContent,
        placed: betDiv.querySelector(".bet-history-card__date").textContent,
        date: betDiv.querySelector(".bet-event__name").textContent.split(" (")[1].replace(")", ""),
        freebet: betDiv.querySelector(".bet-reward-free-bet") ? betDiv.querySelector(".bet-reward-free-bet").textContent.split(" ")[0] : "$0"
      };
    }
    //Parlay
    else
    {
      bet = {
        side: betDiv.querySelector(".bet-outcome-container__body").innerText,
        betType: betDiv.querySelector(".bet-outcome-container-header-wrapper").textContent.split(" ").slice(0, -1).join(" "),
        wager: betDiv.querySelector(".bet-wager__label").nextSibling.textContent.replace("FREE", "$0"),
        freebet: betDiv.querySelector(".bet-reward-free-bet") ? betDiv.querySelector(".bet-reward-free-bet").textContent.split(" ")[0] : "$0",
        paid: betDiv.querySelector(".bet-to-pay__value") && betDiv.querySelector(".bet-status").textContent != "OPEN" ? betDiv.querySelector(".bet-to-pay__value").textContent : "$0",
        outcome: betDiv.querySelector(".bet-status").textContent,
        odds: betDiv.querySelector(".sportsbook-odds").textContent,
        event: betDiv.querySelector(".bet-label").textContent,
        result: null,
        placed: betDiv.querySelector(".bet-history-card__date").textContent,
        date: null
      };
    }
    betID = betDiv.querySelector(".bet-history-card__id").textContent;
    //For odds boosts, two sets of bets are listed. Only record the second one
    //Do plus odds first because you can boost from a negative to a positive but never the other way
    if(bet.odds.indexOf("+") != -1)
    {
      bet.odds = "+" + bet.odds.split("+")[bet.odds.split("+").length-1]
    }
    if(bet.odds.indexOf("−") != -1)
    {
      console.log()
      bet.odds = "-" + bet.odds.split("−")[bet.odds.split("−").length-1];
    }
    //Free bets that win need to have their amount calculated
    if(bet.wager == "$0" && bet.freebet == "$0")
    {
      bet.freebet = "$" + (parseFloat(bet.paid.replace("$", ""))/parseFloat(bet.odds)*100).toFixed(2);
    }
    bets[betID] = bet;
  }
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

copyTSV = function()
{
  console.log(document.hasFocus());
  scrolling = false;
  navigator.clipboard.writeText(betsTSV());
}

atBottom = 0;
pageToBottom = function()
{
  console.log(document.hasFocus());
  if(Object.keys(bets).length > 0)
  {
    copyTSV();
    return;
  }
  
  let pageIncrement = 20;
  window.scrollTo(0,window.scrollY + window.innerHeight);
  atBottom += pageIncrement;
  if(window.scrollY + window.innerHeight < document.body.clientHeight)
  {
      atBottom = 0;
  }
  if(atBottom <= 1000)
  {
    setTimeout(pageToBottom, pageIncrement);
  }
  else
  {
    scrolling = true;
    window.scrollTo(0, 0);
    setTimeout(scrollPage, 1000);
  }
}

scrollPage = function(){
  let scrollInterval = 10;
  let scrollIncrement = 20;
  window.scrollTo(0,window.scrollY + scrollIncrement);
  if(window.scrollY + window.outerHeight <= document.body.clientHeight && scrolling)
  {
    setTimeout(scrollPage, scrollInterval);
  }
  else
  {
    setTimeout(copyTSV,
      500);
  }
}

links = document.querySelectorAll(".my-bets-nav__tab");
if(links.length != 0)
{
  clonedNode = links[4].cloneNode();
  links[4].after(clonedNode);
  clonedNode.textContent = "Copy To TSV";
  clonedNode.onmouseup = pageToBottom;
  setInterval(saveBets, 100);
}



