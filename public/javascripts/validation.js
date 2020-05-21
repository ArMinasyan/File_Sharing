var correct = new Array(10);
correct.fill(false, 0, 10);


function all_true(value) {
    return value === true;
};

$(document).on('click', '#reg1', function () {
    var id = ['fname', 'lname', 'patr', 'bday', 'gnum', 'email', 'pswd1', 'pswd2'];
    id.forEach(function (value) {
        validation(value);
    });
    var valid = correct.every(all_true);
    if (valid) registration();

});

$(document).on('keyup', '#fname, #lname, #patr, #bday, #gnum, #email,#pswd1, #pswd2', function () {
    validation($(this).attr('id'));
});

$(document).on('change', '#code', function () {
    validation($(this).attr('id'));
});


function validation(id) {
    var name = $("#" + id).val();
    if (id == 'fname') {
        var name_reg = new RegExp(/[^\u0531-\u0556\u0561-\u0587]/);
        if (name_reg.test(name.toString()) || name === "") {
            style(id, 'red');
            correct[0] = false;
        } else {
            style(id, 'green');
            correct[0] = true;
        };
    } else
        if (id == 'lname') {
            var name_reg = new RegExp(/[^\u0531-\u0556\u0561-\u0587]/);
            if (name_reg.test(name.toString()) || name === "") {
                style(id, 'red');
                correct[1] = false;
            } else {
                style(id, 'green');
                correct[1] = true;
            };
        } else
            if (id == 'patr') {
                var name_reg = new RegExp(/[^\u0531-\u0556\u0561-\u0587]/);
                if (name_reg.test(name.toString()) || name === "") {
                    style(id, 'red');
                    correct[2] = false;
                } else {
                    style(id, 'green');
                    correct[2] = true;
                };
            } else if (id == 'bday') {
                var bday_reg = new RegExp(/^([012]\d|3[01])\.(0\d|1[12])\.([12][09]\d\d)$/);
                if (!bday_reg.test(name.toString()) || name === "") {
                    style(id, 'red');
                    correct[3] = false;
                } else {
                    style(id, 'green');
                    correct[3] = true;
                };
            } else if (id == 'gnum') {
                var gnum_reg = new RegExp(/(^[\u0531-\u0556])(\d{3,4}$)/);
                if (!gnum_reg.test(name.toString()) || name === "") {
                    style(id, 'red');
                    correct[4] = false;
                } else {
                    style(id, 'green');
                    correct[4] = true;
                };

            } else if (id == 'email') {
                var email_reg = new RegExp(/(^[a-zA-Z0-9_.+-]+@[a-zA-Z]+\.[a-zA-Z]+$)/);
                if (!email_reg.test(name.toString()) || name === "") {
                    style(id, 'red');
                    correct[5] = false;
                } else {
                    style(id, 'green');
                    correct[5] = true;
                };
            } else if (id == 'pswd1') {
                var pswd1_reg_alpha = new RegExp(/([a-zA-Z]{3,})/);
                var pswd1_reg_number = new RegExp(/([0-9]{3,})/);
                var pswd1_reg_symbol = new RegExp(/([~!@#$%^&*()_+=|:;<,.>?"':]{1,})/);
                if (!pswd1_reg_alpha.test(name.toString())) {
                    $('.pswd1_error1').text('Ներառված չեն տառեր');
                    style(id, 'red');
                    display(1);
                    correct[6] = false;
                } else {
                    $('.pswd1_error1').css('display', 'none');
                    correct[6] = true;
                }
                if (!pswd1_reg_number.test(name.toString())) {
                    $('.pswd1_error2').text('Ներառված չեն թվեր');
                    style(id, 'red');
                    display(2);
                    correct[7] = false;
                } else {
                    $('.pswd1_error2').css('display', 'none');
                    correct[7] = true;
                }
                if (!pswd1_reg_symbol.test(name.toString())) {
                    $('.pswd1_error3').text('Ներառված չեն նշաններ');
                    style(id, 'red');
                    display(3);
                    correct[8] = false;
                } else {
                    $('.pswd1_error3').css('display', 'none');
                    correct[8] = true;
                }
                $('.pswd1_error').css('display', 'block');
                if (correct[6] && correct[7] && correct[8]) style(id, 'green');
            };
    if (id == 'pswd2') {
        var pswd1 = $('#pswd1').val();
        var pswd2 = $('#pswd2').val();
        if (pswd1.toString() != pswd2.toString() || pswd1 == '' || pswd2 == '') {
            style(id, 'red');
            correct[9] = false;
        } else {
            style(id, 'green');
            correct[9] = true;
        }
    }
}

function style(id, color) {
    $("#" + id).css({
        'border-style': 'solid',
        'border-width': '2pt',
        'border-color': color
    });
}

function display(id) {
    $('.pswd1_error' + id).css({
        'color': 'red',
        'display': 'block'
    });
}