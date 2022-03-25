bets = {};

copyToTSV = function()
{
  transactionHistoryItems = document.getElementsByClassName("TransactionHistoryItem");
  for(transactionHistoryItem of transactionHistoryItems)
  {
    console.log(transactionHistoryItem.getElementsByClassName("sectionTitle")[0]);
    deepContent = transactionHistoryItem.getElementsByClassName("deepContent")[0];
    shallowContent = transactionHistoryItem.getElementsByClassName("contentShallow")[0].childNodes[0];
    console.log(shallowContent.childNodes);
    console.log(deepContent.childNodes);
    bet = {};
    bet.side = transactionHistoryItem.getElementsByClassName("sectionTitle")[0].textContent;
    bet.placed = deepContent.childNodes[0].childNodes[1].textContent;
    bet.event = shallowContent.childNodes[1].childNodes[0].textContent;
    bet.type = shallowContent.childNodes[0].childNodes[0].textContent;
    bet.odds = shallowContent.getElementsByClassName("betOdds")[0].textContent.replaceAll("@", "");
    bet.date = shallowContent.childNodes[1].childNodes[2].textContent;
    bet.wager = transactionHistoryItem.getElementsByClassName("FreeBetsBadge").length > 0 ? "$0" : deepContent.childNodes[2].childNodes[1].textContent;
    bet.freebet = transactionHistoryItem.getElementsByClassName("FreeBetsBadge").length > 0 ? deepContent.childNodes[2].childNodes[1].textContent : "$0";
    bet.outcome = transactionHistoryItem.getElementsByClassName("BetWon").length > 0 ? "Won" : transactionHistoryItem.getElementsByClassName("statusBadge")[0].textContent;
    bet.paid = deepContent.childNodes[3].childNodes[1].textContent;
    bet.result = null;
    bets[deepContent.childNodes[deepContent.childNodes.length - 1].childNodes[1].textContent] = bet;
    
  }
  
  navigator.clipboard.writeText(betsTSV());
}



loadMoreBets = function()
{
  if(!document.getElementById("moreBetHistory"))
  {
    copyToTSV();
    return;
  }
  
  document.getElementById("moreBetHistory").click();
  setTimeout(loadMoreBets, 100);
}

addTSVButton = function()
{
  if(document.getElementsByClassName("modalTitle").length == 0 || document.getElementById("tsv"))
  {
    return;
  }
  
  tsv = document.createElement("div");
  tsv.classList.add("modalTitle");
  tsv.id = "tsv";
  link = document.createElement("a");
  link.href = "javascript:;"
  link.textContent = "Copy to TSV";
  link.onclick = loadMoreBets;
  tsv.appendChild(link);
  document.getElementsByClassName("modalTop")[0].appendChild(tsv);
  
}

setInterval(addTSVButton, 100);
