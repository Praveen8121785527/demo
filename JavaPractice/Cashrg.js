function checkCashRegister(price, cash, cid) {
    let changeDue = cash - price;
  
    let change = [];
    let statusInsufficient = {status: "INSUFFICIENT_FUNDS", change: []};
    let statusClosed = {status: "CLOSED", change: cid}
    let statusOpen = {status: "OPEN", change: change}
  
    var quarterErrorCheck;
    var cidCopy;
    var changeDueCopy;
  
    const currencies = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.10,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
    }
  
  
    cid = cid.filter((currency) => (changeDue >= (currencies[currency[0]]))) // remove currencies too big
              .filter((currency) => currency[1] > 0); // remove non-available currencies
    let cidFunds = cid.reduce((sum, curr) => {  // get total funds available
        return sum + curr[1];
    },0);
    cidFunds = parseFloat(cidFunds.toFixed(2)); // round to 2 decimal places
  
    if (cidFunds < changeDue) {  // return if current funds not enough for the change due
      return statusInsufficient;
    } else if (cidFunds == changeDue) { // return if current funds are equal to change due
      return statusClosed;
    }
  
  
  
    // Last case to check for: Can we return the exact change due?
    for (let i=cid.length-1; i >= 0; i--) {
      let currencyName = cid[i][0]; 
      let currencyTotal = cid[i][1]; 
      if (currencyTotal > changeDue) { // only focus on values of that currency below change due
        currencyTotal = changeDue;
      }
      let currencyValue = currencies[currencyName]; // value of a single currency unit
      let currencyUnits = Math.floor((currencyTotal / currencyValue))  ;  // how many of those units to give out?
    
  
      // Save copies of cid and changeDue, in case of QUARTER error (see below)
      if (currencyName == "QUARTER" && currencyUnits % 2 == 1) {
        cidCopy = [...cid].slice(0,i+1);
        cidCopy[i][1] -= 0.25;  // take away one quarter
        changeDueCopy = changeDue;
      }
  
      if (currencyUnits != 0) {
        let currencyChange = Number((currencyUnits * currencyValue).toFixed(2).replace(/[.]?0+$/, "")); // how much of this unit to give in total?
        changeDue = Number(changeDue - currencyChange).toFixed(2);  
        change.push([currencyName, currencyChange]);
      }
      if (changeDue == 0) {
        statusOpen.change = change;
        return statusOpen;
      }
  
    }
    
  
    /*
    QUARTER ERROR FIX:
    The usual approach is taking as much currency of the highest possible currency in each step. This leads to  
    the correct change in most cases, since each currency unit is a multiple of the one before:
    Nickel = Penny * 5, Dime = Nickel * 5, Dollar = Quarter * 4, etc.
    However, there is one exception: A Quarter is not a multiple of a Dime. This can lead to issues.
  
    Example:
    If we have changeDue = 0.31, and cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0.3], ["QUARTER", 0.25]]
    then we can give out exact change [['DIME', 0.3], ['PENNY',0.01]] 
    However, the usual approach as described above would try to use the Quarter as change first then will not
    have enough of the other currencies to give out the exact change. Therefore, it will return status = "CLOSED"
  
    I solve this issue by making a copy of the changeDue and cid if the amount of nickels given out is odd. We 
    don't need to check when the amount is even, as even amounts of Nickels are a multiple of dimes.
    Then, we try solving the Exact Change problem just as before, but this time we give out one fewer Nickel 
    as change than last time. 
    */
    quarterErrorCheck = checkCashRegister(0, changeDueCopy, cidCopy); 
    if (quarterErrorCheck.status == "OPEN") { // if giving out a quarter leads to exact change
      let fixIndex = change.indexOf(change.find((currency) => currency[0] == "QUARTER"));
      // combine old solution up to Quarter with new solution starting from quarter:
      change = change.slice(0,fixIndex).concat(quarterErrorCheck.change); 
      statusOpen.change = change;
      return statusOpen;
    } else {
      return statusClosed;
    }
    
  }
  
  
  
  //checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90]///, ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
  
  console.log(checkCashRegister(0.69, 1, [["PENNY", 0.05], ["NICKEL", 0], ["DIME", 3], ["QUARTER", 3], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]))
  
  
  //console.log(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25]///, ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]))
  
  //console.log(checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], //["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));
  
  
  //console.log(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25]//, ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));