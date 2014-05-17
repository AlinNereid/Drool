var valoarecurenta;
var allcurrency;
var resize=function(){
    if($timer1.val().length<30)
    {       
        if($timer1.val().length>minimalSize)
        {
            $timer1.attr({width: 'auto', size: $timer1.val().length});
        }
        else
            $timer1.attr({width: 'auto', size: minimalSize});
    }
    if($timer2.val().length<30)
    {  
        if($timer2.val().length>minimalSize)
            {
                $timer2.attr({width: 'auto', size: $timer2.val().length});
            }
            else
                $timer2.attr({width: 'auto', size: minimalSize});
    }
}
$(document).ready(function(){
        var updateTimeOut;
        var text1=$('ul.menuSearch2 li:nth-child('+2+') span').text();
        var text2=$('ul.menuSearch2 li:nth-child('+3+') span').text();
        var text3=$('ul.menuSearch2 li:nth-child('+4+') span').text();
        $('#input1').attr({width: 'auto', size: minimalSize});
        $('#input2').attr({width: 'auto', size: minimalSize});
        function getAllCurrencyReal(){
            $.ajax({
                url: "../api/currency/ALLCURRENCYREAL",
                type: "GET",
                dataType: "json",
                success: function(data){
                    allcurrency = data.allcurrencyreal;
                    console.log(allcurrency);
                }
            });
        }
        function update() {
            valoarecurenta=0;
            $.ajax({
                url: "../api/currency/"+$('#search1').text()+"/"+$('#search2').text(),
                type: "GET",
                dataType: "json",
                success: function(data){
                   valoarecurenta = data.price.toFixed(numberDecimal);
                    console.log(valoarecurenta);
                }
            });

        }

		var documentHeight = $(document).height();
		var percentageHeight = documentHeight * .1;
		if(documentHeight>500){
			$("#convertor").css("margin-top",percentageHeight );
		}
		/*$("main").css("padding-bottom",percentageHeight*4 );*/
		
		
        getAllCurrencyReal();
        update();
        updateTimeOut=setInterval(update,updateInterval);
		
        //startTimer1();
        $timer1 = $('#input1');
        $('#input1').on('input', function() {
           if($timer1.val()==""){
                    $timer1.attr({width: 'auto', size: minimalSize});
                    $timer2.val("");
                }
                else
                    $timer2.val(($timer1.val()*valoarecurenta).toFixed(numberDecimal));
                    resize()
        });

		//startTimer2();
        $timer2 = $('#input2');
        $('#input2').on('input', function() {
           if($timer2.val()==""){
                    $timer1.attr({width: 'auto', size: minimalSize});
                    $timer2.attr({width: 'auto', size: minimalSize});
                    $timer1.val("");
                }
                else
                    $timer1.val(($timer2.val()/valoarecurenta).toFixed(numberDecimal));
                    resize();
        });
        $('#textField2').on('input', function() {
            if($('#textField2').val()==""){
                $('ul.menuSearch2 li:nth-child('+2+') span').text(text1);
                $('ul.menuSearch2 li:nth-child('+3+') span').text(text2);
                $('ul.menuSearch2 li:nth-child('+4+') span').text(text3);
                for(i=0;i<3;i++){
                    var indexli=i+2;;
                    $('ul.menuSearch2 li:nth-child('+indexli+')').show();
                }
            }
            else{
                for(i=0;i<3;i++){
                    var indexli=i+2;;
                    $('ul.menuSearch2 li:nth-child('+indexli+')').show();
                }
                var currencyStartWithTextField=[];
                for(i=0;i<allcurrency.length;i++){
                    if(allcurrency[i].indexOf($('#textField2').val().toUpperCase())==0){
                        currencyStartWithTextField.push(allcurrency[i]);
                        //console.log(allcurrency[i]);
                    }
                }
                for(i=0;i<currencyStartWithTextField.length;i++){
                    if(i>2){
                        break;
                    }
                    console.log(currencyStartWithTextField[i]);
                    var indexli=i+2;;
                    $('ul.menuSearch2 li:nth-child('+indexli+') span').text(currencyStartWithTextField[i]);
                }
                for(;i<3;i++){
                    var indexli=i+2;;
                    $('ul.menuSearch2 li:nth-child('+indexli+')').hide();
                }
            }
        });
        $(document).click(function(e) {
          var target = e.target;
          console.log($(target));
          if($(target).is('label#search1') ){
            $('.menuSearch1').stop().slideDown(200);
          }
          else{
                if ($(target).is('ul.menuSearch1 li *')) {
                	console.log("da");
                    $("#search1").text(target.parentNode.textContent);

                    clearInterval(updateTimeOut);
                    update();
                    updateTimeOut=setInterval(update,updateInterval);
                }
                if($(target).is('ul.menuSearch1 li')){
                	$("#search1").text(target.textContent);
                    clearInterval(updateTimeOut);
                    update();
                    updateTimeOut=setInterval(update,updateInterval);
                }
              $('.menuSearch1').stop().slideUp(200);
        }
        if($(target).is('label#search2') || $(target).is('#textField2')){
            $('.menuSearch2').stop().slideDown(200);
          }
          else{
                if ($(target).is('ul.menuSearch2 li *')) {
                	console.log("da");
                    $("#search2").text(target.parentNode.textContent);

                    clearInterval(updateTimeOut);
                    update();
                    updateTimeOut=setInterval(update,updateInterval);
                }
                if($(target).is('ul.menuSearch2 li')){
                	$("#search2").text(target.textContent);
                    clearInterval(updateTimeOut);
                    update();
                    updateTimeOut=setInterval(update,updateInterval);
                }
            $('.menuSearch2').stop().slideUp(200);

        }
      });
	});