$(document).ready(function() {
	$('#AllAdmin').dataTable( {
	    language: {
	    	searchPlaceholder: "Search"
		}
	});

	$(document).on('click', '.addAdmin', function () {
		$('#txtemail').attr('readonly', false);
		$('select#country option').removeAttr("selected");
		$('.form-text').val("");

		$('#adminSubmitBtn').html("Add Admin");
		$('#adminModalTitle').html('Add Admin');
		$('#adminRegistrationForm').get(0).setAttribute('action','/addAdmin'); 

		$("#country option").filter(function() {
		    return $(this).text() == "Select Country";
		}).prop('selected', true);
    });

	$(document).on('click', '.removeAdmin', function () {
        var $this = $(this);
        var adminId = $this.data('id');
        bootbox.confirm("Are you sure to delete this admin?", function(result) {
		  	if(result){
			  	$.ajax({
                    url: '/removeAdminById?adminId=' + adminId ,
                    type: 'GET',
                    success: function (data) {
                        window.location.href = "/admins";
                    },
                    error: function (error) {
                        alert('Error: ' + JSON.stringify(error));
                        window.location.href = "/admins";
                    },
                });
            }
		}); 
    });

	$(document).on('click', '.editAdmin', function () {
        var $this = $(this);
        var adminId = $this.data('id');

        $.ajax({
            url: '/getAdminById?adminId=' + adminId ,
            type: 'GET',
            success: function (data) {
                $('#txtfirstname').val(data[0].first_name);
                $('#txtlastname').val(data[0].last_name);
                $('#txtemail').val(data[0].email);
                $('#txtemail').attr('readonly', true);
                var getCountry=data[0].country;
            	$("#country option").filter(function() {
				    return $(this).text() == getCountry;
				}).prop('selected', true);

                $('#txtstatename').val(data[0].state);
                $('#txtcityname').val(data[0].city);

                $('#adminModalTitle').html("Update Admin");
                
                $("#adminSubmitBtn").html("Update Admin");
                
                $('#adminRegistrationForm').get(0).setAttribute('action','/editAdminById/' + data[0]._id); 
            },
            error: function (error) {
                alert('Error: ' + JSON.stringify(error));
            },
        });

    });
});