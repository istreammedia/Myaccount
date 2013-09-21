function register(name,referenceId){
	//alert("name: "+name+" ReferenceId: "+referenceId);
	myApp.showPleaseWait();
	var successFunctionR =  function(data, textStatus, jqXHR) {
		$("#requestedUserName").val("");
		$("#emailId").val("");;
		myApp.hidePleaseWait();
		alert("a mail have been sent to your registered email account");
		$(".invalidErrorMessage").hide();
		$("#loginbut").trigger("click");
	};

	var errorFunctionR = function(jqXHR, textStatus, errorThrown, index, anchor) {
		myApp.hidePleaseWait();
		handleXhrError(jqXHR, textStatus, errorThrown, index, anchor);
	};
	
	$.ajax
	  ({
	    type: "POST",
	    url: "https://spark.openbillingsystem.com:8443/mifosng-provider/api/v1/selfcare",
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    data: '{userName:'+name+',uniqueReference:'+referenceId+'}',
	    beforeSend: function (xhr){ 
	    	xhr.setRequestHeader('Authorization','Basic '+base64);
			xhr.setRequestHeader('X-Mifos-Platform-TenantId','default');
	    },
	    success: successFunctionR,
		error: errorFunctionR
	});	
}
function login(userName,userPassword){
	//alert("USerName: "+userName+" and password is : "+userPassword);
	myApp.showPleaseWait();
	var successFunctionL =  function(data, textStatus, jqXHR) {
		//base64 = data.base64EncodedAuthenticationKey;
		getMainPage(data, textStatus, jqXHR,data.clientId);
		clientId = data.clientId;
		
		myApp.hidePleaseWait();
	};

	var errorFunctionL = function(jqXHR, textStatus, errorThrown, index, anchor) {
		myApp.hidePleaseWait();
		handleXhrError(jqXHR, textStatus, errorThrown, index, anchor);
	};
	
	$.ajax
	  ({
	    type: "POST",
	    url: "https://spark.openbillingsystem.com:8443/mifosng-provider/api/v1/selfcare/login?username="+userName+"&password="+userPassword+"",
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    data: '{}',
	    beforeSend: function (xhr){ 
	    	//xhr.setRequestHeader('Authorization', $.base64.encode("billing" + ":" + "password"));
	    	xhr.setRequestHeader('Authorization','Basic '+base64);
			xhr.setRequestHeader('X-Mifos-Platform-TenantId','default');
	    },
	    success: successFunctionL,
		error: errorFunctionL
	});
}
var base64;
var clientId;
var paypalUrl;

$(document).ready(function(){	
	
	var successFunction =  function(data, textStatus, jqXHR) {
		base64 = data.base64EncodedAuthenticationKey;
						
	};

	var errorFunction = function(jqXHR, textStatus, errorThrown, index, anchor) {
		handleXhrError(jqXHR, textStatus, errorThrown, index, anchor);
	};
	
	$.ajax
	  ({
	    type: "POST",
	    url: "https://spark.openbillingsystem.com:8443/mifosng-provider/api/v1/authentication?username=billing&password=billingadmin@13",//authentication?username=alice&password=axeztykyulihe"
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    data: '{}',
	    beforeSend: function (xhr){ 
	      //  xhr.setRequestHeader('Authorization', $.base64.encode("billing" + ":" + "password"));
			xhr.setRequestHeader('X-Mifos-Platform-TenantId','default');
	    },
	    success: successFunction,
		error: errorFunction
	});
	
	
	
	$("#signup").click(function(){
		register($("#requestedUserName").val(),$("#emailId").val());
	});
	$("#login").click(function(){
		login($("#userName").val(),$("#userPassword").val());
	});	
	
	$("#submit").click(function(){
		createTicket();
	});
	
	
	$("#1").click(function(){
		removeAllDetails();
		$("#profile").show();
	});
	$("#2").click(function(){
		removeAllDetails();
		$("#plan1").show();
	});
	$("#3").click(function(){
		removeAllDetails();
		$("#accountStatement").show();
	});
	$("#4").click(function(){
		removeAllDetails();
		$("#payments").show();
	});
	$("#5").click(function(){
		removeAllDetails();
		$("#tickets").show();
	});
	$("#logout").click(function(){
		signOut();
	});
	$("table #profile").hide();
	
	$("#cancel").click(
			function(){
				$("#ticketbdy").dialog("close");
				$("#errorSpace").hide();
			}
	);
	
	$("#ticketbut").click(function(){
	    
		$("#ticketbdy").dialog({
	        resizable: false,
	        height:350,
	        width: 735,
	        modal: true
	    });
		});
	
	$('#paypal').click(function(){
		//alert(paypalUrl); 
		window.open(paypalUrl, '_blank');
		});
});
	
function signOut() {
	base64 = "";
	location.reload();
	
}	
function removeAllDetails(){
	$("#profile").hide();
	$("#plan1").hide();
	$("#accountStatement").hide();
	$("#payments").hide();
	$("#signupForm").hide();
	$("#tickets").hide();
	//$("#payments").remove();
}
function handleXhrError(jqXHR, textStatus, errorThrown, index, anchor) {
	  	if (jqXHR.status === 0) {
		    alert('No connection. Verify application is running.');
	  	} else if (jqXHR.status == 401) {
			alert('Unauthorized. [401]');
		} else if (jqXHR.status == 404) {
		    alert('Requested page not found. [404]');
		} else if (jqXHR.status == 405) {
			alert('HTTP verb not supported [405]: ' + errorThrown);
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (errorThrown === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (errorThrown === 'timeout') {
		    alert('Time out error.');
		} else if (errorThrown === 'abort') {
		    alert('Ajax request aborted.');
		} else {
			var jsonErrors = JSON.parse(jqXHR.responseText);
		  	var valErrors = jsonErrors.errors;
		  	
		  	$.each(valErrors, function() {
		  	  var errorObj = new Object();
		  	  errorObj.code = this.userMessageGlobalisationCode;
		  	  $(".invalidErrorMessage").text("Incorrect detalis");
		  	  $(".invalidErrorMessage").css("color","red");
		  });
		}
}

function getMainPage(data, textStatus, jqXHR){
	$("#loginForm").remove();
	$("#logout").show();
	$("#user").show();
	$("#ads").show();
	
	//var requestType = "GET";
	
	$(".name").text(data.clientData.displayName);
	$("#user a").text(data.clientData.middlename);
	$(".accountNo").text(data.clientData.accountNo);
	$(".status").text(data.clientData.status.value);
	
	$(".activationDate").text((new Date(data.clientData.activationDate).toDateString()));
	$(".office").text(data.clientData.officeName);
	
	$("#1").trigger("click");
	
	$(".balance").text(data.clientBalanceData.balanceAmount);
	this.paypalUrl = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&rm=2&business=lingala.ashokreddy@gmail.com&item_name=first&amount="+data.clientBalanceData.balanceAmount;
	//alert(data.addressData);
	
	$(".addressNo").text(data.addressData[0].addressNo);
	$(".street").text(data.addressData[0].street);
	$(".city").text(data.addressData[0].city);
	$(".state").text(data.addressData[0].state);
	$(".country").text(data.addressData[0].country);
	$(".zip").text(data.addressData[0].zip);
	
	
	$(data.clientOrdersData).each(function(){
		$("#plansTable").append("<tr><td><span>"+$(this)[0].id+"</span></td><td><span>"+$(this)[0].plan_code+"</span></td><td><span>"+$(this)[0].contractPeriod+"</span></td><td><span>"+new Date($(this)[0].startDate).toDateString()+"</span></td><td><span>"+new Date($(this)[0].currentDate).toDateString()+"</span></td><td><span>"+$(this)[0].price+"</span></td><td><span>"+$(this)[0].status+"</span></td></tr>");
	});
	
	$(data.statementsData).each(function(){
		$("#statementsTable").append("<tr><td><span>"+$(this)[0].id+"</span></td><td><span>"+new Date($(this)[0].billDate).toDateString()+"</span></td><td><span>"+new Date($(this)[0].dueDate).toDateString()+"</span></td><td><span>"+$(this)[0].amount+"</span></td></tr>");
	});
	
	$(data.paymentsData).each(function(){
		$("#paymentsTable").append("<tr><td><span>"+$(this)[0].clientName+"</span></td><td><span>"+new Date($(this)[0].paymentDate).toDateString()+"</span></td><td><span>"+$(this)[0].amountPaid+"</span></td><td><span>"+$(this)[0].payMode+"</span></td><td><span>"+$(this)[0].receiptNo+"</span></td><td><span>"+$(this)[0].billNumber+"</span></td></tr>");
	});
	
	$(data.ticketMastersData).each(function(){
		$("#ticketsTable").append("<tr><td><span>"+$(this)[0].id+"</span></td><td><span>"+$(this)[0].priority+"</span></td><td><span>"+new Date($(this)[0].ticketDate).toDateString()+"</span></td><td><span>"+$(this)[0].problemDescription+"</span></td><td><span>"+$(this)[0].userName+"</span></td><td><span>"+$(this)[0].lastComment+"</span></td><td><span>"+$(this)[0].status+"</span></td></tr>");
	});
	
 
}

function createTicket(){
	
	myApp.showPleaseWait();		
			var serializedArray = {};
			serializedArray["assignedTo"] = "1";
			serializedArray["dateFormat"] = "dd MMMM yyyy";
			serializedArray["description"] = $("#description").val();
			serializedArray["locale"] = "en";
			serializedArray["priority"] = "HIGH";
			serializedArray["problemCode"] = $("#ticketCategory").val();
			serializedArray["ticketDate"] = $.datepicker.formatDate('dd MM yy', new Date());
	var jsonData = JSON.stringify(serializedArray);
	var successFunction = function(){
		myApp.hidePleaseWait();
		$("#errorSpace").hide();
		$("#errorSpace").text("Successfully Creted.");
		$("#errorSpace").css("color","green");
		$("#errorSpace").hide(3000);
		var successFunctionForTicket = function(data, textStatus, jqXHR){
			$("#ticketsTable tbody tr").remove();
			$(data).each(function(){
				$("#ticketsTable tbody").before("<tr><td><span>"+$(this)[0].id+"</span></td><td><span>"+$(this)[0].priority+"</span></td><td><span>"+new Date($(this)[0].ticketDate).toDateString()+"</span></td><td><span>"+$(this)[0].problemDescription+"</span></td><td><span>"+$(this)[0].userName+"</span></td><td><span>"+$(this)[0].lastComment+"</span></td><td><span>"+$(this)[0].status+"</span></td></tr>");
			});
			$("#ticketbdy").dialog('close');
		};
		var errorFunctionForTicket = function(jqXHR, textStatus, errorThrown, index, anchor){
			alert("ticket error");
		};
		executeAjaxRequest("GET", "https://spark.openbillingsystem.com:8443/mifosng-provider/api/v1/tickets/"+clientId, successFunctionForTicket, errorFunctionForTicket);			
	};
	
	var errorFunction = function(jqXHR, textStatus, errorThrown){
		$("#errorSpace").show();
		myApp.hidePleaseWait();
		var jsonErrors = JSON.parse(jqXHR.responseText);
	  	var valErrors = jsonErrors.errors;
	  	
	  	$.each(valErrors, function() {
	  	  var errorObj = new Object();
	  	  errorObj.message = this.parameterName;
	  	  if(errorObj.message.toString() === "description")
	  		  $("#errorSpace").text("Description is mandatory !");
	  	  else if(errorObj.message.toString() === "problemCode"){
	  		  $("#errorSpace").text("Category is mandatory !");
	  	  }else{
	  		$("#errorSpace").text("invalid selection !");
	  	  }
		$("#errorSpace").css("color","red");
		
	  });
	
		
	};
	
	
	$.ajax
	  ({
	    type: "POST",
	    url: "https://spark.openbillingsystem.com:8443/mifosng-provider/api/v1/tickets/"+this.clientId,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    data:jsonData, 
	    beforeSend: function (xhr){ 
	    	xhr.setRequestHeader('Authorization','Basic '+ base64);
			xhr.setRequestHeader('X-Mifos-Platform-TenantId','default');
	    },
	    success: successFunction,
		error: errorFunction
	});	
}
//'{dateFormat:dd MMMM yyyy,locale:en,ticketDate:19 August 2013,problemCode:10,priority:HIGH,assignedTo:1,description:asasasas}',

var myApp;
myApp = myApp || (function () {
    var pleaseWaitDiv = $('<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header"><h1>Processing...</h1></div><div class="modal-body"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div></div>');
    return {
        showPleaseWait: function() {
            pleaseWaitDiv.modal();
        },
        hidePleaseWait: function () {
            pleaseWaitDiv.modal('hide');
        },

    };
})();


function executeAjaxRequest(requestType,url,successFunction,errorFunction){
	$.ajax
	  ({
	    type: requestType,
	    url: url,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    data: '{}',
	    beforeSend: function (xhr){ 
	    	xhr.setRequestHeader('Authorization','Basic '+ base64);
			xhr.setRequestHeader('X-Mifos-Platform-TenantId','default');
	    },
	    success: successFunction,
		error: errorFunction
	});	
}
