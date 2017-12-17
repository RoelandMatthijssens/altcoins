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

    self.render = function renderCoin(container){
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

        $(container).prepend(row);
    }
    self.update = function update(data){
        self.percentage_change_7d = render_delta(data.percent_change_7d);
        self.percentage_change_24h = render_delta(data.percent_change_24h);
        self.percentage_change_1h = render_delta(data.percent_change_1h);
        self.current_price = data.price_eur;
        self.total_value = self.current_price * self.amount;
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
        return "<span class='red'>&#x25BE; " + value + "</span>";
    }else{

        return "<span class='green'>&#x25B4; " + value +  "</span>";
    }
}
