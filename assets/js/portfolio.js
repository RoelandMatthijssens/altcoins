var Portfolio = function Portfolio(){
    let self = {};
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
        let container = $('#tablerows');
        self.total = 0;
        container.empty();
        self.get_ticker_data().then(function(coins){
            $.each(coins, function(index, coin_data){
                let coin = self.coins[coin_data.symbol]
                if(coin){
                    coin.update(coin_data);
                    self.total += coin.total_value;
                    coin.render(container);
                }
            });
            $("#coin-table").trigger("update");
            self.render_total(container);
        }).then(function(){
            $("#coin-table").trigger("update");
            setTimeout(function (){
                $("#coin-table").trigger("sorton",[[[7,1]]]);
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
let portfolio = Portfolio();

function init(){
    coin_db.map(function(coin){
        portfolio.addCoin(coin.symbol, coin.name, coin.amount);
    });
    window.setInterval(portfolio.render, 5*60*1000); //update every 5 minutes
    $("#coin-table").tablesorter({
        textExtraction: function(node){
            let content = node.innerText;
            return content.replace(/[^a-zA-Z0-9\.\-]/g,'');
        },
        headers: {
            0: {sorter: false}
        },
    });
    portfolio.render();
}
