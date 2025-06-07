# [ImaginaryCTF-2021] Go Fish
<p>Đầu tiên, chương trình in ra thông báo <code>"Do you have any eights?"</code> và yêu cầu người dùng nhập dữ liệu. Sau khi nhập xong, chương trình thoát ngay lập tức.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post6/image-1.png)

<p>Khi quan sát dưới dạng biểu đồ (Graph View), ta thấy có một vài lệnh gán chuỗi có vẻ là các thành phần của flag nằm dưới nhãn <code>target</code> -> Mục tiêu hiện tại là làm sao để thay đổi luồng thực thi để chương trình chạy vào nhánh <code>target</code> nơi chứa các lệnh này.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post6/image.png)

<p>Dựa vào vị trí các chuỗi được in ra ở trước, ta xác định vị trí được lệnh đọc dữ liệu từ người dùng là <code>call bufio__ptr_Reader_ReadString</code>. Hàm này đọc một chuỗi kết thúc bằng ký tự newline ('\n') và lưu địa chỉ chuỗi đó vào thanh ghi <code>rax</code>. Ngay sau đó, chương trình thực hiện lệnh <code>cmp [rsp+1F0h+var_1D8], 9</code> có vẻ là so sánh độ dài chuỗi vừa nhập với 9. Nếu chuỗi không có độ dài đúng bằng 9 ký tự, chương trình sẽ nhảy tới <code>loc_49B79D</code>.</p>


![alt text](/thanhlai/post/reverse_engineering/image/post6/image-2.png)

<p>Bên dưới nhãn <code>loc_49B79D</code> là các lệnh kết thúc hàm, do đó chương trình sẽ thoát nếu nhảy đến đây. Vì vậy, để tiếp tục thực thi các lệnh phía sau, chuỗi nhập vào bắt buộc phải có độ dài bằng 9 ký tự.</p>


![alt text](/thanhlai/post/reverse_engineering/image/post6/image-3.png)

<p>
Tại nhãn <code>label_1</code>, chương trình thực hiện lệnh <code>cmp [text], rcx</code> với giá trị <code>rcx = '!hsiF oG'</code>, tức là chuỗi <strong>"Go Fish!"</strong> ở dạng little-endian (đảo ngược byte trong thanh ghi). Nếu không khớp, chương trình nhảy tới <code>loc_49B79D</code> để kết thúc hàm.
</p>

<p>
Tiếp theo, tại nhãn <code>label_2</code>, lệnh <code>cmp byte ptr [text+8], 0Ah</code> kiểm tra xem ký tự thứ 9 có phải là <code>\n</code> (xuống dòng) hay không. Nếu đúng, chương trình nhảy tới <code>loc_49B7AD</code> để tiếp tục xử lý chuỗi tiếp theo. Nếu không, chương trình nhảy tới <code>loc_49B79D</code> để kết thúc hàm. Trong nhãn <code>loc_49B7AD</code>, chương trình gọi hàm <code>fmt.Fprintln</code> để in ra chuỗi <strong>"Your turn! "</strong>.
</p>

![alt text](/thanhlai/post/reverse_engineering/image/post6/image-4.png)

<p>Thử nhập chuỗi <code>"Go Fish!"</code> và nhấn Enter, chương trình xác nhận đầu vào hợp lệ và in ra chuỗi <code>"Your turn!"</code>, cho thấy logic kiểm tra chuỗi đầu tiên đã được vượt qua thành công.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post6/image-5.png)

<p>Tiếp theo, chương trình yêu cầu nhập thêm một chuỗi và thực hiện kiểm tra nội dung bằng cách so sánh từng phần nhỏ như: <code>"Do you h"</code>, <code>"ave "</code>, <code>"an"</code>, <code>"y"</code>. Sau đó kiểm tra độ dài chuỗi phải đúng 23 ký tự tương ứng với chuỗi <code>"Do you have any flags?\n"</code>. Nếu đúng, chương trình sẽ gọi hàm <code>runtime.memequal</code> để xác thực nội dung chuỗi. Như vậy, chuỗi thứ hai cần nhập chính xác là <code>"Do you have any flags?"</code> và nhấn Enter để tiếp tục.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post6/image-6.png)

<p>Chạy chương trình và gửi 2 chuỗi là <code>"Go Fish!"</code> và <code>"Do you have any flags?"</code> -> Nhận được flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post6/image-8.png)
