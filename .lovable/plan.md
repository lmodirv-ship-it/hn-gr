
## الهدف
إضافة ملف `public/index.html` (صفحة HTML ثابتة مستقلة) تكون متاحة على المسار `/index.html` كصفحة هبوط، مع إبقاء بقية الموقع يعمل بـ TanStack Start كما هو دون أي تغيير.

## ما سيتم تنفيذه

1. **إنشاء `public/index.html`** — صفحة HTML/CSS/JS مكتفية بذاتها تحتوي:
   - شعار HN Groupe والاسم
   - قسم Hero مع شرح مختصر بالعربية والإنجليزية
   - أزرار CTA تنتقل إلى `/` (الموقع الكامل) و `/auth` (تسجيل الدخول)
   - عرض إحصائيات حية (الزوار، المتواجدون، المسجلون) عبر استدعاء Supabase RPC `get_public_site_stats` مباشرة من المتصفح بالـ publishable key
   - روابط التواصل (واتساب، إيميل)
   - تصميم متوافق مع هوية الموقع (أزرق/أبيض/ذهبي)
   - دعم RTL/LTR
   - Meta tags وOG كاملة

2. **الاتصال بالـ Backend**:
   - استخدام `fetch` مباشرة إلى `https://<supabase-url>/rest/v1/rpc/get_public_site_stats` مع `apikey` العام (publishable key)
   - لا حاجة لأي Build step — يعمل HTML خالص

3. **الوصول للصفحة**:
   - `https://www.groupe-hn.com/index.html` (الملفات في `public/` تُخدم مباشرة من الجذر)
   - الصفحة الرئيسية `/` تبقى تعرض موقع TanStack كما هو

## ما لن يتغير
- لن أحذف أو أعدل أي route من `src/routes/`
- لن أغير `__root.tsx` أو `index.tsx`
- لن أحول المشروع إلى SPA أو Static Export
- الموقع الحالي يستمر بالعمل بنفس الطريقة 100%

## التقنيات
HTML5 + Tailwind via CDN + Vanilla JS + Supabase REST API مباشرة.
