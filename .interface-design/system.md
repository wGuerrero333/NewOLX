# GRUPO PS — Interface Design System
# Marketplace local, estilo plaza/mercado con acentos violeta/azul en formularios

## Direction & Feel
- **Producto:** GRUPO PS — marketplace local para comprar, vender e intercambiar
- **Feel:** Cálido como plaza de barrio. Superficies en piedra, acentos terracota para la navegación principal. Formularios con atmósfera twilight (azul → violeta) que los distingue como espacios de acción/registro.
- **Dominio:** Plaza, vitrina, trueque, vecindario, hallazgo

## Token Architecture

### Primitives
```
--stone-50 … --stone-900    # Warm neutral canvas (superficies base)
--terracotta-400 … 700      # Accent primario (acciones, links, logo)
--twilight-50 … --twilight-900   # Violet scale (formularios)
--cobalt-400 … --cobalt-700      # Blue accent (formularios, gradientes)
--amber-400 … 600           # Secondary warm
--moss-400 … 600            # Success
--rust-400 … 600            # Destructive/warning
```

### Text Hierarchy
```
--text-primary:   --stone-900   # Contenido principal
--text-secondary: --stone-600   # Soporte, descripciones
--text-tertiary:  --stone-400   # Metadata, placeholders
--text-muted:     --stone-300   # Disabled
```

### Surface Elevation (warm, barely perceptible)
```
--surface-canvas:  --stone-100   # Fondo principal del body
--surface-base:    --stone-50    # Inputs, áreas ligeramente elevadas
--surface-raised:  #ffffff       # Cards, forms, header
--surface-overlay: #ffffff       # Dropdowns, modals
```

### Border Progression
```
--border-soft:   rgba(92,78,64,0.08)   # Separación sutil entre cards
--border-base:   rgba(92,78,64,0.15)   # Header bottom, form borders
--border-medium: rgba(92,78,64,0.25)   # Hover states, emphasis
--border-strong: rgba(92,78,64,0.40)   # Focus rings
```

### Control Tokens
```
--control-bg:           --surface-raised
--control-border:       --border-base
--control-border-focus: --terracotta-500
--control-focus-ring:   rgba(212,105,63,0.25)
```

### Form Page Variant (twilight)
```
--form-accent:      --twilight-500
--form-accent-hover: --twilight-600
--form-surface:     --twilight-50
--form-border:      --twilight-300
--form-focus-ring:  rgba(124,91,191,0.3)
```

## Spacing
- **Base unit:** 8px
- **Scale:** `--space-xs:4 | --space-sm:8 | --space-md:12 | --space-lg:16 | --space-xl:24 | --space-2xl:32 | --space-3xl:48 | --space-4xl:64`

## Depth Strategy
- **Borders-only** — Clean, honest. No sombras en el layout general.
- **Excepción:** `.form-page .form` usa sombra violeta sutil (`rgba(101,69,165,0.08)`) para destacar el formulario como espacio de acción.
- **Header:** Sticky, borde inferior `--border-base`. No sombra.

## Border Radius
```
--radius-sm:   4px    # Small badges
--radius-md:   8px    # Inputs, buttons, category icons
--radius-lg:   12px   # Cards, forms
--radius-xl:   16px   # Modals
--radius-full: 9999px # Pills, search bar, step numbers
```

## Typography
- **Font:** Inter (weights 400, 500, 600, 700, 800)
- **Headlines:** 800 weight, `-0.03em` letter-spacing
- **Body:** 400 weight, `1.6` line-height, `15px` base
- **Prices:** 700 weight, terracotta-600

## Key Component Patterns

### Header
```css
position: sticky; top: 0; z-index: 100;
background: --surface-raised;
border-bottom: 1px solid --border-base;
height: 64px;
```
- `.form-page .header` usa gradiente oscuro (`twilight-800 → twilight-900`), texto blanco.

### Buttons
- `.btn-primary` — Terracotta background, white text
- `.btn-outline` — Transparent + border, hover fills with accent
- `.btn-ghost` — Transparent, hover gets light bg

### Category Cards ("Market Stalls")
```css
display: flex; flex-direction: column; align-items: center;
padding: --space-xl --space-lg;
background: --surface-raised;
border: 1px solid --border-soft;
border-radius: --radius-lg;
```
- Iconos con fondos clay únicos por categoría (sky, leaf, berry, sand, stone)
- Hover: `border-medium` + `translateY(-2px)`

### Product Cards ("Vitrina")
```css
background: --surface-raised;
border: 1px solid --border-soft;
border-radius: --radius-lg;
overflow: hidden;
```
- Estructura: imagen → body (título, descripción clamped, precio en terracotta, meta, link)
- Hover: `border-medium`

### Search Bar
```css
border-radius: --radius-full;
background: --surface-raised;
```
- Focus: `border: --control-border-focus` + `box-shadow: 0 0 0 3px --control-focus-ring`

### Forms
```css
.form {
  background: --surface-raised;
  padding: --space-xl;
  border: 1px solid --border-base;
  border-radius: --radius-lg;
}
```
- Inputs: `--surface-base` bg, `--border-base` border
- Focus: violet accent en `.form-page`
- Submit: `gradient(cobalt-500 → twilight-500)` en `.form-page`

### Page Title
```css
background: linear-gradient(135deg, --cobalt-600, --twilight-600);
-webkit-background-clip: text; -webkit-text-fill-color: transparent;
```

### Steps
- Numeros circulares: `40x40`, `--radius-full`, `--terracotta-500` bg

## Consistency Rules
1. No colores hex sueltos — todo mapea a tokens
2. Hover states en TODOS los interactivos
3. Focus ring siempre visible
4. Form pages usan `.form-page` body class para variante violeta
5. Cards siempre con `--border-soft`, hover `--border-medium`
6. Header siempre sticky en todas las páginas

## Files Styled
- `public/styles.css` — Design system completo
- `public/home.html` — Página principal con tokens
- `public/form.html` — Formulario suscripción (variante twilight)
- `public/formVenta.html` — Publicar artículo (variante twilight)
