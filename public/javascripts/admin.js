

$(document).ready(function () {
    var question = [];
    
    $.ajax({
        url: "http://localhost:3000/admin_data",
        type: 'POST',
        dataType: 'json',
        data: 'true',
        success: function (result) {
            for (var index = 0; index < result.result.length; index++) {
                $('table').append(" <tbody><tr>" + " <td><input type='text' class='input' id='flp" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].flp) + "></td>" +
                " <td width='15%'><input type='text' class='input' id='uname" + result.result[index]._id + "' disabled value=" + result.result[index].username + "></td>" +
                    " <td width='20%'><input type='text' class='input' id='pass" + result.result[index]._id + "' disabled value=" + result.result[index].password + "></td>" +
                    " <td width='20%'><input type='text' class='input' id='name" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].group_number) + "></td>" +
                    " <td><span class='glyphicon glyphicon-edit' id=" + result.result[index]._id + "></span>" +
                    "  <span class='glyphicon glyphicon-ok' id=" + result.result[index]._id + "></span>" +
                    "  <span class='glyphicon glyphicon-remove' id=" + result.result[index]._id + "></span>" +
                    " </td>" + "</tr></tbody>")
            }
        }
    });

    $(document).on('click', '.glyphicon.glyphicon-edit', function (e) {
        $('.input').prop('disabled', 'disabled');
        $('input[id=flp' + e.target.id + ']').prop('disabled', '');
        $('input[id=uname' + e.target.id + ']').prop('disabled', '');
        $('input[id=pass' + e.target.id + ']').prop('disabled', '');
        $('input[id=name' + e.target.id + ']').prop('disabled', '');

    });

    $(document).on('click', '.glyphicon.glyphicon-ok', function (e) {
        question.push({
            type: 1,
            id: e.target.id,
            uname: $('input[id=uname' + e.target.id + ']').val(),
            pass: $('input[id=pass' + e.target.id + ']').val(),
            name: $('input[id=name' + e.target.id + ']').val(),
            flp: $('input[id=flp' + e.target.id + ']').val(),
        });
    });

    $(document).on('click', '.glyphicon.glyphicon-remove', function (e) {
        question.push({
            type: 2,
            id: e.target.id,
        });
    });


    $(document).on('click', '#save', function () {
        question.push({
            type: 3,
            uname: $('#uname').val(),
            pass: $('#pass').val(),
            name: $('#name').val(),
            flp: $('#flp').val(),
        });
    });

    $(document).on('click', '#save_send', function () {
        $.ajax({
            url: 'http://localhost:3000/add_user',
            method: 'post',
            type: 'json',
            data: { d1: question, len: question.length },
        });
    });

    $(document).on('click', '#logout', function () {
        $('form').submit();
    });

    


});