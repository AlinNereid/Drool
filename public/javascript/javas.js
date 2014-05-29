/**
 * Created by alin on 5/26/14.
 */

function getAllApis(digsname, callback) {
    $.ajax({
        url: "../api/coins/digital/" + digsname + "/apiTickers",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var apis = [];
            for (i = 0; i < data.length; i++) {
                apis.push( data[i].sname);
            }
            callback(apis)
            console.log(apis);
        }
    });
}

function getDigital(callback) {
    $.ajax({
        url: "../api/coins/digital",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var snames=[];
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
            var names=[];
            for (i = 0; i < data.length; i++) {
                names.push({type: data[i].type, symbol: data[i].coin});
            }
            callback(names);
        }
    });
}


var putColumn=function(){
    if($('#selectApi').val()!=null){
        $('#ratesApi').find('tr').eq(0).find('th:last').before('<th>'+$('#selectApi').val()+'</th>')
        var valoare=0;
        var real="";
        $.ajax({
            url: "../api/coins/digital/" + $('#coin').text() + "/apiTickers/"+$('#selectApi').val(),
            type: "GET",
            dataType: "json",
            success: function (data) {
                real=data.realsname;
                var date = {};
                date.api1 = $('#selectApi').val();
                date.value = 1;
                date.currency1=$('#coin').text();
                date.currency2 =real;
                $.ajax({
                    url: "../../api/convert",
                    type: "POST",
                    data: date,
                    dataType: "json",
                    success: function (rasp) {
                        valoare=rasp.value;
                        $('#ratesApi').find('tr').eq(1).find('td:last').after('<td>'+valoare.toFixed(numberDecimal)+'</td>')
                        $( "#selectApi option:selected" ).remove();
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            }
        });
    }
    else{
        alert("Please select an api")
    }

}

var addColumnCoin=function(){
    if($('#selectCoin').val()!=null){
        $('#ratesCoins').find('tr').eq(0).find('th:last').before('<th>'+$('#selectCoin').val()+'</th>')
        var rows=$('#ratesCoins').find('tr');
        var lungime=rows.length;
        var valoarecurenta=0;
        var date = {};
        date.value = 1;
        date.currency2 = $('#selectCoin').val();
        for(var i=1; i< lungime-1; i++){
            (function(i){
                date.currency1 =rows.eq(i).find('td:first').text();
                $.ajax({
                    url: "../../api/convert",
                    type: "POST",
                    data: date,
                    dataType: "json",
                    success: function (rasp) {
                        valoarecurenta=rasp.value;
                        rows.eq(i).find('td:last').after('<td>'+valoarecurenta.toFixed(numberDecimal)+'</td>')
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            })(i);
        }
    } else{
        alert("Please select a coin");
    }

    $( "#selectCoin option:selected" ).remove();

}

var addRowCoin=function(){
    if($('#selectDigital').val()!=null){
        var lastRow=$('#ratesCoins tr:last');
        var lungime=$('#ratesCoins').find('tr').eq(1).find('td').length;
        var coloane='<td>'+$('#selectDigital').val()+'</td>';
        var ths=$('#ratesCoins').find('tr').find('th');
        var valoarecurenta=0;
        var date = {};
        date.value = 1;
        date.currency1= $('#selectDigital').val();
        lastRow.before('<tr>'+coloane+'</tr>');
        var lungimeRows=$('#ratesCoins').find('tr').length;
        var row=$('#ratesCoins').find('tr').eq(lungimeRows-2);
        for(var i=1; i< lungime; i++){
            (function(i){
                date.currency2 = ths.eq(i).text();
                $.ajax({
                    url: "../../api/convert",
                    type: "POST",
                    data: date,
                    dataType: "json",
                    success: function (rasp) {
                        valoarecurenta=rasp.value;
                        row.append('<td>'+valoarecurenta.toFixed(numberDecimal)+'</td>');
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            })(i);
        }
    }
    else{
        alert("Please select a coin");
    }

    $( "#selectDigital option:selected" ).remove();

}


var changeRowCoin=function(){
    if($('#changeCurrency').val()!=null){
        $('#coin').html($('#changeCurrency').val());
        $("#changeCurrency option").each(function()
        {
            if($(this).text()!= "Change currency"){
                $(this).remove();
            }
        });

        getDigital(function(snames){
            for (var i = 0; i < snames.length; i++) {
                if(snames[i]!=$('#coin').text()){
                    $("#changeCurrency").append('<option>' + snames[i] + '</option>')
                }
            }
        });
        $("#selectApi option").each(function()
        {
            if($(this).text()!= "Add api"){
                $(this).remove();
            }
        });

        for(var i=$('#ratesApi tr th').length-1;i>=1;i--){
            $('#ratesApi tr').eq(1).find('td').eq(i).remove();
        }
        for(var i= $('#ratesApi tr th').length-2; i>=1; i--){
            $('#ratesApi tr th').eq(i).remove();
        }
        getAllApis($('#coin').text(), function (apis) {
            /* console.log( $("#selectApi"));*/
            if(apis.length>=2){
                $('#ratesApi tr').eq(0).find('th:last').before('<th>'+apis[0]+'</th>');
                $('#ratesApi tr').eq(0).find('th:last').before('<th>'+apis[1]+'</th>');
                for (var i = 2; i < apis.length; i++) {
                    $("#selectApi").append('<option>' + apis[i] + '</option>')
                }
            }
            else{
                $('#ratesApi tr').eq(0).find('th:last').before('<th>'+apis[0]+'</th>');
                for (var i = 1; i < apis.length; i++) {
                    $("#selectApi").append('<option>' + apis[i] + '</option>')
                }
            }
            /* $('#ratesApi tr').eq(0).append(lastTh);*/
            var ths1=$('#ratesApi tr th');
            var lung1=ths1.length;
            for(var i=1; i<lung1-1; i++){
                (function(i){
                    var real="";
                    $.ajax({
                        url: "../api/coins/digital/" + $('#coin').text() + "/apiTickers/"+ths1.eq(i).text(),
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            real=data.realsname;
                            console.log(real);
                            var date = {};
                            date.api1 = ths1.eq(i).text();
                            date.value = 1;
                            date.currency1=$('#coin').text();
                            date.currency2 =real;
                            $.ajax({
                                url: "../../api/convert",
                                type: "POST",
                                data: date,
                                dataType: "json",
                                success: function (rasp) {
                                    valoare=rasp.value;
                                    console.log(valoare);
                                    $('#ratesApi').find('tr').eq(1).append('<td>'+valoare.toFixed(numberDecimal)+'</td>')
                                },
                                error: function () {
                                    console.log("error");
                                }
                            });
                        }
                    });
                })(i);
            }
        });
    } else{
        alert("Please select a coin");
    }

//    $( "#changeCurrency option:selected" ).remove();
}

$(document).ready(function () {


    getAllApis($("#coin").text(), function (apis) {
        for (var i = 0; i < apis.length; i++) {
            $("#selectApi").append('<option>' + apis[i] + '</option>')
        }
    });

    getDigital(function(snames){
        for (var i = 0; i < snames.length; i++) {
            $("#changeCurrency").append('<option>' + snames[i] + '</option>')
        }
    });

    getAllSymbols(function(names){
        for (var i = 0; i < names.length; i++) {
            $("#selectCoin").append('<option>' + names[i].symbol + '</option>')
        }
    });

    getDigital(function(snames){
        for (var i = 0; i < snames.length; i++) {
            $("#selectDigital").append('<option>' + snames[i] + '</option>')
        }
    });

});
