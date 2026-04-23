# دليل الباك اند من الصفر (Food Truck Platform)

هذا الدليل مكتوب لأي شخص جديد على المشروع. بنشرح كل شي بالعربي العامي، ملف ملف، وبنقول لك:

1. وش هو الباك اند أصلًا؟
2. وش التقنيات المستخدمة؟
3. كل ملف وش يسوي؟
4. كيف يمشي الـ request من لحظة ما تضغط زر في التطبيق لين ما يرجع الرد؟
5. لو أبي أضيف ميزة جديدة، وش الخطوات بالترتيب؟

---

## 1) نظرة عامة: وش معنى "الباك اند"؟

- **Frontend** = التطبيق اللي يفتحه المستخدم على جواله (React Native).
- **Backend** = السيرفر (Server) اللي يجلس في مكان ثاني. مهمته:
  - يستقبل الطلبات (Requests) من الفرونت
  - يتعامل مع قاعدة البيانات (Database)
  - يرجع الرد (Response) للفرونت

مثال بسيط: المستخدم يضغط "تسجيل دخول" في التطبيق → الفرونت يرسل `email + password` للباك اند → الباك اند يتحقق من قاعدة البيانات → إذا صح يرجع **Token** (بطاقة دخول) → التطبيق يحفظه ويدخّله.

---

## 2) التقنيات المستخدمة (The Stack)

| التقنية | وش تسوي؟ |
|--------|--------|
| **Node.js** | بيئة تشغيل JavaScript على السيرفر (مب في المتصفح). |
| **TypeScript** | JavaScript بس مع أنواع (Types) عشان ما يصير غلط غبي. |
| **Express** | الـ Framework اللي نبني فيه السيرفر - يستقبل HTTP requests ويرجع responses. |
| **MySQL** | قاعدة البيانات اللي نخزن فيها (المستخدمين، الفود تركات، الطلبات...). |
| **Knex** | مكتبة (Library) تساعدنا نكتب SQL بطريقة JS نظيفة + تدير الـ Migrations. |
| **Zod** | مكتبة تتحقق من صحة البيانات الجاية من المستخدم (Validation). |
| **JWT** (JSON Web Token) | بطاقة دخول مشفّرة نعطيها للمستخدم بعد تسجيل الدخول. |
| **bcryptjs** | يشفّر كلمات المرور (Passwords) قبل ما نخزنها. |
| **Pino** | يطبع الـ Logs (السجلات) بشكل منظم. |
| **Helmet** | middleware للحماية من هجمات الويب المعروفة. |
| **CORS** | يسمح للفرونت يتكلم مع الباك اند (حتى لو مختلفين في الدومين). |
| **express-rate-limit** | يمنع أحد يسبّم السيرفر بطلبات كثيرة. |
| **Multer** | يتعامل مع رفع الملفات (Images / PDFs). |

> **مصطلحات مهمة بتمر عليك كثير:**
> - **Request** = الطلب القادم من التطبيق (يحتوي على URL + طريقة GET/POST + بيانات).
> - **Response** = الرد اللي يرجع منا للتطبيق.
> - **Endpoint / Route** = عنوان محدد في الـ API، مثلاً `POST /api/v1/auth/login`.
> - **Middleware** = دالة تشتغل "في المنتصف" قبل ما يوصل الطلب للكود الأساسي (مثل: التحقق من الـ Token).
> - **Controller** = اللي يستقبل الطلب ويقرر وش يسوي.
> - **Service** = اللي فيه الـ Business Logic (منطق الشغل الفعلي).
> - **Repository** = اللي يتكلم مع قاعدة البيانات (الوحيد المسموح له).
> - **Validator** = اللي يتحقق أن البيانات الجاية صح (Zod schemas).

---

## 3) شجرة المشروع كاملة

```
backend/
├── package.json             ← قائمة المكتبات + أوامر التشغيل (npm run dev ...)
├── tsconfig.json            ← إعدادات TypeScript
├── knexfile.ts              ← إعدادات Knex (قاعدة البيانات + migrations)
├── docker-compose.yml       ← لإطلاق MySQL بسرعة على جهازك
├── uploads/                 ← مجلد الصور/الملفات المرفوعة من المستخدمين
│
└── src/                     ← كل الكود هنا
    ├── app.ts               ← بناء تطبيق Express
    ├── server.ts            ← تشغيل السيرفر على Port معين
    ├── routes.ts            ← تجميع كل الـ routes في مكان واحد
    │
    ├── config/
    │   └── env.ts           ← قراءة متغيرات البيئة (.env) والتحقق منها
    │
    ├── core/                ← البنية التحتية (Infrastructure) - ما تتعلق بأي Feature
    │   ├── db/
    │   │   └── connection.ts       ← الاتصال بقاعدة البيانات
    │   ├── errors/
    │   │   ├── error-codes.ts      ← كتالوج كل أكواد الأخطاء
    │   │   ├── app-error.ts        ← كلاس الخطأ الموحّد (AppError)
    │   │   └── index.ts            ← ملف تصدير (barrel)
    │   ├── http/
    │   │   ├── api-response.ts     ← شكل الردود الموحد (ok/fail)
    │   │   ├── async-handler.ts    ← يتعامل مع أخطاء async
    │   │   ├── require-auth.ts     ← helper يتأكد أن المستخدم مسجل دخول
    │   │   └── middleware/
    │   │       ├── authenticate.ts       ← يتحقق من JWT
    │   │       ├── authorize.ts          ← يتحقق من الصلاحية (Role)
    │   │       ├── error-handler.ts      ← يصطاد كل الأخطاء
    │   │       └── not-found-handler.ts  ← رد 404 لأي route غير موجود
    │   ├── logger/
    │   │   └── logger.ts           ← إعداد Pino logger
    │   └── types/
    │       ├── auth.ts             ← types خاصة بـ Auth
    │       └── express.d.ts        ← إضافة authUser على Request
    │
    ├── database/            ← كل شي يخص البيانات نفسها
    │   ├── schema.sql              ← مرجع SQL للمخطط
    │   ├── erd.md                  ← مخطط العلاقات
    │   ├── dev_seed.sql            ← بيانات تطوير
    │   ├── migrations/             ← Knex migrations (تعديلات بنية الجداول)
    │   └── seeds/                  ← ملفات زرع بيانات أولية
    │
    └── modules/             ← الـ Features (الدومينات) كل واحد في فولدر
        ├── shared/                 ← ثوابت مشتركة بين الموديولز
        │   ├── roles.ts            ← ADMIN / TRUCK_OWNER / CUSTOMER
        │   ├── order-status.ts     ← pending/preparing/ready/...
        │   └── truck-status.ts     ← pending/approved/rejected ...
        │
        ├── auth/                   ← تسجيل + دخول + ملف المستخدم
        ├── trucks/                 ← الفود تركات
        ├── menus/                  ← القوائم والأصناف
        ├── orders/                 ← الطلبات
        ├── uploads/                ← رفع الصور
        └── health/                 ← اختبار سريع أن السيرفر شغال
```

### الفرق بين `core/` و `modules/` و `modules/shared/`

- **`core/`** = أشياء ما تخص أي فيتشر محدد. مثل: قاعدة البيانات، اللوق، معالجة الأخطاء. لو حذفنا `modules/` لظل `core/` شغال.
- **`modules/`** = الفيتشرز (المطاعم، الطلبات...). كل فولدر = دومين مستقل.
- **`modules/shared/`** = ثوابت وأنواع يستخدمها أكثر من موديول (مثلاً `ROLE_CODES` يستخدمها auth و trucks و orders).

---

## 4) شرح كل ملف بالتفصيل

### 4.1) `src/server.ts` - نقطة البداية

```7:7:backend/src/server.ts
app.listen(env.PORT, () => {
```

- هذا الملف أول ملف يشتغل لما تسوي `npm run dev`.
- يستدعي `app` من `app.ts` ويشغّله على Port (في `.env` = 4000).
- ما يسوي شي ثاني، مهمته فقط **"ابدأ الاستماع"**.

### 4.2) `src/app.ts` - بناء تطبيق Express

هذا الملف يرتب الـ **Middlewares** بالترتيب الصح:

| الترتيب | الـ Middleware | وظيفته |
|--------|-------------|--------|
| 1 | `pinoHttp` | يسجل كل Request في الـ Logs |
| 2 | `helmet` | Security headers (حماية أساسية) |
| 3 | `cors` | يسمح للفرونت يتصل (اقرأ `CORS_ORIGIN` من env) |
| 4 | `rateLimit` | يحد الطلبات إلى 200 / 15 دقيقة لكل IP |
| 5 | `express.json()` | يقرأ الـ JSON الجاي في body |
| 6 | `/uploads` static | يخدم الصور والملفات المرفوعة |
| 7 | `/api/v1` → apiRouter | كل الـ routes تبدأ بهذا البادئة |
| 8 | `notFoundHandler` | إذا ما لقى أي route → 404 |
| 9 | `errorHandler` | يصطاد أي خطأ ويرد برد موحد |

> **قاعدة مهمة:** `notFoundHandler` لازم يجي قبل `errorHandler`، و`errorHandler` لازم يكون آخر شي.

### 4.3) `src/routes.ts` - جامع الـ Routes

```15:22:backend/src/routes.ts
export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/trucks", trucksRouter);
apiRouter.use("/menus", menusRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/uploads", uploadsRouter);
```

- يجمع كل الـ routers من الموديولز ويركّبها تحت بادئات (prefixes).
- هذا **المكان الوحيد** اللي يعرف كل الـ APIs الموجودة.
- لو أضفت موديول جديد → هنا تضيف سطر واحد.

### 4.4) `src/config/env.ts` - إعدادات البيئة

```6:17:backend/src/config/env.ts
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default("foodtruck_platform"),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  JWT_ACCESS_SECRET: z.string().min(16).default("dev-only-change-this-secret"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  CORS_ORIGIN: z.string().default("*")
});
```

- يقرأ `.env` ويتحقق أن كل المتغيرات صح قبل ما يشغّل السيرفر.
- لو ناقص متغير مطلوب → السيرفر يطلع خطأ وقت البداية مباشرة (Fail Fast).
- تستورد `env` من هذا الملف في أي مكان تحتاج فيه إعدادات.

### 4.5) `src/core/db/connection.ts` - الاتصال بالقاعدة

- ينشئ **Knex instance** اسمه `db` وعنده pool (حوض) من 2 إلى 10 اتصالات.
- أي Repository يستخدم `db("table_name")...` للتكلم مع MySQL.

### 4.6) `src/core/logger/logger.ts` - Logger

- في `development` يطبع ملوّن (pretty).
- في `production` يطبع JSON (سهل للمراقبة / Monitoring).
- استخدامه: `logger.info("message")` أو `logger.error({err}, "failed")`.

### 4.7) `src/core/errors/` - نظام الأخطاء (قلب المشروع)

#### `error-codes.ts`

فيه **كتالوج** (قائمة) كل أكواد الأخطاء الممكنة. كل كود:
- **اسم ثابت** (مثل `AUTH_INVALID_CREDENTIALS`)
- **HTTP status** افتراضي (401، 404، ...)
- **رسالة** افتراضية

مثال:

```84:84:backend/src/core/errors/error-codes.ts
  AUTH_INVALID_CREDENTIALS: { status: StatusCodes.UNAUTHORIZED, message: "Invalid credentials" },
```

ليش مركزي؟ عشان:
1. الفرونت يقدر يترجم الأكواد لرسائل عربية بدون ما يعتمد على النص.
2. أي مطور يفتح هذا الملف يعرف كل الأخطاء الممكنة.
3. سهل نربطه بمراقبة (Monitoring) مستقبلاً.

#### `app-error.ts`

```26:38:backend/src/core/errors/app-error.ts
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    const definition = ERROR_CATALOG[code];
    super(options.message ?? definition.message);
    this.name = "AppError";
    this.code = code;
    this.status = options.status ?? definition.status;
    this.details = options.details;
  }
}
```

لما تبي ترمي خطأ:

```typescript
throw new AppError("TRUCK_NOT_FOUND");
throw new AppError("ORDER_INVALID_STATUS_TRANSITION", {
  message: `Cannot move from ${from} to ${to}`,
  details: { from, to }
});
```

#### `index.ts`

barrel file (ملف بوابة) يصدّر كل شي. عشان تستورد بسطر واحد:
```typescript
import { AppError, ERROR_CODES } from "../../core/errors";
```

### 4.8) `src/core/http/api-response.ts` - شكل الردود

كل رد من الـ API له شكل ثابت (Contract):

**نجاح:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "accessToken": "...", "user": {...} }
}
```

**فشل:**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": { "code": "AUTH_INVALID_CREDENTIALS" }
}
```

- `ok(message, data)` → ينشئ رد نجاح.
- `fail(message, error)` → ينشئ رد فشل (يستخدمه error-handler).

### 4.9) `src/core/http/async-handler.ts`

Express ما يصطاد الأخطاء في الدوال الـ `async` بشكل افتراضي. هذا الـ helper يغلف دالتك ويحول أي promise rejection إلى `next(error)`:

```typescript
router.get("/x", asyncHandler(async (req, res) => {
  throw new AppError("TRUCK_NOT_FOUND");
}));
```

بدون `asyncHandler` السيرفر ممكن يعلّق.

### 4.10) `src/core/http/require-auth.ts`

helper صغير. يتأكد أن `req.authUser` موجود (يعني المستخدم مر على `authenticate`). إذا مب موجود → يرمي `AUTH_UNAUTHORIZED`.

يختصر كتابة نفس الشرط في كل Controller.

### 4.11) `src/core/http/middleware/authenticate.ts`

- يقرأ header `Authorization: Bearer <token>`.
- يفك الـ JWT باستخدام `JWT_ACCESS_SECRET`.
- لو صح → يضع `authUser` في الـ Request ويكمّل.
- لو ناقص → `AUTH_UNAUTHORIZED`.
- لو خاطئ / منتهي → `AUTH_INVALID_TOKEN`.

### 4.12) `src/core/http/middleware/authorize.ts`

يشتغل **بعد** `authenticate`. يستقبل أدوار مسموحة ويتأكد أن المستخدم عنده واحد منها:

```typescript
authorize(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN)
```

لو الدور مش في القائمة → `AUTH_FORBIDDEN` (403).

### 4.13) `src/core/http/middleware/error-handler.ts`

آخر middleware - يصطاد **كل** الأخطاء ويحولها لرد موحد:

| نوع الخطأ | الإجراء |
|----------|--------|
| `ZodError` | يرجع 422 مع `VALIDATION_ERROR` + تفاصيل الحقول |
| `AppError` | يرجع الـ status والـ code الخاص فيه |
| `ER_DUP_ENTRY` من MySQL | يرجع 409 مع رسالة عربية واضحة (إيميل/جوال مكرر) |
| أي خطأ غير معروف | يلوقه و يرجع 500 + `INTERNAL_ERROR` |

### 4.14) `src/core/http/middleware/not-found-handler.ts`

إذا ما في route يطابق الطلب → يرجع 404 + `ROUTE_NOT_FOUND`.

### 4.15) `src/core/types/auth.ts`

- `AuthUser` = شكل المستخدم المسجل في الـ Request.
- `AccessTokenPayload` = الحمولة اللي نخزنها داخل JWT.

### 4.16) `src/core/types/express.d.ts`

هذا ملف **type declaration** (تعريف أنواع). يوسّع نوع `Request` تبع Express بحيث يصير فيه حقل `authUser`. بدونه TypeScript يطلع غلط لما تكتب `req.authUser`.

### 4.17) `src/database/`

- **`schema.sql`** = مرجع SQL للجداول (مفيد للقراءة بس).
- **`erd.md`** = مخطط العلاقات بين الجداول.
- **`migrations/`** = ملفات Knex migrations. كل ملف يحكي "وش تغير في هيكل القاعدة" في وقت معين.
- **`seeds/`** = بيانات تجريبية (أدوار، مستخدمين تجريبيين، فود ترك تجريبي).
- **`dev_seed.sql`** = بديل SQL لنفس البيانات.

**ليش migrations مهمة؟** عشان أي مطور يسحب الكود يسوي `npm run db:migrate` ويحصل على نفس هيكل القاعدة بالظبط.

### 4.18) `src/modules/shared/`

ثوابت مشتركة بين أكثر من موديول:

- **`roles.ts`**: `ROLE_CODES = { ADMIN, TRUCK_OWNER, CUSTOMER }`.
- **`order-status.ts`**: حالات الطلب (`pending`, `preparing`, `ready`, `picked_up`, `cancelled`).
- **`truck-status.ts`**: حالات الفود ترك (الموافقة + التشغيل).

ليش مب في `core/`؟ لأن هذي ثوابت **دومينية** (تخص منطق الأعمال)، مب بنية تحتية.

### 4.19) هيكل الموديول - على مثال `auth/`

أي موديول عندنا 5 ملفات (بالترتيب من فوق لتحت):

```
modules/auth/
├── auth.routes.ts       ← ربط URL بـ controller (+ middlewares)
├── auth.controller.ts   ← يستقبل الـ request، ينادي service، يرجع response
├── auth.service.ts      ← المنطق الفعلي (Business Logic)
├── auth.repository.ts   ← استعلامات قاعدة البيانات فقط
└── auth.validator.ts    ← Zod schemas للتحقق من الإدخال
```

**التسلسل الذهبي (Golden Flow):**

```
routes → controller → service → repository → database
              ↑
         validator
```

#### مثال كامل: ما يحدث عند `POST /api/v1/auth/login`

1. **`auth.routes.ts`** يستقبل `POST /login` ويوجهه لـ `authController.login`.
2. **`auth.controller.ts`** يسوي:
   - `loginSchema.parse(req.body)` → يتحقق أن البيانات صح (إلا يرمي `ZodError`).
   - `authService.login(payload)` → ينادي المنطق.
   - `res.json(ok("Login successful", result))` → يرجع الرد.
3. **`auth.service.ts`** يسوي:
   - يجيب المستخدم من `authRepository.findUserByEmail(email)`.
   - لو مب موجود → `throw new AppError("AUTH_INVALID_CREDENTIALS")`.
   - يقارن كلمة المرور مع الهاش بـ `bcrypt.compare`.
   - لو خطأ → نفس الخطأ (ما نفرق بين "إيميل غلط" و "باسورد غلط" عشان الأمان).
   - لو صح → يوقع JWT ويرجعه.
4. **`auth.repository.ts`** يستخدم Knex يسأل MySQL.
5. **`auth.validator.ts`** فقط يحتوي schemas الـ Zod.

#### `auth.controller.ts` - استخدام `requireAuth`

في الـ endpoints اللي تحتاج مستخدم مسجل، نستخدم helper `requireAuth`:

```27:31:backend/src/modules/auth/auth.controller.ts
const getMe = async (req: Request, res: Response) => {
  const authUser = requireAuth(req);
  const result = await authService.getMe(authUser.userId);
  res.status(StatusCodes.OK).json(ok("Profile loaded", result));
};
```

### 4.20) الموديولز الباقية - نفس الهيكل

- **`trucks/`** - إنشاء فود ترك، الموافقة من الأدمن، قوائم، Discovery.
- **`menus/`** - قوائم الطعام والأصناف (مقيّد على TRUCK_OWNER و ADMIN).
- **`orders/`** - الطلبات (من العميل) + إدارتها (من المالك).
- **`uploads/`** - ملف واحد خاص (بسبب multer):
  - `uploads.controller.ts` فيه إعداد multer + الدالة.
  - `uploads.routes.ts` يربطه مع authenticate + authorize.
- **`health/`** - endpoint بسيط للتأكد أن السيرفر شغال.

### 4.21) ليش `menus` و `orders` استخدمت `router.use(authenticate)` مباشرة؟

لأن **كل** endpoints في هذين الموديولين تحتاج مستخدم مسجل. بدل ما نكرر `authenticate` في كل سطر، نطبقه على الـ router كاملًا.

```11:12:backend/src/modules/menus/menus.routes.ts
menusRouter.use(authenticate);
menusRouter.use(authorize(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN));
```

---

## 5) كيف يمشي الـ Request من أوله لآخره؟

مثال: عميل يسوي طلب (`POST /api/v1/orders`).

```
التطبيق (Frontend)
   │
   │ POST /api/v1/orders
   │ Authorization: Bearer eyJhbGciOi...
   │ Body: { truckId: 5, items: [...] }
   ▼
┌──────────────────────────────────────┐
│ 1. Express app.ts (global middlewares)│
│    - pinoHttp (log)                   │
│    - helmet (security)                │
│    - cors                             │
│    - rateLimit                        │
│    - express.json()                   │
└──────────────┬───────────────────────┘
               ▼
┌──────────────────────────────────────┐
│ 2. routes.ts                          │
│    /api/v1 → apiRouter                │
│    /orders → ordersRouter             │
└──────────────┬───────────────────────┘
               ▼
┌──────────────────────────────────────┐
│ 3. orders.routes.ts                   │
│    - authenticate (يفك JWT)           │
│    - authorize(CUSTOMER) (يتحقق دور)  │
│    - asyncHandler(controller.create)  │
└──────────────┬───────────────────────┘
               ▼
┌──────────────────────────────────────┐
│ 4. orders.controller.ts → create()   │
│    - requireAuth(req)                 │
│    - createOrderSchema.parse(body)    │
│    - ordersService.createOrder(...)   │
│    - res.json(ok(msg, data))          │
└──────────────┬───────────────────────┘
               ▼
┌──────────────────────────────────────┐
│ 5. orders.service.ts                  │
│    منطق الشغل:                        │
│    - هل الفود ترك موجود ومفتوح؟      │
│    - هل الأصناف متاحة؟               │
│    - احسب المجموع                     │
│    - أنشئ الطلب                       │
│    - أرجع البيانات                    │
└──────────────┬───────────────────────┘
               ▼
┌──────────────────────────────────────┐
│ 6. orders.repository.ts               │
│    db.insert / db.select / ...        │
└──────────────┬───────────────────────┘
               ▼
           MySQL Database
               │
   (والرد يرجع بنفس الترتيب معكوس)
```

### إذا حصل خطأ في أي مكان:

- `ZodError` من validator → يذهب لـ `errorHandler` → `422 VALIDATION_ERROR`.
- `AppError` من service → يذهب لـ `errorHandler` → status الخاص فيه.
- خطأ عشوائي → يذهب لـ `errorHandler` → `500 INTERNAL_ERROR`.

---

## 6) كيف أضيف ميزة (Feature) جديدة؟

خلينا نأخذ مثال واقعي: **"إضافة ميزة Favorites - العميل يحط فود ترك في المفضلة."**

### الخطوة 0: فكّر

- هل هذي ميزة جديدة (دومين جديد) أو إضافة لموديول موجود؟
- **إجابة:** دومين جديد → ننشئ موديول اسمه `favorites`.

### الخطوة 1: القاعدة (Database)

إنشئ migration جديد:

```bash
cd backend
npx knex --knexfile knexfile.ts migrate:make add_favorites_table -x ts
```

راح ينشئ لك ملف مثل `src/database/migrations/20260423_000001_add_favorites_table.ts`. عبّيه:

```typescript
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("favorites", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("truck_id").unsigned().notNullable().references("id").inTable("food_trucks").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["user_id", "truck_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("favorites");
}
```

شغّل:
```bash
npm run db:migrate
```

### الخطوة 2: أكواد الأخطاء

افتح `src/core/errors/error-codes.ts`، أضف أي أكواد تحتاجها:

```typescript
// في ERROR_CODES:
FAVORITE_ALREADY_EXISTS: "FAVORITE_ALREADY_EXISTS",
FAVORITE_NOT_FOUND: "FAVORITE_NOT_FOUND",

// في ERROR_CATALOG:
FAVORITE_ALREADY_EXISTS: { status: StatusCodes.CONFLICT, message: "Truck is already in your favorites" },
FAVORITE_NOT_FOUND: { status: StatusCodes.NOT_FOUND, message: "Favorite not found" },
```

### الخطوة 3: أنشئ مجلد الموديول

```
src/modules/favorites/
├── favorites.validator.ts
├── favorites.repository.ts
├── favorites.service.ts
├── favorites.controller.ts
└── favorites.routes.ts
```

### الخطوة 4: اكتب الـ Validator

`favorites.validator.ts`:
```typescript
import { z } from "zod";

export const createFavoriteSchema = z.object({
  truckId: z.coerce.number().int().positive()
});

export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
```

### الخطوة 5: اكتب الـ Repository

`favorites.repository.ts`:
```typescript
import { db } from "../../core/db/connection";

const findByUserAndTruck = async (userId: number, truckId: number) => {
  return db("favorites").where({ user_id: userId, truck_id: truckId }).first();
};

const create = async (userId: number, truckId: number): Promise<number> => {
  const [id] = await db("favorites").insert({ user_id: userId, truck_id: truckId });
  return Number(id);
};

const listByUser = async (userId: number) => {
  return db("favorites as f")
    .join("food_trucks as t", "t.id", "f.truck_id")
    .select("t.id", "t.name", "t.slug", "f.created_at")
    .where("f.user_id", userId)
    .orderBy("f.created_at", "desc");
};

const remove = async (userId: number, truckId: number): Promise<number> => {
  return db("favorites").where({ user_id: userId, truck_id: truckId }).delete();
};

export const favoritesRepository = { findByUserAndTruck, create, listByUser, remove };
```

### الخطوة 6: اكتب الـ Service

`favorites.service.ts`:
```typescript
import { AppError } from "../../core/errors";
import { favoritesRepository } from "./favorites.repository";
import type { CreateFavoriteInput } from "./favorites.validator";

const add = async (userId: number, payload: CreateFavoriteInput) => {
  const existing = await favoritesRepository.findByUserAndTruck(userId, payload.truckId);
  if (existing) {
    throw new AppError("FAVORITE_ALREADY_EXISTS");
  }
  const id = await favoritesRepository.create(userId, payload.truckId);
  return { id };
};

const list = async (userId: number) => {
  return favoritesRepository.listByUser(userId);
};

const remove = async (userId: number, truckId: number) => {
  const affected = await favoritesRepository.remove(userId, truckId);
  if (affected === 0) {
    throw new AppError("FAVORITE_NOT_FOUND");
  }
};

export const favoritesService = { add, list, remove };
```

### الخطوة 7: اكتب الـ Controller

`favorites.controller.ts`:
```typescript
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ok } from "../../core/http/api-response";
import { requireAuth } from "../../core/http/require-auth";
import { favoritesService } from "./favorites.service";
import { createFavoriteSchema } from "./favorites.validator";

const add = async (req: Request, res: Response) => {
  const authUser = requireAuth(req);
  const payload = createFavoriteSchema.parse(req.body);
  const result = await favoritesService.add(authUser.userId, payload);
  res.status(StatusCodes.CREATED).json(ok("Favorite added", result));
};

const list = async (req: Request, res: Response) => {
  const authUser = requireAuth(req);
  const result = await favoritesService.list(authUser.userId);
  res.status(StatusCodes.OK).json(ok("Favorites fetched", result));
};

const remove = async (req: Request, res: Response) => {
  const authUser = requireAuth(req);
  const truckId = Number(req.params.truckId);
  await favoritesService.remove(authUser.userId, truckId);
  res.status(StatusCodes.OK).json(ok("Favorite removed", null));
};

export const favoritesController = { add, list, remove };
```

### الخطوة 8: اكتب الـ Routes

`favorites.routes.ts`:
```typescript
import { Router } from "express";

import { asyncHandler } from "../../core/http/async-handler";
import { authenticate } from "../../core/http/middleware/authenticate";
import { authorize } from "../../core/http/middleware/authorize";
import { ROLE_CODES } from "../shared/roles";
import { favoritesController } from "./favorites.controller";

const favoritesRouter = Router();

favoritesRouter.use(authenticate);
favoritesRouter.use(authorize(ROLE_CODES.CUSTOMER));

favoritesRouter.post("/", asyncHandler(favoritesController.add));
favoritesRouter.get("/", asyncHandler(favoritesController.list));
favoritesRouter.delete("/:truckId", asyncHandler(favoritesController.remove));

export { favoritesRouter };
```

### الخطوة 9: اربط الموديول في `routes.ts`

```typescript
import { favoritesRouter } from "./modules/favorites/favorites.routes";

// ...
apiRouter.use("/favorites", favoritesRouter);
```

### الخطوة 10: جرب!

```bash
npm run dev
```

جرب في Postman / Insomnia:
- `POST /api/v1/favorites` مع body `{ "truckId": 1 }` و Authorization header.
- `GET /api/v1/favorites`.
- `DELETE /api/v1/favorites/1`.

### ملخص خطوات إضافة ميزة

| # | الخطوة | الملف |
|---|--------|-------|
| 1 | migration للجدول | `src/database/migrations/...` |
| 2 | أضف أكواد الأخطاء | `src/core/errors/error-codes.ts` |
| 3 | أنشئ مجلد الموديول | `src/modules/<name>/` |
| 4 | Validator (Zod schemas) | `<name>.validator.ts` |
| 5 | Repository (DB queries) | `<name>.repository.ts` |
| 6 | Service (منطق الأعمال) | `<name>.service.ts` |
| 7 | Controller (استقبال/إرسال) | `<name>.controller.ts` |
| 8 | Routes (URL + middlewares) | `<name>.routes.ts` |
| 9 | سجّل الموديول | `src/routes.ts` |
| 10 | شغّل migrations + جرب | `npm run db:migrate` + `npm run dev` |

---

## 7) القواعد الذهبية (Dos and Don'ts)

### ✅ افعل
- كل الاستعلامات على DB تكون في **Repository** فقط.
- كل منطق الأعمال (قرارات، شروط، حسابات) في **Service**.
- Controller يبقى نحيف: يستقبل، ينادي service، يرجع response.
- استخدم `AppError` مع **code موجود في الكتالوج** دائماً.
- استخدم `requireAuth(req)` بدل ما تتحقق من `req.authUser` يدوياً.
- استخدم `asyncHandler` حول أي دالة async في route.

### ❌ لا تفعل
- لا تستعلم من DB داخل Controller مباشرة.
- لا تكتب `throw new Error("...")` - استخدم `AppError`.
- لا تستخدم أكواد خطأ غير موجودة في `error-codes.ts` - أضفها أولاً.
- لا تخلط بين `core/` و `modules/` - core لا يعرف modules، modules تعرف core.
- لا تضع كلمة مرور في `.env` وترفعها على Git.

---

## 8) أوامر مهمة

```bash
# تشغيل في وضع التطوير (مع hot reload)
npm run dev

# build للإنتاج
npm run build

# تشغيل النسخة المبنية
npm start

# فحص الأنواع (Type check)
npx tsc --noEmit

# Lint
npm run lint

# قاعدة البيانات
npm run db:migrate      # طبّق كل الـ migrations
npm run db:rollback     # تراجع عن آخر migration
npm run db:seed         # زرع بيانات تجريبية

# MySQL عبر Docker
docker compose up -d    # ابدأ MySQL
docker compose down     # أوقف
```

---

## 9) بيانات حسابات التجربة (بعد `npm run db:seed`)

| البريد | الدور | كلمة المرور |
|--------|------|-------------|
| `admin@foodtruck.local` | admin | `Password123!` |
| `owner@foodtruck.local` | truck_owner | `Password123!` |
| `customer@foodtruck.local` | customer | `Password123!` |

---

## 10) ملخص معماري (لو نسيت كل شي فوق)

- **`core/`** = بنية تحتية (DB، logger، errors، middleware). ما تعرف عن الموديولز.
- **`modules/`** = الفيتشرز. كل موديول مستقل. يعرف `core/` و `modules/shared/`.
- **`modules/shared/`** = ثوابت مشتركة (ROLES، STATUSES).
- **كل موديول** = 5 ملفات: routes / controller / service / repository / validator.
- **التسلسل الذهبي:** routes → controller → service → repository → db.
- **الأخطاء:** رمي `AppError` مع code → يتحول إلى رد موحد تلقائياً.
- **الاستجابات:** كل رد لها شكل `{ success, message, data }` أو `{ success, message, error: { code } }`.

أي مكان تحتار فيه، ارجع لمثال `auth/` - هو أنظف موديول وأسهل للتقليد.
