# [BCACTF-2024] Canary Keeper 
<p>Dòng 11, hàm gets đọc dữ liệu không giới hạn độ dài vào v4 chứa 73 byte -> Buffer overflow. Sau đó, gọi 2 hàm check_canary và check_flag. In ra nội dung flag nếu check_canary trả về true và check_flag trả về false.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post7/image.png)

<p>Hàm check_canary sử dụng hàm strcmp để kiểm tra xem chuỗi ban đầu được thiết lập có bị thay đổi không -> Cần phải làm cho kết quả khi so sánh là bằng nhau (true).</p>

![alt text](/thanhlai/post/buffer_overflow/image/post7/image-1.png)

<p>Hàm check_flag tương tự -> Cần phải làm cho kết quả khi so sánh là khác nhau (false).</p>

![alt text](/thanhlai/post/buffer_overflow/image/post7/image-2.png)

<p>Nếu stdin chứa null byte thì hàm gets vẫn đọc kí tự null byte như thường cho đến khi gặp kí tự xuống dòng hoặc EOF. Cuối cùng, thêm một kí tự null byte nữa vào cuối sau khi đọc xong. Điều này dẫn đến khi ta gửi dãy byte "canary\0" thì nó sẽ thêm một null byte nữa vào cuối. Nhìn vào nội dung trên stack, tại địa chỉ rsp+0x50 (v6 trong hàm main) đã bị ghi đè bởi kí tự null. Khi hàm strcmp được sử dụng trong hàm check_flag bắt đầu đọc, nó sẽ thấy null byte tại byte đầu tiên và xác định đây là chuỗi rỗng -> Chuỗi rỗng so sánh với "FLAG" sẽ trả về giá trị khác 0 và hàm check_flag trả về false. Tóm lại, với dãy byte "canary\0" ta đã có thể thỏa 2 điều kiện hàm check_flag trả về false và check_canary trả về true.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post7/image-3.png)

<p>Full script:</p>

```
from pwn import *

p = process('./provided')

payload  = b"A" * 73       
payload += b"canary\0"      

p.sendline(payload)

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post7/image-4.png)

