# [1337UP-2023] Anonymous
<p>Qua thông tin trả về khi thực hiện lệnh <code>file Anonymous.exe</code>, ta biết được đây là chương trình được viết bằng .NET -> Sử dụng công cụ dnSpy để xem source code C#.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post5/image.png)

<p>Chương trình yêu cầu nhập mật khẩu (dòng 23). Sau đó, kiểm tra mật khẩu có phải là base64 độ dài từ 21 đến 30 và tồn tại trong <code>Resources.anon</code> không. Nếu có thì decode chuỗi base64 và kiểm tra. Nếu kí tự tại index 1 là n và index 3 là i thì in ra thông báo -> Có vẻ n và i là các kí tự nằm trong flag có dạng i<code>n</code>t<code>i</code>griti{...}</p>

![alt text](/thanhlai/post/reverse_engineering/image/post5/image-1.png)

<p>Nội dung chuỗi anon được lưu trong AnonChallenge.Properties.Resources.resources</p>

![alt text](/thanhlai/post/reverse_engineering/image/post5/image-2.png)

<p>Tạo script để decode những chuỗi base64 hợp lệ và tìm flag sau khi decode.</p>

```
import re, base64

ascii_art = """
                            ````...--...````
                 :s+`   ````````````````````````   -sy/
             --+NN:   `..` ``  ``  ``  ``  `` `..`   +NN//:
           .hssMy/  `.`   .````.``o/sy-`.````.   `.` `+yM/dh`
         `-mN-sod: .`    .    .  `y:/My  .    .    `. /dso:My/`
        `d`MyyNy.`.```` .     `    .y:   `     . ````.`.yNhmd:d
        sM.Nmos. .    `.`````.`````/:`````.`````.     . :o+dh+M+
        hM/ooNo .`     .     .     yy     .     .     `. oNs/sMs
       :sMomN+  .     ``     .     --     .     ``     .  +NNyM/+
      `m`mNd:o ``     ``     . `/`oyyo`/` .     ``     `` y-hNy.N
      `My-d-N/ `.`````..``-:/shNd `hh` dNhs/:-``..`````.` +N:y.dN
       hMo-NN` `.     ```NMMMMMM/ .++. /MMMMMMN```     .` `NM-hMs
       :NMyM+/  .     `.sMMMMMMMs  dd  sMMMMMMMs.`     .  o/MhMd:
      `h-yNm`N. ``     -NMMMMMMMN. MM .NMMMMMMMN-     `` :N`dN+:m
       sNo/s/M+  .` ```+MMMMMMMMMm-MM-mMMMMMMMMM+``` `. `oM:o:yM/
        oMN+/My:- ..`  yMMLjKYleQcOuaspJRvVAKvMMy  `.. /:yM/yMm:
        `/sNdNm`N+ `.  NMMMFxz5\fxC2FzvnbtMg4XvMN  .` sN NNmm++`
         :y:/yN:hM/  `:MMMMbM90gfG65GcGKsTrfxMMMM:`  +My+do:+d-
          .hNhoo-NN:o.:MMMW4vf2ScKgE5gSzV9o0XgMMM:-s:Nm-oymNs`
           .smMaNhmd:NyyNaW50aWdyaXRpe0Jhc2VfUl9Fej99NdMNho`
            .+o++ooo:yMddNMAzE3tYXvrft43Fh7NdmmNs-ooo++o+`
             -sdMMNNmmNmmMfjVBGe3l4sMcQ9t1QVMdddmNMMMNh+.
               .++//:/odMOW4t1WUJ4otsj7UuNhZWms+://++-
                 :oyddhNB0lABs8YATzKPXmT4oajNyhys+-
                        `2nDxDEXJsYx1aSvN38Ht`
                         -+sydmNNMMMMNNmdys+-`
"""  

base64_candidates = re.findall(r'[A-Za-z0-9+/=]{20,30}', ascii_art)
pattern_flag = re.compile(r'intigriti\{[^}]+\}', re.IGNORECASE)

for s in base64_candidates:
    s += '=' * (-len(s) % 4) 
    try:
        decoded = base64.b64decode(s, validate=True).decode('utf-8', errors='ignore')
        flags = pattern_flag.findall(decoded)[0]
        if flags:
            print(f"[FOUND]: {flags}")
    except:
        pass
```

<p>Chạy script và tìm thấy nội dung flag.</p>

![alt text](/thanhlai/post/reverse_engineering/image/post5/image-3.png)