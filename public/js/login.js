$(document).ready(async (event) => {
    $("#preloader").css("display", "none");
});

$("#login-form").on('submit', async (event) => {
    event.preventDefault();
    await fetch('/check-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: $("#username").val(),
            password: $("#password").val()
        })
    })
        .then(res => res.json())
        .then(async function (res) {
            if (res.status) {
                window.location.replace("/");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid username or password!',
                })
            }
        })
});

$(".material-icons").mouseup(async function (event) {
    $(this).html("visibility_off");
    $('#password').prop('type', 'password');
})

$(".material-icons").mousedown(async function (event) {
    $(this).html("visibility");
    $('#password').prop('type', 'text');
})