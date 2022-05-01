class Bet{
  constructor(date, sportsbook, event, wager, odds, returned)
  {
    this.date = date;
    this.sportsbook = sportsbook;
    this.event = event;
    this.wager = wager;
    this.odds = odds;
    this.returned = returned;
  }
  
  get TSV()
  {
    return this.date + "\t" + this.sportsbook + "\t" + this.event + "\t" + this.wager + "\t" + this.odds + "\t" + this.returned + "\n";
  }
}

betTSVs = function(bets)
{
  let TSVs = "";
  for (bet of bets)
  {
    TSVs += bet.TSV;
  }
  return TSVs;
}

