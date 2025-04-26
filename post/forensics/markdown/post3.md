# [PicoCTF-2021] MacroHard WeakEdge
<p>File powerpoint có đuôi .pptm khá là lạ. Khi tìm hiểu thì thấy rằng đây file .pptm có chứa marco (mã tự động hóa, có thể chạy lệnh khi mở file,...)</p>

![alt text](/thanhlai/post/forensics/image/post3/image.png)

<p>Thử trích xuất marco từ file .pptm -> Quan sát từ đoạn Sub ... End Sub thì có vẻ như flag thực sự không nằm trong file chứa marco.</p>

![alt text](/thanhlai/post/forensics/image/post3/image-1.png)

<p>Thực chất file .pptm là file nén nên có thể giải nén bằng cách chuyển sang đuôi .zip và unzip. Sau khi giải nén, sử dụng tree để xem cấu trúc thư mục. Có file hidden có vẻ như chứa bí mật nào đó.</p>

![alt text](/thanhlai/post/forensics/image/post3/image-4.png)

<p>Nội dung là các kí tự được ngăn cách bởi khoảng trắng -> Có vẻ cần ghép thành một chuỗi hoàn chỉnh. Các kí tự thuộc tập a-z, A-Z, 0-9 nên có thể đã được encrypt bằng base64, caesar,...<p>

![alt text](/thanhlai/post/forensics/image/post3/image-2.png)

<p>Thử decode base64 đầu tiên. Vì số lượng kí tự đang là 50 nên padding thêm 2 kí tư = để số lượng chia hết cho 4 -> Tránh việc bị lỗi khi decode.<p>

![alt text](/thanhlai/post/forensics/image/post3/image-3.png)