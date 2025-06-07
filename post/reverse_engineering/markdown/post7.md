# [ImaginaryCTF-2021] vnpack
<p>Khi sử dụng lệnh <code>strings vnpack</code> thì phát hiện đoạn thông tin về UPX -> Khả năng cao đây là file thực thi đã bị pack bởi UPX.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-1.png)

<p>Tuy nhiên, khi unpack thì không thành công. Có vẻ file này đã bị chỉnh sửa để UPX không nhận diện được.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-2.png)


<p>Trong nội dung binary, phát hiện các vị trí chứa chuỗi <code>VPX!</code> thay vì <code>UPX!</code>, trong đó byte đầu tiên là <code>0x56</code> (V). Nhiều khả năng byte đúng phải là <code>0x55</code> (U).
</p>

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-3.png)

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-4.png)

<p>Sau khi thử pack một file ELF bất kỳ bằng UPX và kiểm tra nội dung hex, ta xác nhận rằng chuỗi đúng là <code>UPX!</code> với byte đầu tiên là <code>0x55</code>. Do đó, chỉ cần sửa các vị trí chứa <code>VPX!</code> thành <code>UPX!</code> bằng cách đổi byte <code>0x56</code> -> <code>0x55</code>, sau đó có thể unpack bình thường.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-5.png)

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-6.png)

<p>Thực hiện lệnh <code>upx -d vnpack_output</code> sẽ thành công. Chạy file unpacked cho ra flag như sau:</p>

![alt text](/thanhlai/post/reverse_engineering/image/post7/image-8.png)
