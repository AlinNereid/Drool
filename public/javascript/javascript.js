var valoarecurenta;
var allRealSymbols=[];
var allDigitalSnames=[];
var resize = function () {
    if ($timer1.val().length < 30) {
        if ($timer1.val().length > minimalSize) {
            $timer1.attr({width: 'auto', size: $timer1.val().length});
        }
        else
            $timer1.attr({width: 'auto', size: minimalSize});
    }
    if ($timer2.val().length < 30) {
        if ($timer2.val().length > minimalSize) {
            $timer2.attr({width: 'auto', size: $timer2.val().length});
        }
        else
            $timer2.attr({width: 'auto', size: minimalSize});
    }
}

$(document).ready(function () {
    var updateTimeOut;
    var text1 = $('ul.menuSearch2 li:nth-child(' + 2 + ') span').text();
    var text2 = $('ul.menuSearch2 li:nth-child(' + 3 + ') span').text();
    var text3 = $('ul.menuSearch2 li:nth-child(' + 4 + ') span').text();

    var t1 = $('ul.menuSearch1 li:nth-child(' + 2 + ') span').text();
    var t2 = $('ul.menuSearch1 li:nth-child(' + 3 + ') span').text();
    var t3 = $('ul.menuSearch1 li:nth-child(' + 4 + ') span').text();

    $('#input1').attr({width: 'auto', size: minimalSize});
    $('#input2').attr({width: 'auto', size: minimalSize});

    function getAllApis(digsname, callback) {
        $.ajax({
            url: "../api/coins/digital/"+digsname+"/apiTickers",
            type: "GET",
            dataType: "json",
            success: function (data) {
                var apis=[];
                for(i=0; i< data.length; i++){
                    apis.push(data[i].sname);
                }
                callback(apis)
                console.log(apis);
            }
        });
    }

    function getAllCurrencyReal() {
        $.ajax({
            url: "../api/coins/real",
            type: "GET",
            dataType: "json",
            success: function (data) {
                data=data.realCoins;
                for(i=0; i< data.length; i++){
                    allRealSymbols.push(data[i].symbol);
                }
                console.log(allRealSymbols);
            }
        });
    }

    function getDigital() {
        $.ajax({
            url: "../api/coins/digital",
            type: "GET",
            dataType: "json",
            success: function (data) {
                for(i=0; i< data.length; i++){
                    allDigitalSnames.push(data[i].sname);
                }
                console.log(allDigitalSnames);
            }
        });
    }

    getDigital();

    function update() {
        valoarecurenta = 0;
        $.ajax({
            url: "../api/currency/" + $('#search1').text() + "/" + $('#search2').text(),
            type: "GET",
            dataType: "json",
            success: function (data) {
                valoarecurenta = data.price.toFixed(numberDecimal);
                console.log(valoarecurenta);
            }
        });

    }

    var documentHeight = $(document).height();
    var percentageHeight = documentHeight * .08;
    if (documentHeight > 500) {
        $("#convertor").css("margin-top", percentageHeight);
    }
    /*$("main").css("padding-bottom",percentageHeight*4 );*/


    getAllCurrencyReal();
    update();
    updateTimeOut = setInterval(update, updateInterval);

    //startTimer1();
    $timer1 = $('#input1');
    $('#input1').on('input', function () {
        if ($timer1.val() == "") {
            $timer1.attr({width: 'auto', size: minimalSize});
            $timer2.val("");
        }
        else
            $timer2.val(($timer1.val() * valoarecurenta).toFixed(numberDecimal));
        resize()
    });

    //startTimer2();
    $timer2 = $('#input2');
    $('#input2').on('input', function () {
        if ($timer2.val() == "") {
            $timer1.attr({width: 'auto', size: minimalSize});
            $timer2.attr({width: 'auto', size: minimalSize});
            $timer1.val("");
        }
        else
            $timer1.val(($timer2.val() / valoarecurenta).toFixed(numberDecimal));
        resize();
    });
    $('#textField1').on('input', function () {
        if ($('#textField1').val() == "") {
            $('ul.menuSearch1 li:nth-child(' + 2 + ') span').text(t1);
            $('ul.menuSearch1 li:nth-child(' + 3 + ') span').text(t2);
            $('ul.menuSearch1 li:nth-child(' + 4 + ') span').text(t3);
            for (i = 0; i < 3; i++) {
                var indexli = i + 2;
                $('ul.menuSearch1 li:nth-child(' + indexli + ')').show();
            }
        }
        else {
            for (i = 0; i < 3; i++) {
                var indexli = i + 2;
                $('ul.menuSearch1 li:nth-child(' + indexli + ')').show();
            }
            var currencyStartWithTextField = [];
            for (i = 0; i < allDigitalSnames.length; i++) {
                if (allDigitalSnames[i].indexOf($('#textField1').val().toUpperCase()) == 0) {
                    currencyStartWithTextField.push(allDigitalSnames[i]);
                    //console.log(allcurrency[i]);
                }
            }
            for (i = 0; i < currencyStartWithTextField.length; i++) {
                if (i > 2) {
                    break;
                }
                console.log(currencyStartWithTextField[i]);
                var indexli = i + 2;
                $('ul.menuSearch1 li:nth-child(' + indexli + ') span').text(currencyStartWithTextField[i]);
            }
            for (; i < 3; i++) {
                var indexli = i + 2;
                $('ul.menuSearch1 li:nth-child(' + indexli + ')').hide();
            }
        }
    });
    $('#textField2').on('input', function () {
        if ($('#textField2').val() == "") {
            $('ul.menuSearch2 li:nth-child(' + 2 + ') span').text(text1);
            $('ul.menuSearch2 li:nth-child(' + 3 + ') span').text(text2);
            $('ul.menuSearch2 li:nth-child(' + 4 + ') span').text(text3);
            for (i = 0; i < 3; i++) {
                var indexli = i + 2;
                $('ul.menuSearch2 li:nth-child(' + indexli + ')').show();
            }
        }
        else {
            for (i = 0; i < 3; i++) {
                var indexli = i + 2;
                $('ul.menuSearch2 li:nth-child(' + indexli + ')').show();
            }
            var currencyStartWithTextField = [];
            for (i = 0; i < allRealSymbols.length; i++) {
                if (allRealSymbols[i].indexOf($('#textField2').val().toUpperCase()) == 0) {
                    currencyStartWithTextField.push(allRealSymbols[i]);
                    //console.log(allcurrency[i]);
                }
            }
            for (i = 0; i < currencyStartWithTextField.length; i++) {
                if (i > 2) {
                    break;
                }
                console.log(currencyStartWithTextField[i]);
                var indexli = i + 2;
                $('ul.menuSearch2 li:nth-child(' + indexli + ') span').text(currencyStartWithTextField[i]);
            }
            for (; i < 3; i++) {
                var indexli = i + 2;
                $('ul.menuSearch2 li:nth-child(' + indexli + ')').hide();
            }
        }
    });
    $(document).click(function (e) {
        var target = e.target;
        console.log($(target));
        if ($(target).is('label#search1') || $(target).is('#textField1')) {
            $('.menuSearch1').stop().slideDown(200);
        }
        else {
            if ($(target).is('ul.menuSearch1 li *')) {
                console.log("da");
                $("#search1").text(target.parentNode.textContent);

                clearInterval(updateTimeOut);
                update();
                updateTimeOut = setInterval(update, updateInterval);
            }
            if ($(target).is('ul.menuSearch1 li')) {
                $("#search1").text(target.textContent);
                clearInterval(updateTimeOut);
                update();
                updateTimeOut = setInterval(update, updateInterval);
            }
            $('.menuSearch1').stop().slideUp(200);

        }
        if ($(target).is('label#search2') || $(target).is('#textField2')) {
            $('.menuSearch2').stop().slideDown(200);
        }
        else {
            if ($(target).is('ul.menuSearch2 li *')) {
                console.log("da");
                $("#search2").text(target.parentNode.textContent);

                clearInterval(updateTimeOut);
                update();
                updateTimeOut = setInterval(update, updateInterval);
            }
            if ($(target).is('ul.menuSearch2 li')) {
                $("#search2").text(target.textContent);
                clearInterval(updateTimeOut);
                update();
                updateTimeOut = setInterval(update, updateInterval);
            }
            $('.menuSearch2').stop().slideUp(200);

        }

        if ($(target).is('span#plus1')) {
            if ($("#selectPlus1").length == 0) {
                getAllApis($("#search1").text(), function(apis){
                    var positionPlus = $("#plus1").position();
                    var heightPlus = $("#plus1").height();
                    var widthPlus = $("#plus1").width();
                    var leftDiv = positionPlus.left - 75 + widthPlus;
                    var topDiv = positionPlus.top + heightPlus + 18;

                    var myClass = { position: "absolute", left: leftDiv, top: topDiv, width: 150, fontSize: 18 };
                    $("#convertor").append('<select id="selectPlus1"></select>');
                    $("#selectPlus1").css(myClass);

                    for(var i=0; i< apis.length; i++){
                        $("#selectPlus1").append('<option>'+apis[i]+'</option>')
                    }
                });

            }
        }
        if (!$(target).is('span#plus1')) {
            if (!$(target).is('#selectPlus1'))
                $("#selectPlus1").remove();
        }
        if ($(target).is('span#plus2')) {
            if ($("#selectplus2").length == 0) {
                var positionPlus = $("#plus2").position();
                var heightPlus = $("#plus2").height();
                var widthPlus = $("#plus2").width();
                var leftDiv = positionPlus.left - 75 + widthPlus;
                var topDiv = positionPlus.top + heightPlus + 18;

                var myClass2 = { position: "absolute", left: leftDiv, top: topDiv, width: 150, fontSize: 18 };
                $("#convertor").append('<select id="selectPlus2"></select>');
                $("#selectPlus2").css(myClass2);

                $("#selectPlus2").append('<option>test0</option>')
                $("#selectPlus2").append('<option>test1</option>')
                $("#selectPlus2").append('<option>test2</option>')
            }
        }
        if (!$(target).is('span#plus2')) {
            if (!$(target).is('#selectPlus2'))
                $("#selectPlus2").remove();
        }
    });

    $( window ).resize(function() {
        $("#selectPlus1").remove();
        $("#selectPlus2").remove();
    })
});