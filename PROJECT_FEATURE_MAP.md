# PROJECT_FEATURE_MAP — EcoSpark Hub

> Maps every assignment requirement to the architecture defined in `PROJECT_BLUEPRINT.md` and `AI_RULES.md`.
> This document is the single source of truth before any code is written.
> It feeds directly into Phase 0 of `STEP_BY_STEP_BUILD_PLAN.md`.

---

## 1. PROJECT_CONFIG

```yaml
PROJECT_CONFIG:
  projectName: "eco-spark"
  description: "Sustainability idea-sharing portal with voting, nested comments, paid ideas, and admin moderation"

  roles: [ADMIN, MEMBER]

  modules:
    - { name: "auth",                   hasListEndpoint: false, hasMutations: true,  hasFileUpload: false }
    - { name: "user",                   hasListEndpoint: true,  hasMutations: true,  hasFileUpload: true  }
    - { name: "category",               hasListEndpoint: true,  hasMutations: true,  hasFileUpload: false }
    - { name: "idea",                   hasListEndpoint: true,  hasMutations: true,  hasFileUpload: true  }
    - { name: "vote",                   hasListEndpoint: false, hasMutations: true,  hasFileUpload: false }
    - { name: "comment",                hasListEndpoint: true,  hasMutations: true,  hasFileUpload: false }
    - { name: "payment",                hasListEndpoint: true,  hasMutations: true,  hasFileUpload: false }
    - { name: "ideaAccess",             hasListEndpoint: true,  hasMutations: false, hasFileUpload: false }
    - { name: "newsletterSubscription", hasListEndpoint: true,  hasMutations: true,  hasFileUpload: false }
    - { name: "dashboard",              hasListEndpoint: false, hasMutations: false, hasFileUpload: false }

  roleRoutes:
    ADMIN:
      basePath: "admin/dashboard"
      features:
        - ideas-management        # view/approve/reject all ideas
        - users-management        # view/activate/deactivate members
        - categories-management   # create/edit/delete categories
        - comments-management     # delete inappropriate comments

    MEMBER:
      basePath: "member/dashboard"
      features:
        - my-ideas                # list member's own ideas
        - create-idea             # create / draft a new idea
        - my-payments             # paid idea purchase history

  auth:
    library: "better-auth"
    oauth: []
    emailVerification: false
    passwordReset: false

  thirdParty:
    payments: "stripe"       # NOTE: assignment also lists SSLCommerz / ShurjoPay;
                             # PROJECT_BLUEPRINT only supports "stripe" — use Stripe.
    fileStorage: "cloudinary"
    email: null
    scheduling: null
```

---

## 2. Entities (Database Models)

One `<model>.prisma` file per model, plus `enums.prisma`, following `AI_RULES.md §10`.

### 2.1 Enums (`enums.prisma`)

| Enum | Values |
|------|--------|
| `Role` | `ADMIN`, `MEMBER` |
| `IdeaStatus` | `DRAFT`, `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED` |
| `VoteType` | `UPVOTE`, `DOWNVOTE` |
| `PaymentStatus` | `PENDING`, `SUCCESS`, `FAILED` |
| `UserStatus` | `ACTIVE`, `INACTIVE` |

### 2.2 User (`auth.prisma`)

Managed by `better-auth`. Extended with custom fields.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `name` | `String` | |
| `email` | `String` @unique | |
| `emailVerified` | `Boolean` | better-auth field |
| `image` | `String?` | profile picture URL (Cloudinary) |
| `role` | `Role` @default(MEMBER) | drives all access checks |
| `status` | `UserStatus` @default(ACTIVE) | admin can deactivate |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Relations: `ideas[]`, `votes[]`, `comments[]`, `payments[]`, `ideaAccesses[]`

### 2.3 Category (`category.prisma`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `name` | `String` @unique | e.g. "Energy", "Waste", "Transportation" |
| `slug` | `String` @unique | url-safe version of name |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Relations: `ideas[]`

### 2.4 Idea (`idea.prisma`)

Core entity of the platform.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `title` | `String` | |
| `problemStatement` | `String` | |
| `proposedSolution` | `String` | |
| `description` | `String` | rich text / markdown |
| `status` | `IdeaStatus` @default(DRAFT) | see state machine §7.1 |
| `isPaid` | `Boolean` @default(false) | gates content behind payment |
| `price` | `Decimal?` | only set when `isPaid = true` |
| `rejectionFeedback` | `String?` | visible only to submitter |
| `authorId` | `String` | FK → User |
| `categoryId` | `String` | FK → Category |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Relations: `author`, `category`, `images[]`, `votes[]`, `comments[]`, `payments[]`, `ideaAccesses[]`

### 2.5 IdeaImage (`ideaImage.prisma`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `url` | `String` | Cloudinary URL |
| `ideaId` | `String` | FK → Idea |
| `createdAt` | `DateTime` | |

Relations: `idea`

### 2.6 Vote (`vote.prisma`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `type` | `VoteType` | UPVOTE or DOWNVOTE |
| `userId` | `String` | FK → User |
| `ideaId` | `String` | FK → Idea |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Constraints: `@@unique([userId, ideaId])` — one vote per member per idea.

### 2.7 Comment (`comment.prisma`)

Supports nested (Reddit-style) threading via self-relation.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `content` | `String` | |
| `authorId` | `String` | FK → User |
| `ideaId` | `String` | FK → Idea |
| `parentId` | `String?` | FK → Comment (self-relation for nesting) |
| `isDeleted` | `Boolean` @default(false) | soft-delete; keep thread structure intact |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Relations: `author`, `idea`, `parent`, `replies[]`

### 2.8 Payment (`payment.prisma`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `userId` | `String` | FK → User (buyer) |
| `ideaId` | `String` | FK → Idea (paid idea being purchased) |
| `amount` | `Decimal` | price at time of purchase |
| `status` | `PaymentStatus` @default(PENDING) | updated by webhook |
| `transactionId` | `String?` @unique | Stripe payment intent / session id |
| `provider` | `String` @default("stripe") | future-proofs multi-provider |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Relations: `user`, `idea`, `ideaAccess?`

### 2.9 IdeaAccess (`ideaAccess.prisma`)

Join table that records which members have unlocked which paid ideas.
Created only after `Payment.status = SUCCESS`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `userId` | `String` | FK → User |
| `ideaId` | `String` | FK → Idea |
| `paymentId` | `String` @unique | FK → Payment |
| `createdAt` | `DateTime` | |

Constraints: `@@unique([userId, ideaId])` — one access record per user per idea.

### 2.10 NewsletterSubscription (`newsletterSubscription.prisma`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` @id | cuid |
| `email` | `String` @unique | |
| `createdAt` | `DateTime` | |

---

## 3. Roles & Permissions Matrix

| Action | Unauthenticated | MEMBER | ADMIN |
|--------|-----------------|--------|-------|
| View approved free ideas | Yes | Yes | Yes |
| View approved paid idea (full content) | No — redirect to login | Only if purchased | Yes |
| Search / filter ideas | Yes | Yes | Yes |
| Create idea | No | Yes | No |
| Edit own unpublished idea | No | Yes (DRAFT/REJECTED only) | No |
| Delete own unpublished idea | No | Yes (DRAFT/REJECTED only) | No |
| Submit idea for review | No | Yes | No |
| Upvote / downvote | No | Yes | No |
| Remove own vote | No | Yes | No |
| Add comment / reply | No | Yes | No |
| Delete own comment | No | Yes | No |
| Delete any comment | No | No | Yes |
| Purchase paid idea | No — redirect to login | Yes | No |
| View own payment history | No | Yes | No |
| Approve / reject idea | No | No | Yes |
| View all ideas (all statuses) | No | No | Yes |
| Manage users (activate/deactivate) | No | No | Yes |
| Manage categories | No | No | Yes |
| Subscribe to newsletter | Yes | Yes | Yes |
| View admin dashboard stats | No | No | Yes |
| View member dashboard stats | No | Yes | No |

---

## 4. Backend Modules

Maps directly to `PROJECT_CONFIG.modules`. Each module lives at `src/app/module/<moduleName>/`.

| Module | hasListEndpoint | hasMutations | hasFileUpload | Generated files |
|--------|----------------|--------------|---------------|-----------------|
| `auth` | false | true | false | `.route`, `.controller`, `.service`, `.validation` |
| `user` | true | true | true | `.route`, `.controller`, `.service`, `.validation`, `.constant`, `.middlewares` |
| `category` | true | true | false | `.route`, `.controller`, `.service`, `.validation`, `.constant` |
| `idea` | true | true | true | `.route`, `.controller`, `.service`, `.validation`, `.constant`, `.middlewares`, `.utils` |
| `vote` | false | true | false | `.route`, `.controller`, `.service`, `.validation` |
| `comment` | true | true | false | `.route`, `.controller`, `.service`, `.validation`, `.constant` |
| `payment` | true | true | false | `.route`, `.controller`, `.service`, `.validation`, `.constant`, `.utils` |
| `ideaAccess` | true | false | false | `.route`, `.controller`, `.service`, `.constant` |
| `newsletterSubscription` | true | true | false | `.route`, `.controller`, `.service`, `.validation`, `.constant` |
| `dashboard` | false | false | false | `.route`, `.controller`, `.service` |

### Module responsibilities

- **auth** — register (creates `MEMBER`), login, refresh-token, logout. Seed creates one `ADMIN` account.
- **user** — admin: list/activate/deactivate members; member: view/update own profile, upload avatar.
- **category** — admin CRUD; public read-only list.
- **idea** — full lifecycle: CRUD + status transitions + paid flag. `idea.utils.ts` handles access-check logic (is content unlocked for requesting user?).
- **vote** — upsert (cast or switch) + delete (remove) per `[userId, ideaId]` unique pair.
- **comment** — create top-level or reply (parentId), soft-delete by owner or admin.
- **payment** — initiate Stripe session, receive webhook, create `IdeaAccess` on success.
- **ideaAccess** — read-only; checked by `idea` module to gate paid content.
- **newsletterSubscription** — public subscribe; admin can list subscribers.
- **dashboard** — aggregated stats endpoints per role (idea counts by status, top ideas, member count).

---

## 5. Frontend Pages & Routes

Route groups follow `AI_RULES.md §2.3`.

### 5.1 Public Routes — `(commonLayout)`

| Route | Component | Auth required | Notes |
|-------|-----------|--------------|-------|
| `/` | `HomePage` | No | Hero, search, featured ideas, testimonials/top-voted, newsletter |
| `/ideas` | `AllIdeasPage` | No | Paginated grid, sort, filter, search |
| `/ideas/[id]` | `IdeaDetailsPage` | No (gated for paid) | Full idea, voting, comments, paid gate |
| `/about` | `AboutPage` | No | |
| `/blog` | `BlogPage` | No | Static/informational |

### 5.2 Auth Routes — `(commonLayout)/(authRouteGroup)`

| Route | Notes |
|-------|-------|
| `/login` | Email + password; redirects to role dashboard on success |
| `/register` | Creates MEMBER account |
| `/forgot-password` | Optional — skipped if `auth.passwordReset: false` |
| `/reset-password` | Optional |

### 5.3 Protected Shared Routes — `(dashboardLayout)/(commonProtectedLayout)`

| Route | Notes |
|-------|-------|
| `/my-profile` | View and update own profile; upload avatar |
| `/change-password` | Update password |

### 5.4 Admin Dashboard — `(dashboardLayout)/admin/dashboard/`

| Route | Feature | Notes |
|-------|---------|-------|
| `/admin/dashboard` | Overview | Stats cards, charts (ideas by status, members count) |
| `/admin/dashboard/ideas-management` | Ideas list | All statuses; approve / reject with feedback modal |
| `/admin/dashboard/users-management` | Members list | Activate / deactivate; role visible |
| `/admin/dashboard/categories-management` | Categories list | Create / edit / delete |
| `/admin/dashboard/comments-management` | Comments list | Delete inappropriate comments |

### 5.5 Member Dashboard — `(dashboardLayout)/member/dashboard/`

| Route | Feature | Notes |
|-------|---------|-------|
| `/member/dashboard` | Overview | Stats: total ideas, pending, approved, rejected |
| `/member/dashboard/my-ideas` | Own ideas list | Status badges; edit/delete if unpublished; submit for review |
| `/member/dashboard/create-idea` | Create form | Title, fields, images, category, paid toggle + price |
| `/member/dashboard/my-payments` | Payment history | List of purchased paid ideas |

---

## 6. API Endpoint Groups

All endpoints use `/api/v1/` prefix and kebab-case plural nouns per `AI_RULES.md §3.3`.

### 6.1 Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Create MEMBER account |
| POST | `/api/v1/auth/login` | Public | Returns 3 httpOnly cookies |
| POST | `/api/v1/auth/refresh-token` | Public (cookie) | Rotate access token |
| POST | `/api/v1/auth/logout` | MEMBER \| ADMIN | Clear all session cookies |

### 6.2 Users — `/api/v1/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/users` | ADMIN | List all members (paginated, filterable) |
| GET | `/api/v1/users/:id` | ADMIN | Single user detail |
| PATCH | `/api/v1/users/:id` | ADMIN | Update role / status |
| GET | `/api/v1/users/my-profile` | MEMBER \| ADMIN | Own profile |
| PATCH | `/api/v1/users/my-profile` | MEMBER \| ADMIN | Update own profile / avatar |

### 6.3 Categories — `/api/v1/categories`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/categories` | Public | List all categories |
| POST | `/api/v1/categories` | ADMIN | Create category |
| PATCH | `/api/v1/categories/:id` | ADMIN | Update category |
| DELETE | `/api/v1/categories/:id` | ADMIN | Delete category |

### 6.4 Ideas — `/api/v1/ideas`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/ideas` | Public | List approved ideas (paid content gated; supports search, filter, sort, pagination) |
| GET | `/api/v1/ideas/:id` | Public / MEMBER | Full idea; paid content requires `IdeaAccess` or ownership |
| POST | `/api/v1/ideas` | MEMBER | Create idea (starts as DRAFT) |
| PATCH | `/api/v1/ideas/:id` | MEMBER | Edit own idea (only if DRAFT or REJECTED) |
| DELETE | `/api/v1/ideas/:id` | MEMBER | Delete own idea (only if DRAFT or REJECTED) |
| GET | `/api/v1/ideas/my-ideas` | MEMBER | All ideas by current member (all statuses) |
| PATCH | `/api/v1/ideas/:id/submit` | MEMBER | DRAFT → PENDING (triggers UNDER_REVIEW on admin view) |
| PATCH | `/api/v1/ideas/:id/approve` | ADMIN | UNDER_REVIEW → APPROVED |
| PATCH | `/api/v1/ideas/:id/reject` | ADMIN | UNDER_REVIEW → REJECTED (requires feedback body) |
| GET | `/api/v1/ideas/admin-all` | ADMIN | All ideas, all statuses (management view) |

### 6.5 Votes — `/api/v1/votes`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/votes` | MEMBER | Cast or switch vote (`{ ideaId, type: "UPVOTE"\|"DOWNVOTE" }`); upserts on unique `[userId, ideaId]` |
| DELETE | `/api/v1/votes/:ideaId` | MEMBER | Remove own vote for given idea |
| GET | `/api/v1/votes/:ideaId` | Public | Vote counts (`{ upvotes, downvotes, userVote? }`) |

### 6.6 Comments — `/api/v1/comments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/comments?ideaId=` | Public | Nested comment tree for an idea |
| POST | `/api/v1/comments` | MEMBER | Create comment or reply (`parentId` optional) |
| PATCH | `/api/v1/comments/:id` | MEMBER | Edit own comment |
| DELETE | `/api/v1/comments/:id` | MEMBER \| ADMIN | Soft-delete (own or admin deletes any) |

### 6.7 Payments — `/api/v1/payments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/payments/initiate` | MEMBER | Create Stripe Checkout session for a paid idea; returns session URL |
| POST | `/api/v1/payments/webhook` | Public (Stripe sig) | Receives Stripe event; creates `IdeaAccess` on `checkout.session.completed` |
| GET | `/api/v1/payments/my-payments` | MEMBER | Own payment history |
| GET | `/api/v1/payments/verify/:transactionId` | MEMBER | Check payment status (used on return URL) |

### 6.8 Idea Accesses — `/api/v1/idea-accesses`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/idea-accesses/my-accesses` | MEMBER | List all paid ideas the member has unlocked |
| GET | `/api/v1/idea-accesses/:ideaId/check` | MEMBER | Boolean check — does current member own access to this idea? |

### 6.9 Newsletter Subscriptions — `/api/v1/newsletter-subscriptions`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/newsletter-subscriptions` | Public | Subscribe email |
| GET | `/api/v1/newsletter-subscriptions` | ADMIN | List all subscribers |
| DELETE | `/api/v1/newsletter-subscriptions/:id` | ADMIN | Remove subscriber |

### 6.10 Dashboard Stats — `/api/v1/dashboard`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/dashboard/admin-stats` | ADMIN | Total members, ideas by status, top ideas, recent activity |
| GET | `/api/v1/dashboard/member-stats` | MEMBER | Own ideas by status, total votes received, total comments received |

---

## 7. Special Systems

### 7.1 Idea Status State Machine

```
[DRAFT] ──── submit ──────────────────────────────► [PENDING]
                                                          │
                                                    admin views
                                                          │
                                                          ▼
                                                   [UNDER_REVIEW]
                                                    /           \
                                              approve           reject
                                                /                  \
                                               ▼                    ▼
                                          [APPROVED]           [REJECTED]
                                   (publicly visible)    (returned to member
                                                          with feedback text)
```

**Rules:**
- Member can edit/delete only in `DRAFT` or `REJECTED` state.
- `PENDING` is a transient state; when an admin opens the idea for review, it is automatically moved to `UNDER_REVIEW` (via a PATCH on first admin view, or immediately on submit — implementation choice, documented before build).
- `APPROVED` ideas are immutable; admin cannot un-approve without deleting.
- `REJECTED` ideas can be re-edited and re-submitted (cycle back to `PENDING`).
- Only `APPROVED` ideas appear on public `/ideas` listing.

### 7.2 Paid Idea Access Gate

```
User lands on /ideas/[id] (isPaid = true)
         │
         ├─── Not authenticated ──────────────────► redirect /login?callbackUrl=/ideas/[id]
         │
         ├─── Authenticated, has IdeaAccess ──────► render full content
         │
         ├─── Authenticated, is idea Author ──────► render full content (no payment needed)
         │
         ├─── Authenticated, is ADMIN ────────────► render full content
         │
         └─── Authenticated, no IdeaAccess ───────► show teaser + "Purchase for $X" button
                                                          │
                                                    POST /payments/initiate
                                                          │
                                                    redirect to Stripe Checkout
                                                          │
                                                    Stripe webhook fires
                                                          │
                                                    Payment.status = SUCCESS
                                                    IdeaAccess record created
                                                          │
                                                    User returns to /ideas/[id]
                                                    → full content unlocked
```

**Key rule:** Free ideas (`isPaid = false`) are always fully visible to everyone — no login required.

### 7.3 Reddit-Style Voting System

- **Data model:** `Vote` table with `@@unique([userId, ideaId])`.
- **Cast/switch:** `POST /api/v1/votes` uses `upsert` — creates if no vote exists, updates `type` if it does.
- **Remove:** `DELETE /api/v1/votes/:ideaId` deletes the unique record.
- **Display:** Each idea card / detail page shows `upvotes`, `downvotes`, and the current user's vote (highlighted arrow).
- **One vote per member per idea** — switching from UPVOTE to DOWNVOTE is allowed; casting the same type again is idempotent.
- **Score calculation** (for sorting "Top Voted"): `upvotes - downvotes` computed at query time via Prisma `_count`.

### 7.4 Nested Comment System

```
Idea
 └── Comment (parentId = null)          ← top-level
       ├── Comment (parentId = c1)      ← reply
       │     └── Comment (parentId = c2) ← reply to reply
       └── Comment (parentId = c1)      ← sibling reply
```

- **Self-relation:** `Comment.parentId → Comment.id` (nullable).
- **API returns flat list:** client or server reconstructs the tree by nesting `replies[]` via recursive include in Prisma query.
- **Depth:** No hard limit enforced in schema; UI may cap visual depth for readability.
- **Soft delete:** `isDeleted = true` — the record stays to keep thread structure; content replaced with "[deleted]" in UI.
- **Admin moderation:** Admin can soft-delete any comment via `DELETE /api/v1/comments/:id`.

### 7.5 Admin Review Flow

```
1. Member creates idea ──────────────────────────────── status: DRAFT
2. Member submits idea ──────────────────────────────── status: PENDING
3. Admin views "Under Review" queue ─────────────────── status: UNDER_REVIEW
                                                              │
                    ┌─────────────────────────────────────────┤
                    │                                         │
             [Approve]                                  [Reject]
                    │                                         │
         status: APPROVED                         status: REJECTED
         Idea visible on                          rejectionFeedback saved
         public /ideas page                       Visible to author only
                                                  Author can edit & resubmit
```

- Rejection feedback is stored on `Idea.rejectionFeedback`.
- It is **never** returned in public API responses — only in `GET /api/v1/ideas/my-ideas` and `GET /api/v1/ideas/:id` when the requester is the author.
- Admin dashboard `ideas-management` page shows ideas grouped or filterable by `IdeaStatus`.
- Approve/Reject actions are inline row actions in the data table (via `DropdownMenu` per `AI_RULES.md §8`).

---

## 8. Frontend Component Map

Key feature components that will live under `src/components/modules/`:

| Folder | Key Components |
|--------|---------------|
| `Auth/` | `LoginForm`, `RegisterForm` |
| `Home/` | `HeroBanner`, `SearchBar`, `FeaturedIdeaCard`, `TestimonialsSection`, `NewsletterForm` |
| `Idea/` | `IdeaCard`, `IdeaGrid`, `IdeaFilters`, `IdeaDetailHeader`, `IdeaDetailContent`, `PaidIdeaGate`, `SubmitIdeaForm`, `EditIdeaForm`, `IdeaStatusBadge` |
| `Vote/` | `VoteButtons` |
| `Comment/` | `CommentThread`, `CommentItem`, `ReplyForm` |
| `Payment/` | `PaymentButton`, `PaymentHistory` |
| `Dashboard/` | `Sidebar`, `Navbar`, `AdminStatsCards`, `MemberStatsCards` |
| `User/` | `UserProfileForm`, `MembersTable` |
| `Category/` | `CategoriesTable`, `CategoryForm` |

---

## 9. Searchable & Filterable Fields

Defines `<module>.constant.ts` values per `AI_RULES.md §4.5`.

| Module | Searchable fields | Filterable fields |
|--------|------------------|------------------|
| `idea` | `title`, `description`, `problemStatement` | `status`, `categoryId`, `isPaid`, `authorId` |
| `user` | `name`, `email` | `role`, `status` |
| `category` | `name`, `slug` | — |
| `comment` | `content` | `ideaId`, `authorId`, `isDeleted` |
| `payment` | — | `userId`, `ideaId`, `status` |
| `ideaAccess` | — | `userId`, `ideaId` |
| `newsletterSubscription` | `email` | — |

---

## 10. Environment Variables Required

### Backend `.env`

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `development` / `production` |
| `PORT` | Express server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `ACCESS_TOKEN_SECRET` | JWT signing |
| `REFRESH_TOKEN_SECRET` | JWT signing |
| `ACCESS_TOKEN_EXPIRES_IN` | e.g. `"15m"` |
| `REFRESH_TOKEN_EXPIRES_IN` | e.g. `"7d"` |
| `BETTER_AUTH_SECRET` | better-auth session secret |
| `BETTER_AUTH_URL` | e.g. `http://localhost:5000` |
| `FRONTEND_URL` | CORS + redirect origin |
| `CLOUDINARY_CLOUD_NAME` | File upload |
| `CLOUDINARY_API_KEY` | File upload |
| `CLOUDINARY_API_SECRET` | File upload |
| `STRIPE_SECRET_KEY` | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |

### Frontend `.env.local`

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL |
| `JWT_ACCESS_SECRET` | Middleware token verification (server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe redirect (client-side) |

---

## 11. Seed Data (`src/app/utils/seed.ts`)

| Record | Details |
|--------|---------|
| Admin user | `email: admin@ecosparkHub.com`, `role: ADMIN`, `status: ACTIVE` |
| Default categories | `Energy`, `Waste`, `Transportation`, `Water`, `Agriculture`, `Technology` |
| Sample member | `email: member@ecosparkHub.com`, `role: MEMBER`, `status: ACTIVE` |
