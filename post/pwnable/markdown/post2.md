# [DaVinCi-2021] Faking till you're making
Bài này có hai hàm chính: <code>main</code> và <code>sh</code>. Hàm <code>sh</code> đơn giản gọi <code>system("/bin/sh")</code> để mở shell. Có vẻ mục tiêu của ta là ghi đè <code>return address</code> để nhảy vào hàm sh.

Trong <code>main</code>, chương trình:

In ra địa chỉ của <code>sh</code> bằng <code>printf</code> -> Leak được địa chỉ hàm sh.

Gọi <code>malloc(1)</code>: thực tế sẽ cấp phát <code>0x20</code> bytes vì đây là kích thước tối thiểu cho một chunk.

Gọi <code>read(0, data, 0x50)</code> để cho phép ghi dữ liệu vào biến <code>data</code> trên stack.

Sau đó, chương trình thực hiện <code>free(data + 2)</code> -> Nếu ta giả lập một chunk hợp lệ tại vị trí này (với <code>size = 0x40</code>), glibc sẽ tin đây là chunk thật và đẩy nó vào <code>tcache</code>.

Gọi <code>malloc(0x30)</code> để lấy lại chunk đã fake từ tcache (chunk trên stack).

Cuối cùng, chương trình gọi <code>fgets(__s, 0x404, stdin)</code> để ghi dữ liệu vào fake chunk - tức là ghi vào vùng stack -> Từ đó, có thể overflow và ghi đè <code>return address</code> thành địa chỉ <code>sh</code> đã leak ở đầu chương trình.

![alt text](/thanhlai/post/pwnable/image/post13/image.png)

Hãy debug để hiểu hơn về cách khai thác bài này. Khi gọi hàm read, dữ liệu sẽ được ghi vào địa chỉ 0x7fffffffde90 (trên stack).

![alt text](/thanhlai/post/pwnable/image/post13/image-1.png)

Tiếp tục, free chunk ở 0x7fffffffdea0 (so với 0x7fffffffde90 thì cách 16 byte) mà read cho phép nhập tới 0x50 -> có thể tràn qua dữ liệu tại 0x7fffffffdea0 và có thể fake chunk tại đây. Để fake một chunk, ta cần tạo dữ liệu của metadata ở 0x7fffffffde98 (nằm trước 8 byte so với 0x7fffffffdea0). Giả sử, ta gán giá trị = 0x20 thì sau khi thực thi lệnh free sẽ không bị lỗi vì chunk bây giờ đã hợp lệ. Tiếp theo, <code>malloc(0x30)</code> nên cần fake giá trị chính xác là 0x40 để sử dụng lại chunk đã free đó. Sau đó, khi tới hàm fgets ta chỉ cần override return address để chuyển hướng thực thi của chương trình.

![alt text](/thanhlai/post/pwnable/image/post13/image-2.png)

Ta có thể tính được khoảng cách để dữ liệu chunk đó override tới return address là 0x58 byte.

![alt text](/thanhlai/post/pwnable/image/post13/image-3.png)

Còn một vấn đề là nếu như ta trực tiếp set giá trị của rsp ở lệnh ret ngay lần đầu bằng địa chỉ hàm sh thì nó sẽ bị lỗi. Lỗi xuất phát từ việc địa chỉ của rsp (0x7fffffffdef8) không chia hết cho 16. Để giải quyết lỗi này, ta chỉ cần return về lệnh ret của hàm main (hoặc sh) một lần nữa. Note: để kiểm tra nhanh một địa chỉ có chia hết cho 16 không, ta có thể nhìn 4 bit cuối của địa chỉ (tức là chữ số cuối trong hệ hex). Nếu nó kết thúc bằng <code>0</code>, <code>...0</code>, <code>...10</code>, v.v., thì địa chỉ đó chia hết cho 16.

![alt text](/thanhlai/post/pwnable/image/post13/image-4.png)

Lúc này, địa chỉ rsp (0x7fffffffdf00) chia hết 16 -> Bây giờ, ta set giá trị rsp thành địa chỉ hàm sh là lấy được shell.

![alt text](/thanhlai/post/pwnable/image/post13/image-5.png)

Nếu làm theo hướng return lần 1 về lại lệnh ret của hàm main thì ta cần tính: <code>offset = địa chỉ ret (main) - địa chỉ của sh</code>. Trong script, chỉ cần lấy địa chỉ của sh + offset (0xb5) sẽ ra địa chỉ ret trong hàm main. Còn nếu sử dụng địa chỉ ret trong hàm sh ta chỉ cần lấy địa chỉ hàm sh + 18.

![alt text](/thanhlai/post/pwnable/image/post13/image-7.png)

Script:

```
from pwnable import *

elf = ELF('./vuln')
p = process(elf.path)

sh_addr = int(p.recvline().strip(), 16)
log.success(f'sh() = {hex(sh_addr)}')

fake_chunk = p64(0) + p64(0x40) + 6 * p64(0)
p.send(fake_chunk)

payload = b'a' * 0x58 + p64(sh_addr+0xb5) + p64(sh_addr)

p.sendline(payload)

p.interactive()
```

Kết quả:

![alt text](/thanhlai/post/pwnable/image/post13/image-6.png)