# [TJCTF-2023] groppling-hook
<p>Dòng 9, đọc 56 byte vào buf có kích thước 10 byte -> Buffer overflow. Tiếp theo, kiểm tra nếu giá trị của savedregs > địa chỉ bắt đầu của hàm main và <= địa chỉ cuối cùng của hàm main thì return. Ngược lại thì gọi hàm laugh.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image.png)

<p>Hàm laugh chỉ in thông báo từ chối khai thác ROP và exit.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-3.png)

<p>Quan sát bảng Functions, ta có hàm win dùng để in nội dung flag -> Vậy mục tiêu là thỏa điều kiện if trong hàm pwnable để có thể kiểm soát RIP nhảy tới hàm win thay vì để nó gọi tới hàm laugh.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-1.png)

<p>Đoạn mã asm bắt đầu kiểm tra điều kiện là từ địa chỉ main+70 đến main+98. Giá trị trong thanh ghi rax sẽ được so sánh với 0x401262 và 0x40128a -> Ta cần ghi giá trị vào đỉnh stack ngay trước khi nó pop rax để kiểm soát giá trị rax.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-2.png)

<p>Tính được số byte cần padding trước khi ghi đè rax là 18.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-4.png)

<p>Sử dụng lệnh set $rax=0x401208 (giá trị này <= 0x40128a và > 0x401262) và tiếp tục debug đến lệnh ret. Phía trước lệnh ret có push rax nên nó sẽ đẩy giá trị rax vào lại stack mà giá trị đang set bằng 0x401208 là không hợp lệ nên gây ra lỗi -> Giá trị rax vừa phải thỏa điều kiện if và phải là địa chỉ hợp lệ. Mà rax được phép bằng 0x40128a (địa chỉ lệnh ret trong main) nên ta có thể cho nó return về cuối hàm main.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-5.png)

<p>Lúc này, đã đi được đến lệnh ret trong hàm main. Có thể tính được cần 26 byte trước khi ghi đè giá trị RIP trong stack.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-8.png)

<p>Script exploit:</p>

```
from pwn import *

p = process('./groppling-hook')
elf = ELF('./groppling-hook')

payload = b'a' * 18
payload += p64(0x40128a)
payload += p64(elf.sym['win'])

p.sendlineafter(b'> ', payload)

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post1/image-9.png)