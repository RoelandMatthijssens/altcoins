var Portfolio = function Portfolio(){
    var self = {};
    self.coins = {};
    self.total = 0;
    self.addCoin = function addCoinToPortfolio(symbol, name, amount){
        coin = Coin(symbol, name, amount);
        self.coins[symbol] = coin;
    }

    self.get_ticker_data = function getTickerData(){
        return $.getJSON(TICKER_BASE_URL+'?convert=EUR&limit=0', function(data){
            return data;
        });
    }

    self.render = function renderPortfolio(){
        var container = $('#tablerows');
        self.total = 0;
        container.empty();
        self.get_ticker_data().then(function(coins){
            $.each(coins, function(index, coin_data){
                var coin = self.coins[coin_data.symbol]
                if(coin){
                    coin.update(coin_data);
                    self.total += coin.total_value;
                    coin.render(container);
                }
            });
            self.render_total(container);
            $("#coin-table").tablesorter({
                textExtraction: function(node){
                    var content = node.innerText;
                    return content.replace(/[^a-zA-Z0-9\.\-]/g,'');
                },
                headers: {
                    0: {sorter: false}
                },
                sortList: [[7,1]]
            });
        });
    }

    self.render_total = function renderTotals(container){
        $('#total').html('&euro;'+self.total.toFixed(3));
        $('#total-profit').html(render_delta(self.total-TOTAL_INVESTMENT));
        document.title = "AC €" + self.total.toFixed(2);
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
