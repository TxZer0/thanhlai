# [BCACTF-2021] bca-mart
Hàm main yêu cầu user chọn món hàng cần mua. Để lấy được flag, ta cần mua món thứ 6. Nếu kết quả trả về từ hàm purchase() lớn hơn 0 thì in nội dung flag.

![alt text](/thanhlai/post/pwnable/image/post14/image.png)

Để purchase() trả về giá trị > 0, ta cần thỏa hai điều kiện sau: amount > 0 và cost * amount <= money. Thông thường, với money = 15 và cost = 100, thì điều kiện thứ hai không thể xảy ra. Tuy nhiên, ta có thể bypass cả hai điều kiện này bằng cách khai thác lỗi integer overflow. Biến amount và cost đều là kiểu int 32-bit có dấu. Do đó, giá trị lớn nhất mà amount có thể nhận là (2^31 - 1) = 2147483647. Khi ta nhập amount = 2147483647, phép nhân: <code>cost = 100 * 2147483647</code> sẽ vượt quá giới hạn kiểu int, và do đó gây ra tràn số (overflow). Giá trị cost sau khi nhân sẽ trở thành một số âm. Mặt khác, biến amount vẫn  là số dương nên điều kiện amount > 0 vẫn đúng.

![alt text](/thanhlai/post/pwnable/image/post14/image-1.png)

Cùng kiểm tra bằng đoạn code dưới đây, ta thử in hai giá trị của a và b đều có kiểu int. Số thứ hai có giá trị là âm vì kiểu int sử dụng bit cao nhất làm bit dấu nên chỉ có thể biểu diễn tối đa là 2^31 - 1.   

![alt text](/thanhlai/post/pwnable/image/post14/image-2.png)

Như vậy, chỉ cần chọn option 6, rồi nhập 2147483647 làm số lượng cần mua -> Chương trình sẽ in ra flag.

![alt text](/thanhlai/post/pwnable/image/post14/image-3.png)