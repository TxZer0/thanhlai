# [Intigrity] Mind_trick
<p>Chọn Statistics -> Protocol Hierarchy: xem thống kê số gói và dung lượng mà mỗi giao thức chiếm. Giao thức SMB2 có số byte đang chiếm tới 87,1% -> Có thể có file gì đó được truyền qua SMB2.</p>

![alt text](/thanhlai/post/forensics/image/post1/image-1.png)

<p>Chọn Export Objects -> SMB2: có file có phần mở rộng là .wav có vẻ như là một file âm thanh.</p>

![alt text](/thanhlai/post/forensics/image/post1/image-4.png)

<p>Mở file .wav bằng công cụ Sonic Visualiser thì biên độ âm thanh không có gì đặc biệt.</p>

![alt text](/thanhlai/post/forensics/image/post1/image-5.png)

<p>Thử filter hết các port không có dấu hiệu khả nghi thì tìm thấy có một port khá đặc biệt là 1337 đang gửi thông điệp gì đó.</p>

![alt text](/thanhlai/post/forensics/image/post1/image-2.png)

<p>Cllick phải -> Follow -> TCP Stream: xem thông điệp trao đổi trong kết nối TCP. Có vẻ như nội dung ám chỉ có điều gì đó ở tần số 18-21kHz trong file truyền qua SMB.</p>

![alt text](/thanhlai/post/forensics/image/post1/image-3.png)

<p>Chọn Pane -> Add Spectrogram: xem tần số 18-21kHz thì thấy được nội dung flag.</p>

![alt text](/thanhlai/post/forensics/image/post1/image.png)