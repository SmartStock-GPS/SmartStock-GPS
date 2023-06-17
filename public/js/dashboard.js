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
            console.log(res);
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