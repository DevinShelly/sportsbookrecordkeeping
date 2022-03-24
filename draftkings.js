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
    //bet-outcome-list
    errors = [];
    try
    {
    if(betDiv.querySelectorAll(".bet-outcome-cell").length == 1)
    {
      bet = {
        side: betDiv.querySelector("h3").textContent,
        betType: betDiv.querySelectorAll("h3")[1].textContent,
        wager: betDiv.querySelector(".bet-wager__label").nextSibling.textContent.replace("FREE", "$0"),
        paid: betDiv.querySelector(".bet-to-pay__value") ? betDiv.querySelector(".bet-to-pay__value").textContent : "$0",
        outcome: betDiv.querySelector(".bet-status").textContent,
        odds: betDiv.querySelector(".sportsbook-odds").textContent,
        event: betDiv.querySelector(".bet-event__name").textContent,
        result: betDiv.querySelector(".bet-outcome-cell__details-result").textContent,
      };
    }
    else
    {
      bet = {
        side: betDiv.querySelector(".bet-outcome-container__body").innerText,
        betType: betDiv.querySelector(".bet-outcome-container-header-wrapper").textContent.split(" ").slice(0, -1).join(" "),
        wager: betDiv.querySelector(".bet-wager__label").nextSibling.textContent.replace("FREE", "$0"),
        paid: betDiv.querySelector(".bet-to-pay__value") && betDiv.querySelector(".bet-status").textContent != "OPEN" ? betDiv.querySelector(".bet-to-pay__value").textContent : "$0",
        outcome: betDiv.querySelector(".bet-status").textContent,
        odds: betDiv.querySelector(".sportsbook-odds").textContent,
        event: betDiv.querySelector(".bet-label").textContent,
        result: betDiv.querySelector(".bet-outcome-cell__details-result").textContent
      };
    }
    betID = betDiv.querySelector(".bet-history-card__id").textContent;
    bets[betID] = bet;
    }
    catch (error)
    {
      if(errors.indexOf(betDiv.querySelector(".bet-history-card__id").textContent) == -1)
      {
        errors.push(betDiv.querySelector(".bet-history-card__id").textContent);
        console.log(betDiv.textContent);
        console.log(error);
      }
    }
  }
  
  navigator.clipboard.writeText(betTSV());
}

betsTSV = function()
{
  let tsv = "";
  for (id of Object.keys(bets))
  {
    tsv +=  bets[id].event + "\t" + bets[id].side.replaceAll("\n", " ") + "\t" + 
            bets[id].betType + "\t" + bets[id].result + "\t" + bets[id].outcome + "\t" + 
            bets[id].wager + "\t" + bets[id].odds.split("+") + "\t" + bets[id].paid + "\n";
  }
  return tsv;
}

atBottom = 0;
pageToBottom = function()
{
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
    setTimeout(function(){scrolling = false}, 500);
  }
}

links = document.querySelectorAll(".my-bets-nav__tab");
clonedNode = links[4].cloneNode();
links[4].after(clonedNode);
clonedNode.textContent = "Save";
clonedNode.onmouseup = pageToBottom;
setInterval(saveBets, 100);


