
# Futuristic Admin Dashboard — Complete Redesign

تحويل لوحة التحكم من تصميم عادي إلى **لوحة من المستقبل** بمستوى Linear / Vercel / Arc Browser، مع زجاجية متقدمة، خلفيات متحركة، ولوحة قيادة حية.

## ما المشكلة الحالية

- بطاقات KPI بسيطة بدون trends أو sparklines أو حركة
- خلفية مسطحة، sidebar عادي بدون عمق بصري
- جداول HTML خام بدون filters/search/pagination
- لا توجد تأثيرات حركية، لا command palette، لا real-time
- الإعدادات والمحتوى يستخدمون inputs أساسية

## الرؤية الجديدة

**Aesthetic**: "Bloomberg terminal × Apple Vision Pro × Linear"
- خلفية ميش متدرّجة متحركة (animated aurora mesh) + شبكة نقطية خفيفة
- جميع الكروت من نوع `glass-strong` مع حواف نيون متوهجة
- typography: Space Grotesk للعناوين بأحجام كبيرة، أرقام KPI ضخمة (text-5xl) مع تدرّج ذهبي
- micro-interactions في كل مكان: fade-up عند الدخول، scale-in للأرقام، shimmer للـ skeletons

## ما سيتم بناؤه

### 1. Shell — `admin.tsx` + خلفية جديدة

- خلفية ثابتة `fixed inset-0` تحتوي على:
  - `gradient-mesh` متحرّكة ببطء (animate-float-slow)
  - شبكة `bg-grid bg-grid-fade`
  - blob ضوئي primary وآخر accent يتحركان (orbit بطيء)
- TopBar زجاجي بـ `backdrop-blur` يحتوي:
  - SidebarTrigger + breadcrumb ديناميكي من الـ pathname
  - **Command Palette** (Cmd/Ctrl+K) باستخدام `cmdk` (متوفّر عبر `@/components/ui/command`) — تنقّل سريع لأي صفحة + إجراءات (إنشاء lead, تحديث، تسجيل خروج…)
  - مؤشّر "Live" (نقطة pulse خضراء) + ساعة بالوقت الحقيقي
  - زر theme/notifications، avatar مع dropdown

### 2. Sidebar — تطوير `AdminSidebar.tsx`

- شعار HN بتدرّج نيون + shimmer
- عناصر التنقّل بـ active state واضح: شريط جانبي متوهّج + bg تدرّجي + أيقونة بحجم أكبر
- شارات (badges) ديناميكية على Leads (عدد pending) و Chat (عدد جديد) من Supabase
- footer: حالة النظام (uptime, DB latency بسيط) + version

### 3. Overview — إعادة بناء `admin.index.tsx`

**Hero strip**:
- ترحيب ديناميكي ("Good evening, {name}") + ملخص اليوم في جملة واحدة
- 4 KPI كبيرة بـ:
  - رقم ضخم بتدرّج
  - sparkline مصغّر (recharts) لآخر 14 يوم
  - شارة trend (+12% ▲ خضراء / حمراء) مقارنة بالأسبوع السابق
  - أيقونة `neon-icon` متوهّجة

**Grid رئيسي (12-col)**:
- **Activity Feed (real-time)** col-span-4: stream حيّ عبر Supabase Realtime لـ project_requests و chat_logs و analytics_events، مع badge "LIVE"
- **Traffic & Conversion chart** col-span-8: AreaChart متعدد الطبقات (sessions, page_views, leads) مع toggle للفترة (7d/30d/90d) + tooltip زجاجي مخصّص
- **Top Pages** col-span-4: bar list أفقي مع progress bars نيون
- **Lead funnel** col-span-4: donut chart (pending → contacted → won → lost)
- **World/Geo placeholder** col-span-4: قائمة دول مع flag emojis ونسب

**Quick actions** كـ dock عائم سفلي (mac-style) مع 6 أيقونات.

### 4. Data tables — مكوّن مشترك جديد

إنشاء `src/components/admin/DataTable.tsx`:
- search bar زجاجي + filters (status, date range)
- column sorting، pagination، selection bulk-actions
- row hover: شريط primary على اليسار + scale خفيف
- empty state بأيقونة كبيرة ورسالة لطيفة
- skeleton shimmer أثناء التحميل

تطبيقه على: Leads, Users, Chat logs, Services, Portfolio.

### 5. Settings — تجديد `admin.settings.tsx`

- tabs أفقية زجاجية (Contact / SEO / Social / Branding / Integrations)
- inputs مع floating labels + focus ring نيون
- preview صغير على اليمين (مثلاً preview لكارت SEO يشبه Google snippet)
- زر Save sticky سفلي يظهر فقط عند وجود تغييرات (dirty state)

### 6. Services & Portfolio — تحسين بصري

- grid بطاقات بـ `neon-card` مع صورة، شارة active/draft، hover overlay مع زرّي edit/delete
- modal/drawer للإضافة والتعديل (بدل forms inline)

### 7. حركة وتفاعل

- جميع الكروت تدخل بـ `animate-fade-up` بـ stagger (delay متدرّج)
- الأرقام تتحرّك من 0 لقيمتها (count-up بسيط)
- toasts (sonner) لكل عملية CRUD
- `Cmd+K` / `Cmd+B` (toggle sidebar) / `g then o` للتنقل (اختياري)

## التفاصيل التقنية

**الملفات المُعدّلة**:
- `src/routes/admin.tsx` — shell جديد بخلفية متحركة + topbar + command palette
- `src/components/admin/AdminSidebar.tsx` — active state نيون + badges حية
- `src/routes/admin.index.tsx` — overview كامل بـ realtime
- `src/routes/admin.settings.tsx` — tabs + dirty state
- `src/routes/admin.leads.tsx` / `admin.users.tsx` / `admin.chat.tsx` — استخدام DataTable
- `src/routes/admin.services.tsx` / `admin.portfolio.tsx` — grid بطاقات + drawer

**ملفات جديدة**:
- `src/components/admin/AdminBackground.tsx` — خلفية aurora متحركة
- `src/components/admin/AdminTopbar.tsx` — topbar + breadcrumb + clock
- `src/components/admin/CommandPalette.tsx` — Cmd+K
- `src/components/admin/KpiCard.tsx` — KPI مع sparkline + trend + count-up
- `src/components/admin/ActivityFeed.tsx` — stream حيّ من Supabase Realtime
- `src/components/admin/DataTable.tsx` — جدول قابل للإعادة الاستخدام
- `src/hooks/use-count-up.tsx` — animation للأرقام
- `src/hooks/use-realtime-feed.tsx` — اشتراك realtime موحّد

**Realtime**: تفعيل `ALTER PUBLICATION supabase_realtime ADD TABLE` لـ `project_requests` و `chat_logs` و `analytics_events` عبر migration.

**التبعيات**: كل المطلوب موجود (recharts, cmdk عبر shadcn command, lucide, sonner, framer-motion غير ضروري — نستخدم CSS animations الموجودة في styles.css).

**Design tokens**: استخدام حصري للـ tokens الموجودة (`--primary`, `--accent`, `--gradient-neon`, `--shadow-neon`, `.neon-card`, `.glass-strong`) — لا ألوان hardcoded.

## النتيجة

لوحة تحكم بمستوى منتجات SaaS العالمية: زجاجية، حية، سريعة، مع command palette، realtime feed، وKPIs ذكية — بدلاً من الواجهة الحالية الجامدة.
