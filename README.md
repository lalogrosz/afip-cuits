
Aquí va el **paso a paso** para tener los archivos que usa tu código: `certificate-prod.crt` y `certificate.key`.

---

## Requisitos previos

- **Clave Fiscal nivel 3** (AFIP).
- **OpenSSL** instalado (en macOS suele estar; en Windows: [OpenSSL en SourceForge](https://sourceforge.net/projects/openssl/), copiar la carpeta `bin` a `C:\OpenSSL` y usar esa consola).
- Tener habilitada en AFIP la aplicación **“Administración de Certificados Digitales”** (si no la ves, hay que solicitarla/habilitarla desde el escritorio de AFIP; el tutorial está en [Habilitar administrador de certificados de producción](https://docs.afipsdk.com/recursos/tutoriales-pagina-de-arca/habilitar-administrador-de-certificados-de-produccion)).

---

## Paso 1 – Generar la clave privada (`.key`)

En una terminal:

```bash
openssl genrsa -traditional -out certificate.key 2048
```

- `certificate.key` puede ser otro nombre; ese archivo es el que usás como `DEFAULT_CERTIFICATE_KEY` en tu código.
- Si falla por el flag `-traditional` (OpenSSL viejo), probá sin él:

```bash
openssl genrsa -out certificate.key 2048
```

**Importante:** guardá bien este archivo; es la “contraseña” del certificado y no se puede recuperar.

---

## Paso 2 – Generar el CSR (Certificate Signing Request)

Reemplazá los valores entre corchetes por los tuyos:

```bash
openssl req -new -key certificate.key -subj "/C=AR/O=[NOMBRE_EMPRESA]/CN=[NOMBRE_CERTIFICADO]/serialNumber=CUIT [CUIT_11_DIGITOS]" -out solicitud.csr
```

Ejemplo (CUIT 20302760935, como en tu código):

```bash
openssl req -new -key certificate.key -subj "/C=AR/O=Mi Empresa/CN=ProduccionWS/serialNumber=CUIT 20302760935" -out solicitud.csr
```

Reglas:

- **CUIT:** solo 11 dígitos, sin guiones.
- **serialNumber:** exactamente `CUIT ` (con espacio) + los 11 dígitos.
- **CN (nombre del certificado):** solo letras y números; es un alias para reconocer este certificado en AFIP.
- **O (organización):** nombre de la empresa o contribuyente.

El archivo que te interesa es `solicitud.csr` (o el nombre que hayas puesto). **No** uses el CSR como certificado; el certificado lo entrega AFIP.

---

## Paso 3 – Subir el CSR en la página de AFIP

1. Entrá a **AFIP** con Clave Fiscal: [https://www.afip.gob.ar](https://www.afip.gob.ar) (o el acceso que uses).
2. Abrí **“Administración de Certificados Digitales”** (si tenés que elegir contribuyente, elegí el que corresponda).
3. Clic en **“Agregar alias”**.
4. En **Alias** poné **exactamente** el mismo texto que usaste en **CN** del CSR (ej. `ProduccionWS`).
5. **Examinar** y seleccioná el archivo `.csr` que generaste.
6. Clic en **“Agregar Alias”**.

---

## Paso 4 – Descargar el certificado (`.crt`)

1. En la lista de alias, buscá el que acabás de agregar y hacé clic en **“Ver”**.
2. Usá el botón para **descargar** el certificado.
3. Guardalo con el nombre que use tu proyecto, por ejemplo `certificate-prod.crt`, en la misma ruta que espera tu código (junto a `certificate.key`).

Documentación oficial AFIP del proceso: [wsaa_obtener_certificado_produccion.pdf](https://www.afip.gob.ar/ws/WSAA/wsaa_obtener_certificado_produccion.pdf).

---

## Paso 5 – Autorizar el certificado para el web service

1. **Entrar** a **Administrador de Relaciones de Clave Fiscal** (con Clave Fiscal nivel 3).
2. Si te pide, **elegir el contribuyente** (tu CUIT o el que representes).
3. Ir a **“Nueva Relación”**.
4. En **“Representado”**: dejar tu CUIT (o el de quien te delegó si aplica) y pulsar **“Buscar”**.
5. En el árbol que se abre, ir a **“ARCA” → “Web Services”** y elegir el servicio que corresponde al Padrón A13. En la documentación de AFIP suele aparecer como **“ws_sr_padron_a13”** o algo tipo **“Padrón Alcance 13” / “Persona Service A13”**. Seleccionar ese servicio.
6. Pulsar el **segundo botón “Buscar”** (el que lista certificados).
7. **Elegir el certificado** (el alias que diste al subir el CSR, ej. “ProduccionWS”) y pulsar **“Confirmar”**.
8. **Confirmar de nuevo** en la siguiente pantalla.
---

## Resumen de archivos para tu código

| Archivo                 | Origen              | Uso en tu código                    |
|-------------------------|---------------------|-------------------------------------|
| `certificate.key`       | Lo generás vos (Paso 1) | `DEFAULT_CERTIFICATE_KEY`          |
| `certificate-prod.crt`  | Lo descargás de AFIP (Paso 4) | `DEFAULT_CERTIFICATE`              |
| `solicitud.csr`         | Solo para subir a AFIP; después no lo usa tu app | Podés borrarlo si querés. |




