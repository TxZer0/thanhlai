# [BackdoorCTF-2023] Secret Door
<p>Dòng 20, kiểm tra nếu độ dài của tham số thứ hai (argv[1]) truyền vào khi chạy chương trình khác với 17 hoặc có giá trị rỗng thì exit. Ngược lại thì tiếp tục xử lý.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post3/image.png)

<p>Dòng 58, truyền argv[1] làm tham số thứ hai vào hàm func_4 và gán giá trị trả về vào v3. Tiếp tục, v3 làm tham số thứ nhất cho hàm func_3 và gán kết quả vào v7. Sau đó, hàm func_2 được sử dụng để kiểm tra giá trị của v7 và nếu thỏa mãn điều kiện thì gọi hàm func_1 với 2 tham số là byte đầu tiên và byte có index 16 trong mảng v7.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post3/image-1.png)

<p>Hàm func_1 dùng giá trị 2 tham số để giải mã dữ liệu trong file encoded.bin và ghi vào file the_door.jpg -> Có vẻ như file the_door.jpg sẽ chứa nội dung flag sau khi giải mã. Vậy mục tiêu bây giờ là tìm ra giá trị của 2 tham số truyền vào.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post3/image-2.png)

<p>Trong hàm func_2, kiểm tra nếu các phần tử trong mảng a1 (v7 trong hàm main) phải bằng các giá trị tương ứng thì trả về true. Tuy nhiên, cần quan tâm giá trị của phần tử đầu tiên là 0x4e và phần tử có index 16 là 0x21.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post3/image-3.png)

<p>Sử dụng gdb để gọi tới hàm func_1 với tham số thứ nhất bằng 0x4e và thứ hai bằng 0x21 -> Thấy được file the_door.jpg đã được tạo ra.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post3/image-4.png)

<p>Cuối cùng, mở file và tìm được nội dung flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post3/image-5.png)