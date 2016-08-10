$(document).ready(function() {
	$("#adminLoginBtn").click(function() {
	  	var $this = $(this);
        var admin_email = $('#txtemail').val();
        var admin_password = $('#txtpassword').val();
        var admin = {
            txtemail : $('#txtemail').val(),
            txtpassword : $('#txtpassword').val()
        }
        $(".fail_message_container").empty();
	  	$.ajax({
            url: '/adminLogin' ,
            type: 'POST',
            dataType: 'json',
            data: admin,
            success: function (data) {
            	var error_message = data.result;
            	var html ="<div class='alert alert-danger alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Fail! </strong>" + error_message.fail +"</div>";
            	if(error_message.fail == 'Admin Not found' || error_message.fail == 'Invalid Credentials'){
            		$('.fail_message_container').append(html);
            	} else {
            		window.location.href = "/";
            	}
            },
            error: function (error) {
                alert('Error: ' + JSON.stringify(error));
                window.location.href = "/login";
            },
        });
	});
});