# Shopping Web

فروشگاه مبلمان با فرانت React/Vite و API مبتنی بر Django REST Framework.

## اجرا در محیط توسعه

### بک‌اند

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API به‌صورت پیش‌فرض روی `http://127.0.0.1:8000` اجرا می‌شود.

### فرانت‌اند

در ریشه پروژه فایل `.env` باید شامل آدرس API باشد:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

سپس:

```powershell
npm install
npm run dev
```

## مسیرهای اصلی API

- `GET /api/products/` — فهرست، جست‌وجو، فیلتر و مرتب‌سازی محصولات
- `GET /api/products/categories/` — فهرست دسته‌بندی‌ها
- `GET /api/products/<slug>/` — جزئیات محصول
- `POST /api/auth/register/` — ثبت‌نام
- `POST /api/auth/login/` — ورود و دریافت توکن
- `GET /api/auth/profile/` — پروفایل کاربر واردشده
- `POST /api/auth/logout/` — خروج
- `GET /api/orders/` — سفارش‌های کاربر
- `POST /api/orders/` — ثبت سفارش و کسر تراکنشی موجودی
- `GET /api/orders/<id>/` — جزئیات سفارش متعلق به کاربر
- `GET /api/site/config/` — تنظیمات زنده قالب، برند، منو و ظاهر

برای مسیرهای محافظت‌شده هدر زیر ارسال می‌شود:

```text
Authorization: Token <token>
```

ساخت، ویرایش و حذف محصولات فقط برای کاربران staff مجاز است. مدیریت محصولات، دسته‌ها و سفارش‌ها از `/admin/` نیز در دسترس است.

صفحه‌های `/login`، `/register`، `/checkout` و `/orders` در فرانت به این APIها متصل هستند. checkout و سفارش‌ها فقط برای کاربر واردشده قابل دسترسی‌اند.

## مدیریت قالب از پنل ادمین

در `/admin/` دو بخش جدید وجود دارد:

- **تنظیمات سایت:** نام و لوگو، زبان، جهت RTL/LTR، رنگ‌ها، فونت، عرض قالب، گردی گوشه‌ها، اعلان، Hero و اطلاعات فوتر.
- **منوی ناوبری:** عنوان فارسی و انگلیسی، مسیر، ترتیب، فعال/غیرفعال بودن و بازشدن در تب جدید.

فرانت در زمان اجرا تنظیمات را از API دریافت و بدون نیاز به build مجدد روی CSS variables، متن‌ها و ساختار منو اعمال می‌کند.

## تنظیمات production

مقادیر نمونه در `backend/.env.example` مستند شده‌اند. Django فایل `.env` را خودکار بارگذاری نمی‌کند؛ این متغیرها باید در سرویس اجرا یا پنل هاست تنظیم شوند. حداقل `DJANGO_SECRET_KEY`، `DJANGO_DEBUG=false`، دامنه‌های مجاز و اطلاعات SMTP را تنظیم کنید.

## تست و بررسی

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py test

cd ..
npm run lint
npm run build
```
