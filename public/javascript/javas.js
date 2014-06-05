function getAllApis(digsname, callback) {
    $.ajax({
        url: "../api/coins/digital/" + digsname + "/apiTickers",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var apis = [];
            for (i = 0; i < data.length; i++) {
                apis.push(data[i].sname);
            }
            callback(apis);
            /*console.log(apis);*/
        }
    });
}

function getDigital(callback) {
    $.ajax({
        url: "../api/coins/digital",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var snames = [];
            for (i = 0; i < data.length; i++) {
                snames.push(data[i].sname);
            }
            callback(snames);
        }
    });
}

function getAllSymbols(callback) {
    $.ajax({
        url: "../api/coins",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var names = [];
            for (i = 0; i < data.length; i++) {
                names.push({type: data[i].type, symbol: data[i].coin});
            }
            callback(names);
        }
    });
}


var putColumn = function () {
    if ($('#selectApi').val() != null) {
        if ($('#selectCoinApi').val() != null) {
            $('#dateTime').html('DateTime: '+ new Date(Date.now()));
            var api = $('#selectApi').val();
            $('#api').before('<th>' + api + '</th>');
            $("#selectApi option:selected").remove();
            if ($('#selectApi option').size() == 1) {
                $('#api').hide();
            }
            var valoare = 0;
            var real = $('#selectCoinApi').val();
            var date = {};
            date.api1 = api;
            date.value = 1;
            date.currency1 = $('#coin').text();
            date.currency2 = real;
            $.ajax({
                url: "../../api/convert",
                type: "POST",
                data: date,
                dataType: "json",
                success: function (rasp) {
                    valoare = rasp.value;
                    $('#ratesApi').find('tr').eq(1).find('td:last').after('<td>' + valoare.toFixed(numberDecimal) +' '+real+'</td>')
                },
                error: function () {
                    console.log("error");
                }
            });
        } else {
            alert('Please choose a reference currency');
        }

    }
    else {
        alert("Please select an api")
    }

}

var addColumnCoin = function () {
    if ($('#selectCoin').val() != null) {
        $('#ratesCoins').find('tr').eq(0).find('th:last').before('<th>' + $('#selectCoin').val() + '</th>')
        var rows = $('#ratesCoins').find('tr');
        var lungime = rows.length;
        var valoarecurenta = 0;
        var date = {};
        date.value = 1;
        date.currency2 = $('#selectCoin').val();
        for (var i = 1; i < lungime - 1; i++) {
            (function (i) {
                date.currency1 = rows.eq(i).find('td:first').text();
                $.ajax({
                    url: "../../api/convert",
                    type: "POST",
                    data: date,
                    dataType: "json",
                    success: function (rasp) {
                        valoarecurenta = rasp.value;
                        rows.eq(i).find('td:last').after('<td>' + valoarecurenta.toFixed(numberDecimal) + '</td>')
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            })(i);
        }
    } else {
        alert("Please select a coin");
    }

    $("#selectCoin option:selected").remove();

}

var addRowCoin = function () {
    if ($('#selectDigital').val() != null) {
        var lastRow = $('#ratesCoins tr:last');
        var lungime = $('#ratesCoins').find('tr').eq(1).find('td').length;
        var coloane = '<td>' + $('#selectDigital').val() + '</td>';
        var ths = $('#ratesCoins').find('tr').find('th');
        var valoarecurenta = 0;
        var date = {};
        date.value = 1;
        date.currency1 = $('#selectDigital').val();
        lastRow.before('<tr>' + coloane + '</tr>');
        var lungimeRows = $('#ratesCoins').find('tr').length;
        var row = $('#ratesCoins').find('tr').eq(lungimeRows - 2);
        $("#selectDigital option:selected").remove();
        if ($('#selectDigital option').size() == 1) {
            $('#ratesCoins tr:last td').hide();
        }
        for (var i = 1; i < lungime; i++) {
            (function (i) {
                date.currency2 = ths.eq(i).text();
                $.ajax({
                    url: "../../api/convert",
                    type: "POST",
                    data: date,
                    dataType: "json",
                    success: function (rasp) {
                        valoarecurenta = rasp.value;
                        row.append('<td>' + valoarecurenta.toFixed(numberDecimal) + '</td>');
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            })(i);
        }
    }
    else {
        alert("Please select a coin");
    }
}


var changeRowCoin = function () {
    if ($('#changeCurrency').val() != null) {
        if ($('#selectCoinApi').val() != null) {
            $('#dateTime').html('DateTime: '+ new Date(Date.now()));
            var real = $('#selectCoinApi').val();
            $('#coin').html($('#changeCurrency').val());
            $("#changeCurrency option").each(function () {
                if ($(this).text() != "Change currency") {
                    $(this).remove();
                }
            });

            getDigital(function (snames) {
                for (var i = 0; i < snames.length; i++) {
                    if (snames[i] != $('#coin').text()) {
                        $("#changeCurrency").append('<option>' + snames[i] + '</option>')
                    }
                }
            });
            $("#selectApi option").each(function () {
                if ($(this).text() != "Add api") {
                    $(this).remove();
                }
            });

            for (var i = $('#ratesApi tr th').length - 1; i >= 1; i--) {
                $('#ratesApi tr').eq(1).find('td').eq(i).remove();
            }
            for (var i = $('#ratesApi tr th').length - 2; i >= 1; i--) {
                $('#ratesApi tr th').eq(i).remove();
            }
            getAllApis($('#coin').text(), function (apis) {
                /*console.log($("#selectApi"));*/

                if (apis.length == 2) {
                    $('#api').before('<th>' + apis[0] + '</th>');
                    $('#api').before('<th>' + apis[1] + '</th>');
                    $('#api').hide();
                }
                if (apis.length > 2) {
                    $('#api').before('<th>' + apis[0] + '</th>');
                    $('#api').before('<th>' + apis[1] + '</th>');
                    for (var i = 2; i < apis.length; i++) {
                        $("#selectApi").append('<option>' + apis[i] + '</option>')
                    }
                    $('#api').show();
                }

                if (apis.length == 1) {
                    $('#api').before('<th>' + apis[0] + '</th>');
                    $('#api').hide();
                }

                var ths1 = $('#ratesApi tr th');
                var lung1 = ths1.length;
                for (var i = 1; i < lung1 - 1; i++) {
                    (function (i) {
                        var date = {};
                        date.api1 = ths1.eq(i).text();
                        date.value = 1;
                        date.currency1 = $('#coin').text();
                        date.currency2 = real;
                        $.ajax({
                            url: "../../api/convert",
                            type: "POST",
                            data: date,
                            dataType: "json",
                            success: function (rasp) {
                                valoare = rasp.value;
                                /*console.log(valoare);*/
                                $('#ratesApi').find('tr').eq(1).append('<td>' + valoare.toFixed(numberDecimal) +' '+real+'</td>')
                            },
                            error: function () {
                                console.log("error");
                            }
                        });
                    })(i);
                }
            });
        } else {
            alert("Please choose a referece currency");
        }
    }
    else {
        alert("Please select a coin");
    }

}


$(document).ready(function () {


    getAllApis($('#coin').text(), function (apis) {
        if (apis.length <= 2) {
            $('#api').hide();

        } else {
            if (apis.length > 2) {
                $('#api').show();
                for (var i = 2; i < apis.length; i++) {
                    $("#selectApi").append('<option>' + apis[i] + '</option>')
                }
            }

        }
    });

    getAllSymbols(function (names) {
        for (var i = 0; i < names.length; i++) {
            $("#selectCoinApi").append('<option value="'+names[i].symbol+'">' + names[i].symbol + '</option>')
        }
        //console.log("marime api " + apis.length);
        $("#selectCoinApi option[value='USD']").attr('selected', 'selected');
    });

   /* $('#selectCoinApi').val('USD');*/

    getDigital(function (snames) {
        console.log("symbols " + snames);
        for (var i = 1; i < snames.length; i++) {
            $("#changeCurrency").append('<option>' + snames[i] + '</option>')
        }
    });


    getAllSymbols(function (names) {
        for (var i = 0; i < names.length; i++) {
            $("#selectCoin").append('<option>' + names[i].symbol + '</option>')
        }
    });

    getDigital(function (snames) {
        for (var i = 0; i < snames.length; i++) {
            if (snames[i] != $('#ratesCoins td:first').text())
                $("#selectDigital").append('<option>' + snames[i] + '</option>')
        }
    });

    $('#selectCoinApi').on('change', '', function () {
        var optionSelected = $(this).find("option:selected");
        var real = optionSelected.val();
        var ths1 = $('#ratesApi tr th');
        var lung1 = ths1.length;
        $('#dateTime').html('DateTime: '+ new Date(Date.now()));
        for (var i = 1; i < lung1 - 1; i++) {
            (function (i) {
                var date = {};
                date.api1 = ths1.eq(i).text();
                date.value = 1;
                date.currency1 = $('#coin').text();
                date.currency2 = real;
                $.ajax({
                    url: "../../api/convert",
                    type: "POST",
                    data: date,
                    dataType: "json",
                    success: function (rasp) {
                        valoare = rasp.value;
                        /*console.log(valoare);*/
                        $('#ratesApi tr td').eq(i).html(valoare.toFixed(numberDecimal)+" "+real);
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            })(i);
        }
    });

});

