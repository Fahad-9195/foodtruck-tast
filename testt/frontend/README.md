# دليلك في مشروع الـ Frontend (تطبيق الفود ترك)

هذا الملف يشرح **مجلد `frontend` بالكامل** على أنك جديد: وش وظيفة كل جزء، وش تعني كلمات إنجليزية تلقاها، و**كيف تضيف ميزة جديدة** من أول يوم.

---

## 1) وش نستخدم؟ (بجملة واحدة)

- **Expo** = أداة تبني بها تطبيق React Native (أندرويد + آيفون) من مكان واحد.
- **React Native** = مكتبة تبني بها واجهة شاشة التطبيق (مثل الـ HTML لكن مكونات موبايل: `View`, `Text`، إلخ).
- **TypeScript** = لغة فوق جافاسكربت: تخلي الأخطاء البرمجية تظهر **قبل** ما تشغّل التطبيق.
- **React Navigation** = مكتبة للتنقل بين الشاشات (تبويب سفلي، وشاشة فوق شاشة).

---

## 2) معجم سريع (مصطلحات إنجليزية + معناها)

| الكلمة | وش المقصود؟ |
|--------|-------------|
| **package** / **dependencies** | الحزم/المكتبات اللي ينزّلها المشروع من الإنترنت (مثلاً Expo، الخرائط). |
| **npm** | أداة تثبيت الحزم (تشغّل `npm install` عشان ينزّل كل شي مذكور في `package.json`). |
| **script** (في `package.json`) | أمر جاهز: `npm start` يربطه داخليًا بـ `expo start`. |
| **build** | بناء التطبيق النهائي (للأندرويد/آيفون أو للويب). |
| **config / configuration** | إعدادات: اسم التطبيق، لون الـ splash، مفاتيح الخرائط، إلخ. |
| **entry point** | أول ملف ينفّذ عند التشغيل: عندنا `index.js` ثم يروح لـ `App.tsx`. |
| **Component** | مكوّن واجهة (زر، شاشة، كرت ترك) — مثل “قطعة LEGO”. |
| **Screen** | شاشة كاملة المستخدم يراها (الرئيسية، الطلبات، تفاصيل ترك). |
| **State** (حالة) | بيانات تتغير: مثل السلة، مثل من مسجل دخول. |
| **Store** | مكان يحفظ الـ state عالميًا: عندنا `auth-store` و`cart-store`. |
| **API** | الاتصال بالسيرفر/الباك اند (جلب تركات، تسجيل دخول). |
| **Client** (في `api/client.ts`) | إعداد “العميل” اللي يرسل طلبات HTTP (عادة Axios). |
| **Hook** (ربط) | دالة باسم `useSomething` تربطك بشي جاهز (مثلاً `useTruckDetails` يجيب تفاصيل ترك). |
| **Route** | مسار/اسم شاشة في الـ navigation (مثلاً `TruckDetails`). |
| **Stack** | “كومة” شاشات: تفتح شاشة فوق الثانية (مثلاً تفاصيل ترك فوق التبويب). |
| **Tab** | تبويب سفلي (الرئيسية، الخريطة، الطلبات…). |
| **Token** (في `theme/tokens`) | قيم تصميم ثابتة: ألوان، مسافات، خطوط — مو رمز دخول هنا. |
| **Path alias** (`@/`) | اختصار: `@/ui` = `src/ui` عشان ما تطول الاستيراد. |
| **Babel** | أداة تحوّل الكود (TypeScript/JSX) لشي يفهمه الـ bundler. |
| **Metro** | الباندلر الافتراضي لـ React Native (يجمع الملفات ويشغلها). |
| **NativeWind / Tailwind** (موجودة كحزم) | مكتبات للتصميم بصيغة `className` مثل الويب — **مشروعنا يعتمد غالبًا على `StyleSheet` + `theme/tokens`**. |
| **Lock file** (`package-lock.json`) | يقفل إصدارات الحزم عشان نفس النسخة تثبّت للجميع. **لا تحذفه “عشان تنظف”**؛ git يتعامل معه. |

---

## 3) الملفات في **جذر** مجلد `frontend` (وش تسوي؟)

| الملف | وش يسوي؟ | تقدر تحذفه؟ |
|-------|----------|-------------|
| **`package.json`** | يعرّف: اسم المشروع، سكربتات التشغيل (`start`, `android`…)، وقائمة المكتبات. | **لا** — بدون المشروع ما ينتعرف كـ Node project. |
| **`package-lock.json`** | يقفل نسخ الحزم بعد آخر `npm install`. | **ما تحذفه عمدًا** — يُحدَّث تلقائيًا. |
| **`index.js`** | **نقطة البداية:** يستدعي `registerRootComponent(App)` ويحمّل `gesture-handler` أول شي. | **لا** — Expo يتوقع `main` في `package.json` يشير لملف مثل هذا. |
| **`App.tsx`** | جذر واجهة التطبيق: `NavigationContainer`، `QueryClient`، الـ `Stack` لكل الشاشات الكبيرة. | **لا** — قلب التطبيق. |
| **`app.json`** | إعدادات ثابتة لـ Expo: اسم التطبيق، الاتجاه، الـ splash، الـ plugins. | **لا** — لازم للبناء. |
| **`app.config.js`** | **إعداد ديناميكي:** يقرأ `app.json` و**يضيف مفتاح خرائط Google** من متغير البيئة `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`. | تقدر “تدمج” كل شي في `app.json` لكن **تفقد** حقن المفتاح بسهولة. |
| **`babel.config.js`** | إعداد Babel: `babel-preset-expo` + مهم جدًا: `react-native-reanimated/plugin`. | **لا**. |
| **`tsconfig.json`** | إعداد TypeScript: مثل `strict`، ومسار `@/*` → `src/*`. | **لا** — بدون المحرر والـ tsc يضربون. |
| **`.nvmrc`** | يقول: استخدم **Node 20** (لـ nvm / fnm). | اختياري — للتوحيد بين المطورين. |
| **`global.css` + `tailwind.config.js` + `nativewind-env.d.ts`** | مرتبط بـ **NativeWind/Tailwind** (تصميم بـ className). | حاليًا **أغلب UI** مبني بـ `StyleSheet` + `theme/tokens`؛ هذي ملفات “جاهزية” للمستقبل. حذفها = لازم تشيل الحزم من `package.json` بخطوة منظّمة. |
| **`App.tsx` vs `app.json`** | غير مسمّيين: **App.tsx** = كود واجهة. **app.json** = إعدادات تطبيق Expo. | — |

**مجلد `scripts/`**
- `check-node-version.js` — يتأكد من إصدار Node قبل `npm install` / `start` (مرتبط بـ `preinstall` و`prestart` في `package.json`).
- `bootstrap-frontend.ps1` — سكربت ويندوز يساعد بتهيئة المشروع (`npm run bootstrap`).

---

## 4) شجرة `src/` (القلب الحقيقي)

```
src/
├── api/                 ← بنية HTTP مشتركة (عميل، رد API، أخطاء الشبكة، React Query)
├── config/              ← إعدادات مثل رابط الـ API (EXPO_PUBLIC_API_BASE_URL)
├── features/            ← “مجالات” تطبيق: تركات، طلبات، دخول… (كل feature فيه عادة api.ts)
├── navigation/          ← أسماء التبويب + أنواع الـ Stack
├── screens/             ← شاشات المسارات (واجهة المستخدم “صفحات”)
├── store/               ← Zustand: حالة عامة (دخول، سلة)
├── theme/               ← tokens: ألوان ومسافات (مصدر التصميم)
├── ui/                  ← مكوّنات UI مشتركة (زر، فاضي، خطأ، خريطة…)
├── utils/               ← دوال صغيرة عامة (مسافة، رابط صورة، وقت تحضير)
└── assets/              ← صور (خلفية، لوجو)
```

### 4.1) `src/api/`

- **`client.ts`**: ينشئ `axios` مع `baseURL` من `config`.
- **`envelope.ts`**: شكل الرد من الباك اند: `{ success, message, data }` — يسمونه **envelope** (مظروف/غلاف).
- **`network-error.ts`**: يحوّل أخطاء الشبكة لرسالة عربية للمستخدم.
- **`query-client.ts`**: إعداد **TanStack React Query** (تخزين مؤقت، إعادة محاولة طلبات).

### 4.2) `src/config/`

- **`app-config.ts`**: **Base URL** للـ API (من env أو قيمة افتراضية للتطوير).

### 4.3) `src/features/`

كل مجلد = **نطاق وظيفي**:

| المجلد | وش داخله عادة؟ |
|--------|----------------|
| `auth/` | `api.ts` — تسجيل دخول، تسجيل، ملفك الشخصي. |
| `trucks/` | `api.ts`, `types.ts`, `utils.ts`, `hooks/`, `components/` — استكشاف، تفاصيل، ترك لصاحب الترك. |
| `orders/` | `api.ts`, `components/` — طلبات العميل/الوارد. |
| `menus/` | `api.ts` — أصناف المنيو. |
| `admin/` | `api.ts`, `components/` — لوحة الأدمن. |
| `checkout/` | `components/` — اختيار طريقة الدفع (وAPI الطلب ممكن يبقى في `orders` حسب التصميم). |

**الفكرة:** الكود “الخاص بموضوع معيّن” **ما يتناثر** في كل المشروع — يتجمع في `features/`.

### 4.4) `src/navigation/`

- **`main-tabs.tsx`**: **التبويب السفلي** — يتغيّر حسب الدور: عميل (رئيسية/خريطة/طلبات) أو مالك ترك (لوحة/وارد/حساب) أو أدمن.
- **`root-stack.ts`**: **أنواع (types)** لأسماء الشاشات وباراميتراتها (مثلاً `TruckDetails` يحتاج `truckId`).

### 4.5) `src/screens/`

كل ملف = **شاشة كاملة** (غالبًا مربوطة بمسار في `App.tsx` أو التبويب):

- `auth/` — splash, auth, profile
- `home/` — home, map, map-discovery
- `truck/` — تفاصيل الترك
- `cart/`, `checkout/`
- `orders/`
- `owner/` — لوحة المالك، وارد، تسجيل ترك
- `admin/`

**Rule of thumb (قاعدة بسيطة):** `screens` = “أين المستخدم؟” — **ما تخلط** فيها منطق HTTP معقّد؛ يستدعي من `features` و`api`.

### 4.6) `src/store/`

- **`auth-store.ts`**: **Zustand** — التوكن، بيانات المستخدم، دخول/خروج.
- **`cart-store.ts`**: السلة (عناصر، ترك واحد، كميات).

**Zustand** = مكتبة state خفيفة (سهل تتبّع “منو مسجل؟” بدون فوضى).

### 4.7) `src/theme/`

- **`tokens.ts`**: **Design tokens** — ألوان، `spacing`, `radius`, `typography`, ظلال. **هنا مصدر الحقيقة للتصميم** في الكود الحالي (مع `StyleSheet`).

### 4.8) `src/ui/`

مكوّنات **مشتركة** تستخدمها أي شاشة: أزرار، حالات (فارغ/خطأ/تحميل)، `SearchBar`, `MapView`، `index.ts` يصدّر “باريل” (ملف يجمع الـ exports).

### 4.9) `src/utils/`

دوال **عامة** مو مربوطة بميزة واحدة: مسافة (Haversine), ربط URL للصور, تقدير وقت من نص `working_hours`.

---

## 5) كيف يمشي التشغيل؟ (تدفق بسيط)

1. `index.js` → يسجّل `App` كمكوّن الجذر.
2. `App.tsx` → يلفّ التطبيق بـ **Safe Area** + **QueryClient** + **Navigation** ويعرّف الـ **Stack** (MainTabs, Auth, TruckDetails, …).
3. **MainTabs** (`main-tabs.tsx`) → يختار **أي تبويبات** تظهر حسب `roleCode` من `auth-store`.
4. الشاشة تستدعي:
   - `features/.../api` للبيانات، أو
   - **hooks** مثل `useTrucksDiscovery`،
   - وتعرض بـ `ui` + `StyleSheet` + `tokens`.

---

## 6) وش يصير لما “تضغط” زر؟ (مفهوم عام)

- **State محلي** → `useState` داخل نفس الملف.
- **State عام (دخول/سلة)** → `useAuthStore` / `useCartStore`.
- **بيانات من السيرفر** → **React Query** (`useQuery` / `useMutation`) + دوال في `features/.../api.ts`.
- **انتقال شاشة** → `navigation.navigate("اسم_الراوت", { ... })` (الأسماء معرّفة في `App.tsx` و`RootStackParamList`).

---

## 7) كيف تضيف **ميزة جديدة** في الـ frontend؟ (خطوات عملية)

### أ) ميزة **تحتاج شاشة جديدة** (مثلاً: “مفضلة” Favorites)

1. **حدّد المسار:** هل هي داخل **تبويب** ولا **شاشة فوق** (stack)؟
2. **أضف الراوت (Route):**
   - افتح `src/navigation/root-stack.ts` (و/أو `main-tabs.tsx` حسب اختيارك).
   - عرّف الاسم + الباراميترات (مثلاً `Favorites: undefined`).
3. **أضف `Stack.Screen` في `App.tsx`** (أو `Tab.Screen` في `main-tabs` إن كانت تبويب).
4. **أنشئ ملف الشاشة** مثل `src/screens/favorites/favorites-screen.tsx` — تبدأ بـ `View` + نص بسيط للتأكد.
5. **اربط الانتقال:** من مكان يناسب (زر في home مثلاً) `navigation.navigate("Favorites")`.
6. **بعدها تبني “العقل”:**
   - مجلد `src/features/favorites/api.ts` — دوال `getFavorites` إذا الباك جاهز.
   - أو `hooks/use-favorites.ts` لـ React Query.
   - مكوّنات خاصة = `src/features/favorites/components/` (إن لزم).

### ب) ميزة **بدون شاشة جديدة** (مثلاً: زر “مشاركة” داخل تفاصيل الترك)

1. **حدّد الشاشة:** `src/screens/truck/truck-details-screen.tsx`.
2. **أضف الزر/المنطق** (مشاركة: غالباً `Share` من React Native).
3. **ما تحتاج** تعديل navigation إن ما في شاشة جديدة.

### ج) ميزة **تحتاج API جديدة**

1. **راجع الباك اند** — الـ path والـ body (مثلاً `GET /favorites`).
2. في `src/features/.../api.ts` (أو ميزة جديدة) أضف دالة تستخدم `apiClient` ونوع `ApiEnvelope<T>` من `@/api/envelope`.
3. **لا تكرّر** envelope في كل مكان — استخدم الـ `ApiEnvelope` المشترك.
4. **في الشاشة:** `useQuery` للقراءة أو `useMutation` للكتابة.

### د) قواعد “تنظّم نفسك” (Staff-level بسيطة)

- **تصميم مكرر لكل المشروع؟** → حطّه في `src/ui/`.
- **لون/مسافة؟** → من `src/theme/tokens.ts` (ما تسحب ألوان عشوائية في كل مكان).
- **منطق “ترك / طلب / …”؟** → `src/features/<domain>/`.
- **“صفحة” المستخدم؟** → `src/screens/...`.

---

## 8) أوامر مفيدة (من داخل مجلد `frontend`)

- `npm install` — ينزّل الحزم (أول مرة، أو بعد تغيير `package.json`).
- `npm start` — يشغّل **Expo** (وغالباً يتأكد من Node قبل).
- `npx tsc --noEmit` — يفحص TypeScript بدون بناء (إصلاح أخطاء الأنواع).

**متغيرات بيئة (مهمة):** غالباً ملف `.env` في `frontend` (مش لازم يكون في git):

- `EXPO_PUBLIC_API_BASE_URL` — عنوان الباك اند.
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` — مفتاح الخرائط (يُقرأ عبر `app.config.js`).

---

## 9) وين تطلب مساعدة؟

- **شاشة جديدة لا تفتح؟** → `App.tsx` + `root-stack.ts` + نفس `name` في `navigate`.
- **401 / Unauthorized؟** → `auth-store` وهل ترسل `Authorization: Bearer` في `api` (مثل دوال `features` الحالية).
- **صورة ما تظهر؟** → `utils/media-url.ts` + إن `EXPO_PUBLIC` صحيح لجهازك.

---

*آخر تحديث: يعكس هيكلية `src/` الحالية (مجلدات `api`, `ui`, `features`, `screens`, إلخ). إذا تغيّر المشروع لاحقاً، حدّث هذا الملف من نفس المستوى.*
