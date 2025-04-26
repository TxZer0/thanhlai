# [PicoCTF-2021] Trivial Flag Transfer Protocol
<p>Phần Data trong giao thức TFTP đang có số byte chiếm 82,8% -> Có thể có file được truyền qua TFTP.</p>

![alt text](/thanhlai/post/forensics/image/post2/image.png)

<p>Có 6 file được truyền tải. Chọn Save All để tải tất cả các file về máy.</p>

![alt text](/thanhlai/post/forensics/image/post2/image-1.png)

<p>Có 3 ảnh, 2 file text và 1 gói cài đặt phần mềm dành cho Debian. Nội dung file plan là các kí tự viết hoa -> Có vẻ như đã được encrypt.</p>

![alt text](/thanhlai/post/forensics/image/post2/image-2.png)

<p>Thử decrypt bằng Caesar, khi k = 13 thì nội dung có ý nghĩa. Có vẻ như ám chỉ việc chạy chương trình với chuỗi DUEDILIGENCE khi kiểm tra ảnh -> Có thể bí mật được giấu trong các ảnh và phải sử dụng steghide với pass là DUEDILIGENCE</p>

![alt text](/thanhlai/post/forensics/image/post2/image-5.png)

<p>Tương tự, với instructions.txt -> Có vẻ nói rằng sẽ kiểm tra gì đó trong file plan để xem được flag bị giấu.</p>

![alt text](/thanhlai/post/forensics/image/post2/image-4.png)

<p>Sử dụng steghide với pass là DUEDILIGENCE với cả 3 file .bmp. Đến file picture3.bmp thì tìm thấy flag.txt bị ẩn.</p>

![alt text](/thanhlai/post/forensics/image/post2/image-6.png)


