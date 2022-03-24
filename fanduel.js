bets = {};

saveBets = function()
{
  let spans = document.getElementsByTagName("span");
  for(span of spans)
  {
    if(span.textContent.indexOf("TOTAL WAGER") != -1)
    {
        outcomeSpans = span.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("span");
        betInfoSpans = span.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.getElementsByTagName("span");
        
        bet = {};
        bet.side = betInfoSpans[0].textContent;
        bet.event = betInfoSpans[betInfoSpans.length  - 2].textContent;
        bet.type = betInfoSpans[2].textContent;
        bet.outcome = outcomeSpans[3].textContent;
        bet.wager = outcomeSpans[0].textContent;
        bet.odds = betInfoSpans[1].textContent;
        bet.paid = outcomeSpans[2].textContent;
        
        if(bet.side.indexOf("Leg Parlay") != -1)
        {
          ///TODO: Save sides
          bet.event = "N/A";
          side = bet.type;
          bet.type = bet.side;
          bet.side = side;
        }
      
        if(bet.type[0] == "+" || bet.type[0] == "-")
        {
          console.log(bet);
          bet.side = bet.side + " " + bet.odds;
          bet.odds = betInfoSpans[3].textContent;
          bet.type = betInfoSpans[4].textContent;
          console.log(bet);
        }
        
        if(bet.side == "Over" || bet.side == "Under")
        {
          bet.side = bet.side + " " + betInfoSpans[2].textContent;
          bet.type = betInfoSpans[4].textContent;
        }
        
        bets[outcomeSpans[4].textContent.replace("BET ID: ", "")] = bet;
    }
  }
  navigator.clipboard.writeText(betsTSV());
}

betsTSV = function()
{
  let tsv = "";
  for (id of Object.keys(bets))
  {
    tsv +=  bets[id].event + "\t" + bets[id].side.replaceAll("\n", " ") + "\t" + 
            bets[id].type + "\t" + bets[id].result + "\t" + bets[id].outcome + "\t" + 
            bets[id].wager + "\t" + bets[id].odds + "\t" + bets[id].paid + "\n";
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
  saveBets();
}

addSaveButton = function()
{
  if(document.URL != "https://ny.sportsbook.fanduel.com/my-bets")
  {
    return;
  }
  lis = document.getElementsByTagName("li");
  settled = lis.length == 10 ? lis[9] : lis[1];
  save = settled.cloneNode(true);
  save.getElementsByTagName("span")[0].textContent = "Save";
  save.onclick = pageToBottom;
  save.getElementsByTagName("a")[0].href = "javascript: void(0)";
  if(settled.parentElement.lastChild == settled)
  {
    settled.parentElement.appendChild(save);
  }
}
setInterval(addSaveButton, 100);


