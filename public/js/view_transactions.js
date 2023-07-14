$(document).ready(async event => {
    await fetch('/view-transactions/select_transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                for (let i = 0; i < res.dates.length; i++) {
                    if (
                        i == 0 ||
                        (i != 0 &&
                            res.dates[i].split(' ')[0] !=
                            res.dates[i - 1].split(' ')[0])
                    ) {
                        $('#t_container').append(`
                        <div class="card month-card">
                            <div class="card-header text-bg-secondary">
                                <span>${res.dates[i]
                                .split(' ')[0]
                                .toUpperCase()} MONTH SALE</span>
                                <span></span>
                            </div>
                        </div>
                        `)
                    }

                    $('#t_container').append(`
                        <div class="card" id="${i}">
                        	<div class="card-header">
                        		<span>${res.dates[i]}</span>
                        		<span class="float-end"></span>
                        	</div>
                        	<ul class="list-group list-group-flush"></ul>
                        </div>
                    `)

                    res.transactions[res.dates[i]].forEach(transaction => {
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
                        `)
                    })
                }
                $('.card .list-group-item').css('display', 'none')
                calculate_monthly_sales();
            } else {
                $('#t_container').append('<h5>No transactions found</h5>')
            }
        })

    $('#preloader').css('display', 'none')
})

function calculate_monthly_sales() {
    $('.card').each(function () {
        if (!$(this).hasClass('month-card')) {
            let total = 0;
            $(this).find('.list-group-item').each(function () {
                if (!$(this).hasClass('importantRule'))
                    total += parseInt($(this).find('.flex-even').last().find('span').last().html().split(' ')[1])
            })
            $(this).find('.card-header span').last().html(`Rs. ${total}`)
        }
    })

    $('.month-card').each(function () {
        let month_total = 0;
        $(this).nextUntil('.month-card').each(function () {
            month_total += parseInt($(this).find('.card-header span').last().html().split(' ')[1])
        })
        $(this).find('.card-header span').last().html(`Rs. ${month_total}`)
    })
}

$('#export-to-pdf').click(async function (event) {
    await fetch('/view-transactions/select_transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                const { total_sales } = res
                Object.entries(res.transactions).forEach(
                    ([strDate, transactions], i) => {
                        const numTransactions = transactions.length

                        const trDate = new Date(strDate)
                        const date = trDate.getDate()
                        const month = trDate.getMonth() + 1
                        const year = trDate.getFullYear()
                        const formattedDate = [date, month, year].join('/')

                        const noBorderRowClass =
                            numTransactions > 1 ? 'class="no-border-row' : ''

                        $('#day-wise tbody').append(`
                            <tr>
                                <td rowspan="${numTransactions} noBorderRowClass">${i + 1
                            }</td>
                                <td rowspan="${numTransactions} noBorderRowClass">${formattedDate}</td>
                                <td>${transactions[0].name}</td>
                                <td>${transactions[0].quantity}</td>
                                <td>${transactions[0].selling_price}</td>
                                <td>${transactions[0].total}</td>
                                <td rowspan="${numTransactions} noBorderRowClass">${total_sales[i]
                            }</td>
                            </tr>
                        `)

                        transactions.slice(1).forEach(tr => {
                            $('#day-wise tbody').append(`
                                <tr>
                                    <td>${tr.name}</td>
                                    <td>${tr.quantity}</td>
                                    <td>${tr.selling_price}</td>
                                    <td>${tr.total}</td>
                                </tr>
                            `)
                        })
                    }
                )

                const { monthly_sales } = res
                Object.entries(monthly_sales).forEach(([month, sale], i) => {
                    $('#month-wise tbody').append(`
                        <tr>
                            <td>${i + 1}</td>
                            <td>${month}</td>
                            <td>${sale}</td>
                        </tr>
                    `)
                })

                const element = document.getElementById('pdf')
                const options = {
                    filename: 'transactions.pdf',
                    margin: 2,
                    html2canvas: { scale: 2 },
                    jsPDF: {
                        unit: 'cm',
                        format: 'a4',
                        orientation: 'portrait'
                    }
                }
                html2pdf()
                    .set(options)
                    .from(element)
                    .save()
                    .then(pdf => {
                        $('#day-wise tbody').empty()
                        $('#month-wise tbody').empty()
                    })
            }
        })
})

$('.nav-item:last a').click(async function (event) {
    await Swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#375F74',
        showDenyButton: true,
        denyButtonText: 'No'
    }).then(async res => {
        if (res.isConfirmed) {
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(res => window.location.replace('/'))
        }
    })
})

$('#search').on('input', async event => {
    query = $('#search').val().toLowerCase()
    $('.card .list-group-item').each(function () {
        if (
            $(this)
                .find('.flex-even')
                .eq(0)
                .find('span')
                .html()
                .toLowerCase()
                .includes(query)
        ) {
            $(this).removeClass('importantRule')
        } else {
            $(this).addClass('importantRule')
        }
    })

    $('.card').each(function () {
        if (
            $(this).find('.list-group-item').hasClass('importantRule') &&
            $(this).find('.list-group-item').length ==
            $(this).find('.importantRule').length
        ) {
            $(this).addClass('importantRule')
        } else {
            $(this).removeClass('importantRule')
        }
    })
    calculate_monthly_sales();
})
