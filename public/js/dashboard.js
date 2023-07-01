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
                                <div class="flex-even">
                                    <span>Current Stock:</span> 
                                    <span id="q-${element._id}">${element.current_stock} <span class="stat">${element.updated_stock > 0 ? `(+${element.updated_stock})` : element.updated_stock < 0 ? `(${element.updated_stock})` : ""}</span></span>
                                </div>
                                <div class="flex-even">
                                    <span>Sold Stock:</span>
                                    <span>${element.sold_stock}</span>
                                </div>
                                <div class="flex-even">
                                    <span>PP/Item:</span>
                                    <span>Rs. ${element.purchase_price}</span>
                                </div>
                                <div class="flex-even">
                                    <span>SP/Item:</span>
                                    <span>Rs. ${element.selling_price}</span>
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
                                    <span class="material-icons" onclick="deleteStock('${element._id}')">delete</span>
                                </div>
                            </li>
                        </ul>
                    </div>                
                    `)
                    $('.stat').each(function () {
                        if ($(this).html().includes('-')) {
                            $(this).css('color', 'red');
                        } else if ($(this).html().includes('+')) {
                            $(this).css('color', 'rgb(3, 167, 3)');
                        }
                    })
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
    $("#current_stock_lbl").html("Opening Stock");
    $("#current_stock").prop('disabled', false);
    $('#name').val('');
    $('#current_stock').val('');
    $('#purchase_price').val('');
    $('#selling_price').val('');
})

$('#add-stock').click(async function (event) {
    let name = $('#name').val();
    let current_stock = $('#current_stock').val();
    let purchase_price = $('#purchase_price').val();
    let selling_price = $('#selling_price').val();

    if (name == '' || current_stock == '' || purchase_price == '' || selling_price == '') {
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
                    current_stock: current_stock,
                    selling_price: selling_price,
                    purchase_price: purchase_price
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
                                ${name}
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-md-flex d-grid">
                                    <div class="flex-even">
                                        <span>Current Stock:</span> 
                                        <span id="q-${res.id}">${current_stock}</span>
                                    </div>
                                    <div class="flex-even">
                                        <span>Sold Stock:</span>
                                        <span>0</span>
                                    </div>
                                    <div class="flex-even">
                                        <span>PP/Item:</span>
                                        <span>Rs. ${purchase_price}</span>
                                    </div>
                                    <div class="flex-even">
                                        <span>SP/Item:</span>
                                        <span>Rs. ${selling_price}</span>
                                    </div>
                                    <div class="flex-fill icons-container">
                                        <button class="material-icons" onclick="edit('${name}')">edit_note</button>
                                        <div class="btn-box">
                                            <input type="text" id="rem-${res.id}" maxlength="5">
                                            <button class="material-icons" onclick="update('${res.id}',false)">remove_circle</button>
                                        </div>
                                        <div class="btn-box">
                                            <input type="text" id="add-${res.id}" maxlength="5">
                                            <button class="material-icons" onclick="update('${res.id}',true)">add_circle</button>
                                        </div>
                                        <span class="material-icons" onclick="deleteStock('${res.id}')">delete</span>
                                    </div>
                                </li>
                            </ul>
                        </div>` + content);
                        $('#name').val('');
                        $('#current_stock').val('');
                        $('#purchase_price').val('');
                        $('#selling_price').val('');
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
                    purchase_price: purchase_price,
                    selling_price: selling_price
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

async function edit(item_name) {
    $("#collapseExample").collapse("show");
    $("#add-stock").html("Update");
    $("#current_stock_lbl").html("Current Stock");
    $("#current_stock").prop('disabled', true);

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
            $('#current_stock').val(res.current_stock);
            $('#purchase_price').val(res.purchase_price);
            $('#selling_price').val(res.selling_price);
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
                    updated_stock: $('#add-' + _id).val()
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
                    updated_stock: $('#rem-' + _id).val()
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

async function deleteStock(_id) {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#375F74',
        showDenyButton: true,
        denyButtonText: 'No'
    }).then(async (res) => {
        if (res.isConfirmed) {
            await fetch('/delete_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: _id
                })
            })
                .then((res) => res.json())
                .then(async function (res) {
                    if (res.status) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Stock deleted successfully!',
                        }).then(() => window.location.reload())
                    }
                })
        }
    })
}