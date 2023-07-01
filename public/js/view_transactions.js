$(document).ready(async (event) => {
    $("#preloader").css("display", "none");
})

$(".nav-item:last a").click(async function (event) {
    await Swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#375F74',
        showDenyButton: true,
        denyButtonText: 'No'
    }).then(async (res) => {
        if (res.isConfirmed) {
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((res) => res.json())
                .then((res) => window.location.replace('/'))
        }
    })
})