# FLOW HIERARCHY

Your whole form actually has **4 nested entities** :

<pre class="overflow-visible!" data-start="617" data-end="715"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Visit
  └── Interactions</span><span>[]</span><span>
         └── PrincipalInteractions</span><span>[]</span><span>
                 └── Leads</span><span>[]</span></span></code></div></div></pre>

---

# 🟦 **STEP 1 — Create Visit (POST /visits)**

You want ONLY this:

- Create a new row in DB
- Assign a unique Visit ID (like V01)
- Set userId (current logged-in user)
- Set status: `"draft"`
- Set createdAt timestamp

So your request body is usually EMPTY:

---

## ✅ **Frontend sends:**

<pre class="overflow-visible!" data-start="1161" data-end="1185"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST /api/visits
</span></span></code></div></div></pre>

## ⬇️ Backend creates inside DB:

<pre class="overflow-visible!" data-start="1220" data-end="1380"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>{
  </span><span>id:</span><span></span><span>"V01"</span><span>,
  </span><span>userId:</span><span></span><span>17</span><span>,
  </span><span>status:</span><span></span><span>"draft"</span><span>,
  </span><span>dateRange:</span><span></span><span>null</span><span>,
  </span><span>customerName:</span><span></span><span>null</span><span>,
  </span><span>location:</span><span></span><span>null</span><span>,
  </span><span>interactionType:</span><span></span><span>null</span><span>,
  </span><span>sharedWith:</span><span></span><span>null</span><span>
}
</span></span></code></div></div></pre>

## ⬆️ Backend returns:

<pre class="overflow-visible!" data-start="1405" data-end="1435"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>{</span><span>
  </span><span>"visitId"</span><span>:</span><span></span><span>"V01"</span><span>
</span><span>}</span><span>
</span></span></code></div></div></pre>

## 📌 React now stores:

<pre class="overflow-visible!" data-start="1461" data-end="1517"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>const</span><span> [visitId, setVisitId] = </span><span>useState</span><span>(</span><span>"V01"</span><span>);
</span></span></code></div></div></pre>

---

# 🔥 IMPORTANT

### You CANNOT save anything until Visit ID exists.

So yes — your POST /visits contains **no body** (or very minimal body).

---

# 🟦 **STEP 2 — User starts filling metadata**

Now you have visitId → you can PATCH.

Example when user selects customer:

<pre class="overflow-visible!" data-start="1795" data-end="1859"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>PATCH /api/visits/V01
{
  </span><span>"customerName"</span><span>: </span><span>"Tata Steel"</span><span>
}
</span></span></code></div></div></pre>

When user selects date range:

<pre class="overflow-visible!" data-start="1892" data-end="1967"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>PATCH /api/visits/V01
{
  </span><span>"dateRange"</span><span>: </span><span>"2025-01-01 to 2025-01-02"</span><span>
}
</span></span></code></div></div></pre>

Same endpoint, different fields.

---

# 🟦 **STEP 3 — When user clicks Add Interaction**

### Again you DO NOT create everything at once.

You call:

<pre class="overflow-visible!" data-start="2120" data-end="2173"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST /api/interactions
{
  </span><span>"visitId"</span><span>: </span><span>"V01"</span><span>
}
</span></span></code></div></div></pre>

This means:

- Create empty Interaction under the Visit
- Backend returns new interactionId (like V01-1)

You don’t send departments, Principals, persons yet.

Those come later via PATCH.

---

# 🟦 **STEP 4 — When user selects Principals**

You update interaction:

<pre class="overflow-visible!" data-start="2438" data-end="2513"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>PATCH /api/interactions/V01-1
{
  </span><span>"Principals"</span><span>: [</span><span>"Deublin"</span><span>, </span><span>"Koba"</span><span>]
}
</span></span></code></div></div></pre>

---

# 🟦 **STEP 5 — When user clicks Add Principal Interaction**

You POST again without details:

<pre class="overflow-visible!" data-start="2613" data-end="2710"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST /api/Principal-interactions
{
  </span><span>"interactionId"</span><span>: </span><span>"V01-1"</span><span>,
  </span><span>"PrincipalName"</span><span>: </span><span>"Deublin"</span><span>
}
</span></span></code></div></div></pre>

Backend returns:

<pre class="overflow-visible!" data-start="2730" data-end="2779"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>{</span><span>
  </span><span>"PrincipalInteractionId"</span><span>:</span><span></span><span>"V01-1-PI1"</span><span>
</span><span>}</span><span>
</span></span></code></div></div></pre>

Then PATCH:

<pre class="overflow-visible!" data-start="2794" data-end="2889"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>PATCH /api/Principal-interactions/V01-1-PI1
{
  </span><span>"objective"</span><span>: </span><span>"Discussed sealing issues"</span><span>
}
</span></span></code></div></div></pre>

Every field updates individually.

---

# 🎯 WHY THIS APPROACH IS BEST (And industry standard)

### ✔ Supports auto-save (Google Docs style)

### ✔ Supports resume later

### ✔ Supports partial saves

### ✔ Ensures no data is lost if browser reloads

### ✔ Clean backend structure

### ✔ Modular PATCH APIs → simple & reliable

This is how all large CRMs work (HubSpot, Odoo, Salesforce).
