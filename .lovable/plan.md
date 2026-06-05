سأتعامل مع المشكلة كفشل نشر حقيقي وليس كإصلاح مؤقت.

## ما الذي ظهر من الفحص
- النشر يفشل أثناء البناء، والصورة تشير إلى خطأ في `careers.tsx`.
- يوجد احتمال قوي أن السبب من أخطاء TypeScript/Imports ظهرت بعد آخر تعديل:
  - استخدام `React.FormEvent` و `React.ReactNode` بدون استيراد Type مناسب.
  - استيراد server function من `src/server/cvSummary.ts` داخل route في الواجهة، وهذا قد يكسر build في TanStack Start.

## خطة الإصلاح
1. **إصلاح أخطاء imports في صفحات careers**
   - تعديل `src/routes/careers.tsx` لاستخدام type imports الصحيحة بدل الاعتماد على namespace `React` غير المستورد.
   - تعديل `src/routes/admin.careers.tsx` لنفس السبب.

2. **نقل server function للمكان الصحيح**
   - نقل/إعادة إنشاء `generateCvSummary` في مسار آمن مثل `src/lib/cvSummary.functions.ts`.
   - تحديث استيراده في صفحة admin careers.
   - ترك الملفات الخاصة بالخادم كـ helpers فقط وعدم استيرادها مباشرة من الواجهة.

3. **التحقق من auth middleware للـ server functions**
   - فحص `src/start.ts` والتأكد أن `attachSupabaseAuth` مضاف في `functionMiddleware` لأن `generateCvSummary` محمي بتسجيل الدخول.

4. **عدم لمس بياناتك**
   - هذا الإصلاح سيكون للكود والبناء فقط.
   - لن أحذف أو أغير محتوى قاعدة البيانات أو المعلومات التي أضفتها.

5. **التحقق بعد الإصلاح**
   - فحص الإشارة المهمة: هل اختفى خطأ build/publish أم لا.
   - إذا بقي خطأ آخر، أعالجه من نص الخطأ الحقيقي بدل التخمين.

إذا وافقت، سأطبّق الخطة الآن.

<presentation-actions>
  <presentation-open-history>View History</presentation-open-history>
</presentation-actions>

<presentation-actions>
<presentation-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</presentation-link>
</presentation-actions>