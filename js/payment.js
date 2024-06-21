// Function to display checkout items and total on payment page
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');

    // Lấy danh sách sản phẩm từ localStorage
    let checkoutItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    let cartTotal = localStorage.getItem('cartTotal') || '0';

    if (checkoutItems.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Không có sản phẩm nào trong giỏ hàng.</p>';
        checkoutTotalElement.textContent = '0,00 vnd';
    } else {
        let checkoutTotal = 0;

        // Đổ thông tin sản phẩm vào HTML
        checkoutItems.forEach(item => {
            const { name, price, quantity, discount } = item;

            // Tính giá đã giảm giá nếu có
            let discountedPrice = price;
            if (discount && discount > 0) {
                discountedPrice = price * (1 - discount / 100);
            }

            const totalPrice = discountedPrice * quantity;

            // Format giá và tổng giá theo định dạng số tiền
            const displayPrice = discountedPrice.toLocaleString() + 'đ';
            const displayTotalPrice = totalPrice.toLocaleString() + 'đ';

            const itemHTML = `
                <div class="checkout-item">
                    <div class="checkout-item-name">${name}</div>
                    <div class="checkout-item-price">${displayPrice}</div>
                    <div class="checkout-item-quantity">${quantity}</div>
                    <div class="checkout-item-total">${displayTotalPrice}</div>
                </div>
            `;
            checkoutItemsContainer.innerHTML += itemHTML;

            // Tính tổng tiền của đơn hàng
            checkoutTotal += totalPrice;
        });

        // Hiển thị tổng tiền của đơn hàng
        checkoutTotalElement.textContent = checkoutTotal.toLocaleString() + ' vnd';
    }
}

// Gọi hàm để hiển thị các sản phẩm từ giỏ hàng khi trang được tải
window.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
});

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');

    // Lắng nghe sự kiện submit của form đặt hàng
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định
        
        // Lấy các giá trị từ form
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const province = document.getElementById('province').value;
        const district = document.getElementById('district').value;
        const email = document.getElementById('email').value;

        // Lấy phương thức thanh toán được chọn
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        // Kiểm tra xem đã chọn phương thức thanh toán chưa
        if (!selectedPaymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán.');
            return;
        }

        const paymentMethodValue = selectedPaymentMethod.value;

        // Lấy danh sách sản phẩm từ localStorage
        let checkoutItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];

        // Kiểm tra xem có sản phẩm trong giỏ hàng hay không
        if (checkoutItems.length === 0) {
            alert('Không có sản phẩm nào trong giỏ hàng để đặt hàng.');
            return;
        }

        // Xử lý logic đặt hàng dựa trên phương thức thanh toán
        switch (paymentMethodValue) {
            case 'bankTransfer':
                handleBankTransferOrder(name, phone,email, address, province, district, checkoutItems);
                break;
            case 'cashOnDelivery':
                handleCashOnDeliveryOrder(name, phone,email, address, province, district, checkoutItems);
                break;
            default:
                alert('Phương thức thanh toán chưa được hỗ trợ.');
        }

        // Xóa dữ liệu trong localStorage sau khi đặt hàng
        localStorage.clear();
    });

    // Hàm xử lý đặt hàng chuyển khoản ngân hàng
    function handleBankTransferOrder(name, phone,email, address, province, district, checkoutItems) {
        // Gửi email xác nhận đơn hàng chuyển khoản
        sendConfirmationEmail(name, email, generateOrderDetails(checkoutItems));

        // Thực hiện các thao tác liên quan đến đặt hàng và chuyển khoản ngân hàng
        alert('Bạn đã chọn thanh toán bằng chuyển khoản ngân hàng. Đơn hàng của bạn đã được ghi nhận. Vui lòng kiểm tra email để xem thông tin chi tiết.');
        // Ví dụ: gửi yêu cầu đặt hàng đến server
        // window.location.href = 'bank-transfer-order.html';
    }

    // Hàm xử lý đặt hàng khi nhận hàng (COD)
    function handleCashOnDeliveryOrder(name, phone,email, address, province, district, checkoutItems) {
        // Gửi email xác nhận đơn hàng COD
        sendConfirmationEmail(name, email, generateOrderDetails(checkoutItems));

        // Thực hiện các thao tác liên quan đến đặt hàng khi nhận hàng
        alert('Bạn đã chọn thanh toán khi nhận hàng (COD). Đơn hàng của bạn đã được ghi nhận. Vui lòng kiểm tra email để xem thông tin chi tiết.');
        // Ví dụ: gửi yêu cầu đặt hàng đến server
        // window.location.href = 'order-confirmation.html';
    }
// Hàm tạo nội dung chi tiết đơn hàng
function generateOrderDetails(checkoutItems) {
    let orderDetails = '';
    checkoutItems.forEach(item => {
        const { name, price, quantity, totalPrice } = item;
        const displayPrice = price ? (price.toLocaleString() + 'đ') : '0đ';
        const displayTotalPrice = totalPrice ? (totalPrice.toLocaleString() + 'đ') : '0đ';
        
        orderDetails += `
        ${name}\n
        Giá: ${displayPrice}\n
        Số lượng: ${quantity}\n
        Thành tiền: ${displayTotalPrice}\n\n
        `;    
    });
    return orderDetails;
}
    // Hàm tạo nội dung chi tiết đơn hàng
    // Hàm gửi email xác nhận đơn hàng
function sendConfirmationEmail(name, email, orderDetails) {
    // Gửi email tới khách hàng
    emailjs.send('service_8uqu8lb', 'template_g4eylzx', {
        subject: "Xác nhận thanh toán đơn hàng",
        from_name: "THE FLOWER",
        to_email: email,
        reply_to: 'pvpminecrafthighlight@gmail.com',
        order_details: orderDetails
    })
    .then(function(response) {
        console.log('Email sent to customer successfully:', response);
        // Sau khi gửi email cho khách hàng, gửi thêm email cho admin
        sendOrderNotificationToAdmin(name, orderDetails);
    }, function(error) {
        console.error('Email send to customer failed:', error);
        // Xử lý lỗi khi gửi email cho khách hàng không thành công
    });
}

// Hàm gửi thông báo đơn hàng tới admin
function sendOrderNotificationToAdmin(email, orderDetails) {
    // Thay đổi địa chỉ email admin theo yêu cầu
    const adminEmail = 'pvpminecrafthighlight@gmail.com'; // Thay đổi thành địa chỉ email admin
    
    // Gửi email tới admin
    emailjs.send('service_8uqu8lb', 'template_dqrw6hn', {
        subject: "Yêu cầu từ khách hàng",
        from_name: 'The Flower',
        to_email: adminEmail,
        reply_to: email,
        order_details: orderDetails
    })
    .then(function(response) {
        console.log('Order notification sent to admin successfully:', response);
        // Có thể thực hiện các thao tác bổ sung sau khi gửi email thành công
    }, function(error) {
        console.error('Order notification send to admin failed:', error);
        // Xử lý lỗi khi gửi email thông báo đơn hàng tới admin không thành công
    });
}
});

