// Function to load cart items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Lấy danh sách sản phẩm từ localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Kiểm tra xem giỏ hàng có sản phẩm không
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="4">Giỏ hàng của bạn đang trống.</td></tr>';
        cartTotalElement.textContent = '0,00 vnd'; // Thiết lập tổng tiền là 0 nếu không có sản phẩm
    } else {
        // Tạo một đối tượng để lưu trữ các sản phẩm theo tên
        let groupedProducts = {};

        // Duyệt qua danh sách sản phẩm và gộp nhóm theo tên
        cartItems.forEach(product => {
            const { name, price, discount, quantity } = product;
            const discountedPrice = price * (1 - discount / 100);
            const totalPrice = discountedPrice * quantity;

            if (groupedProducts[name]) {
                // Nếu sản phẩm đã có trong groupedProducts, cập nhật thông tin
                groupedProducts[name].quantity += quantity;
                groupedProducts[name].totalPrice += totalPrice;
            } else {
                // Nếu sản phẩm chưa có, thêm vào groupedProducts
                groupedProducts[name] = {
                    name: name,
                    price: discountedPrice, // Giá giảm giá
                    quantity: quantity,
                    totalPrice: totalPrice
                };
            }
        });

        // Xóa bỏ nội dung cũ trong container
        cartItemsContainer.innerHTML = '';

        // Đổ danh sách sản phẩm đã gộp vào HTML
        let cartTotal = 0;
        Object.values(groupedProducts).forEach(product => {
            const { name, price, quantity, totalPrice } = product;
            const productHTML = `
                <tr>
                    <td class="product-name">${name}</td>
                    <td class="product-price">${price.toLocaleString()}đ</td>
                    <td class="product-quantity">${quantity}</td>
                    <td class="product-total">${totalPrice.toLocaleString()}đ</td>
                </tr>
            `;
            cartItemsContainer.innerHTML += productHTML;
            cartTotal += totalPrice;
        });

        // Hiển thị tổng tiền của giỏ hàng
        cartTotalElement.textContent = cartTotal.toLocaleString() + ' vnd';
    }
}

// Gọi hàm để load các sản phẩm trong giỏ hàng khi trang được tải
window.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
});

document.getElementById('checkout-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    
    // Xóa dữ liệu trong localStorage
    localStorage.removeItem('cartItems');
    
    // Thông báo hoặc chuyển hướng đến trang cần thiết sau khi thanh toán thành công
    alert('Tính năng nay đang bảo trì bạn có thể liên hệ với chúng tôi');
    
    // Sau khi thanh toán, bạn có thể chuyển hướng đến trang khác hoặc làm gì đó khác tùy vào yêu cầu của bạn
    window.location.href = 'index.html'; // Ví dụ chuyển hướng về trang chủ sau khi thanh toán
});