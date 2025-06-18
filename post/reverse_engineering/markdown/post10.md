# [FooBarCTF-2021] 
## Child rev
<p>Dòng 13, dữ liệu được đọc vào local_38. Sau đó, đưa giá trị local_38 làm tham số thứ nhất của hàm XOR và các tham số còn lại là các giá trị cố định. Có vẻ nếu local_10 != 0 thì sẽ in ra nội dung flag (dòng 23).</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image.png)

<p>Ta có thể thấy 4 giá trị cố định được đưa vào hàm gen_key (dòng 17) và kết quả trả về sẽ xor với input rồi lưu giá trị sau khi xor vào auStack_138 (dòng 19). Tại dòng 34, kiểm tra từng phần tử của auStack_138 với local_248 nếu không khớp thì trả về 0. Giá trị của local_248 được copy 0x22 (34) giá trị ulong từ địa chỉ DAT_0049e060 -> Tóm lại, ta cần tìm ra giá trị cần nhập để sau khi XOR với iVar1 thì khớp với từng phần tử của local_248. Ta có thể biết được giá trị trả về của hàm gen_key bằng cách đọc giá trị của RAX sau khi thực thi xong hàm gen_key.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-1.png)

<p>Ta có thể đọc 34 giá trị (ulong) của local_248 khi thực thi lệnh tại địa chỉ 0x00401e13.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-2.png)

<p>Vì là địa chỉ tĩnh nên có thể trực tiếp đặt breakpoint tại 2 vị trí trên và run.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-3.png)

<p>Tại breakpoint đầu tiên, ta biết được giá trị trả về của hàm gen_key là 0x12f00.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-4.png)

<p>Tới breakpoint thứ hai, vì giá trị trong RAX đang là 0x0 nên có thể lấy giá trị RBP-0x240 để xem giá trị 34 phần tử của local_248.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-5.png)

<p>Script:</p>

```
local_248 = [
    0x12f78, 0x12f30, 0x12f72, 0x12f5f,
    0x12f61, 0x12f6e, 0x12f64, 0x12f5f,
    0x12f6c, 0x12f30, 0x12f67, 0x12f31,
    0x12f63, 0x12f40, 0x12f6c, 0x12f5f,
    0x12f73, 0x12f68, 0x12f31, 0x12f66,
    0x12f74, 0x12f5f, 0x12f65, 0x12f40,
    0x12f73, 0x12f79, 0x12f5f, 0x12f72,
    0x12f31, 0x12f67, 0x12f68, 0x12f38,
    0x12f3f, 0x12f3f
]

uVar1 = 0x12f00

res = ""
for v in local_248:
    c = (v ^ uVar1)
    res += chr(c)

print(f"{res}")
```

<p>Nhập kết quả sau khi thực thi script -> Nhận được flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-6.png)

## NET DOT
<p>Qua thông tin trả về sau khi thực thi lệnh <code>file win.dll</code>, ta biết được chương trình này được viết bằng .NET.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-7.png)

<p>Sử dụng dnSpy và nhảy vào Entry Point. Đầu tiên, đọc dữ liệu và lưu vào biến text (dòng 69). Sau đó, kiểm tra nếu độ dài != 26 thì in ra thông báo lỗi. Ngược lại, chuyển từng ký tự vừa nhập sang dạng mã ASCII (ví dụ: 'a' -> 97) rồi lưu vào array. Sau đó, thực hiện tính toán để gán từng phần tử vào array2. Cuối cùng, array2 được đưa vô hàm check. Nếu kết quả trả về bằng 1 thì in ra flag (là chuỗi nhập vào).</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-8.png)

<p>Chức năng của hàm sum_all là tính tổng giá trị mã ASCII của tất cả ký tự trong chuỗi. Còn hàm check dùng để check từng phần tử của mảng values (tham số) với mảng array cố định nếu khác bất kỳ giá trị nào thì trả về 0.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-9.png)

<p>Tóm lại, ta cần nhập chuỗi sao cho sau khi tính toán thì array2 phải khớp với array (cố định) trong hàm check. Script:</p>

```
from z3 import *

array = [
    2410, 2404, 2430, 2408, 2391, 2381, 2333, 2396, 2369, 2332,
    2398, 2422, 2332, 2397, 2416, 2370, 2393, 2304, 2393, 2333,
    2416, 2376, 2371, 2305, 2377, 2391
]

cs = [BitVec(f'c{i}', 8) for i in range(26)]
S = Sum(cs)

solver = Solver()

for j in range(26):
    f_j = (j % 2) * 2 + (j % 3)
    expr = (cs[j] - f_j) ^ S
    solver.add(expr == array[j])
    solver.add(cs[j] >= 0x20, cs[j] <= 0x7e)

if solver.check() == sat:
    model = solver.model()
    flag = ''.join([chr(model[cs[i]].as_long()) for i in range(26)])
    print("Flag:", flag)
```

<p>Sau khi chạy chương trình, ta tìm được chuỗi cần nhập và đây cũng chính là flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-10.png)

## Numerical Computing
<p>Trong hàm main, gọi hàm question để xử lý tác vụ chính trong chương trình. Hàm question kiểm tra flag mà người dùng nhập vào. Sau đó, so sánh với flag đã mã hóa. Dòng 46, đọc 18 kí tự vào inp.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-11.png)

<p>Vòng lặp đầu tiên xor từng phần tử của inp và enc rồi lưu vào num2. Vòng lặp thứ hai, lấy ra từng phần tử trong num2 rồi nhân 4 (nếu n - 1 là giá trị chẵn - tức index chẵn) và nhân 16 (nếu n - 1 là giá trị lẻ - tức index lẻ) rồi lưu vào num1. Vòng lặp thứ ba, kiểm tra từng 18 phần tử của num1 với num. Nếu tất cả đều khớp thì in ra thông báo "you got it". Tóm lại, flow mã hóa như sau: xor input với enc -> nhân 4 hoặc 16 tùy vào index. Suy ra, để giải mã ra chuỗi cần nhập thì: từng phần tử trong num chia 4 hoặc 16 tùy điều kiện -> xor với enc.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-12.png)

<p>Click vào A_0_3887 ở dòng 27, ta có đầy đủ dữ liệu của num.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-14.png)

<p>Script giải mã:</p>

```
num = [
    0x6C00000160,    
    0x5400000100,
    0xA0000002F0,
    0x1E000000670,
    0xCC000007B0,
    0x19400000250,
    0x1C800000700,
    0xA800000240,
    0xD8000007B0
]

num_flat = []
for n in num:
    low = n & 0xFFFFFFFF
    high = (n >> 32) & 0xFFFFFFFF
    num_flat.append(low)
    num_flat.append(high)

enc = b"QWERTYUIOPASDFGHJK"
flag = b""

for i in range(18):
    if i % 2 == 0:
        num2 = num_flat[i] // 16
    else:
        num2 = num_flat[i] // 4

    ch = num2 ^ enc[i]
    flag += bytes([ch])

print("[+] Flag:", flag.decode(errors='ignore'))
```

<p>Chạy chương trình và get the flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post10/image-13.png)

