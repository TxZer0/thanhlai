# [BCACTF-2024]
## Manipulate_Spreadsheet_2
<p>Có chuỗi văn bản nằm ở ô A1, tuy nhiên có vẻ như là do màu sắc đã bị thay đổi thành màu nào đó nên không thấy được. Chuỗi nằm trong tập a-f, 0-9 nên có vẻ là dạng hex.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-5.png)

<p>Chuyển sang dạng ascii thì nhận được một đoạn văn bản. Có vẻ là có một bí mật được giấu ở đâu đó.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-4.png)

<p>Chọn View -> Hidden sheet: tìm thấy Sheet2 đang bị ẩn.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-6.png)

<p>Sau khi tải file về, click phải vào vị trí Sheet1 và chọn Unhide để hiển thị Sheet2.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-7.png)

<p>Mở Sheet2, chọn tất cả và đổi màu chữ thành đen thì tìm thấy một chuỗi tương tự ban đầu ở ô A1. Có vẻ như cột byte cần phải sắp xếp theo thứ tự cột index.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-8.png)

<p>Các từ khóa được in hoa(nhấn mạnh) là BITS, LEAST -> Có vẻ như mỗi byte trong cột byte chỉ chọn bit ngoài cùng bên phải. Từ hai dữ kiện có thể chốt lại là sắp xếp thứ tự các byte theo cột index rồi ghép tất cả các bit ngoài cùng bên phải hoặc là làm ngược lại.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-9.png)

<p>Sử dụng SORT() trong excel để sắp xếp lại thứ tự các byte theo cột index và lấy ra bit ngoài cùng bên phải.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-10.png)

<p>Tiếp theo, ghép tất cả các bit lại thành một dãy nhị phân.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-11.png)

<p>Chuyển sang dạng ascii và tìm thấy nội dung flag.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-12.png)

## 23_719
<p>Khi search chuỗi "BCACTF" thì có match nhưng giao diện không hiển thị nội dung flag.</p>

![alt text](/thanhlai/post/forensics/image/post5/image.png)

<p>Thử copy tất cả nội dung và paste sang file text thì đọc được nội dung flag.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-1.png)

## Chalkboard_Gag
<p>Thử sắp xếp lại các dòng và chỉ lấy các dòng không trùng nhau thì thấy được kí tự } có xuất hiện ở cuối nên mình đoán rằng cần ghép các kí tự khiến cho chuỗi khác "I WILL NOT BE SNEAKY" thành nội dung flag hoàn chỉnh.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-2.png)

<p>Đoạn script để tìm ghép thành nội dung flag hoàn chỉnh:</p>

```
ref = "I WILL NOT BE SNEAKY"
flag = ""
with open("chalkboardgag.txt", "r") as f:
    for line in f:
        line = line.strip()
        diff = "".join([c for c, r in zip(line, ref) if c != r])
        if diff:
            flag += diff 

print(flag) 
```

<p>Tìm thấy nội dung flag.</p>

![alt text](/thanhlai/post/forensics/image/post5/image-3.png)



