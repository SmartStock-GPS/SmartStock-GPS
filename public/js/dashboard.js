$(document).ready(async (event) => {
    await fetch('/select_stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //     parameter: ''          
        // })
    })
        .then((res) => res.json())
        .then(async function (res) {
            res.forEach(element => {
                $('#stock-area').append(`
                    <div class="card">
                        <div class="card-header">
                            ${element.name}
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-md-flex d-grid">
                                <div class="flex-fill">
                                    <span>Quantity:</span>
                                    <span>${element.quantity}</span>
                                </div>
                                <div class="flex-fill">
                                    <span>Price per item:</span>
                                    <span>Rs. ${element.price}</span>
                                </div>
                                <div class="flex-fill">
                                    <span>Total Price:</span>
                                    <span>Rs. ${element.quantity * element.price}</span>
                                </div>
                                <div class="flex-fill icons-container">
                                    <icon class="material-icons">edit_note</icon>
                                    <icon class="material-icons">remove_circle</icon>
                                    <icon class="material-icons">add_circle</icon>
                                </div>
                            </li>
                        </ul>
                    </div>                
                `)
            });
        })

    $("#preloader").css("display", "none");
})

$('#add-stock').click(async (event) => {
    let name = $('#name').val();
    let quantity = $('#quantity').val();
    let price = $('#price-per-item').val();
    let total = $('#total-price').val();

    if (name == '' || quantity == '' || price == '' || total == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all the fields!',
        })
    } else {
        const date = new Date()
        const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(date)

        await fetch('/add_stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                quantity: quantity,
                price: price,
                last_updated: formattedDate
            })
        })
            .then((res) => res.json())
            .then(async function (res) {
                if (res.status) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Stock added successfully!',
                    })
                    $('#stock-area').append(`
                        <div class="card">
                            <div class="card-header">
                                ${$('#name').val()}
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-md-flex d-grid">
                                    <div class="flex-fill">
                                        <span>Quantity:</span>
                                        <span>${$('#quantity').val()}</span>
                                    </div>
                                    <div class="flex-fill">
                                        <span>Price per item:</span>
                                        <span>Rs. ${$('#price-per-item').val()}</span>
                                    </div>
                                    <div class="flex-fill">
                                        <span>Total Price:</span>
                                        <span>Rs. ${ $('#total-price').val()}</span>
                                    </div>
                                    <div class="flex-fill icons-container">
                                        <icon class="material-icons">edit_note</icon>
                                        <icon class="material-icons">remove_circle</icon>
                                        <icon class="material-icons">add_circle</icon>
                                    </div>
                                </li>
                            </ul>
                        </div>                
                    `)

                    $('#name').val('');
                    $('#quantity').val('');
                    $('#price-per-item').val('');
                    $('#total-price').val('');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                }
            })
    }
})

$('#quantity, #price-per-item').on('input', async (event) => {
    $('#total-price').val($('#quantity').val() * $('#price-per-item').val());
})