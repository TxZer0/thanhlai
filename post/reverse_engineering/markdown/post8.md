# [TJCTF-2023] wtmoo
<p>Dòng 11, đọc dữ liệu và lưu vào biến s. Vòng lặp for duyệt qua tất cả byte của s và biến đổi từng ký tự chuỗi đầu vào. Với mỗi ký tự trong s, chương trình áp dụng biến đổi theo quy tắc:</p>

- Nếu là chữ thường (a-z) -> s[i] -= 60;

- Nếu là chữ hoa (A-Z) -> s[i] += 32 -> Chuyển về chữ thường.

- Nếu là số từ 0–4 -> s[i] += 43;

- Nếu là số từ 5–9 -> s[i] -= 21;

- Nếu là ký tự { hoặc } -> Giữ nguyên.

- Nếu là bất kỳ ký tự khác -> In lỗi và return 1;

![alt text](/thanhlai/post/reverse_engineering/image/post8/image-1.png)

<p>So sánh kết quả đã biến đổi với flag. Nếu bằng nhau thì in ra chuỗi dest trong cow -> Có vẻ dest chứa nội dung flag (khi chưa mã hóa). Ngược lại, in ra input trong cow.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post8/image-2.png)

<p>Truy cập vào phần .data, ta biết được flag trỏ tới chuỗi "8.'8*{;8m33[o[3[3[%\")#*\\}".</p>

![alt text](/thanhlai/post/reverse_engineering/image/post8/image-3.png)

<p>Như vậy, tạo script để tìm chuỗi cần nhập để thỏa mãn <code>strcmp(s, flag)</code> trả về 0.</p>

```
from z3 import *

encoded = '''8.'8*{;8m33[o[3[3[%\")#*\\}'''
input_chars = [BitVec(f'c{i}', 8) for i in range(len(encoded))]

s = Solver()

for i, c in enumerate(input_chars):
    conds = []
    conds.append(If(And(c >= 97, c <= 122), c - 60, -1) == ord(encoded[i]))
    conds.append(If(And(c >= 65, c <= 90), c + 32, -1) == ord(encoded[i]))
    conds.append(If(And(c >= 48, c <= 52), c + 43, -1) == ord(encoded[i]))
    conds.append(If(And(c >= 53, c <= 57), c - 21, -1) == ord(encoded[i]))
    conds.append(If(Or(c == 123, c == 125), c, -1) == ord(encoded[i]))
    s.add(Or(*conds))

if s.check() == sat:
    model = s.model()
    result = ''.join(chr(model[c].as_long()) for c in input_chars)
    print("Output: ", result)
```

<p>Chạy chương trình và kết quả là chuỗi cần nhập (flag).</p>

![alt text](/thanhlai/post/reverse_engineering/image/post8/image.png)