/**
 * Created by alin on 5/18/14.
 */
$(document).ready(function(){
    $("#parse").click(function(event)
    {
        event.preventDefault(); // cancel default behavior
        var uriEncodat = encodeURIComponent($("input[name='urlTicker']").val());
        $.ajax({
            url: "/api/parse/?url="+uriEncodat,
            type: "POST",
            dataType: "json",
            success: function(data){
                if(data != false){
                    var str = JSON.stringify(data, undefined, 4);
                    $("#prejSON").text(str);
                }else{
                    $("#prejSON").text("Error, invalid link!");
                }
            }
        });
    });
});