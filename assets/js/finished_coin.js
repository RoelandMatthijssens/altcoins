var FinishedCoin = function FinishedCoin(symbol, name, amount, buy_price, sell_price){
    let self = {};
    self.symbol = symbol;
    self.name = name;
    self.amount = amount;
    self.sell_price = sell_price;
    self.buy_price = buy_price;
    self.value = amount*sell_price;
    self.investment = amount*buy_price;
    self.profit = self.value - self.investment;

    self.render = function renderCoin(container){
        let image_url = 'https://files.coinmarketcap.com/static/img/coins/32x32/'+self.name+'.png'
        let row = $('<tr class="coin">');
        $(row).append($('<td><img class="logo" src="'+image_url+'"></td>'));
        $(row).append($('<td><a href="' + self.get_market_cap_url() + '" target="_blank">' + self.symbol + '</a></td>'));
        $(row).append($('<td>'+self.name+'</td>'));
        $(row).append($('<td>'+self.investment.toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.amount.toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.buy_price.toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.sell_price.toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.value.toFixed(2)+'</td>'));
        $(row).append($('<td>'+self.profit.toFixed(2)+'</td>'));

        $(container).prepend(row);
    }

    self.get_market_cap_url = function getMarketCapUrl(){
        return MARKET_CAP_URL+'currencies/' + self.name;
    }

    return self;
}
