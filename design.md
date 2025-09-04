# PROMPT PARA CLAUDE CODE - LINEAMIENTOS DE MARCA PLATAFORMA BOLIVIANA

## INSTRUCCIONES GENERALES
Cuando desarrolles cualquier página web, componente o elemento visual para la **Plataforma Boliviana de Adolescentes y Jóvenes por los Derechos Sexuales y Reproductivos**, debes seguir estrictamente estos lineamientos de marca:

---

## 1. PALETA DE COLORES CORPORATIVA
**Utiliza ÚNICAMENTE estos 5 colores en el orden establecido:**

### Color Primario (Morado Principal)
- **HEX:** `#744C7A` 
- **RGB:** `rgb(116, 76, 122)`
- **Uso:** Encabezados principales, botones primarios, elementos destacados

### Color Secundario (Rosa/Fucsia)
- **HEX:** `#D93069`
- **RGB:** `rgb(217, 48, 105)`
- **Uso:** Botones secundarios, acentos, enlaces importantes

### Color Terciario (Morado Oscuro)
- **HEX:** `#5A3B85`
- **RGB:** `rgb(90, 59, 133)`
- **Uso:** Fondos de sección, elementos de contraste

### Color Cuaternario (Amarillo/Dorado)
- **HEX:** `#F4B942`
- **RGB:** `rgb(244, 185, 66)`
- **Uso:** Highlights, iconos, elementos de atención

### Color Quinto (Turquesa)
- **HEX:** `#1BB5A0`
- **RGB:** `rgb(27, 181, 160)`
- **Uso:** Elementos informativos, badges, elementos complementarios

### Colores Neutros Permitidos:
- **Blanco:** `#FFFFFF`
- **Negro:** `#000000` 
- **Gris Oscuro:** `#333333`
- **Gris Claro:** `#F8F9FA`

---

## 2. TIPOGRAFÍA

### Tipografía Principal: **Dimbo**
```css
font-family: 'Dimbo', sans-serif;
```
- **Uso:** Logotipo, títulos principales, elementos destacados
- **Pesos disponibles:** Regular, Bold

### Tipografía Secundaria: **Helvetica LT Std**
```css
font-family: 'Helvetica LT Std', 'Helvetica Neue', Arial, sans-serif;
```
- **Uso:** Textos de lectura, párrafos, contenido general
- **Pesos disponibles:** 
  - Regular
  - Regular Condensed
  - Bold Condensed  
  - Light Condensed
  - Light Condensed Oblique
  - Condensed Oblique
  - Bold Condensed Oblique
  - Black Condensed

### Fallback para Web:
```css
font-family: 'Helvetica Neue', 'Arial', 'Roboto', sans-serif;
```

---

## 3. JERARQUÍA TIPOGRÁFICA
```css
/* Títulos Principales */
h1 { 
  font-family: 'Dimbo', sans-serif; 
  color: #744C7A; 
  font-weight: bold;
  font-size: 2.5rem;
}

/* Subtítulos */
h2 { 
  font-family: 'Helvetica LT Std', sans-serif; 
  color: #5A3B85; 
  font-weight: bold;
  font-size: 2rem;
}

/* Texto de párrafo */
p { 
  font-family: 'Helvetica LT Std', sans-serif; 
  color: #333333; 
  font-weight: regular;
  line-height: 1.6;
}

/* Enlaces */
a { 
  color: #D93069; 
  text-decoration: none;
}

a:hover { 
  color: #5A3B85; 
}
```

---

## 4. ELEMENTOS DE DISEÑO

### Botones
```css
/* Botón Primario */
.btn-primary {
  background-color: #744C7A;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-family: 'Helvetica LT Std', sans-serif;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #5A3B85;
}

/* Botón Secundario */
.btn-secondary {
  background-color: #D93069;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
}

.btn-secondary:hover {
  background-color: #744C7A;
}
```

### Gradientes Permitidos
```css
/* Gradiente Principal */
background: linear-gradient(135deg, #744C7A 0%, #5A3B85 100%);

/* Gradiente Secundario */
background: linear-gradient(135deg, #D93069 0%, #744C7A 100%);

/* Gradiente Complementario */
background: linear-gradient(135deg, #1BB5A0 0%, #F4B942 100%);
```

---

## 5. ESPACIADO Y LAYOUT
- **Margin/Padding base:** 16px, 24px, 32px, 48px, 64px
- **Border radius:** 8px para elementos pequeños, 25px para botones
- **Sombras sutiles:** `box-shadow: 0 4px 6px rgba(116, 76, 122, 0.1);`

---

## 6. ICONOGRAFÍA
- Usar iconos outline/line style
- Color principal: `#744C7A`
- Color secundario: `#D93069`
- Tamaños estándar: 16px, 24px, 32px, 48px

---

## 7. RESTRICCIONES IMPORTANTES
❌ **NO usar otros colores** fuera de la paleta establecida
❌ **NO usar tipografías** diferentes a las especificadas
❌ **NO alterar** el orden de jerarquía cromática
❌ **NO usar efectos** demasiado llamativos que compitan con la identidad

✅ **SÍ mantener** consistencia visual en todos los elementos
✅ **SÍ usar** espaciado uniforme y proporcional
✅ **SÍ priorizar** legibilidad y accesibilidad
✅ **SÍ aplicar** estos colores en gradientes cuando sea apropiado

---

## 8. IMPLEMENTACIÓN EN CÓDIGO
Al crear cualquier página o componente, asegúrate de:
1. Definir las variables CSS con estos colores exactos
2. Usar las tipografías especificadas con sus fallbacks
3. Mantener la jerarquía cromática establecida
4. Aplicar los estilos de botones y elementos interactivos
5. Usar el espaciado modular definido

**RECUERDA:** Estos lineamientos son obligatorios para mantener la coherencia visual de la marca Plataforma Boliviana.