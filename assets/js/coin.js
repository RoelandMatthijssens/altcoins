var Coin = function Coin(symbol, name){
    let self = {};
    self.symbol = symbol;
    self.name = name;
    self.amount = 0;
    self.current_price = 0;
    self.percentage_change_7d = 0;
    self.percentage_change_24h = 0;
    self.percentage_change_1h = 0;
    self.total_value = 0;
    self.total_investment = 0;
    self.purchases = [];

    self.render = function renderCoin(container){
        let image_url = 'https://files.coinmarketcap.com/static/img/coins/32x32/'+self.name+'.png'
        let row = $('<tr class="coin">');
        $(row).append($('<td><img class="logo" src="'+image_url+'"></td>'));
        $(row).append($('<td><a href="' + self.get_market_cap_url() + '" target="_blank">' + self.symbol + '</a></td>'));
        $(row).append($('<td>'+self.name+'</td>'));
        $(row).append($('<td>'+render_delta(self.percentage_change_7d)+'</td>'));
        $(row).append($('<td>'+render_delta(self.percentage_change_24h)+'</td>'));
        $(row).append($('<td>'+render_delta(self.percentage_change_1h)+'</td>'));
        $(row).append($('<td>'+self.total_investment.toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.amount.toFixed(2)+'</td>'));
        $(row).append($('<td>'+Number(self.current_price).toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.total_value.toFixed(2)+'</td>'));
        $(row).append($('<td>'+render_delta(self.total_profit)+'</td>'));
        $(row).append($('<td>'+render_delta(100*self.total_profit/self.total_investment)+'</td>'));

        $(container).prepend(row);
    }

    self.get_market_cap_url = function getMarketCapUrl(){
        return MARKET_CAP_URL+'currencies/' + self.name;
    }

    self.update = function update(data){
        self.percentage_change_7d = data.percent_change_7d;
        self.percentage_change_24h = data.percent_change_24h;
        self.percentage_change_1h = data.percent_change_1h;
        self.current_price = data.price_eur;
        self.calculate_total_investment();
        self.total_value = self.current_price * self.amount;
        self.total_profit = self.total_value - self.total_investment;
    }
    self.add_buy = function addBuy(amount, price){
        self.purchases.push({amount: amount, price: price});
    }

    self.calculate_total_investment = function calculateInvestment(){
        self.total_investment = 0;
        self.amount = 0;
        $.each(self.purchases, function(index, purchase){
            self.amount += purchase.amount;
            self.total_investment += purchase.price * purchase.amount;
        });
    }
    return self;
}

function render_delta(value){
    value = Number(value);
    value = value.toFixed(2);
    if(value < 0)
    {
        return "<span class='red'>&#x25BE; " + value + "</span>";
    }else{

        return "<span class='green'>&#x25B4; " + value +  "</span>";
    }
}
