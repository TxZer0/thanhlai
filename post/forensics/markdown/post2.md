# [OSCTF-2024]
## The_Lost_Image_Mystery
<p>Đầu tiên, check 8 byte đầu tiên thì xác nhận rằng đây không phải là magic byte của PNG. Tuy nhiên, khi sửa lại thành magic byte của PNG thì vẫn không xem ảnh được -> Có vẻ như đây không thực sự là file PNG.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-9.png)

<p>Khi kiểm tra các byte nằm ở cuối thì phát hiện ra 2 byte FF D9 => Điều này biểu thị sự kết thúc của luồng dữ liệu JPEG -> Có vẻ như cần sửa magic byte thành định dạng JPEG.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-10.png)

<p>Sửa 12 byte đầu tiên và save lại thành file .jpeg.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-11.png)

<p>Tìm thấy flag nằm trong file ảnh.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-12.png)

## Cyber_Heist_Conspiracy
<p>Mở phần Packet comments của gói đầu tiên thì tìm thấy flag.</p>

![alt text](/thanhlai/post/forensics/image/post4/image.png)

## Mysterious_Website_Incident
<p>Có một dòng log khá đặc biệt đang gửi request đến file nào đó được lưu trên Google Drive.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-1.png)

<p>Truy cập url thì tìm thấy flag.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-2.png)

## PDF_Puzzle
<p>Nội dung file pdf bị che ở một số đoạn -> Có vẻ như cần đọc các đoạn nội dung bị che.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-3.png)

<p>Thử chọn tất cả và copy thì không tìm thấy flag bên trong.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-4.png)

<p>Thử đọc các metadata thì tìm thấy flag là giá trị của trường Author.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-5.png)

## Seele_Vellorei
<p>Ban đầu, mở file docx và xem nội dung thì không có gì đặc biệt. Tiếp theo, giải nén để xem các file (xml, png, ...) bên trong.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-6.png)

<p>Xem cấu trúc thư mục thì không tìm thấy file nào có tên đặc biệt. Thử sử dụng find kết hợp regex để tìm chuỗi flag.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-7.png)

## The_Hidden_Soundwave
<p>Chọn Pane -> Add Spectrogram: để xem tần số âm thanh -> Phát hiện flag nằm trong đoạn 0-1kHz.</p>

![alt text](/thanhlai/post/forensics/image/post4/image-8.png)





