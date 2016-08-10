$(document).ready(function() {
	$('#AllUsers').dataTable( {
	    language: {
	    	searchPlaceholder: "Search"
		},
		columnDefs: [
	       { type: 'de_datetime', targets: 0 },
	       { type: 'de_date', targets: 1 }
	    ]
	});

	function getTreatingHtml(){
		var treatingHtml = "<div class='treating form-group col-sm-12'><label for='State' class='col-sm-5 form-control-label'>State</label><div class='col-sm-7'><input type='text' class='form-control' id='txtstatename' name='txtstatename' placeholder='State' required></div></div>";

	 		treatingHtml +="<div class='treating form-group col-sm-12'><label for='CIty' class='col-sm-5 form-control-label'>City</label><div class='col-sm-7'><input type='text' id='txtcityname' class='form-control' name='txtcityname' placeholder='City' required></div></div>";

	 		treatingHtml +="<div class='treating form-group col-sm-12'><label for='usertype' class='col-sm-5 form-control-label'>UserType</label><div class='col-sm-7'><select id='usertype' class='form-control' name='usertype'><option value=''>Select UserType</option><option value='Doctor'>Doctor</option><option value='HealthWorker'>HealthWorker</option><option value='Nurse'>Nurse</option></select></div></div>";
	 		
	 		treatingHtml+="<div class='treating form-group col-sm-12'><label for='usersubtype' class='col-sm-5 form-control-label'>User Sub Type</label><div class='col-sm-7'><select id='usersubtype' class=' form-control' name='usersubtype'><option value='' selected disabled>Select User Sub Type</option></select></div></div>";

	 		treatingHtml+="<div class='treating form-group col-sm-12'><label for='Clinic' class='col-sm-5 form-control-label'>Clinic</label><div class='col-sm-7'><select id='Clinic' class='form-control' name='clinic'><option value='' selected disabled>Select Clinic</option><% for(var i=0;i<clinics.length;i++){ %><option value=<%=clinics[i].clinic_name %>><%=clinics[i].clinic_name %></option><%}%></select></div></div>";

	 		treatingHtml+="<div class='treating form-group col-sm-12'><label for='FirstYearofRegistration' class='col-sm-5 form-control-label'>First Year Of Registration</label><div class='col-sm-7'><input type='text' class='form-control' id='FirstYearofRegistration' name='FirstYearofRegistration' placeholder='First Year Of Registration' required></div></div>";

	 		treatingHtml+="<div class='treating form-group col-sm-12'><label for='Gender' class='col-sm-5 form-control-label'>Gender</label><div class='col-sm-7'><label class='radio inline'><input type='radio' name='Gender' checked='true' value='Male'> Male</label><label class='radio inline'><input type='radio' name='Gender' value='Female'>Female</label></div></div>";

	 		treatingHtml+="<div class='treating form-group col-sm-12'><label for='Statuss' class='col-sm-5 form-control-label'>Status</label><div class='col-sm-7'><label class='radio inline'><input type='radio' name='Status' checked='true' value='Active'> Active</label><label class='radio inline'><input type='radio' name='Status' value='Inactive'> Inactive</label></div></div>";
	 		
		 	return treatingHtml;
	}

	$(document).on('click', '.removeUser', function () {
        var $this = $(this);
        var userId = $this.data('id');
        bootbox.confirm("Are you sure to delete this user?", function(result) {
		  	if(result){
			  	$.ajax({
                    url: '/removeUserById?userId=' + userId ,
                    type: 'GET',
                    success: function (data) {
                        window.location.href = "/users";
                    },
                    error: function (error) {
                        alert('Error: ' + JSON.stringify(error));
                        window.location.href = "/users";
                    },
                });
            }
		}); 
    });

	$(document).on('click','.addUser',function(){
		$("div.treating").remove();
		$('select#country option').removeAttr("selected");
		$('#txtemail').attr('readonly', false);
		$('.form-text').val("");

		$('#addUserBtn').html("Add User");
		$('#userModalTitle').html('Add User');
		$('#userRegistrationForm').get(0).setAttribute('action','/addUser'); 
    	
		var select_type_html = "<select name='person_type' id='person_type'class='form-control' required=''><option value='' selected disabled>Select Type of Person</option><option value='Conducting Assessment of Clinics'>Conducting Assessment of Clinics</option><option value='Treating Patients'>Treating Patients</option></select>";

		$('.person_type_div #person_type').remove();
		$('.person_type_div #hidden_persontype').remove();
		$('.person_type_div').append(select_type_html);

		$("#country option").filter(function() {
		    return $(this).text() == "Select Country";
		}).prop('selected', true);
	});

	$(document).on('click', '.editUser', function () {
        var $this = $(this);
        var userId = $this.data('id');

        $.ajax({
            url: '/getUserById?userId=' + userId ,
            type: 'GET',
            success: function (data) {
            	$('#person_type').remove();
            	$('.person_type_div #hidden_persontype').remove();
            	var getPersonType = data[0].person_type;
            	var getCountry=data[0].country;
            	$("#country option").filter(function() {
				    return $(this).text() == getCountry;
				}).prop('selected', true);
				
				var readonly_person_type_html = "<input type='text' class='form-control' id='hidden_persontype' name='hidden_persontype' readonly>";
				$('.person_type_div').append(readonly_person_type_html);
				$("#hidden_persontype").val(getPersonType);

                $('#txtfirstname').val(data[0].first_name);
                $('#txtlastname').val(data[0].last_name);
                $('#txtemail').val(data[0].email);
                $('#txtemail').attr('readonly', true);
                $('#txtPosition').val(data[0].position);
                $('#txtEmployer').val(data[0].employer);
                $('#txtMobile').val(data[0].mobile_no);

                $("div.treating").remove();
                if(getPersonType == "Treating Patients"){
					$(getTreatingHtml()).insertBefore('.form-action');
					$('#txtstatename').val(data[0].state);
					$('#txtcityname').val(data[0].city);
					$('#FirstYearofRegistration').val(data[0].first_year_registration);
                } 

                var getUserType=data[0].user_type;
            	$("#usertype option").filter(function() {
				    return $(this).text() == getUserType;
				}).prop('selected', true);

				$('#usertype').trigger( "change" );

				var getClinic=data[0].clinic_id;
            	$("#Clinic option").filter(function() {
				    return $(this).val() == getClinic;
				}).prop('selected', true);

                $('#addUserBtn').html("Update User");
                $('#userModalTitle').html("Update User");
                $('#userRegistrationForm').get(0).setAttribute('action','/editUserById/' + data[0]._id); 
            },
            error: function (error) {
                alert('Error: ' + JSON.stringify(error));
            },
        });
    });

	$(document).on('change', "#person_type", function () {
		var type=$("#person_type").val();
		if(type=="Conducting Assessment of Clinics"){
			$("div.treating").remove();
		}else if(type=="Treating Patients"){
			$("div.treating").remove();
			$(getTreatingHtml()).insertBefore('.form-action');			
		}	
	});

	$(document).on('change', "#usertype", function () {
        var val = $(this).val();
        if (val == "Doctor") {
            $("#usersubtype").html("<option value='Intern'>Intern</option>\
            	<option value='Resident'>Resident</option>\
            	<option value='Registrar'>Registrar</option>\
            	<option value='GP'>GP</option>\
            	<option value='Surgeon'>Surgeon</option>\
            	<option value='Other Specialist'>Other Specialist</option>");
        } else if (val == "HealthWorker") {
            $("#usersubtype").html("<option value='Student'>Student</option>\
                <option value='Community Health Worker'>\
                Community Health Worker</option>\
                <option value='Untrained Volunteer'>Untrained Volunteer\
                </option>");
        } else if (val == "Nurse") {
            $("#usersubtype").html("<option value='Nurse Aide'>Nurse Aide\
            	</option>\
            	<option value='Registered Nurse'>Registered Nurse</option>\
            	<option value='Midwife'>Midwife</option>");
        }
	});
});