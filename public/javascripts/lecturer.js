$(document).on('click', '#allow', function (e) {
    $('#tbl').css('display', 'none');

    $('#tbl_1').css('display', 'block');
    var string;
    $.ajax({
        url: "http://localhost:3000/allow_file",
        type: 'post',
        dataType: 'json',
        data: { gr: $('#gr').val() },
        success: function (result) {
            for (var index = 0; index < result.result.length; index++) {
                string = '<input style="width:90%; background:none; border:none; text-align:center;" disabled type="text" value=' + JSON.stringify(result.result[index].flp) + '>';
                $('#table_1').append(" <tbody><tr>" + "<td style='width:70%; text-align:center;'>" + string + '</td>' +
                    "<td><input type='checkbox' class='allow' id='" + result.result[index]._id + "' style='margin-left:50%'>" +
                    " </td>" + "</tr></tbody>");
            }
        },
    });
});


