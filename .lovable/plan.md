
## خطة: تطوير HN-GROUPE الحالي (المرحلة التالية)

بناءً على اختيارك للخيار **1** (تطوير الموقع الحالي)، إليك خطة الإطلاق الكاملة مقسمة على 4 محاور:

### 1) Admin Dashboard حقيقي
- إنشاء جدول `user_roles` + enum `app_role` (admin/user) مع RLS آمنة (تجنب recursion عبر `has_role()` SECURITY DEFINER).
- إضافة `lmodirv@gmail.com` كأدمن تلقائياً عبر trigger على `auth.users`.
- ترقية `src/routes/admin.tsx` (موجود) ليصبح لوحة كاملة بتبويبات:
  - **Leads**: عرض كل `project_requests` (search/filter حسب نوع المشروع، الميزانية، الحالة) + تغيير الحالة (new/contacted/won/lost).
  - **Users**: قائمة المستخدمين من `profiles` + تعيين/إزالة صلاحية admin.
  - **Chat logs**: محادثات `ChatWidget` المخزّنة لتحليل نية الزوار.
  - **Analytics**: KPIs (عدد الزوار، leads جدد، conversion rate، أكثر الخدمات طلباً) — مخططات بـ Recharts.
- حماية المسار: `beforeLoad` يتحقق من `has_role(uid, 'admin')`، وإلا redirect إلى `/`.

### 2) تتبع داخلي (Internal Analytics)
- جدول `analytics_events` (event_name, user_id, session_id, path, metadata jsonb, created_at).
- Hook `useTrackEvent()` + tracker تلقائي للأحداث الأساسية:
  `page_view`, `cta_click`, `chat_open`, `chat_message_sent`, `lead_submitted`, `idea_generated`, `signup`, `signin`.
- عرض النتائج داخل تبويب Analytics في الأدمن (جاهز للترقية لاحقاً إلى Google Analytics بإضافة Measurement ID).

### 3) تنظيف وتحضير الإطلاق (Launch Polish)
- إزالة أي بيانات وهمية متبقية في `data/projects.ts` و `TestimonialsSection` واستبدالها بمحتوى حقيقي قابل للتعديل من الأدمن لاحقاً.
- إضافة قسم **Mission** واضح في `HeroSection` يوضح هدف الموقع.
- إضافة `robots.txt` + `sitemap.xml` ديناميكي.
- meta tags محسّنة لكل route (services, portfolio, idea-generator).

### 4) Viral / Growth Hooks
- زر **Share** على بطاقات portfolio.
- صفحة شكر بعد إرسال lead فيها CTA لمشاركة الموقع.
- Toast notifications احترافية بصوت نجاح عند:
  - تسجيل الدخول
  - إرسال نموذج Start Project
  - توليد فكرة من AI

---

### الملفات التي ستُعدَّل / تُنشأ
**جديد:**
- `supabase/migrations/*` — `app_role` enum, `user_roles`, `has_role()`, `analytics_events`, trigger للأدمن.
- `src/hooks/use-track-event.tsx`
- `src/hooks/use-admin.tsx`
- `src/components/admin/{LeadsTab,UsersTab,AnalyticsTab,ChatLogsTab}.tsx`
- `src/routes/_admin.tsx` (layout guard)
- `src/components/home/MissionSection.tsx`
- `public/robots.txt`, `src/routes/sitemap[.]xml.tsx`

**معدّل:**
- `src/routes/admin.tsx` — استبدال بالـ Dashboard الكامل
- `src/routes/__root.tsx` — تركيب tracker تلقائي
- `src/components/home/HeroSection.tsx` — إضافة Mission CTA
- `src/components/forms/StartProjectForm.tsx` — track + redirect للشكر
- `src/components/chat/ChatWidget.tsx` — track فتح/إرسال

### الأمان
- جميع الجداول الجديدة بـ RLS:
  - `user_roles`: قراءة فقط للمستخدم لأدواره؛ admin فقط للكتابة.
  - `analytics_events`: insert مفتوح (للزوار)، select للأدمن فقط.
  - `project_requests`: select/update للأدمن فقط، insert مفتوح (موجود).
- لا تخزين أدوار في `profiles` — جدول منفصل عبر `has_role()`.

### ملاحظات
- لن أحذف أي مكوّن موجود — فقط أطوّر وأضيف.
- بعد الموافقة، سأنفذ كل شيء بالترتيب: Migration → Admin → Tracking → Polish.
- إذا أردت لاحقاً ربط Google Analytics الحقيقي، فقط أعطني `G-XXXXXXXXXX`.
