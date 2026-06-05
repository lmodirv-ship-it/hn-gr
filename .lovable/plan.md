# خطة الإصلاح

## 1. إصلاح أخطاء البناء/المعاينة
- فحص `src/components/chat/ChatWidget.tsx` للعثور على خطأ التحويل (500) — على الأرجح استيراد مفقود، خطأ JSX، أو استخدام API متصفح (window/localStorage) أثناء SSR.
- إصلاح السبب الجذري لاستعادة تحميل `virtual:tanstack-start-client-entry`.
- التحقق من السجلات بعد الإصلاح للتأكد من اختفاء الأخطاء.

## 2. المشكلة الأمنية: بيانات الاتصال الشخصية في `site_settings`
- `site_settings.contact` قابل للقراءة عاماً ويحتوي `lmodirv@gmail.com` و`0668546358`.
- **الحل:** تقسيم `contact` إلى مفتاحين:
  - `contact_public` (يبقى مرئياً عاماً) — يحتوي فقط بيانات العمل الرسمية (مثل `contact@groupe-hn.com` ورقم العمل إن وجد).
  - `contact_private` (admin/super_admin فقط) — يحتوي بريد المالك ورقم WhatsApp الشخصي.
- تحديث سياسات RLS لتقييد المفتاح الخاص.
- تحديث الواجهة (Footer/WhatsAppButton/Header) لاستخدام `contact_public` فقط.
- مطلوب من المستخدم: تأكيد بيانات العمل البديلة، أو السماح بإخفاء WhatsApp/الإيميل عن الواجهة العامة مؤقتاً.

## 3. المشكلة الأمنية: رفع CV بدون توثيق
- سياسة storage الحالية تسمح لأي شخص (anon) برفع ملفات إلى bucket `cvs` الخاص — مخاطر spam/malware.
- **الحل المختار:** الإبقاء على الرفع المجهول (لأن صفحة Careers عامة) مع إضافة قيود:
  - تقييد حجم الملف (10MB موجود مسبقاً في الواجهة، إضافته كـ bucket setting).
  - تقييد نوع MIME إلى PDF/DOC/DOCX على مستوى bucket.
  - تقييد مسار الرفع بـ prefix زمني محدد (مثلاً `applications/YYYY/MM/`) ومنع الكتابة فوق الملفات الموجودة (`upsert: false`).
  - حذف السياسة المفتوحة الحالية واستبدالها بـ INSERT policy تتطلب `bucket_id = 'cvs' AND name LIKE 'applications/%' AND (storage.extension(name) IN ('pdf','doc','docx'))`.

## 4. تحديث الذاكرة الأمنية
- توثيق الوضع الجديد: `site_settings.contact_public` عام مقصود، `contact_private` محمي، رفع CV anonymous مقيد بـ MIME/المسار.

## التفاصيل التقنية
- **الملفات المتأثرة:**
  - `src/components/chat/ChatWidget.tsx` (إصلاح خطأ البناء)
  - Migration SQL جديد: إعادة هيكلة `site_settings.contact`، سياسات RLS، سياسات storage.objects.
  - مكونات الواجهة التي تقرأ `contact`: `Footer.tsx`, `WhatsAppButton.tsx`, `Header.tsx`, `admin.settings.tsx`.

## سؤال قبل التنفيذ
هل تريد:
- (أ) **استبدال** الإيميل/الواتساب الشخصي ببيانات عمل بديلة (زودني بها)، أم
- (ب) **إخفاؤها** من الواجهة العامة وإبقاؤها متاحة فقط في لوحة الإدارة؟