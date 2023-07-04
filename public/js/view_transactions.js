$(document).ready(async (event) => {
    await fetch('/view-transactions/select_transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.status) {
                for (let i = 0; i < res.dates.length; i++) {
                    if (i == 0 || (i != 0 && res.dates[i].split(" ")[0] != res.dates[i - 1].split(" ")[0])) {
                        $("#t_container").append(`
                        <div class="card month-card">
                            <div class="card-header text-bg-secondary">
                                <span>${res.dates[i].split(" ")[0].toUpperCase()} MONTH SALE</span>
                                <span>Rs. ${res.monthly_sales[res.dates[i].split(" ")[0]]}</span>
                            </div>
                        </div>
                        `);
                    }

                    $("#t_container").append(`
                        <div class="card" id="${i}">
                        	<div class="card-header">
                        		<span>${res.dates[i]}</span>
                        		<span class="float-end">Rs. ${res.total_sales[i]}</span>
                        	</div>
                        	<ul class="list-group list-group-flush"></ul>
                        </div>
                    `);

                    res.transactions[res.dates[i]].forEach((transaction) => {
                        $(`#${i} ul`).append(`
                            <li class="list-group-item d-md-flex d-grid">
                                <div class="flex-even">
                                    <span>${transaction.name}</span>
                                </div>
                                <div class="flex-even">
                                    <span>Quantity:</span>
                                    <span>${transaction.quantity}</span>
                                </div>
                                <div class="flex-even">
                                    <span>SP/Item:</span>
                                    <span>Rs. ${transaction.selling_price}</span>
                                </div>
                                <div class="flex-even">
                                    <span>Total Price:</span>
                                    <span>Rs. ${transaction.total}</span>
                                </div>
                            </li>
                        `);
                    })
                }
                $('.card .list-group-item').css('display', 'none');
            } else {
                $("#t_container").append("<h5>No transactions found</h5>");
            }
        })

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

$('#search').on('input', async (event) => {
    query = $('#search').val().toLowerCase();
    $('.card .list-group-item').each(function () {
        if ($(this).find('.flex-even').eq(0).find('span').html().toLowerCase().includes(query)) {
            $(this).removeClass('importantRule');
        } else {
            $(this).addClass('importantRule');
        }
    })

    $('.card').each(function () {
        if ($(this).find('.list-group-item').hasClass('importantRule') && $(this).find('.list-group-item').length == $(this).find('.importantRule').length) {
            $(this).addClass('importantRule');
        } else {
            $(this).removeClass('importantRule');
        }
    })
})