$(document).ready(function(){
    $('#allcountry').dataTable( {
        language: {
            searchPlaceholder: "Search"
        }
    });

    $(document).on('click', '.removeCountry', function () {
        var $this = $(this);
        var country_id = $this.data('id');
        bootbox.confirm("Are you sure to delete this country?", function(result) {
            if(result){
                $.ajax({
                    url: '/removeCountryById?country_id=' + country_id ,
                    type: 'GET',
                    success: function (data) {
                        window.location.href = "/country";
                    },
                    error: function (error) {
                        alert('Error: ' + JSON.stringify(error));
                        window.location.href = "/country";
                    },
                });
            }
        }); 
    });

    $(document).on('click','.editCountry',function(){
        var $this=$(this);
        var country_id=$this.data('id');
                        
        $.ajax({
            url:'getCountryById?country_id='+country_id,
            type:'GET',
            success: function (data) {
                var country_data = data.country;

                //alert(" ----- data [0][1] " + JSON.stringify(data));
                $('#txtcountryname').val((typeof country_data === "undefined" ? "" : country_data[0].country_name));

                $('#countryModalTitle').html('Update Country');
                $("#countryBtn").html("Update Country");
                $('#countryform').get(0).setAttribute('action','/editCountryById?country_id='+country_id);
            },
            error:function(error){
                alert('Error:'+error);
            },
        });
    });

    $(document).on('click','#addCountry',function(){
        //$('#txtcountryname').val("");
        $('.form-text').val("");
        $('#txtcountryname').prop('readonly', false);
        $('#countryBtn').html('Add Country');
        $('#countryModalTitle').html('Add Country');
        $('#countryform').get(0).setAttribute('action','/addCountry');
        $('#countryform').find(':checkbox[name^="initial_items"]').each(function () {
            $(this).prop("checked", false);
        });
    });
    });