var valoarecurenta;
var allSymbols = [];
var allDigitalSnames = [];
var api1 = "Any api";
var api2 = "Any api";
var resize = function () {
    if($timer1.val()=="NaN"){
        $timer1.val("");
    }
    if($timer2.val()=="NaN"){
        $timer2.val("");
    }
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
            url: "../api/coins/digital/" + digsname + "/apiTickers",
            type: "GET",
            dataType: "json",
            success: function (data) {
                var apis = [];
                apis.push("Any api")
                for (i = 0; i < data.length; i++) {
                    apis.push(data[i].sname);
                }
                callback(apis)
                console.log(apis);
            }
        });
    }

    function getAllSymbols() {
        $.ajax({
            url: "../api/coins",
            type: "GET",
            dataType: "json",
            success: function (data) {
                for (i = 0; i < data.length; i++) {
                    allSymbols.push({type: data[i].type, symbol: data[i].coin});
                }
                console.log(allSymbols);
            }
        });
    }

    function getDigital() {
        $.ajax({
            url: "../api/coins/digital",
            type: "GET",
            dataType: "json",
            success: function (data) {
                for (i = 0; i < data.length; i++) {
                    allDigitalSnames.push(data[i].sname);
                }
                console.log(allDigitalSnames);
            }
        });
    }

    getDigital();

    function update() {
        valoarecurenta = 0;
        var url = "../api/convertor";
        var date = {};
        if (api1 != "Any api") {
            date.api1 = api1;
        }
        if (api2 != "Any api") {
            date.api2 = api2;
        }
        date.value = 1;
        date.currency1 = $("#search1").text();
        date.currency2 = $("#search2").text();
        $.ajax({
            url: "../../api/convert",
            type: "POST",
            data: date,
            dataType: "json",
            success: function (rasp) {
                valoarecurenta=rasp.value;
                if($timer1.val()==""){
                    $timer2.val("");
                }
                else{
                    $timer2.val(($timer1.val() * valoarecurenta).toFixed(numberDecimal));
                }

                resize()
            },
            error: function () {
                console.log("error");
            }
        });
    }

    var documentHeight = $(document).height();
    var percentageHeight = documentHeight * .08;
    if (documentHeight > 500) {
        $("#convertor").css("margin-top", percentageHeight);
    }
    /*$("main").css("padding-bottom",percentageHeight*4 );*/


    getAllSymbols();
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
            for (i = 0; i < allSymbols.length; i++) {
                if (allSymbols[i].symbol.indexOf($('#textField2').val().toUpperCase()) == 0) {
                    currencyStartWithTextField.push(allSymbols[i].symbol);
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
        /*console.log($(target));*/
        if ($(target).is('label#search1') || $(target).is('#textField1')) {
            $('.menuSearch1').stop().slideDown(200);
        }
        else {
            if ($(target).is('ul.menuSearch1 li *')) {
                console.log("da");
                $("#search1").text(target.parentNode.textContent);
                api1="Any api";
                update();
            }
            if ($(target).is('ul.menuSearch1 li')) {
                $("#search1").text(target.textContent);
                api1="Any api";
                update();
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
                console.log("target " + target.parentNode.textContent);
                for (var i = 0; i < allSymbols.length; i++) {
                    if (allSymbols[i].symbol == target.parentNode.textContent) {
                        if (allSymbols[i].type == "digital") {
                            $("#plus2").show();
                        }
                        else {
                            $("#plus2").hide();
                        }
                        break;
                    }
                }
                api2="Any api";
                update();
            }
            if ($(target).is('ul.menuSearch2 li')) {
                $("#search2").text(target.textContent);
                console.log("target " + target.textContent);
                for (var i = 0; i < allSymbols.length; i++) {
                    if (allSymbols[i].symbol == target.textContent) {
                        if (allSymbols[i].type == "digital") {
                            $("#plus2").show();
                        }
                        else {
                            $("#plus2").hide();
                        }
                        break;
                    }
                }
                api2="Any api";
                update();
            }
            $('.menuSearch2').stop().slideUp(200);

        }

        if ($(target).is('span#plus1')) {
            if ($("#selectPlus1").length == 0) {
                getAllApis($("#search1").text(), function (apis) {
                    var positionPlus = $("#plus1").position();
                    var heightPlus = $("#plus1").height();
                    var widthPlus = $("#plus1").width();
                    var leftDiv = positionPlus.left - 75 + widthPlus;
                    var topDiv = positionPlus.top + heightPlus + 18;

                    var myClass = { position: "absolute", left: leftDiv, top: topDiv, width: 150, fontSize: 18 };
                    $("#convertor").append('<select id="selectPlus1"></select>');
                    $("#selectPlus1").css(myClass);

                    for (var i = 0; i < apis.length; i++) {
                        $("#selectPlus1").append('<option>' + apis[i] + '</option>')
                    }
                });

            }
        }
        if (!$(target).is('span#plus1')) {
            if (!$(target).is('#selectPlus1'))
                $("#selectPlus1").remove();
        }
        if ($(target).is('#selectPlus1')) {
            api1 = $("#selectPlus1").val();
            update();
        }
        if ($(target).is('#selectPlus2')) {
            api2 = $("#selectPlus2").val();
            update();
        }
        if ($(target).is('span#plus2')) {
            if ($("#selectPlus2").length == 0) {
                getAllApis($("#search2").text(), function (apis) {
                    var positionPlus = $("#plus2").position();
                    var heightPlus = $("#plus2").height();
                    var widthPlus = $("#plus2").width();
                    var leftDiv = positionPlus.left - 75 + widthPlus;
                    var topDiv = positionPlus.top + heightPlus + 18;

                    var myClass2 = { position: "absolute", left: leftDiv, top: topDiv, width: 150, fontSize: 18 };
                    $("#convertor").append('<select id="selectPlus2"></select>');
                    $("#selectPlus2").css(myClass2);

                    for (var i = 0; i < apis.length; i++) {
                        $("#selectPlus2").append('<option>' + apis[i] + '</option>')
                    }
                });
            }
        }
        if (!$(target).is('span#plus2')) {
            if (!$(target).is('#selectPlus2'))
                $("#selectPlus2").remove();
        }
    });

    $(window).resize(function () {
        $("#selectPlus1").remove();
        $("#selectPlus2").remove();
    })
});