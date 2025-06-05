# [IrisCTF-2024] The Johnson's
<p>Đầu tiên, chương trình đưa ra thông báo "Nhập màu sắc bạn yêu thích" và yêu cầu nhập một chuỗi s1. Sau đó, so sánh chuỗi đó với giá trị colors, s2, off_4050, và off_4058. Nếu bằng nhau thì set giá trị của v7 thành giá trị từ 1 đến 4.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post2/image.png)

<p>Truy cập phần .data, ta thấy được chuỗi colors là "red", s2 là "blue",... </p>

![alt text](/thanhlai/post/reverse_engineering/image/post2/image-2.png)

<p>Dòng 48, so sánh v7 với các phần tử trong mảng chosenColor và nếu trùng thì in ra thông báo "Lựa chọn này đã được chọn" -> Vòng lặp while đầu tiên sẽ so sánh với các màu trong mảng colors và v7 được dùng để ngăn việc nhập một màu nhiều lần bằng cách kiểm tra số được lưu từ 1 đến 4 đại diện cho index của màu trong mảng colors</p>

![alt text](/thanhlai/post/reverse_engineering/image/post2/image-1.png)

<p>Vòng lặp thứ 2 cũng có hành vi tương tự thứ nhất. Tuy nhiên, chuỗi nhập vào sẽ được so sánh với các phần tử trong mảng foods.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post2/image-3.png)

<p>Dòng 112 trong main, hàm check được sử dụng để kiểm tra nếu không thỏa điều kiện if (dòng 10) thì in ra nội dung flag. Sau khi rename các phần tử trong mảng chosenFoods và chosenColors, có thể dễ dàng thấy các điều kiện cần thỏa mãn bao gồm: </p>

- v2 = 1 => chosenColors[0] != 3 && chosenColors2 != 3 => Màu nhập lần thứ nhất và thứ hai không được là green
- v1 = 1 => v0 && chosenColors2 != 1 => Màu nhập lần thứ hai không được là red và v0 = 1
- v0 = 1 => chosenFoods3 != 2 && chosenFoods4 != 2 => Đồ ăn nhập lần thứ 3 và lần thứ tư không được là pasta
- chosenFoods[0] == 4 => Đồ ăn nhập lần thứ nhất là chicken
- chosenFoods4 != 3 => Đồ ăn nhập lần thứ tư không được là steak
- chosenColors3 != 4 => Màu nhập lần thứ ba không được là yellow
- chosenColors4 == 2 => Màu nhập lần thứ tư là blue 

![alt text](/thanhlai/post/reverse_engineering/image/post2/image-4.png)

<p>Tóm tắt, các điều kiện:</p>

- Đối với màu:
1. khác green 
2. khác red, green 
3. khác yellow
4. blue

- Đối với đồ ăn:
1. chicken
2. không có
3. khác pasta
4. khác steak, pasta

![alt text](/thanhlai/post/reverse_engineering/image/post2/image-5.png)