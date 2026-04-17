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
 
    @Transactional
    public double procesarCompra(CompraRequest req) {
        Cliente cliente = null;
        if (req.getIdCliente() != null) {
            cliente = clienteRepo.findById(req.getIdCliente()).orElse(null);
        }
        double total = 0;
        for (CompraRequest.ItemCompra item : req.getItems()) {
            Producto prod = productoRepo.findById(item.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getIdProducto()));
            double subtotal = item.getPrecio() * item.getCantidad();
            total += subtotal;
            HistorialCompra hc = new HistorialCompra();
            hc.setCliente(cliente); hc.setProducto(prod);
            hc.setCantidad(item.getCantidad()); hc.setTotal(subtotal);
            hc.setFecha(LocalDateTime.now());
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
        return total;
    }
 
    public byte[] generarTicketPDF(String nombreCliente,
                                    List<CompraRequest.ItemCompra> items,
                                    List<String> nombresProductos,
                                    double total) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
 
            float alturaBase  = 600f;
            float alturaExtra = Math.max(0, items.size() - 3) * 16f;
            Rectangle pageSize = new Rectangle(320, alturaBase + alturaExtra);
 
            Document doc = new Document(pageSize, 20, 20, 20, 16);
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            doc.open();
 
            // ══════════════════════════════════════
            // PALETA CLARA — pistache suave y verde claro
            // ══════════════════════════════════════
            java.awt.Color V_OSCURO    = new java.awt.Color(44,  74,  30);
            java.awt.Color V_MEDIO     = new java.awt.Color(85,  136, 59);
            java.awt.Color P_PISTACHE  = new java.awt.Color(193, 232, 153);
            java.awt.Color P_CLARO     = new java.awt.Color(220, 242, 190);
            java.awt.Color P_MUY_CLARO = new java.awt.Color(235, 248, 210);
            java.awt.Color P_FONDO     = new java.awt.Color(244, 252, 230);
            java.awt.Color BORDE       = new java.awt.Color(180, 220, 140);
            java.awt.Color BLANCO      = java.awt.Color.WHITE;
            java.awt.Color DORADO_S    = new java.awt.Color(180, 150, 60);
            java.awt.Color TEXTO_SEC   = new java.awt.Color(100, 150, 65);
            java.awt.Color META_BG1    = new java.awt.Color(230, 248, 210);
            java.awt.Color META_BG2    = new java.awt.Color(215, 240, 195);
            java.awt.Color TOT_BG1     = new java.awt.Color(240, 252, 220);
            java.awt.Color TOT_BG2     = new java.awt.Color(225, 245, 205);
 
            Font fBrand      = new Font(Font.HELVETICA, 13, Font.BOLD,   BLANCO);
            Font fBrandSub   = new Font(Font.HELVETICA,  5, Font.NORMAL, P_PISTACHE);
            Font fDocTitle   = new Font(Font.HELVETICA,  7, Font.BOLD,   V_MEDIO);
            Font fFolio      = new Font(Font.HELVETICA, 13, Font.BOLD,   V_OSCURO);
            Font fMetaLabel  = new Font(Font.HELVETICA,  5, Font.BOLD,   TEXTO_SEC);
            Font fMetaVal    = new Font(Font.HELVETICA,  8, Font.BOLD,   V_OSCURO);
            Font fMetaSub    = new Font(Font.HELVETICA,  6, Font.NORMAL, V_MEDIO);
            Font fThHead     = new Font(Font.HELVETICA,  6, Font.BOLD,   BLANCO);
            Font fTdNombre   = new Font(Font.HELVETICA,  7, Font.NORMAL, V_OSCURO);
            Font fTdNum      = new Font(Font.HELVETICA,  7, Font.BOLD,   V_OSCURO);
            Font fTdSub      = new Font(Font.HELVETICA,  7, Font.BOLD,   V_MEDIO);
            Font fTotalLbl   = new Font(Font.HELVETICA,  7, Font.BOLD,   TEXTO_SEC);
            Font fTotalVal   = new Font(Font.HELVETICA,  7, Font.NORMAL, V_OSCURO);
            Font fGrandLbl   = new Font(Font.HELVETICA, 10, Font.BOLD,   BLANCO);
            Font fGrandVal   = new Font(Font.HELVETICA, 10, Font.BOLD,   P_PISTACHE);
            Font fGracias    = new Font(Font.HELVETICA,  8, Font.BOLD,   V_OSCURO);
            Font fGraciasSub = new Font(Font.HELVETICA,  6, Font.ITALIC, TEXTO_SEC);
            Font fRedes      = new Font(Font.HELVETICA,  6, Font.BOLD,   V_MEDIO);
            Font fRedesSub   = new Font(Font.HELVETICA,  6, Font.ITALIC, TEXTO_SEC);
 
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
 
            // ── Fondo base pistache muy claro ──
            cv.setColorFill(P_FONDO);
            cv.rectangle(0, 0, W, H); cv.fill();
 
            // ── Venas de mármol sutiles ──
            cv.saveState();
            cv.setColorStroke(new java.awt.Color(160, 210, 120, 20));
            cv.setLineWidth(7f);
            cv.moveTo(-10, H * 0.72f); cv.lineTo(W * 0.58f, -10); cv.stroke();
            cv.setColorStroke(new java.awt.Color(140, 195, 100, 14));
            cv.setLineWidth(3f);
            cv.moveTo(W * 0.22f, H + 10); cv.lineTo(W + 10, H * 0.28f); cv.stroke();
            cv.setColorStroke(new java.awt.Color(170, 220, 130, 12));
            cv.setLineWidth(9f);
            cv.moveTo(-10, H * 0.38f); cv.lineTo(W * 0.78f, H + 10); cv.stroke();
            cv.setColorStroke(new java.awt.Color(193, 232, 153, 18));
            cv.setLineWidth(2f);
            cv.moveTo(W * 0.48f, -10); cv.lineTo(W + 10, H * 0.52f); cv.stroke();
            cv.restoreState();
 
            // ── Bordes ──
            cv.setColorStroke(V_MEDIO);
            cv.setLineWidth(1.5f);
            cv.rectangle(5, 5, W - 10, H - 10); cv.stroke();
            cv.setColorStroke(P_PISTACHE);
            cv.setLineWidth(0.4f);
            cv.rectangle(8, 8, W - 16, H - 16); cv.stroke();
 
            // ── Header ──
            PdfPTable tHeader = new PdfPTable(1);
            tHeader.setWidthPercentage(100); tHeader.setSpacingAfter(0f);
            PdfPCell cHeader = new PdfPCell();
            cHeader.setBackgroundColor(V_OSCURO); cHeader.setBorder(Rectangle.NO_BORDER);
            cHeader.setPaddingTop(14f); cHeader.setPaddingBottom(14f);
            cHeader.setPaddingLeft(16f); cHeader.setPaddingRight(16f);
 
            boolean logoOk = false;
            try {
                InputStream imgS = getClass().getResourceAsStream("/static/logo_elite_beauty.png");
                if (imgS == null) imgS = getClass().getResourceAsStream("/logo_elite_beauty.png");
                if (imgS != null) {
                    Image logo = Image.getInstance(imgS.readAllBytes());
                    logo.scaleToFit(30, 30);
                    PdfPTable tL = new PdfPTable(2); tL.setWidths(new float[]{1, 4});
                    PdfPCell cLogo = new PdfPCell(logo);
                    cLogo.setBorder(Rectangle.NO_BORDER); cLogo.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    tL.addCell(cLogo);
                    PdfPCell cNm = new PdfPCell();
                    cNm.setBorder(Rectangle.NO_BORDER); cNm.setVerticalAlignment(Element.ALIGN_MIDDLE); cNm.setPaddingLeft(6f);
                    Paragraph pN = new Paragraph("ELITE BEAUTY", fBrand); pN.setSpacingAfter(2f);
                    cNm.addElement(pN);
                    cNm.addElement(new Paragraph("TIENDA DE BELLEZA  \u00b7  TORREON, COAH.", fBrandSub));
                    tL.addCell(cNm);
                    cHeader.addElement(tL); logoOk = true;
                }
            } catch (Exception ignored) {}
            if (!logoOk) {
                Paragraph pN = new Paragraph("ELITE BEAUTY", fBrand);
                pN.setAlignment(Element.ALIGN_CENTER); pN.setSpacingAfter(2f); cHeader.addElement(pN);
                Paragraph pS = new Paragraph("TIENDA DE BELLEZA  \u00b7  TORREON, COAH.", fBrandSub);
                pS.setAlignment(Element.ALIGN_CENTER); cHeader.addElement(pS);
            }
            tHeader.addCell(cHeader);
 
            PdfPTable tFranja = new PdfPTable(1); tFranja.setWidthPercentage(100); tFranja.setSpacingAfter(0f);
            PdfPCell cFranja = new PdfPCell(new Phrase(" "));
            cFranja.setBackgroundColor(P_CLARO); cFranja.setFixedHeight(3f); cFranja.setBorder(Rectangle.NO_BORDER);
            tFranja.addCell(cFranja);
            doc.add(tHeader); doc.add(tFranja);
 
            // ── Título y folio ──
            doc.add(new Paragraph(" ", new Font(Font.HELVETICA, 4)));
            PdfPTable tTitulo = new PdfPTable(1); tTitulo.setWidthPercentage(100); tTitulo.setSpacingAfter(0f);
            PdfPCell cTitulo = new PdfPCell(); cTitulo.setBorder(Rectangle.NO_BORDER); cTitulo.setPaddingTop(6f); cTitulo.setPaddingBottom(2f);
            Paragraph pDocTitle = new Paragraph("COMPROBANTE DE COMPRA", fDocTitle);
            pDocTitle.setAlignment(Element.ALIGN_CENTER); pDocTitle.setSpacingAfter(4f); cTitulo.addElement(pDocTitle);
            Paragraph pFolio = new Paragraph("# " + folio, fFolio);
            pFolio.setAlignment(Element.ALIGN_CENTER); pFolio.setSpacingAfter(4f); cTitulo.addElement(pFolio);
            tTitulo.addCell(cTitulo); doc.add(tTitulo);
            doc.add(separador(P_CLARO, DORADO_S, P_FONDO));
 
            // ── Meta ──
            PdfPTable tMeta = new PdfPTable(2); tMeta.setWidthPercentage(100);
            tMeta.setWidths(new float[]{50, 50}); tMeta.setSpacingBefore(2f); tMeta.setSpacingAfter(4f);
            tMeta.addCell(metaCelda("CLIENTE", nombreCliente != null ? nombreCliente : "Cliente", "Compra registrada",
                fMetaLabel, fMetaVal, fMetaSub, META_BG1, BORDE, true, false));
            tMeta.addCell(metaCelda("FECHA", fecha, "Hora: " + hora,
                fMetaLabel, fMetaVal, fMetaSub, META_BG2, BORDE, false, true));
            doc.add(tMeta);
            doc.add(separador(P_CLARO, DORADO_S, P_FONDO));
 
            // ── Tabla productos ──
            PdfPTable tProd = new PdfPTable(4); tProd.setWidthPercentage(100);
            tProd.setWidths(new float[]{44, 11, 22, 23}); tProd.setSpacingBefore(3f); tProd.setSpacingAfter(0f);
            String[] heads  = {"PRODUCTO", "UDS", "PRECIO", "TOTAL"};
            int[]    aligns = {Element.ALIGN_LEFT, Element.ALIGN_CENTER, Element.ALIGN_RIGHT, Element.ALIGN_RIGHT};
            for (int i = 0; i < heads.length; i++) {
                PdfPCell ch = new PdfPCell(new Phrase(heads[i], fThHead));
                ch.setBackgroundColor(V_MEDIO); ch.setPaddingTop(7f); ch.setPaddingBottom(7f);
                ch.setPaddingLeft(i == 0 ? 8f : 3f); ch.setPaddingRight(i == heads.length - 1 ? 8f : 3f);
                ch.setBorder(Rectangle.NO_BORDER); ch.setHorizontalAlignment(aligns[i]); tProd.addCell(ch);
            }
            for (int i = 0; i < items.size(); i++) {
                CompraRequest.ItemCompra item = items.get(i);
                String nombre = i < nombresProductos.size() ? nombresProductos.get(i) : "Producto";
                double subtotal = item.getPrecio() * item.getCantidad();
                java.awt.Color bgF = (i % 2 == 0) ? BLANCO : P_MUY_CLARO;
                tProd.addCell(filaCelda(nombre, fTdNombre, bgF, BORDE, Element.ALIGN_LEFT, 8f, 3f));
                tProd.addCell(filaCelda(String.valueOf(item.getCantidad()), fTdNum, bgF, BORDE, Element.ALIGN_CENTER, 3f, 3f));
                tProd.addCell(filaCelda("$" + fmt(item.getPrecio()), fTdNum, bgF, BORDE, Element.ALIGN_RIGHT, 3f, 3f));
                tProd.addCell(filaCelda("$" + fmt(subtotal), fTdSub, bgF, BORDE, Element.ALIGN_RIGHT, 3f, 8f));
            }
            doc.add(tProd); doc.add(lineaFina(P_CLARO));
 
            // ── Totales ──
            double iva = total * 0.16, totalFin = total + iva;
            PdfPTable tTot = new PdfPTable(2); tTot.setWidthPercentage(70);
            tTot.setHorizontalAlignment(Element.ALIGN_RIGHT); tTot.setWidths(new float[]{52, 48});
            tTot.setSpacingBefore(2f); tTot.setSpacingAfter(10f);
            filaTotal(tTot, "Subtotal",  "$" + fmt(total), fTotalLbl, fTotalVal, TOT_BG1, BORDE);
            filaTotal(tTot, "IVA (16%)", "$" + fmt(iva),   fTotalLbl, fTotalVal, TOT_BG2, BORDE);
            PdfPCell cTL = new PdfPCell(new Phrase("TOTAL", fGrandLbl));
            cTL.setBackgroundColor(V_MEDIO); cTL.setBorder(Rectangle.NO_BORDER);
            cTL.setPaddingTop(9f); cTL.setPaddingBottom(9f); cTL.setPaddingLeft(10f); cTL.setHorizontalAlignment(Element.ALIGN_LEFT); tTot.addCell(cTL);
            PdfPCell cTV = new PdfPCell(new Phrase("$" + fmt(totalFin), fGrandVal));
            cTV.setBackgroundColor(V_MEDIO); cTV.setBorder(Rectangle.NO_BORDER);
            cTV.setPaddingTop(9f); cTV.setPaddingBottom(9f); cTV.setPaddingRight(10f); cTV.setHorizontalAlignment(Element.ALIGN_RIGHT); tTot.addCell(cTV);
            doc.add(tTot);
            doc.add(separador(P_CLARO, DORADO_S, P_FONDO));
 
            // ── Pie ──
            PdfPTable tPie = new PdfPTable(2); tPie.setWidthPercentage(100);
            tPie.setWidths(new float[]{55, 45}); tPie.setSpacingBefore(5f); tPie.setSpacingAfter(0f);
            PdfPCell cMsg = new PdfPCell(); cMsg.setBackgroundColor(P_MUY_CLARO);
            cMsg.setBorderColor(BORDE); cMsg.setBorderWidth(0.5f);
            cMsg.setPaddingTop(12f); cMsg.setPaddingBottom(12f); cMsg.setPaddingLeft(14f); cMsg.setPaddingRight(8f);
            Paragraph pG = new Paragraph("\u00a1Gracias por tu compra!", fGracias); pG.setSpacingAfter(4f); cMsg.addElement(pG);
            cMsg.addElement(new Paragraph("Esperamos verte muy pronto :)", fGraciasSub)); tPie.addCell(cMsg);
            PdfPCell cRedes = new PdfPCell(); cRedes.setBackgroundColor(V_OSCURO); cRedes.setBorder(Rectangle.NO_BORDER);
            cRedes.setPaddingTop(10f); cRedes.setPaddingBottom(10f); cRedes.setPaddingLeft(10f); cRedes.setPaddingRight(8f);
            PdfPTable rowI = new PdfPTable(2); rowI.setSpacingAfter(5f);
            try { rowI.setWidths(new float[]{1, 5}); } catch (Exception ignored) {}
            PdfPCell cII = new PdfPCell(); cII.setBorder(Rectangle.NO_BORDER); cII.setPaddingRight(3f);
            try { InputStream is = getClass().getResourceAsStream("/static/instagram_icon.png"); if (is != null) { Image ig = Image.getInstance(is.readAllBytes()); ig.scaleToFit(10,10); cII.addElement(ig); } } catch (Exception ignored) {}
            rowI.addCell(cII);
            PdfPCell cTI = new PdfPCell(new Phrase("@elite_beautytrc", fRedes)); cTI.setBorder(Rectangle.NO_BORDER); cTI.setVerticalAlignment(Element.ALIGN_MIDDLE); rowI.addCell(cTI);
            cRedes.addElement(rowI);
            PdfPTable rowF = new PdfPTable(2); try { rowF.setWidths(new float[]{1, 5}); } catch (Exception ignored) {}
            PdfPCell cIF = new PdfPCell(); cIF.setBorder(Rectangle.NO_BORDER); cIF.setPaddingRight(3f);
            try { InputStream fs = getClass().getResourceAsStream("/static/facebook_icon.png"); if (fs != null) { Image fb = Image.getInstance(fs.readAllBytes()); fb.scaleToFit(10,10); cIF.addElement(fb); } } catch (Exception ignored) {}
            rowF.addCell(cIF);
            PdfPCell cTF = new PdfPCell(new Phrase("Pr\u00f3ximamente", fRedesSub)); cTF.setBorder(Rectangle.NO_BORDER); cTF.setVerticalAlignment(Element.ALIGN_MIDDLE); rowF.addCell(cTF);
            cRedes.addElement(rowF); tPie.addCell(cRedes); doc.add(tPie);
 
            // ── Barra final ──
            PdfPTable tBar = new PdfPTable(1); tBar.setWidthPercentage(100); tBar.setSpacingBefore(6f);
            PdfPCell bP = new PdfPCell(new Phrase(" ")); bP.setBackgroundColor(P_CLARO); bP.setFixedHeight(4f); bP.setBorder(Rectangle.NO_BORDER); tBar.addCell(bP);
            PdfPCell bV = new PdfPCell(new Phrase(" ")); bV.setBackgroundColor(V_OSCURO); bV.setFixedHeight(5f); bV.setBorder(Rectangle.NO_BORDER); tBar.addCell(bV);
            doc.add(tBar);
 
            doc.close();
            return out.toByteArray();
 
        } catch (Exception e) {
            throw new RuntimeException("Error generando ticket PDF: " + e.getMessage());
        }
    }
 
    private String fmt(double v) { return String.format("%.2f", v); }
 
    private PdfPCell metaCelda(String label, String valor, String sub, Font fLabel, Font fValor, Font fSub, java.awt.Color bg, java.awt.Color border, boolean izq, boolean der) {
        PdfPCell c = new PdfPCell(); c.setBackgroundColor(bg); c.setBorderColor(border); c.setBorderWidth(0.6f);
        c.setPaddingTop(8f); c.setPaddingBottom(8f); c.setPaddingLeft(izq ? 10f : 6f); c.setPaddingRight(der ? 10f : 6f);
        Paragraph pL = new Paragraph(label, fLabel); pL.setSpacingAfter(3f); c.addElement(pL);
        c.addElement(new Paragraph(valor, fValor));
        if (sub != null && !sub.isEmpty()) c.addElement(new Paragraph(sub, fSub));
        return c;
    }
 
    private PdfPCell filaCelda(String texto, Font font, java.awt.Color bg, java.awt.Color border, int align, float padL, float padR) {
        PdfPCell c = new PdfPCell(new Phrase(texto, font)); c.setBackgroundColor(bg);
        c.setPaddingTop(6f); c.setPaddingBottom(6f); c.setPaddingLeft(padL); c.setPaddingRight(padR);
        c.setBorderColor(border); c.setBorderWidthTop(0f); c.setBorderWidthBottom(0.4f); c.setBorderWidthLeft(0f); c.setBorderWidthRight(0f);
        c.setHorizontalAlignment(align); return c;
    }
 
    private PdfPTable separador(java.awt.Color linea, java.awt.Color punto, java.awt.Color bg) throws Exception {
        PdfPTable t = new PdfPTable(3); t.setWidthPercentage(100); t.setWidths(new float[]{38, 24, 38}); t.setSpacingBefore(3f); t.setSpacingAfter(3f);
        PdfPCell cL = new PdfPCell(new Phrase(" ")); cL.setFixedHeight(1f); cL.setBackgroundColor(linea); cL.setBorder(Rectangle.NO_BORDER); t.addCell(cL);
        PdfPCell cM = new PdfPCell(new Phrase("  \u2767  ", new Font(Font.HELVETICA, 7, Font.NORMAL, punto)));
        cM.setBorder(Rectangle.NO_BORDER); cM.setHorizontalAlignment(Element.ALIGN_CENTER); cM.setVerticalAlignment(Element.ALIGN_MIDDLE); cM.setBackgroundColor(bg); t.addCell(cM);
        PdfPCell cR = new PdfPCell(new Phrase(" ")); cR.setFixedHeight(1f); cR.setBackgroundColor(linea); cR.setBorder(Rectangle.NO_BORDER); t.addCell(cR);
        return t;
    }
 
    private PdfPTable lineaFina(java.awt.Color color) throws Exception {
        PdfPTable t = new PdfPTable(1); t.setWidthPercentage(100); t.setSpacingBefore(0f); t.setSpacingAfter(2f);
        PdfPCell c = new PdfPCell(new Phrase(" ")); c.setFixedHeight(1.2f); c.setBackgroundColor(color); c.setBorder(Rectangle.NO_BORDER); t.addCell(c); return t;
    }
 
    private void filaTotal(PdfPTable tabla, String label, String valor, Font fLabel, Font fValor, java.awt.Color bg, java.awt.Color border) {
        PdfPCell cL = new PdfPCell(new Phrase(label, fLabel)); cL.setBackgroundColor(bg); cL.setPaddingTop(4f); cL.setPaddingBottom(4f); cL.setPaddingLeft(10f);
        cL.setBorderColor(border); cL.setBorderWidthBottom(0.4f); cL.setBorderWidthTop(0f); cL.setBorderWidthLeft(0f); cL.setBorderWidthRight(0f); cL.setHorizontalAlignment(Element.ALIGN_LEFT); tabla.addCell(cL);
        PdfPCell cV = new PdfPCell(new Phrase(valor, fValor)); cV.setBackgroundColor(bg); cV.setPaddingTop(4f); cV.setPaddingBottom(4f); cV.setPaddingRight(10f);
        cV.setBorderColor(border); cV.setBorderWidthBottom(0.4f); cV.setBorderWidthTop(0f); cV.setBorderWidthLeft(0f); cV.setBorderWidthRight(0f); cV.setHorizontalAlignment(Element.ALIGN_RIGHT); tabla.addCell(cV);
    }
}