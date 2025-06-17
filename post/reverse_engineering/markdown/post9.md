# [TCP1P-2023] Take some byte
<p>Đề bài cho một đoạn bytecode của Python.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post9/image.png)

<p>Khi tham khảo <a href="https://docs.python.org/3/library/dis.html#analysis-functions">tài liệu</a>, ta có thể dịch thủ công sang Python code như bên dưới. Các điều kiện if dùng để kiểm tra từng byte của flag và hàm oops có vẻ là dùng để xác định khi nội dung flag sai.</p>

```
def oops():pass
def yeayy():pass
def check(flag):
    if flag[:6] != 'TCP1P{' and flag[-1:] != '}':
        oops()
    if flag[6:10] == 'byte':
        yeayy()
    if (flag[10] or flag[15] or flag[18]) != chr(95):
        oops()
    if flag[11:15] != 'code':
        oops()
    if flag[11] == flag[19]: 
        yeayy()
    if flag[12] == ord(flag[20] - 6):
        yeayy()
    if ord(flag[16]) != 105 and ord(flag[17]) != 115:
        oops()
    if flag[19] != 'H':
        oops()
    if ord(flag[20]) == 117:
        yeayy()
    if ord(flag[21]) != ord(flag[2] - 10):
        oops()
    if flag[22] != flag[0].lower():
        oops()
    if flag[22] == flag[23]:
        yeayy()
```

<p><code>TCP1P{byte_code_is_HuFtt}</code> (flag) là chuỗi pass qua được hàm check và không kích hoạt hàm oops.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post9/image-1.png)