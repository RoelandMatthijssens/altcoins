var Portfolio = function Portfolio(){
    let self = {};
    self.coins = {};
    self.finished_coins = {};
    self.finished_profits  = 0;
    self.total = 0;
    self.total_profits = 0;
    self.addCoin = function addCoinToPortfolio(symbol, name, amount, price){
        coin = self.coins[symbol];
        if (!coin){
            coin = Coin(symbol, name);
            self.coins[symbol] = coin;
        }
        coin.add_buy(amount, price);
    }
    self.addFinishedCoin = function addFinishedCoinToPortfolio(symbol, name, amount, buy_price, sell_price){
        coin = self.finished_coins[symbol];
        if (!coin){
            coin = FinishedCoin(symbol, name, amount, buy_price, sell_price);
            self.finished_coins[symbol] = coin;
        }
    }

    self.get_ticker_data = function getTickerData(){
        return $.getJSON(TICKER_BASE_URL+'?convert=EUR&limit=0', function(data){
            return data;
        });
    }

    self.render = function renderPortfolio(){
        self.render_live_coins('#coin-tablerows');
        self.render_finished_coins('#finished-tablerows');
    }

    self.render_live_coins = function renderLiveCoins(container_selector){
        let container = $(container_selector);
        self.total = 0;
        self.total_investment = 0;
        self.get_ticker_data().then(function(coins){
            container.empty();
            $.each(coins, function(index, coin_data){
                let coin = self.coins[coin_data.symbol]
                if(coin && coin.name == coin_data.id){
                    coin.update(coin_data);
                    self.total_investment += coin.total_investment;
                    self.total += coin.total_value;
                    coin.render(container);
                }
            });
            self.total_profits = self.total - self.total_investment;
            $("#coin-table").trigger("update");
            self.render_total(container);
        }).then(function(){
            $("#coin-table").trigger("update");
            setTimeout(function (){
                $("#coin-table").trigger("sorton",[[[10,1]]]);
            });
        });
    }

    self.render_finished_coins = function srenderFinishedCoins(container_selector){
        let container = $(container_selector);
        container.empty();
        self.finished_profits = 0;
        $.each(self.finished_coins, function(symbol, coin){
            self.finished_profits += coin.profit
            coin.render(container);
        });
    }

    self.render_total = function renderTotals(container){
        $('#live-totals').html(
            '&euro;'+self.total_investment.toFixed(2)+' -> '+'&euro;'+self.total.toFixed(2)+' = '+render_delta(self.total-self.total_investment)
        )
        $('#finished-totals').html(render_delta(self.finished_profits.toFixed(2)));
        $('#total').html(self.total.toFixed(2));
        $('#total-profit').html(render_delta(self.total_profits+self.finished_profits));
        $('#total-profit-percentage').html(render_delta(100 * self.total_profits/self.total_investment)+"%");
        document.title = "AC €" + self.total.toFixed(2);
    }
    return self;
}
let portfolio = Portfolio();

function init(){
    coin_db.map(function(coin){
        portfolio.addCoin(coin.symbol, coin.name, coin.amount, coin.price);
    });
    finished_coin_db.map(function(coin){
        portfolio.addFinishedCoin(coin.symbol, coin.name, coin.amount, coin.buy_price, coin.sell_price);
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
