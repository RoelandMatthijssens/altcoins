var Coin = function Coin(symbol, name, amount){
    var self = {};
    self.symbol = symbol;
    self.name = name;
    self.amount = amount;
    self.current_price = 0;
    self.percentage_change_7d = 0;
    self.percentage_change_24h = 0;
    self.percentage_change_1h = 0;
    self.total_value = 0;

    self.render = function renderCoin(){
        var image_url = 'https://files.coinmarketcap.com/static/img/coins/32x32/'+self.name+'.png'
        var row = $('<tr class="coin">');
            $(row).append($('<td><img class="logo" src="'+image_url+'"></td>'));
        $(row).append($('<td>'+self.symbol+'</td>'));
        $(row).append($('<td>'+self.name+'</td>'));
        $(row).append($('<td>'+self.percentage_change_7d+'</td>'));
        $(row).append($('<td>'+self.percentage_change_24h+'</td>'));
        $(row).append($('<td>'+self.percentage_change_1h+'</td>'));
        $(row).append($('<td>'+self.amount.toFixed(3)+'</td>'));
        $(row).append($('<td>'+self.total_value.toFixed(3)+'</td>'));

        return row
    }
    self.getStats = function getStats(){
    }
    self.update = function update(container){
        var promise = $.getJSON(TICKER_BASE_URL+self.name+'?convert=EUR', function(data){
            self.current_price = Number(data[0].price_eur);
            self.percentage_change_7d = render_delta(data[0].percent_change_7d);
            self.percentage_change_24h = render_delta(data[0].percent_change_24h);
            self.percentage_change_1h = render_delta(data[0].percent_change_1h);
            self.total_value = self.amount * self.current_price;
        }).then(function(){
            coin = self.render();
            $(container).prepend(coin);
        });
        return promise;
    }
    self.add = function addCoin(amount){
        self.amount += amount;
    }
    return self;
}

function render_delta(value){
    value = Number(value);
    value = value.toFixed(2);
    if(value < 0)
    {
        value = 0 - value;
        return "<span class='red'>&#x25BE; " + value + "</span>";
    }else{

        return "<span class='green'>&#x25B4; " + value +  "</span>";
    }
}