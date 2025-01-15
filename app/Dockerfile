# Sử dụng image Python 3.13
FROM python:3.13

# Đặt thư mục làm việc
WORKDIR /D:/BT/Web/fastapi/food-delivery-fastapi/app

# Sao chép các tệp vào container
COPY . .

# Cài đặt các thư viện cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Mở cổng 8000 cho ứng dụng FastAPI
EXPOSE 8000

# Chạy ứng dụng
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
