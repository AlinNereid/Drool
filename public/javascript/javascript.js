var valoarecurenta;
var lastValCurenta;
var lastValue1 = "",
		    timerCheckCount1 = 0,
		    checkInputChange1 = function() {
		    	if($timer1.val()==""){
		    		$timer1.attr({width: 'auto', size: 3});
                    $timer2.val("");
                    lastValue1 = $timer1.val();
		    	}
		    	else
		        if (lastValue1 !== $timer1.val()||lastValCurenta!==valoarecurenta) {
		       		$timer2.val(($timer1.val()*valoarecurenta).toFixed(3));
		        	//convertor
		            if($timer1.val().length<100)
					{		
						if($timer1.val().length>3)
				  			$timer1.attr({width: 'auto', size: $timer1.val().length});
				  		else
				  			$timer1.attr({width: 'auto', size: 3});
			  		}
		            lastValue1 = $timer1.val();
                    lastValCurenta=valoarecurenta;
		        }
		    },
		    timer1 = undefined,
		    startTimer1 = function() {
		        timer1 = setInterval(checkInputChange1,50); // check input field every 200 ms (1/5 sec)
		    },
		    endTimer1 = function() {
		        clearInterval(timer1);
		    };
	var lastValue2 = "",
		    timerCheckCount2 = 0,
		    checkInputChange2 = function() {
		    	if($timer2.val()==""){
		    		$timer2.attr({width: 'auto', size: 3});
		    	}
		    	else
		        if (lastValue2 !== $timer2.val()) {

		            if($timer2.val().length<200)
					{		
						//convertor
						if($timer2.val().length>3)
				  			$timer2.attr({width: 'auto', size: $timer2.val().length});
				  		else
				  			$timer2.attr({width: 'auto', size: 3});
			  		}
		            lastValue = $timer2.val();
		        }
		    },
		    timer2 = undefined,
		    startTimer2 = function() {
		        timer2 = setInterval(checkInputChange2, 100); // check input field every 200 ms (1/5 sec)
		    },
		    endTimer2 = function() {
		        clearInterval(timer2);
		    };

	$(document).ready(function(){
        var updateTimeOut;
        function update() {
            valoarecurenta=0;
            $.ajax({
                url: "../api/currency/"+$('#search1').text()+"/"+$('#search2').text(),
                type: "GET",
                dataType: "json",
                success: function(data){
                   valoarecurenta = data.price.toFixed(3);
                    console.log(valoarecurenta);
                    lastValue1="NAN";
                    lastValue2="NAN";
                }
            });

        }

		var documentHeight = $(document).height();
		var percentageHeight = documentHeight * .1;
		if(documentHeight>500){
			$("#convertor").css("margin-top",percentageHeight );
		}
		/*$("main").css("padding-bottom",percentageHeight*4 );*/
		$timer1 = $('#input1')
		$timer2 = $('#input2')
        update();
        updateTimeOut=setInterval(update,10000);
		startTimer1();
		startTimer2();
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
                    updateTimeOut=setInterval(update,10000);
                }
                if($(target).is('ul.menuSearch1 li')){
                	$("#search1").text(target.textContent);
                    clearInterval(updateTimeOut);
                    update();
                    updateTimeOut=setInterval(update,10000);
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
                    updateTimeOut=setInterval(update,10000);
                }
                if($(target).is('ul.menuSearch2 li')){
                	$("#search2").text(target.textContent);
                    clearInterval(updateTimeOut);
                    update();
                    updateTimeOut=setInterval(update,10000);
                }
            $('.menuSearch2').stop().slideUp(200);

        }
      });
	});