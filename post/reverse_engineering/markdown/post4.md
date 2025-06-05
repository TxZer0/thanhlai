# [LACTF-2023] ctfd plus

<p>Đầu tiên, chương trình yêu cầu nhập flag và đọc tối đa 255 kí tự từ đầu vào. Dòng 21, so sánh từng kí tự đầu vào với kết quả trả về của hàm sub_1230 với tham số là các phần tử ở vị trí tương ứng trong mảng v5. Nếu không khớp thì in ra thông báo rồi thoát -> Mục tiêu: tìm được tất cả kí tự trả về của hàm sub_1230 với tham số là các phần tử trong mảng v5 rồi ghép thành flag hoàn chỉnh.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image.png)

<p>Hàm sub_1230, thực hiện các phép toán và cuối cùng trả về 1 kí tự. Ta chỉ cần quan tâm kết quả về trả về của hàm này để biết các kí tự được so sánh với input.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-1.png)

<p>Quan sát ở dạng graph, ta thấy lệnh <code>cmp rsi, 47</code> trong nhãn loc_10F8 chính là đoạn hàm while kiểm tra giá trị v4 trong hàm main (dòng 28). Lệnh <code>cmp al, [rbx+rsi]</code> trong nhãn loc_1102 là đoạn so sánh sub_1230(v5[v4]) và v7[v4] trong hàm main (dòng 21) -> Có thể tìm lệnh này trong gdb để biết được các kí tự được so sánh với kí tự trong input.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-2.png)

<p>Khi start thì địa chỉ lệnh hiện tại là 0x0000555555555140. Tuy nhiên, xem các lệnh từ địa chỉ 0x0000555555555140 trở đi thì không tìm thấy đoạn xử lý trong hàm main -> Tui đoán là nó nằm trước địa chỉ 0x0000555555555140.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-6.png)

<p>Sử dụng lệnh <code>vm 0x0000555555555140</code> để xem địa chỉ bắt đầu của vùng nhớ. Sau đó, đặt breakpoint ngay địa chỉ 0x0000555555555000.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-3.png)

<p>Sử dụng lệnh <code>x/150i $pc</code> để hiển thị 150 lệnh hợp ngữ tiếp theo từ địa chỉ hiện tại CPU đang thực thi -> Tìm được lệnh <code>cmp al, [rbx+rsi]</code> nằm ở địa chỉ 0x000055555555510b.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-4.png)

<p>Thử nhập 47 kí tự 'a'. Khi tới lệnh này thì giá trị của thanh ghi al là 0x6c (kí tự đang so sánh với kí tự đầu tiên trong input) và kí tự tại địa chỉ rbx+rsi*1 là kí tự 'a' trong input vừa nhập.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-5.png)

<p>Tạo script để dò từng kí tự:</p>

```
from pwn import *
import warnings
warnings.filterwarnings("ignore")

open('x.gdb', 'w').write('gef config context.color off\n')
flag = ''
while True:
    pos = 0
    with context.local(log_level='warn'):
        p = process('gdb --command=x.gdb ./ctfd_plus', shell=True)

        p.sendlineafter('gef➤ ', b'b*0x55555555510b')
        p.sendlineafter('gef➤ ', b'r')
        p.sendlineafter('Enter the flag:\n', flag.encode())

        while True:
            p.sendlineafter('gef➤ ', b'p/x $al')
            res = p.recvline().decode().strip()

            if '=' in res:
                val = res.split('=')[1].strip()
                res_char = chr(int(val, 16))
            else:
                break

            if pos >= len(flag):
                flag += res_char
                print(f"[FLAG]: {flag}")
                if res_char == "}":
                    quit()
                break

            pos += 1
            p.sendlineafter('gef➤ ', b'c')
```

<p>Kết quả sau khi chạy:</p>

![alt text](/thanhlai/post/reverse_engineering/image/post4/image-7.png)