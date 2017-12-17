var Portfolio = function Portfolio(){
    var self = {};
    self.coins = [];
    self.total = 0;
    self.addCoin = function addCoinToPortfolio(symbol, name, amount){
        coin = Coin(symbol, name, amount);
        self.coins.push(coin);
    }
    self.render = function renderPortfolio(){
        var container = $('#tablerows');
        container.empty();
        var total = 0;
        promises = [];
        self.coins.map(function(coin){
            promises.push(coin.update(container));
        });
        $.when(...promises).done(function(){
            self.total = 0;
            self.coins.map(function(coin){
                self.total += coin.total_value;
            });
            console.log(self.total);
            self.render_total(container);
        });
    }

    self.render_total = function renderTotals(container){
        var row = $('<tr class="coin" id="totals">');
        $(row).append($('<td colspan=5>'));
        $(row).append($('<td>Total</td>'));
        $(row).append($('<td><b>&euro;'+self.total.toFixed(3)+'</b></td>'));
        $(row).append($('<td>'+render_delta(self.total-TOTAL_INVESTMENT)+'</td>'));
        $(container).append(row);
        document.title = "AltCoins - € " + self.total.toFixed(2);
    }
    return self;
}

function init(){
    var portfolio = Portfolio();
    coin_db.map(function(coin){
        portfolio.addCoin(coin.symbol, coin.name, coin.amount);
    });
    window.setInterval(portfolio.render, 5*60*1000); //update every 5 minutes
    portfolio.render();
}
