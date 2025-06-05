# [UofTCTF-2024] Random Maze
<p>Chương trình yêu cầu nhập số nguyên ở dạng hex và lưu vào v5 (dòng 10). Con trỏ path sẽ trỏ tới địa chỉ v5 (dòng 12). Sau đó, duyệt qua từng byte vừa nhập và kiểm tra 4 biểu thức logic. Nếu 1 trong 4 trả về true thì gọi hàm oops, ngược lại không thỏa biểu thức nào thì gọi hàm traverse và truyền vào index đang duyệt.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post1/image.png)

<p>Hàm oops in ra thông báo và thoát chương trình.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post1/image-1.png)

<p>Trong hàm traverse, các byte trong mảng flag được cập nhật lại bằng giá trị sau khi XOR từng byte với dữ liệu đã nhập (dòng 9). Khi a1 != 0 (index != 0) thì kiểm tra nếu thỏa biểu thức (dòng 12) thì hàm oops sẽ được gọi để thoát chương trình. Đặc biệt là ở dòng 16, nó sẽ gọi (*(cur + 2))() như một hàm -> Theo tui đoán thì sau khi thỏa các điều kiện trong cả 8 lần lặp thì khi đến lần thứ 8 giá trị tại (cur + 2) sẽ là một địa chỉ hàm hợp lệ -> Cần tìm ra dãy byte không thỏa điều kiện if trong hàm main và sau khi xor với flag thì không thỏa if ở dòng 12 trong hàm traverse để hàm oops không được gọi làm thoát chương trình.</p>
 
![alt text](/thanhlai/post/reverse_engineering/image/post1/image-2.png)

<p>Quan sát bảng Functions, ta có một hàm profit dùng để in ra nội dung flag -> Có vẻ đây là hàm sẽ được gọi sau 8 lần lặp.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post1/image-3.png)

<p>Truy cập vào phần .data, ta có được giá trị trong mảng flag và sums. Vì kí tự đầu tiên của mảng flag là O (giá trị thập phân là 79 trong ascii) nên khi gọi hàm check_prime ở dòng 20 trong hàm traverse sẽ luôn trả về 1 -> Hàm oops (dòng 22) sẽ không được gọi khiến cho chương trình bị thoát.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post1/image-5.png)

<p>Script exploit:</p>

```
from z3 import *

s = Solver()
n = 8
a = [BitVec(f'a{i}', 8) for i in range(n)]

flag = [ord(c) for c in "ON#X~o8&"]
sums = [0xce, 0xa1, 0xae, 0xad, 0x64, 0x9f, 0xd5]

for i in range(n):
    s.add((a[i] & 3) != 0, a[i] % 3 != 0, a[i] <= 100, a[i] > 19)   
    flag[i] ^= a[i]
    if i > 0:
        s.add(flag[i] + flag[i-1] == sums[i-1])

if s.check() == sat:
    m = s.model()
    w = [format(m[a[i]].as_long(), 'x') for i in range(n)]
    print(''.join(w[::-1]))
```

<p>Chạy script và nhận giá trị cần nhập. Cuối cùng, nhập giá trị đó vào và nhận flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post1/image-6.png)



