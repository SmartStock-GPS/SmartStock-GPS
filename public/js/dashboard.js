let update_id = '';

$(document).ready(async (event) => {
    await fetch('/select_stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then(async function (res) {
            if (res.status) {
                res.items.forEach(element => {
                    $('#stock-area').append(`
                    <div class="card">
                        <div class="card-header">
                            ${element.name}
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-md-flex d-grid">
                                <div class="flex-fill">
                                    <span>Quantity:</span> 
                                    <span id="q-${element._id}">${element.quantity}</span>
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
                                    <button class="material-icons" onclick="edit('${element.name}')">edit_note</button>
                                    <div class="btn-box">
                                        <input type="text" id="rem-${element._id}" maxlength="5">
                                        <button class="material-icons" onclick="update('${element._id}',false)">remove_circle</button>
                                    </div>
                                    <div class="btn-box">
                                        <input type="text" id="add-${element._id}" maxlength="5">
                                        <button class="material-icons" onclick="update('${element._id}',true)">add_circle</button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>                
                `)
                    $('.btn-box input').keypress(async function (event) {
                        var keycode = event.which;
                        if (keycode < 48 || keycode > 57)
                            event.preventDefault();
                    });
                });
            }
        })

    $("#preloader").css("display", "none");
})

$('#btnCollapse').click((event) => {
    $("#add-stock").html("Add");
    $("#quantity").prop('disabled', false);
    $('#name').val('');
    $('#quantity').val('');
    $('#price-per-item').val('');
    $('#total-price').val('');
})

$('#add-stock').click(async function (event) {
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
        $('body').unbind('click');
        if ($(this).html() == "Add") {
            await fetch('/add_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    quantity: quantity,
                    price: price
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
                        let content = $('#stock-area').html();
                        $('#stock-area').html(`
                            <div class="card">
                                <div class="card-header">
                                    ${$('#name').val()}
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-md-flex d-grid">
                                        <div class="flex-fill">
                                            <span>Quantity:</span>
                                            <span id="q-${res.id}">${$('#quantity').val()}</span>
                                        </div>
                                        <div class="flex-fill">
                                            <span>Price per item:</span>
                                            <span>Rs. ${$('#price-per-item').val()}</span>
                                        </div>
                                        <div class="flex-fill">
                                            <span>Total Price:</span>
                                            <span>Rs. ${$('#total-price').val()}</span>
                                        </div>
                                        <div class="flex-fill icons-container">
                                            <button class="material-icons" onclick="edit('${$('#name').val()}')">edit_note</button>
                                            <div class="btn-box">
                                                <input type="text" id="rem-${res.id}" maxlength="5">
                                                <button class="material-icons" onclick="update('${res.id}',false)">remove_circle</button>
                                            </div>
                                            <div class="btn-box">
                                                <input type="text" id="add-${res.id}" maxlength="5">
                                                <button class="material-icons" onclick="update('${res.id}',true)">add_circle</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>` + content);
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
        } else {
            await fetch('/update_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: update_id,
                    name: name,
                    quantity: quantity,
                    price: price
                })
            })
                .then((res) => res.json())
                .then(async function (res) {
                    if (res.status) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Stock updated successfully!',
                        }).then(() => window.location.reload())
                    }
                })
        }
        $('body').bind('click');
    }
})

$('#quantity, #price-per-item').on('input', async (event) => {
    $('#total-price').val($('#quantity').val() * $('#price-per-item').val());
})

async function edit(item_name) {
    $("#collapseExample").collapse("show");
    $("#add-stock").html("Update");
    $("#quantity").prop('disabled', true);

    await fetch('/select_stock_from_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: item_name
        })
    })
        .then((res) => res.json())
        .then(async function (res) {
            update_id = res._id;
            $('#name').val(item_name);
            $('#quantity').val(res.quantity);
            $('#price-per-item').val(res.price);
            $('#total-price').val(res.quantity * res.price);
        })
}

async function update(_id, incre) {
    if (incre) {
        if ($('#add-' + _id).val() == '')
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter quantity to update!',
            })
        else {
            await fetch('/increment_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: _id,
                    quantity: $('#add-' + _id).val()
                })
            })
                .then((res) => res.json())
                .then(async function (res) {
                    if (res.status) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Stock incremented successfully!',
                        }).then(() => window.location.reload())
                    }
                })
        }
    } else {
        if ($('#rem-' + _id).val() == '')
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter quantity to update!',
            })
        else if (parseInt($('#rem-' + _id).val()) > parseInt($('#q-' + _id).html())) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Insufficient Stock!',
            })
            $('#rem-' + _id).val('')
        } else {
            await fetch('/decrement_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: _id,
                    quantity: $('#rem-' + _id).val()
                })
            })
                .then((res) => res.json())
                .then(async function (res) {
                    if (res.status) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Stock decremented successfully!',
                        }).then(() => window.location.reload())
                    }
                })
        }
    }
}

$('#search').on('input', async (event) => {
    query = $('#search').val().toLowerCase();
    $('.card').each(function () {
        if ($(this).find('.card-header').html().toLowerCase().includes(query)) {
            $(this).css('display', 'flex');
        } else {
            $(this).css('display', 'none');
        }
    })
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