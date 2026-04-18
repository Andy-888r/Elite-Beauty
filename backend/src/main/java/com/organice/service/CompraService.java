package com.organice.service;
 
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.organice.dto.CompraRequest;
import com.organice.model.*;
import com.organice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
 
@Service
public class CompraService {
 
    @Autowired private ClienteRepository clienteRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private HistorialCompraRepository historialCompraRepo;
    @Autowired private InventarioRepository inventarioRepo;
    @Autowired private HistorialMovimientoRepository movimientoRepo;
 
    public static class ResultadoCompra {
        public final double total;
        public final String idOrden;
        public ResultadoCompra(double total, String idOrden) {
            this.total = total;
            this.idOrden = idOrden;
        }
    }
 
    @Transactional
    public ResultadoCompra procesarCompra(CompraRequest req) {
        Cliente cliente = null;
        if (req.getIdCliente() != null) {
            cliente = clienteRepo.findById(req.getIdCliente()).orElse(null);
        }
        String idOrden = java.util.UUID.randomUUID().toString();
        double total = 0;
        for (CompraRequest.ItemCompra item : req.getItems()) {
            Producto prod = productoRepo.findById(item.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getIdProducto()));
            Integer stockDisponible = inventarioRepo.findByProductoId(prod.getId())
                    .map(inv -> inv.getStock()).orElse(0);
            if (stockDisponible < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para " + prod.getNombre()
                        + " (disponible: " + stockDisponible + ")");
            }
            double subtotal = item.getPrecio() * item.getCantidad();
            total += subtotal;
            HistorialCompra hc = new HistorialCompra();
            hc.setCliente(cliente); hc.setProducto(prod);
            hc.setCantidad(item.getCantidad()); hc.setTotal(subtotal);
            hc.setFecha(LocalDateTime.now());
            hc.setIdOrden(idOrden);
            historialCompraRepo.save(hc);
            inventarioRepo.findByProductoId(prod.getId()).ifPresent(inv -> {
                int nuevoStock = Math.max(0, inv.getStock() - item.getCantidad());
                inv.setStock(nuevoStock);
                inv.setEstado(nuevoStock == 0 ? "SIN STOCK" : nuevoStock <= inv.getMinimo() ? "BAJO" : "OK");
                inventarioRepo.save(inv);
                HistorialMovimiento mov = new HistorialMovimiento();
                mov.setProducto(prod); mov.setTipo("Salida");
                mov.setCantidad(item.getCantidad()); mov.setMotivo("Venta a cliente");
                mov.setFecha(LocalDateTime.now());
                movimientoRepo.save(mov);
            });
        }
        return new ResultadoCompra(total, idOrden);
    }
 
    public byte[] generarTicketPDF(String nombreCliente,
                                    String correoCliente,
                                    List<CompraRequest.ItemCompra> items,
                                    List<String> nombresProductos,
                                    double total) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
 
            float alturaBase  = 610f;
            float alturaExtra = Math.max(0, items.size() - 3) * 16f;
            Rectangle pageSize = new Rectangle(320, alturaBase + alturaExtra);
 
            Document doc = new Document(pageSize, 18, 18, 18, 14);
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            doc.open();
 
            // ════════════════════════════════════════════════════════════════
            //  PALETA VERDE INTENSO + PISTACHE
            // ════════════════════════════════════════════════════════════════
            java.awt.Color VERDE_HEADER  = new java.awt.Color( 91, 168,  74);
            java.awt.Color PISTACHE_VIB  = new java.awt.Color(168, 220, 120);
            java.awt.Color PISTACHE_MED  = new java.awt.Color(232, 248, 208);
            java.awt.Color PISTACHE_SUAV = new java.awt.Color(240, 251, 223);
            java.awt.Color BASE          = new java.awt.Color(250, 255, 245);
            java.awt.Color DORADO        = new java.awt.Color(196, 176, 120);
            java.awt.Color BORDE         = new java.awt.Color(200, 236, 168);
            java.awt.Color VERDE_OSC     = new java.awt.Color( 45, 122,  30);
            java.awt.Color VERDE_MED     = new java.awt.Color(106, 176,  80);
            java.awt.Color BLANCO        = java.awt.Color.WHITE;
 
            // ── Tipografías ──────────────────────────────────────────────────
            Font fBrand      = new Font(Font.HELVETICA, 13, Font.BOLD,   BLANCO);
            Font fBrandSub   = new Font(Font.HELVETICA,  5, Font.NORMAL, new java.awt.Color(216, 245, 200));
            Font fSecLabel   = new Font(Font.HELVETICA,  6, Font.BOLD,   new java.awt.Color( 74, 152,  56));
            Font fFolio      = new Font(Font.HELVETICA, 12, Font.BOLD,   VERDE_OSC);
            Font fFolioSub   = new Font(Font.HELVETICA,  5, Font.ITALIC, VERDE_MED);
            Font fMetaLbl    = new Font(Font.HELVETICA,  5, Font.BOLD,   VERDE_MED);
            Font fMetaVal    = new Font(Font.HELVETICA,  8, Font.BOLD,   VERDE_OSC);
            Font fMetaSub    = new Font(Font.HELVETICA,  6, Font.NORMAL, VERDE_MED);
            Font fThHead     = new Font(Font.HELVETICA,  6, Font.BOLD,   BLANCO);
            Font fTdNombre   = new Font(Font.HELVETICA,  7, Font.NORMAL, VERDE_OSC);
            Font fTdNum      = new Font(Font.HELVETICA,  7, Font.BOLD,   VERDE_OSC);
            Font fTdSub      = new Font(Font.HELVETICA,  7, Font.BOLD,   VERDE_MED);
            Font fTotLbl     = new Font(Font.HELVETICA,  7, Font.BOLD,   VERDE_MED);
            Font fTotVal     = new Font(Font.HELVETICA,  7, Font.NORMAL, VERDE_OSC);
            Font fGrandLbl   = new Font(Font.HELVETICA, 10, Font.BOLD,   BLANCO);
            Font fGrandVal   = new Font(Font.HELVETICA, 10, Font.BOLD,   new java.awt.Color(216, 248, 184));
            Font fGracias    = new Font(Font.HELVETICA,  9, Font.BOLD,   VERDE_OSC);
            Font fGracSub    = new Font(Font.HELVETICA,  6, Font.ITALIC, VERDE_MED);
            Font fRedesLabel = new Font(Font.HELVETICA,  6, Font.BOLD,   VERDE_OSC);
            Font fRedesVal   = new Font(Font.HELVETICA,  7, Font.BOLD,   VERDE_HEADER);
 
            java.util.Locale localeMX = new java.util.Locale.Builder()
                .setLanguage("es").setRegion("MX").build();
            String fecha = LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", localeMX));
            String hora  = LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("HH:mm"));
            String folio = "EB-" + (System.currentTimeMillis() % 100000);
 
            PdfContentByte cv = writer.getDirectContent();
            float W = pageSize.getWidth();
            float H = pageSize.getHeight();
 
            // ── Fondo base ────────────────────────────────────────────────────
            cv.setColorFill(BASE);
            cv.rectangle(0, 0, W, H);
            cv.fill();
 
            // ── Borde exterior verde intenso + línea interior dorada ──────────
            cv.setColorStroke(VERDE_HEADER);
            cv.setLineWidth(2.0f);
            cv.rectangle(5, 5, W - 10, H - 10);
            cv.stroke();
            cv.setColorStroke(DORADO);
            cv.setLineWidth(0.5f);
            cv.rectangle(8, 8, W - 16, H - 16);
            cv.stroke();
 
            // ════════════════════════════════════════════════════════════════
            //  SECCIÓN 1 — CABECERA (verde intenso)
            // ════════════════════════════════════════════════════════════════
            PdfPTable tHeader = new PdfPTable(1);
            tHeader.setWidthPercentage(100); tHeader.setSpacingAfter(0f);
            PdfPCell cHeader = new PdfPCell();
            cHeader.setBackgroundColor(VERDE_HEADER); cHeader.setBorder(Rectangle.NO_BORDER);
            cHeader.setPaddingTop(13f); cHeader.setPaddingBottom(13f);
            cHeader.setPaddingLeft(16f); cHeader.setPaddingRight(16f);
 
            boolean logoOk = false;
            try {
                InputStream imgS = getClass().getResourceAsStream("/static/logo_elite_beauty.png");
                if (imgS == null) imgS = getClass().getResourceAsStream("/logo_elite_beauty.png");
                if (imgS != null) {
                    Image logo = Image.getInstance(imgS.readAllBytes());
                    logo.scaleToFit(28, 28);
                    PdfPTable tL = new PdfPTable(2); tL.setWidths(new float[]{1, 4});
                    PdfPCell cLogo = new PdfPCell(logo);
                    cLogo.setBorder(Rectangle.NO_BORDER); cLogo.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    tL.addCell(cLogo);
                    PdfPCell cNm = new PdfPCell();
                    cNm.setBorder(Rectangle.NO_BORDER); cNm.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    cNm.setPaddingLeft(6f);
                    Paragraph pN = new Paragraph("ELITE BEAUTY", fBrand); pN.setSpacingAfter(2f);
                    cNm.addElement(pN);
                    cNm.addElement(new Paragraph("TIENDA DE BELLEZA  \u00b7  TORRE\u00d3N, COAH.", fBrandSub));
                    tL.addCell(cNm);
                    cHeader.addElement(tL); logoOk = true;
                }
            } catch (Exception ignored) {}
            if (!logoOk) {
                Paragraph pN = new Paragraph("ELITE BEAUTY", fBrand);
                pN.setAlignment(Element.ALIGN_CENTER); pN.setSpacingAfter(2f); cHeader.addElement(pN);
                cHeader.addElement(new Paragraph("TIENDA DE BELLEZA  \u00b7  TORRE\u00d3N, COAH.", fBrandSub));
            }
            tHeader.addCell(cHeader);
            doc.add(tHeader);
 
            // Franja superior: pistache vibrante + DORADO
            doc.add(franjaDiv(new float[]{60f, 40f},
                              new java.awt.Color[]{PISTACHE_VIB, DORADO}, 5f));
 
            // ════════════════════════════════════════════════════════════════
            //  SECCIÓN 2 — FOLIO / TÍTULO
            // ════════════════════════════════════════════════════════════════
            PdfPTable tTitulo = new PdfPTable(1);
            tTitulo.setWidthPercentage(100); tTitulo.setSpacingAfter(0f);
            PdfPCell cTitulo = new PdfPCell();
            cTitulo.setBackgroundColor(PISTACHE_MED);
            cTitulo.setBorderColor(BORDE);
            cTitulo.setBorderWidthBottom(0.8f); cTitulo.setBorderWidthTop(0f);
            cTitulo.setBorderWidthLeft(0f);     cTitulo.setBorderWidthRight(0f);
            cTitulo.setPaddingTop(9f); cTitulo.setPaddingBottom(8f);
            Paragraph pDocTitle = new Paragraph("COMPROBANTE DE COMPRA", fSecLabel);
            pDocTitle.setAlignment(Element.ALIGN_CENTER); pDocTitle.setSpacingAfter(4f);
            cTitulo.addElement(pDocTitle);
            Paragraph pFolio = new Paragraph("# " + folio, fFolio);
            pFolio.setAlignment(Element.ALIGN_CENTER); pFolio.setSpacingAfter(3f);
            cTitulo.addElement(pFolio);
            cTitulo.addElement(new Paragraph("Conserve este comprobante", fFolioSub) {{
                setAlignment(Element.ALIGN_CENTER);
            }});
            tTitulo.addCell(cTitulo);
            doc.add(tTitulo);
 
            // Franja pistache vibrante
            doc.add(franjaDiv(new float[]{100f}, new java.awt.Color[]{PISTACHE_VIB}, 3f));
 
            // ════════════════════════════════════════════════════════════════
            //  SECCIÓN 3 — CLIENTE | FECHA
            // ════════════════════════════════════════════════════════════════
            PdfPTable tMeta = new PdfPTable(2);
            tMeta.setWidthPercentage(100); tMeta.setWidths(new float[]{50, 50});
            tMeta.setSpacingBefore(0f); tMeta.setSpacingAfter(0f);
            String correoSub = (correoCliente != null && !correoCliente.isEmpty())
                ? correoCliente : "Compra registrada";
            tMeta.addCell(metaCelda("CLIENTE",
                nombreCliente != null ? nombreCliente : "Cliente",
                correoSub, fMetaLbl, fMetaVal, fMetaSub,
                PISTACHE_SUAV, BORDE, true, false));
            tMeta.addCell(metaCelda("FECHA", fecha, "Hora: " + hora,
                fMetaLbl, fMetaVal, fMetaSub,
                PISTACHE_MED, BORDE, false, true));
            doc.add(tMeta);
 
            // Franja pistache vibrante
            doc.add(franjaDiv(new float[]{100f}, new java.awt.Color[]{PISTACHE_VIB}, 3f));
 
            // ════════════════════════════════════════════════════════════════
            //  SECCIÓN 4 — TABLA DE PRODUCTOS
            // ════════════════════════════════════════════════════════════════
            PdfPTable tProd = new PdfPTable(4);
            tProd.setWidthPercentage(100); tProd.setWidths(new float[]{44, 11, 22, 23});
            tProd.setSpacingBefore(0f); tProd.setSpacingAfter(0f);
 
            String[] heads  = {"PRODUCTO", "UDS", "PRECIO", "TOTAL"};
            int[]    aligns = {Element.ALIGN_LEFT, Element.ALIGN_CENTER,
                               Element.ALIGN_RIGHT, Element.ALIGN_RIGHT};
            for (int i = 0; i < heads.length; i++) {
                PdfPCell ch = new PdfPCell(new Phrase(heads[i], fThHead));
                ch.setBackgroundColor(VERDE_HEADER);
                ch.setPaddingTop(7f); ch.setPaddingBottom(7f);
                ch.setPaddingLeft(i == 0 ? 8f : 3f);
                ch.setPaddingRight(i == heads.length - 1 ? 8f : 3f);
                ch.setBorder(Rectangle.NO_BORDER);
                ch.setHorizontalAlignment(aligns[i]);
                tProd.addCell(ch);
            }
            for (int i = 0; i < items.size(); i++) {
                CompraRequest.ItemCompra item = items.get(i);
                String nombre   = i < nombresProductos.size() ? nombresProductos.get(i) : "Producto";
                double subtotal = item.getPrecio() * item.getCantidad();
                java.awt.Color bgFila = (i % 2 == 0) ? BLANCO : PISTACHE_SUAV;
                tProd.addCell(filaCelda(nombre,                            fTdNombre, bgFila, BORDE, Element.ALIGN_LEFT,   8f, 3f));
                tProd.addCell(filaCelda(String.valueOf(item.getCantidad()), fTdNum,   bgFila, BORDE, Element.ALIGN_CENTER, 3f, 3f));
                tProd.addCell(filaCelda("$" + fmt(item.getPrecio()),        fTdNum,   bgFila, BORDE, Element.ALIGN_RIGHT,  3f, 3f));
                tProd.addCell(filaCelda("$" + fmt(subtotal),                fTdSub,   bgFila, BORDE, Element.ALIGN_RIGHT,  3f, 8f));
            }
            doc.add(tProd);
 
            // Franja pistache vibrante (cierra tabla)
            doc.add(franjaDiv(new float[]{100f}, new java.awt.Color[]{PISTACHE_VIB}, 2f));
 
            // ════════════════════════════════════════════════════════════════
            //  SECCIÓN 5 — TOTALES
            // ════════════════════════════════════════════════════════════════
            double iva = total * 0.16, totalFin = total + iva;
            PdfPTable tTot = new PdfPTable(2);
            tTot.setWidthPercentage(70); tTot.setHorizontalAlignment(Element.ALIGN_RIGHT);
            tTot.setWidths(new float[]{52, 48});
            tTot.setSpacingBefore(3f); tTot.setSpacingAfter(8f);
            filaTotal(tTot, "Subtotal",  "$" + fmt(total), fTotLbl, fTotVal, PISTACHE_SUAV, BORDE);
            filaTotal(tTot, "IVA (16%)", "$" + fmt(iva),   fTotLbl, fTotVal, PISTACHE_MED,  BORDE);
            PdfPCell cTL = new PdfPCell(new Phrase("TOTAL", fGrandLbl));
            cTL.setBackgroundColor(VERDE_HEADER); cTL.setBorder(Rectangle.NO_BORDER);
            cTL.setPaddingTop(9f); cTL.setPaddingBottom(9f); cTL.setPaddingLeft(10f);
            cTL.setHorizontalAlignment(Element.ALIGN_LEFT); tTot.addCell(cTL);
            PdfPCell cTV = new PdfPCell(new Phrase("$" + fmt(totalFin), fGrandVal));
            cTV.setBackgroundColor(VERDE_HEADER); cTV.setBorder(Rectangle.NO_BORDER);
            cTV.setPaddingTop(9f); cTV.setPaddingBottom(9f); cTV.setPaddingRight(10f);
            cTV.setHorizontalAlignment(Element.ALIGN_RIGHT); tTot.addCell(cTV);
            doc.add(tTot);
 
            // Franja pistache vibrante
            doc.add(franjaDiv(new float[]{100f}, new java.awt.Color[]{PISTACHE_VIB}, 3f));
 
            // ════════════════════════════════════════════════════════════════
            //  SECCIÓN 6 — PIE: mensaje + redes sociales
            // ════════════════════════════════════════════════════════════════
            PdfPTable tPie = new PdfPTable(2);
            tPie.setWidthPercentage(100); tPie.setWidths(new float[]{55, 45});
            tPie.setSpacingBefore(0f); tPie.setSpacingAfter(0f);
 
            // Celda mensaje — pistache medio
            PdfPCell cMsg = new PdfPCell();
            cMsg.setBackgroundColor(PISTACHE_MED);
            cMsg.setBorderColor(BORDE); cMsg.setBorderWidth(0.5f);
            cMsg.setPaddingTop(14f); cMsg.setPaddingBottom(14f);
            cMsg.setPaddingLeft(14f); cMsg.setPaddingRight(8f);
            Paragraph pG = new Paragraph("\u00a1Gracias por tu compra!", fGracias);
            pG.setSpacingAfter(6f); cMsg.addElement(pG);
            cMsg.addElement(new Paragraph(
                "Eres parte de nuestra historia \u2014 vuelve pronto \u2728",
                fGracSub));
            tPie.addCell(cMsg);
 
            // Celda redes — fondo BLANCO con borde izquierdo verde intenso
            PdfPCell cRedes = new PdfPCell();
            cRedes.setBackgroundColor(BLANCO);
            cRedes.setBorderColor(VERDE_HEADER);
            cRedes.setBorderWidthLeft(2f);
            cRedes.setBorderWidthTop(0.5f);
            cRedes.setBorderWidthBottom(0.5f);
            cRedes.setBorderWidthRight(0.5f);
            cRedes.setPaddingTop(10f); cRedes.setPaddingBottom(10f);
            cRedes.setPaddingLeft(12f); cRedes.setPaddingRight(8f);
 
            // ── Fila Instagram ────────────────────────────────────────────
            PdfPTable rowI = new PdfPTable(2);
            rowI.setSpacingAfter(6f);
            try { rowI.setWidths(new float[]{1, 5}); } catch (Exception ignored) {}
            PdfPCell cII = new PdfPCell();
            cII.setBorder(Rectangle.NO_BORDER); cII.setPaddingRight(3f);
            try {
                InputStream is = getClass().getResourceAsStream("/static/instagram_icon.png");
                if (is != null) {
                    Image ig = Image.getInstance(is.readAllBytes());
                    ig.scaleToFit(10, 10);
                    cII.addElement(ig);
                }
            } catch (Exception ignored) {}
            rowI.addCell(cII);
            PdfPCell cTI = new PdfPCell();
            cTI.setBorder(Rectangle.NO_BORDER);
            cTI.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cTI.addElement(new Paragraph("Instagram", fRedesLabel));
            cTI.addElement(new Paragraph("@elite_beautytrc", fRedesVal));
            rowI.addCell(cTI);
            cRedes.addElement(rowI);
 
            // ── Fila Facebook ─────────────────────────────────────────────
            PdfPTable rowF = new PdfPTable(2);
            rowF.setSpacingAfter(0f);
            try { rowF.setWidths(new float[]{1, 5}); } catch (Exception ignored) {}
            PdfPCell cIF = new PdfPCell();
            cIF.setBorder(Rectangle.NO_BORDER); cIF.setPaddingRight(3f);
            try {
                InputStream fs = getClass().getResourceAsStream("/static/facebook_logo.png");
                if (fs == null) fs = getClass().getResourceAsStream("/static/facebook_logo.webp");
                if (fs != null) {
                    Image fb = Image.getInstance(fs.readAllBytes());
                    fb.scaleToFit(10, 10);
                    cIF.addElement(fb);
                }
            } catch (Exception ignored) {}
            rowF.addCell(cIF);
            PdfPCell cTF = new PdfPCell();
            cTF.setBorder(Rectangle.NO_BORDER);
            cTF.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cTF.addElement(new Paragraph("Facebook", fRedesLabel));
            cTF.addElement(new Paragraph("Elite Beautytrc", fRedesVal));
            rowF.addCell(cTF);
            cRedes.addElement(rowF);
 
            tPie.addCell(cRedes);
            doc.add(tPie);
 
            // Franja final: DORADO + verde intenso
            doc.add(franjaDiv(new float[]{40f, 60f},
                              new java.awt.Color[]{DORADO, VERDE_HEADER}, 5f));
 
            doc.close();
            return out.toByteArray();
 
        } catch (Exception e) {
            throw new RuntimeException("Error generando ticket PDF: " + e.getMessage());
        }
    }
 
    // ─────────────────────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────────────────────
 
    private String fmt(double v) { return String.format("%.2f", v); }
 
    private PdfPTable franjaDiv(float[] pesos, java.awt.Color[] colores, float altura) throws Exception {
        PdfPTable t = new PdfPTable(pesos.length);
        t.setWidthPercentage(100); t.setSpacingBefore(0f); t.setSpacingAfter(0f);
        t.setWidths(pesos);
        for (java.awt.Color c : colores) {
            PdfPCell fc = new PdfPCell(new Phrase(" "));
            fc.setBackgroundColor(c); fc.setFixedHeight(altura); fc.setBorder(Rectangle.NO_BORDER);
            t.addCell(fc);
        }
        return t;
    }
 
    private PdfPCell metaCelda(String label, String valor, String sub,
                                Font fLabel, Font fValor, Font fSub,
                                java.awt.Color bg, java.awt.Color border,
                                boolean izq, boolean der) {
        PdfPCell c = new PdfPCell();
        c.setBackgroundColor(bg); c.setBorderColor(border); c.setBorderWidth(0.5f);
        c.setPaddingTop(9f); c.setPaddingBottom(9f);
        c.setPaddingLeft(izq ? 10f : 6f); c.setPaddingRight(der ? 10f : 6f);
        Paragraph pL = new Paragraph(label, fLabel); pL.setSpacingAfter(3f); c.addElement(pL);
        c.addElement(new Paragraph(valor, fValor));
        if (sub != null && !sub.isEmpty()) c.addElement(new Paragraph(sub, fSub));
        return c;
    }
 
    private PdfPCell filaCelda(String texto, Font font, java.awt.Color bg,
                                java.awt.Color border, int align, float padL, float padR) {
        PdfPCell c = new PdfPCell(new Phrase(texto, font));
        c.setBackgroundColor(bg);
        c.setPaddingTop(6f); c.setPaddingBottom(6f);
        c.setPaddingLeft(padL); c.setPaddingRight(padR);
        c.setBorderColor(border);
        c.setBorderWidthTop(0f); c.setBorderWidthBottom(0.4f);
        c.setBorderWidthLeft(0f); c.setBorderWidthRight(0f);
        c.setHorizontalAlignment(align);
        return c;
    }
 
    private void filaTotal(PdfPTable tabla, String label, String valor,
                            Font fLabel, Font fValor,
                            java.awt.Color bg, java.awt.Color border) {
        PdfPCell cL = new PdfPCell(new Phrase(label, fLabel));
        cL.setBackgroundColor(bg); cL.setPaddingTop(4f); cL.setPaddingBottom(4f); cL.setPaddingLeft(10f);
        cL.setBorderColor(border); cL.setBorderWidthBottom(0.4f);
        cL.setBorderWidthTop(0f); cL.setBorderWidthLeft(0f); cL.setBorderWidthRight(0f);
        cL.setHorizontalAlignment(Element.ALIGN_LEFT); tabla.addCell(cL);
        PdfPCell cV = new PdfPCell(new Phrase(valor, fValor));
        cV.setBackgroundColor(bg); cV.setPaddingTop(4f); cV.setPaddingBottom(4f); cV.setPaddingRight(10f);
        cV.setBorderColor(border); cV.setBorderWidthBottom(0.4f);
        cV.setBorderWidthTop(0f); cV.setBorderWidthLeft(0f); cV.setBorderWidthRight(0f);
        cV.setHorizontalAlignment(Element.ALIGN_RIGHT); tabla.addCell(cV);
    }
}